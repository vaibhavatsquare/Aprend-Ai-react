"use client";

import React from "react";
import Image from "next/image";
import { useRedirect } from "@/src/hooks/router.hooks";

type CardType = "notes" | "flashcards";

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
};

const SavedCard = ({
  type,
  item,
  onRename,
  onDelete,
  onRemove,
}: Props) => {

  const handleCardClick = () => {
    useRedirect("${type}/${item.id}");
  };

  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      onDelete(item.id);
    }
  };


const mainIcon =
    type === "notes"
      ? "/images/notes/saveNotes.svg"
      : "/images/home/flashCards.svg";


  return (
    <div
      onClick={handleCardClick}
      className="flex items-center justify-between px-2 py-4 pr-5"
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
            {item.createdAt}
          </p>
        </div>
      </div>

      {/* RIGHT ACTION BUTTONS */}
      <div className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionButton
          icon="/images/notes/rename.svg"
          label="Rename"
          onClick={() => {
            const newTitle = prompt("Rename", item.title);
            if (newTitle) onRename(item.id, newTitle);
          }}
        />

        <ActionButton
          icon="/images/notes/unsave.svg"
          label="Remove"
          onClick={() => onRemove(item.id)}
        />

        <ActionButton
          icon="/images/notes/delete.svg"
          label="Delete"
          onClick={handleDeleteClick}
        />
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
