"use client";

import IconSparkel from "@/src/components/icons/iconSparkel";
import { useBack } from "@/src/hooks/router.hooks";
import { useAudioRecorder } from "@/src/hooks/useAudioRecorder";
import dynamic from "next/dynamic";
import { Input, Image as AntImage } from "antd";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { IoArrowForwardSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaPause, FaPlay } from "react-icons/fa";
import NotesIcon from "@/src/components/icons/notesIcon";
import { TbCards } from "react-icons/tb";

const AudioWaveform = dynamic(
  () => import("@/src/components/AudioWaveform/AudioWaveform"),
  { ssr: false }
);

const AudioPlayer = dynamic(
  () => import("@/src/components/AudioPlayer/AudioPlayer"),
  { ssr: false }
);

const AiTutor = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    recordingState,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  } = useAudioRecorder();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const [messages, setMessages] = useState<any[]>([
    // {
    //   role: "user",
    //   message: "Hey! Can you help me revise the human heart anatomy?",
    // },
    // {
    //   role: "tutor",
    //   message:
    //     "Of course! ❤️ The human heart has four chambers — two atria (upper chambers) and two ventricles (lower chambers).",
    // },
  ]);

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImage = (e: any) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "" || selectedImage) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          message: message.trim() !== "" ? message : null,
          image: selectedImage || null,
        },
      ]);
      setMessage("");
      setSelectedImage(null);
    }
  };

  const handleSendAudio = useCallback(() => {
    if (recordingState === "stopped" && audioUrl) {
      setMessages((prev) => [
        ...prev,
        { role: "user", message: null, audio: audioUrl },
      ]);
      resetRecording();
    }
  }, [recordingState, audioUrl, resetRecording]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && recordingState === "stopped") {
        e.preventDefault();
        handleSendAudio();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recordingState, handleSendAudio]);

  return (
    <div className="px-4 grid grid-cols-3 gap-2">
      {/* Header  */}
      <div
        className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-xl col-span-2 flex flex-col gap-4"
        style={{
          boxShadow: "0px 0px 4px 0px #00000040",
        }}
      >
        <div className="mx-4 flex relative justify-center">
          <GoArrowLeft
            className="text-xl absolute left-0 cursor-pointer"
            onClick={() => useBack()}
          />
          <h1 className="text-base font-semibold">AI Tutor</h1>
        </div>

        <div className="px-4 relative flex-1 flex flex-col gap-2 overflow-y-auto scrollbar">
          {messages.length === 0 && (
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-semibold bg-linear-to-r from-primary via-[#6D8199] to-primary bg-clip-text text-transparent">
              Hello, lucas!
            </h1>
          )}

          <div className="mt-auto flex flex-col gap-2">
            {messages &&
              messages.map((msg, index) =>
                msg.role === "user" ? (
                  <div key={index} className="flex justify-end">
                    {msg.audio ? (
                      <div className="w-[50%] p-3 bg-[#5555550D] rounded-xl rounded-br-none">
                        <AudioPlayer audioUrl={msg.audio} />
                      </div>
                    ) : (
                      <div className="max-w-[80%] p-3 bg-[#5555550D] rounded-xl rounded-br-none flex flex-col gap-2">
                        {msg.image && (
                          <AntImage
                            src={msg.image}
                            alt="Uploaded"
                            className="max-w-[200px] rounded-lg"
                            preview={{
                              toolbarRender: () => null,
                            }}
                          />
                        )}
                        {msg.message && (
                          <p className="text-secondary">{msg.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={index} className="flex justify-start">
                    <div className="max-w-[80%] p-3 flex gap-2">
                      <div className="w-12 h-12 p-2 rounded-full bg-primary flex justify-center items-center">
                        <IconSparkel color="#ffffff" />
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {messages.length > 0 && (
            <div className="px-4 grid grid-cols-2 gap-3">
              <div className="w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] cursor-pointer">
                <p className="text-sm text-secondary">Save to Notes</p>
                <NotesIcon />
              </div>
              <div className="w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] cursor-pointer">
                <p className="text-sm text-secondary">Generate Flashcards</p>
                <TbCards className="text-secondary text-xl" />
              </div>
            </div>
          )}
          <div
            className="mx-4 flex flex-col gap-2 rounded-xl p-3"
            style={{
              boxShadow: "0px 0px 4px 0px #00000040",
            }}
          >
            {/* Image Preview */}
            {selectedImage && (
              <div className="relative w-fit">
                <AntImage
                  src={selectedImage}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                  preview={{
                    toolbarRender: () => null,
                  }}
                />
                <div
                  className="absolute -top-2 -right-2 w-5 h-5 bg-secondary rounded-full flex justify-center items-center cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  <IoClose className="text-white text-sm" />
                </div>
              </div>
            )}
            <div className="flex gap-2 items-center">
              {recordingState === "idle" && (
                <>
                  <div
                    className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
                    style={{
                      boxShadow: "0px 0px 4px 0px #00000040",
                    }}
                    onClick={() => inputRef.current?.click()}
                  >
                    <Image
                      src="/images/home/camera.svg"
                      alt="Camera"
                      width={20}
                      height={20}
                    />
                    <input
                      ref={inputRef}
                      onChange={handleImage}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <Input
                    className="border-none! shadow-none! flex-1"
                    placeholder="Ask Your AI Tutor"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSendMessage}
                  />
                </>
              )}
              {recordingState === "idle" ? (
                <div
                  className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
                  style={{
                    boxShadow: "0px 0px 4px 0px #00000040",
                  }}
                  onClick={startRecording}
                >
                  <Image
                    src="/images/home/mic.svg"
                    alt="Mic"
                    width={20}
                    height={20}
                  />
                </div>
              ) : recordingState === "recording" ? (
                <div className="flex-1 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={cancelRecording}
                  >
                    <IoClose className="text-lg text-gray-600" />
                  </div>
                  <div className="flex-1 flex justify-center items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-gray-600 min-w-[40px]">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
                    style={{
                      boxShadow: "0px 0px 4px 0px #00000040",
                    }}
                    onClick={stopRecording}
                  >
                    <FaPause className="text-sm" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={cancelRecording}
                  >
                    <IoClose className="text-lg text-gray-600" />
                  </div>
                  {audioUrl && <AudioWaveform audioUrl={audioUrl} />}
                </div>
              )}
              <div
                className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer"
                style={{
                  boxShadow: "0px 0px 4px 0px #00000040",
                }}
                onClick={
                  recordingState === "stopped"
                    ? handleSendAudio
                    : handleSendMessage
                }
              >
                <Image
                  src="/images/home/shareIcon.svg"
                  alt="Share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right part */}
      <div className="flex flex-col gap-4 h-[calc(100vh-84px)] mt-1 px-2 overflow-y-auto scrollbar">
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
          <h1 className="text-base text-white">
            You've studied 3 days in a row! <br />
            Keep it up 💪
          </h1>
          <AiOutlineFire className="text-white text-4xl" />
          <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
            <h2 className="text-5xl">3</h2>
            <p className="text-xl">days</p>
          </div>
        </div>

        <div className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA]">
          <p className="text-sm font-medium">Question Bank</p>
          <IoArrowForwardSharp className="text-lg -rotate-45 cursor-pointer" />
        </div>

        <div className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA]">
          <p className="text-sm font-medium">Weak Spot Tracker</p>
          <IoArrowForwardSharp className="text-lg -rotate-45 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
