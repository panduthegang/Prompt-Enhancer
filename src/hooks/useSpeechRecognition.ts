import { useState, useRef, useEffect, useCallback } from "react";

export function useSpeechRecognition(onTranscript: (transcript: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  // Interim text shows words in real-time as they're being spoken
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          // Accumulate interim words for real-time display
          interim += event.results[i][0].transcript;
        }
      }

      // Show interim words immediately as user speaks
      setInterimTranscript(interim);

      // Commit final transcript to the actual input
      if (finalTranscript) {
        onTranscriptRef.current(finalTranscript.trim());
        setInterimTranscript(""); // Clear interim once finalized
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

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript("");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
      }
    }
  }, [isRecording]);

  return { isRecording, interimTranscript, toggleRecording };
}
