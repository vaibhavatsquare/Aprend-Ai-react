import Image from "next/image";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "@/src/libs/i18n";
import { Achievement } from "@/src/libs/types";
import { Button } from "antd";

const ConfirmModal = ({
  type,
  onClose,
  onConfirm,
  achievement,
  loading = false,
}: {
  type: "logout" | "delete" | "achievement";
  onClose: () => void;
  onConfirm?: () => void;
  achievement?: Achievement | null;
  loading?: boolean;
}) => {
  const isDelete = type === "delete";
  const isAchievement = type === "achievement";
  const { t } = useTranslation();
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
            <h2 className="text-[26px] font-semibold">New Achievement</h2>

            <div className="flex justify-center mb-4">
              <img
                src={achievement.image}
                alt="achievement"
                className="w-50 h-50 object-contain"
              />
            </div>

            <h3 className="text-[18px] font-medium">{achievement.title}</h3>

            <p className="text-[14px] text-secondary mt-2 px-4">
              {achievement.description}
            </p>

            <button
              onClick={onClose}
              style={{ backgroundColor: achievement.code }}
              className="h-[40px] rounded-[20px] mt-6 px-6 py-2 rounded-[8px] text-white font-semibold mb-4"
            >
              {achievement.buttonName}
            </button>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-4 mt-6">
              {isDelete ? (
                <FiTrash2 size={50} className="text-red-500" />
              ) : (
                // <FiLogOut size={50} className="text-[#0F3057]" />
                <FiLogOut size={50} className="text-[#2563EB]" />
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

              {/* <button
                onClick={onConfirm}
               className={`flex-1 h-[40px] rounded-[8px] text-white ${isDelete ? "bg-red-500" : ""}`}
              style={!isDelete ? {
                backgroundImage: "url('/images/buttonBg.svg')",
                backgroundSize: '350% 700%', backgroundPosition: 'center',
                boxShadow: '0px 0px 50px 0px #1953CB40',
                border: '1px solid rgba(255,255,255,0.35)',
              } : {}}
              >
                {isDelete ? t("common.delete") : t("nav.logout")}
              </button> */}
              <Button
                onClick={onConfirm}
                loading={loading}
                disabled={loading}
                className={`flex-1 h-[40px]! rounded-[8px]! text-white! ${isDelete ? "bg-red-500!" : ""}`}
                style={!isDelete ? {
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '350% 700%', backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                } : {}}
              >
                {isDelete ? t("common.delete") : t("nav.logout")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmModal;
