"use client";

import { FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "primary";
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
      <div className="bg-white w-[420px] rounded-[16px] p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4"
          disabled={loading}
        >
          <IoClose size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4 mt-4">
          <FiTrash2 size={48} className="text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-center mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mb-6">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-[42px] bg-gray-100 rounded-lg"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-[42px] rounded-lg text-white ${
              confirmColor === "red"
                ? "bg-red-500"
                : "bg-primary"
            }`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
