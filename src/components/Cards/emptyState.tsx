import { HiOutlineDocumentText } from "react-icons/hi2";
import { PiCardsLight } from "react-icons/pi";
import { useTranslation } from "@/src/libs/i18n";

const EmptyState = ({
    type,
}: {
    type: "notes" | "flashcards" | "library";
}) => {
    const { t } = useTranslation();
    const config = {
        notes: {
            icon: (
                <HiOutlineDocumentText
                    size={120}
                    className="text-gray-300"
                />
            ),
            title: t('notes.noSavedNotes'),
            desc: t('notes.noSavedNotesDesc'),
        },
        flashcards: {
            icon: (
                <PiCardsLight
                    size={120}
                    className="text-gray-300"
                />
            ),
            title: t('flashcards.noSavedFlashcards'),
            desc: t('flashcards.noSavedFlashcardsDesc'),
        },
        library: {
            icon: (
                <PiCardsLight
                    size={120}
                    className="text-gray-300"
                />
            ),
            title: t('library.noSavedLibrary'),
            desc: t('library.noSavedLibraryDesc'),
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
