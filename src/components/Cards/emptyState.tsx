import { HiOutlineDocumentText } from "react-icons/hi2";
import { PiCardsLight } from "react-icons/pi";

const EmptyState = ({
  type,
}: {
  type: "notes" | "flashcards";
}) => {
  const config = {
    notes: {
      icon: (
        <HiOutlineDocumentText
          size={120}
          className="text-gray-300"
        />
      ),
      title: "No Saved Notes Yet",
      desc: "You haven’t saved any notes. Start saving notes to see them here.",
    },
    flashcards: {
      icon: (
        <PiCardsLight
          size={120}
          className="text-gray-300"
        />
      ),
      title: "No Saved Flashcards Yet",
      desc: "You haven’t saved any flashcards. Save one to see it here.",
    },
  };

  const data = config[type];

  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      {data.icon}

      <h2 className="text-[20px] font-semibold text-primaryText mt-6">
        {data.title}
      </h2>

      <p className="text-[14px] text-secondary mt-2 max-w-[320px]">
        {data.desc}
      </p>
    </div>
  );
};

export default EmptyState;
