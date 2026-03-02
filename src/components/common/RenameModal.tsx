"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

type RenameModalProps = {
    isOpen: boolean;
    initialValue: string;
    loading?: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
};

const RenameModal = ({
    isOpen,
    initialValue,
    loading = false,
    onClose,
    onSubmit,
}: RenameModalProps) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="bg-white w-[420px] rounded-[16px] p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4"
                    disabled={loading}
                >
                    <IoClose size={22} />
                </button>

                <h2 className="text-lg font-semibold mb-4">
                    Rename Note
                </h2>

                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full border rounded-lg p-2 mb-6"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-[42px] bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSubmit(value)}
                        disabled={loading}
                        className="flex-1 h-[42px] bg-primary text-white rounded-lg"
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenameModal;
