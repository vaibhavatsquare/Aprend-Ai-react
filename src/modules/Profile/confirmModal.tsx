import { FiLogOut } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const ConfirmModal = ({
  type,
  onClose,
  onConfirm,
}: {
  type: "logout" | "delete";
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const isDelete = type === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
      <div className="bg-white w-[400px] rounded-[12px] p-4 relative">

        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-primaryText"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4 mt-6">
          {isDelete ? (
            <FiTrash2 size={50} className="text-red-500" />
          ) : (
            <FiLogOut size={50} className="text-[#0F3057]" />
          )}
        </div>

        {/* Text */}
        <p className="text-center text-[16px] text-primaryText mb-6 px-10">
          {isDelete
            ? "Are you sure you want to delete your account?"
            : "Are you sure you want to logout from the app?"}
        </p>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-[40px] bg-gray-100 rounded-[8px]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 h-[40px] rounded-[8px] text-white ${
              isDelete ? "bg-red-500" : "bg-[#0F3057]"
            }`}
          >
            {isDelete ? "Delete" : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;