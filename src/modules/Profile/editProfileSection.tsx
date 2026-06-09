"use client";

import { useState, useMemo, useEffect } from "react";
import { UserDetail, UserEducationLevel } from "@/src/libs/types";
import { uploadImage } from "@/src/services/api/upload.api";
import { Image as AntImage, Button, message, Spin } from "antd";
import { updateUserProfile, getEducationLevels } from "@/src/services/api/user.api";
import { getInitials } from "@/src/libs/helpers";
import { FiCamera } from "react-icons/fi";

interface Props {
    user: UserDetail | null;
    onUpdated: (user: Partial<UserDetail>) => void;
    onCancel: () => void;
}

const EditProfileSection = ({ user, onUpdated, onCancel }: Props) => {

    const [name, setName] = useState(user?.name || "");
    const [education, setEducation] = useState<string>(
    user?.educationLevelId || ""
);
const [educationLevels, setEducationLevels] = useState<any[]>([]);

useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const language = user?.user_language || "ENGLISH";
    getEducationLevels(language)
        .then(setEducationLevels)
        .catch(() => {});
}, []);
    const [image, setImage] = useState<string | null>(user?.image || null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImage(URL.createObjectURL(file)); // preview
    };

    const hasChanges = useMemo(() => {
        return (
            name !== user?.name ||
            education !== (user?.educationLevelId || "") ||
            !!imageFile
        );
    }, [name, education, image, user]);

    const handleSave = async () => {

        try {
            setLoading(true);

            let imageUrl = user?.image;

            // Upload only if new image selected
            if (imageFile) {
                const uploaded = await uploadImage(imageFile);
                imageUrl = encodeURI(uploaded);
            }

            await updateUserProfile({
                name,
                educationLevelId: education,
                image: imageUrl,
            });

            onUpdated({
                name,
                educationLevelId: education,
                image: imageUrl,
            });

            setImageFile(null);
            message.success("Profile updated");

        } catch {
            message.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const displayName = user?.name || user?.email?.split("@")[0] || "";

    return (
        <div className="w-full h-full flex flex-col px-6">
           

            {/* TITLE */}
            <h1 className="text-[24px] font-semibold text-center mb-6 mt-6">
                Edit Profile
            </h1>

            {/* PROFILE IMAGE */}
            <div className="flex justify-center mb-4">

                <div className="relative w-[110px] h-[110px]">

                    {image ? (
                        <AntImage
                            src={image}
                            alt="profile"
                            width={100}
                            height={100}
                            preview={false}
                            className="rounded-full object-fill shadow-[0_-3px_10px_rgba(0,0,0,0.15)]"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-[#0F3057] flex items-center justify-center text-white text-[32px] font-semibold">
                            {getInitials(displayName)}
                        </div>
                    )}

                    {/* Camera */}
                    <label className="absolute bottom-2 right-2 bg-white shadow-md w-[28px] h-[28px] flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-50">

                        <FiCamera size={16} />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                    </label>

                </div>

            </div>

            {/* FORM */}
            <div className="space-y-5">

                {/* NAME */}
                <div>
                    <label className="text-[16px] font-medium">
                        Name
                    </label>

                    {/* <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[48px] mt-1 px-4 bg-[#F5F5F6] rounded-[12px] outline-none"
                    /> */}
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[48px] mt-1 px-4 bg-[#F5F5F6] rounded-[12px] outline-none border border-transparent focus:border-2 focus:border-[#2563EB] transition-all"
                    />
                </div>

                {/* EMAIL */}
                <div>
                    <label className="text-[16px] font-medium">
                        Email Address
                    </label>

                    <input
                        value={user?.email || ""}
                        disabled
                        className="w-full h-[48px] mt-1 px-4 bg-[#F5F5F6] rounded-[12px]"
                    />
                </div>

                {/* EDUCATION */}
                <div>

                    <label className="text-[16px] font-medium">
                        Education level
                    </label>

                    <div className="relative mt-1">

                        {/* <select
                            value={education}
                            onChange={(e) =>
                                setEducation(e.target.value as UserEducationLevel)
                            }
                            className="w-full h-[48px] px-4 bg-[#F5F5F6] rounded-[12px] outline-none appearance-none"
                        > */}
                        <select
                            value={education}
                             onChange={(e) => setEducation(e.target.value)}
                            className="w-full h-[48px] px-4 bg-[#F5F5F6] rounded-[12px] outline-none appearance-none border border-transparent focus:border-2 focus:border-[#2563EB] transition-all"
                        >
                            {educationLevels.map((level) => (
                                <option key={level.id} value={level.id}>
                                    {level.name}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-auto pt-6 pb-6">
                <div className="flex gap-4">

                    <button
                        onClick={onCancel}
                        className="w-full h-[48px] rounded-[12px] border border-gray-300"
                    >
                        Cancel
                    </button>

                    {/* <button
                        disabled={!hasChanges || loading}
                        onClick={handleSave}
                        className="w-full h-[48px] rounded-[12px] text-white flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={hasChanges ? {
                            backgroundImage: "url('/images/buttonBg.svg')",
                            backgroundSize: '350% 700%',
                            backgroundPosition: 'center',
                            boxShadow: '0px 0px 50px 0px #1953CB40',
                            border: '1px solid rgba(255,255,255,0.35)',
                        } : { backgroundColor: '#D1D5DB' }}
                    >
                        {loading && <Spin size="small" className="[&_.ant-spin-dot-item]:bg-white" />}
                        {loading ? "Saving..." : "Save"}
                    </button> */}

                    <Button
    disabled={!hasChanges || loading}
    loading={loading}
    onClick={handleSave}
    className="w-full h-[48px]! rounded-[12px]! text-white!"
    style={hasChanges ? {
        backgroundImage: "url('/images/buttonBg.svg')",
        backgroundSize: '350% 700%',
        backgroundPosition: 'center',
        boxShadow: '0px 0px 50px 0px #1953CB40',
        border: '1px solid rgba(255,255,255,0.35)',
    } : { backgroundColor: '#D1D5DB' }}
>
    {loading ? "Saving..." : "Save"}
</Button>

                </div>
            </div>

        </div >
    );
};

export default EditProfileSection;