"use client";

import React from "react";
import Image from "next/image";
import { useRedirect } from "@/src/hooks/router.hooks";
import { formatDate } from "@/src/libs/helpers";

type CardType = "notes" | "flashcards" | "library";

type Props = {
  type: CardType;
  item: {
    id: string;
    title: string;
    createdAt: string;
  };
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onRemove: (id: string) => void;
  onOpenFlashcard?: (id: string) => void;
};

const SavedCard = ({
  type,
  item,
  onRename,
  onDelete,
  onRemove,
  onOpenFlashcard,
}: Props) => {

  const handleCardClick = () => {
    if (type === "flashcards") {
      onOpenFlashcard?.(item.id);
      return;
    }

    if (type === "library") {
      onOpenFlashcard?.(item.id);
      return;
    }

    sessionStorage.setItem("selectedNote", JSON.stringify(item));
    useRedirect(`/${type}/${item.id}`);
  };

  let mainIcon;

  if (type === "notes") {
    mainIcon = "/images/notes/saveNotes.svg";
  } else if (type === "flashcards") {
    mainIcon = "/images/home/flashCards.svg";
  } else {
    mainIcon = "/images/home/savedLibrary.svg";
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between px-2 py-4 pr-5 cursor-pointer"
      style={{
        height: "76px",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: "20px",
      }}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Save Notes Icon */}
        <Image
          src={mainIcon}
          alt="saved item"
          width={60}
          height={60}
        />

        <div>
          <h3 className="text-[20px] font-medium text-primaryText">
            {item.title}
          </h3>

          <p className="text-[14px] text-secondary mt-1">
            {formatDate(item.createdAt)}
          </p>
        </div>
      </div>

      {/* RIGHT ACTION BUTTONS */}
      <div className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >

        {type !== "library" && (
          <ActionButton
            icon="/images/notes/rename.svg"
            label="Rename"
            onClick={() => onRename(item.id, item.title)}
          />
        )}

        {type === "library" &&
          <ActionButton
            icon="/images/notes/unsave.svg"
            label="Remove"
            onClick={() => onRemove(item.id)}
          />
        }

        {type !== "library" && (
          <ActionButton
            icon="/images/notes/delete.svg"
            label="Delete"
            onClick={() => onDelete(item.id)}
          />
        )}
      </div>

    </div>
  );
};

const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 h-[36px] rounded-[12px] bg-white hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
      style={{
        boxShadow: "0px 0px 10px rgba(0,0,0,0.10)",
      }}
    >
      <Image
        src={icon}
        alt={label}
        width={20}
        height={20}
      />
      <span className="text-[14px] font-normal text-primaryText">
        {label}
      </span>
    </button>
  );
};

export default SavedCard;
