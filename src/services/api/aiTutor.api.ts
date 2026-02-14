import { fetch } from "@/src/libs/helpers";

export const sendAiMessage = async (payload: {
  message: string;
  imageUrl?: string;
  conversationId?: string | null;
}) => {
  return await fetch<{
    conversationId: string;
    reply: string;
  }>({
    url: "/ai-tutor/conversation",
    method: "POST",
    data: payload,
  });
};
