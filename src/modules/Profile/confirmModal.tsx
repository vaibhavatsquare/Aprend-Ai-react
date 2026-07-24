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
      <div className="bg-white w-[clamp(280px,25vw,400px)] rounded-[clamp(8px,0.8vw,12px)] p-[clamp(10px,1vw,16px)] relative">
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
            <h2 className="text-[clamp(16px,1.6vw,26px)] font-semibold">New Achievement</h2>

            <div className="flex justify-center mb-[clamp(10px,1vw,16px)]">
              <img
                src={achievement.image}
                alt="achievement"
                className="w-50 h-50 object-contain"
              />
            </div>

            <h3 className="text-[clamp(13px,1.1vw,18px)] font-medium">{achievement.title}</h3>

            <p className="text-[clamp(11px,0.9vw,14px)] text-secondary mt-[clamp(4px,0.5vw,8px)] px-[clamp(8px,1vw,16px)]">
              {achievement.description}
            </p>

            <button
              onClick={onClose}
              style={{ backgroundColor: achievement.code }}
              className="h-[clamp(32px,2.5vw,40px)] rounded-[clamp(16px,1.2vw,20px)] mt-[clamp(10px,1.2vw,20px)] px-[clamp(12px,1.5vw,24px)] py-[clamp(4px,0.5vw,8px)] rounded-[8px] text-white font-semibold mb-[clamp(8px,1vw,16px)]"
            >
              {achievement.buttonName}
            </button>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-[clamp(10px,1vw,16px)] mt-[clamp(12px,1.5vw,24px)]">
              {isDelete ? (
                <FiTrash2 size={50} className="text-red-500" />
              ) : (
                // <FiLogOut size={50} className="text-[#0F3057]" />
                <FiLogOut size={50} className="text-[#2563EB]" />
              )}
            </div>

            {/* Text */}
            <p className="text-center text-[clamp(12px,1vw,16px)] text-primaryText mb-[clamp(10px,1.2vw,20px)] px-[clamp(12px,2vw,40px)]">
              {isDelete
                ? t("profile.confirmDelete")
                : t("profile.confirmLogout")}
            </p>

            {/* Buttons */}
            <div className="flex justify-between gap-[clamp(8px,0.8vw,12px)]">
              <button
                onClick={onClose}
                className="flex-1 h-[clamp(32px,2.5vw,40px)] bg-gray-100 rounded-[clamp(6px,0.5vw,8px)] text-[clamp(11px,0.9vw,14px)]"
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
                className={`flex-1 h-[clamp(32px,2.5vw,40px)]! rounded-[clamp(6px,0.5vw,8px)]! text-[clamp(11px,0.9vw,14px)]! text-white! ${isDelete ? "bg-red-500!" : ""}`}
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
