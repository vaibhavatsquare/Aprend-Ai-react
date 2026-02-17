import { fetch } from "@/src/libs/helpers";
import { Note } from "@/src/libs/types/notes.types";

// GET all notes
export const getNotes = async (): Promise<Note[]> => {
  return fetch<Note[]>({
    url: "/ai-tutor/notes",
    method: "GET",
  });
};

// CREATE note from conversation
export const createNote = async (
  conversationId: string
): Promise<Note> => {
  return fetch<Note>({
    url: "/ai-tutor/notes",
    method: "POST",
    data: { conversationId },
  });
};

// RENAME note
export const renameNote = async (
  id: string,
  title: string
): Promise<Note> => {
  return fetch<Note>({
    url: `/ai-tutor/notes/${id}`,
    method: "PATCH",
    data: { title },
  });
};

// DELETE note
export const deleteNote = async (id: string): Promise<Note> => {
  return fetch<Note>({
    url: `/ai-tutor/notes/${id}`,
    method: "DELETE",
  });
};
