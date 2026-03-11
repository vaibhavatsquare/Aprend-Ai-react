"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import ReactMarkdown from "react-markdown";
import { formatDate } from "@/src/libs/helpers";

const NoteDetail = () => {
  const router = useRouter();

  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedNote");
    if (stored) {
      setNote(JSON.parse(stored));
    }
  }, []);

  if (!note) return <div className="p-6">No data found</div>;

  return (
    <div className="px-4 grid grid-cols-2 gap-2">
      <div
        className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-xl col-span-2 flex flex-col gap-4"
        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
      >
        {/* Header */}
        <div className="mx-4 flex relative justify-center">
          <GoArrowLeft
            className="text-xl absolute left-0 cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-base font-semibold">
            {note.title}
          </h1>
        </div>

        {/* Center Time */}
        <div className="text-center text-xs text-gray-400">
          {formatDate(note.createdAt)}
        </div>

        {/* Chat */}
        <div className="px-4 flex-1 flex flex-col gap-3 overflow-y-auto scrollbar">
          {note.messages.map((msg: any, index: number) =>
            msg.role === "USER" ? (
              <div key={index} className="flex justify-end">
                <div className="max-w-[80%] p-3 bg-[#5555550D] rounded-xl rounded-br-none">
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      className="max-w-[200px] rounded-lg mb-2"
                    />
                  )}
                  <p className="text-secondary">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-start gap-2">
                <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center text-white">
                  AI
                </div>
                <div className="max-w-[80%] p-3 bg-gray-100 rounded-xl rounded-bl-none">
                  <div className="prose prose-sm max-w-none text-secondary">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
