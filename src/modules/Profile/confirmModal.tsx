import Image from "next/image";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { t } from "@/src/libs/i18n";
import { Achievement } from "@/src/libs/types";

const ConfirmModal = ({
  type,
  onClose,
  onConfirm,
  achievement,
}: {
  type: "logout" | "delete" | "achievement";
  onClose: () => void;
  onConfirm?: () => void;
  achievement?: Achievement | null;
}) => {
  const isDelete = type === "delete";
  const isAchievement = type === "achievement";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">

      <div className="bg-white w-[400px] rounded-[12px] p-4 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-primaryText"
        >
          ✕
        </button>

        {/* Achievement Layout */}
        {isAchievement && achievement ? (
          <div className="text-center pt-2">

            <h2 className="text-[26px] font-semibold">
              New Achievement
            </h2>

            {/* <div className="flex justify-center mb-4">
              <Image
                src={achievement.icon}
                alt="achievement"
                width={80}
                height={80}
              />
            </div> */}
            <div className="flex justify-center">
              <div className="text-[100px]">
                {achievement.icon}
              </div>
            </div>

            <h3 className="text-[18px] font-medium">
              {achievement.title}
            </h3>

            <p className="text-[14px] text-secondary mt-2 px-4">
              {achievement.description}
            </p>

            <button
              onClick={onClose}
              style={{ backgroundColor: achievement.buttonColor }}
              className="h-[40px] rounded-[20px] mt-6 px-6 py-2 rounded-[8px] text-white font-semibold mb-4"
            >
              {achievement.buttonText}
            </button>
          </div>
        ) : (
          <>
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
                ? t("profile.confirmDelete")
                : t("profile.confirmLogout")}
            </p>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-[40px] bg-gray-100 rounded-[8px]"
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={onConfirm}
                className={`flex-1 h-[40px] rounded-[8px] text-white ${isDelete ? "bg-red-500" : "bg-[#0F3057]"
                  }`}
              >
                {isDelete ? t("common.delete") : t("nav.logout")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;