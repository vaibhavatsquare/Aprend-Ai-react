export interface NoteMessage {
  role: "USER" | "AI";
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface ConversationInfo {
  id: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  conversationId: string;
  title: string;
  text: string | null;
  messages: NoteMessage[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  conversation?: ConversationInfo;
}

export interface PaginatedNotes {
  total: number;
  list: Note[];
  hasMany: boolean;
  count: number;
}
