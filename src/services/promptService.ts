import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { PromptHistory, PromptCategory } from "../types";

// Firestore document shape (what we store)
interface PromptDoc {
  original: string;
  optimized: string;
  category: PromptCategory;
  isFavorite: boolean;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

// Helper: get the prompts subcollection ref for a user
function promptsCollection(uid: string) {
  return collection(db, "users", uid, "prompts");
}

/**
 * Add a new prompt to Firestore under the user's subcollection.
 * Returns the generated document ID.
 */
export async function addPrompt(
  uid: string,
  data: {
    original: string;
    optimized: string;
    category: PromptCategory;
  }
): Promise<string> {
  const colRef = promptsCollection(uid);
  const docRef = await addDoc(colRef, {
    original: data.original,
    optimized: data.optimized,
    category: data.category,
    isFavorite: false,
    createdAt: serverTimestamp(),
  } satisfies PromptDoc);
  return docRef.id;
}

/**
 * Subscribe to the user's prompts in real-time, ordered newest-first.
 * Returns an unsubscribe function.
 */
export function subscribeToPrompts(
  uid: string,
  callback: (prompts: PromptHistory[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    promptsCollection(uid),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const prompts: PromptHistory[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          timestamp: data.createdAt?.toMillis?.() ?? Date.now(),
          original: data.original ?? "",
          optimized: data.optimized ?? "",
          category: data.category ?? "other",
          isFavorite: data.isFavorite ?? false,
        };
      });
      callback(prompts);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      onError?.(error);
    }
  );
}

/**
 * Toggle the isFavorite field for a prompt document.
 */
export async function toggleFavorite(
  uid: string,
  promptId: string,
  currentValue: boolean
): Promise<void> {
  const docRef = doc(db, "users", uid, "prompts", promptId);
  await updateDoc(docRef, { isFavorite: !currentValue });
}

/**
 * Delete a prompt document.
 */
export async function deletePrompt(
  uid: string,
  promptId: string
): Promise<void> {
  const docRef = doc(db, "users", uid, "prompts", promptId);
  await deleteDoc(docRef);
}
