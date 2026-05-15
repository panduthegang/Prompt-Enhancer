import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechRecognition(onTranscript: (transcript: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  // Track the highest result index we've already committed as final
  const lastCommittedIndexRef = useRef(-1);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // Skip any index we've already committed — mobile re-delivers these
          if (i <= lastCommittedIndexRef.current) continue;
          lastCommittedIndexRef.current = i;
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);

      if (finalTranscript) {
        onTranscriptRef.current(finalTranscript.trim());
        setInterimTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setInterimTranscript("");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return;
    recognitionRef.current.stop();
    setIsRecording(false);
    setInterimTranscript("");
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      stopRecording();
    } else {
      try {
        // Reset the committed index guard on each new session
        lastCommittedIndexRef.current = -1;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  }, [isRecording, stopRecording]);

  return { isRecording, interimTranscript, toggleRecording, stopRecording };
}