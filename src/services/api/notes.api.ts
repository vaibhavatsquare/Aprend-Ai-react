import { fetch } from "@/src/libs/helpers";
import { Note, PaginatedNotes } from "@/src/libs/types/notes.types";

// GET all notes
export const getNotes = async (params?: {
  skip?: number;
  take?: number;
  search?: string;
  orderBy?: string;
}): Promise<PaginatedNotes> => {
  return fetch<PaginatedNotes>({
    url: "/ai-tutor/notes",
    method: "GET",
    params,
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
