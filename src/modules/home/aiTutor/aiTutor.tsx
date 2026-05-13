"use client";

import IconSparkel from "@/src/components/icons/iconSparkel";
import { setSearchParam, useBack, useRedirect } from "@/src/hooks/router.hooks";
import { useAudioRecorder } from "@/src/hooks/useAudioRecorder";
import dynamic from "next/dynamic";
import { Image as AntImage, message as antMessage, Modal } from "antd";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { GoArrowLeft } from "react-icons/go";
import { IoArrowForwardSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import NotesIcon from "@/src/components/icons/notesIcon";
import { TbCards } from "react-icons/tb";
import { sendAiMessage } from "@/src/services/api/aiTutor.api";
import ReactMarkdown from "react-markdown";
import { deleteFile, uploadImage } from "@/src/services/api/upload.api";
import { createNote } from "@/src/services/api/notes.api";
import { generateFlashcards } from "@/src/services/api/flashcards.api";
import { getStoredUser } from "@/src/libs/helpers";
import { useTranslation } from "@/src/libs/i18n";
import { useSearchParams } from "next/navigation";

const AudioWaveform = dynamic(
  () => import("@/src/components/AudioWaveform/AudioWaveform"),
  { ssr: false }
);

const AudioPlayer = dynamic(
  () => import("@/src/components/AudioPlayer/AudioPlayer"),
  { ssr: false }
);

const AiTutor = () => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const recognitionRef = useRef<any>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isGeneratingFlashcard, setIsGeneratingFlashcard] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const searchParams = useSearchParams();
  const hasTriggeredUpload = useRef(false);

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setIsConverting(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsConverting(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setIsConverting(false);
    };
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setUserName(user?.name ||
        user?.email?.split("@")[0] ||
        "");
    };
  }, []);

  useEffect(() => {
    const shouldUpload = searchParams.get("upload");

    if (shouldUpload === "true" && !hasTriggeredUpload.current) {
      hasTriggeredUpload.current = true;

      setTimeout(() => {
        if (!uploadedImageUrl) {
          inputRef.current?.click();
        }

        setSearchParam("upload", null);
      }, 300);
    }
  }, [searchParams]);

  const {
    recordingState,
    recordingTime,
    audioUrl,
    cancelRecording,
    resetRecording,
  } = useAudioRecorder();

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleImage = async (e: any) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const outPutUrl = await uploadImage(file);

      setUploadedImageUrl(outPutUrl);  // real S3 public URL

      // Local preview
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadedImageUrl) return;

    try {
      const fileName = uploadedImageUrl.split("/").pop(); // extract file name
      console.log(fileName)
      if (fileName) {
        await deleteFile(fileName);
      }
    } catch (err) {
      console.warn("Delete failed");
    }
    setUploadedImageUrl(null);
    setSelectedImage(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const userMessage = {
      role: "user",
      message: message.trim() || null,
      image: uploadedImageUrl || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setSelectedImage(null);

    try {
      setLoading(true);

      const res = await sendAiMessage({
        message: userMessage.message || "",
        imageUrl: uploadedImageUrl || "",
        conversationId,
      });

      // Save conversationId if first message
      if (!conversationId) {
        setConversationId(res.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "tutor",
          message: res.reply,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "tutor",
          message: t('errors.somethingWentWrong'),
        },
      ]);
    } finally {
      setLoading(false);
      setUploadedImageUrl(null);
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

  const handleGenerateNote = async () => {
    if (!conversationId) return;

    try {
      setIsSavingNote(true);

      await createNote(conversationId);

      // Optional: show success toast
      console.log("Note saved successfully");

    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
      setIsSavingNote(false);
      antMessage.success(t('success.saved'));
    }
  };

  const handleGenerateFlashcard = async () => {
    if (!conversationId) return;

    try {
      setIsGeneratingFlashcard(true);

      const res = await generateFlashcards(conversationId);

      console.log("Flashcards generated:", res);

    } catch (err) {
      console.error("Flashcard generation failed", err);
    } finally {
      setIsGeneratingFlashcard(false);
      antMessage.success(t('success.saved'));
    }
  };

  const streak = Number(localStorage.getItem("streak")) || 0;

  const streakTitle =
    streak === 0
      ? t('home.streak.startJourney')
      : t('home.streak.studiedDays', { count: streak });

  const streakSub =
    streak === 0
      ? "Consistency builds mastery. Let's begin!"
      : t('home.streak.keepItUp');

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
              Hello{userName ? `, ${userName}!` : ""}
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
                              actionsRender: () => [],
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
                      <div className="prose prose-sm max-w-none text-secondary">
                        <ReactMarkdown>{msg.message}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )
              )}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 flex gap-2">
                  <div className="w-12 h-12 p-2 rounded-full bg-primary flex justify-center items-center">
                    <IconSparkel color="#ffffff" />
                  </div>
                  <div className="flex items-center h-12">
                    <p className="text-secondary leading-none">
                      {t('common.loading')}...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {messages.length > 0 && (
            <div className="px-4 grid grid-cols-2 gap-3">
              <div
                className={`w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] transition-all
    ${!conversationId || isSavingNote ? "opacity-50 pointer-events-none" : "cursor-pointer"}
  `}
                onClick={handleGenerateNote}
              >
                <p className="text-sm text-secondary">
                  {isSavingNote ? t('common.saving') : t('notes.title')}
                </p>

                {isSavingNote ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <NotesIcon />
                )}
              </div>
              <div
                className={`w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] transition-all
    ${!conversationId || isGeneratingFlashcard
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                  }
  `}
                onClick={handleGenerateFlashcard}
              >
                <p className="text-sm text-secondary">
                  {isGeneratingFlashcard ? t('common.generating') : t('flashcards.title')}
                </p>

                {isGeneratingFlashcard ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TbCards className="text-secondary text-xl" />
                )}
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
              <div className="relative w-fit overflow-visible">
                <AntImage
                  src={selectedImage}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg"
                  preview={{
                    actionsRender: () => [],
                  }}
                />

                <div
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-secondary rounded-full flex justify-center items-center cursor-pointer pointer-events-auto"
                  onClick={handleRemoveImage}
                >
                  <IoClose className="text-white text-xs" />
                </div>
              </div>
            )}

            <div className="flex gap-2 items-center">
              {recordingState === "idle" && (
                <>
                  <div
                    className={`w-8 h-8 rounded-full flex justify-center items-center transition-all ${uploadedImageUrl ? "opacity-50 pointer-events-none" : "cursor-pointer"
                      }`}
                    style={{
                      boxShadow: "0px 0px 4px 0px #00000040",
                    }}
                    onClick={() => {
                      if (!uploadedImageUrl) {
                        inputRef.current?.click();
                      }
                    }}
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
                      disabled={!!uploadedImageUrl}
                      className="hidden"
                    />
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-sm text-red-500 px-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Listening...
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    className="flex-1 resize-none outline-none transition-all duration-150"
                    placeholder="Ask Your AI Tutor"
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </>
              )}
              {recordingState === "idle" ? (
                <div
                  className={`w-8 h-8 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 ${isRecording ? "bg-red-500 scale-110 animate-pulse" : ""
                    }`}
                  style={{
                    boxShadow: "0px 0px 4px 0px #00000040",
                  }}
                  onClick={() => {
                    if (!recognitionRef.current) return;

                    if (!isRecording) {
                      recognitionRef.current.start();
                    } else {
                      setIsConverting(true);
                      recognitionRef.current.stop();
                    }
                  }}
                >
                  <Image
                    src="/images/home/mic.svg"
                    alt="Mic"
                    width={20}
                    height={20}
                  />
                </div>
              ) : isRecording ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 flex justify-center items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm text-gray-600">
                      Listening...
                    </span>
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
                className={`w-8 h-8 rounded-full flex justify-center items-center transition-all ${loading || isConverting || isRecording || isUploading
                  ? "opacity-50 pointer-events-none"
                  : "cursor-pointer"
                  }`}
                style={{
                  boxShadow: "0px 0px 4px 0px #00000040",
                }}
                onClick={handleSendMessage}
              >
                {loading || isConverting || isUploading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Image
                    src="/images/home/shareIcon.svg"
                    alt="Share"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right part */}
      <div className="flex flex-col gap-4 h-[calc(100vh-84px)] mt-1 px-2 overflow-y-auto scrollbar">
        <div className="relative w-full flex items-start justify-between gap-4 rounded-lg px-4 py-6 bg-linear-to-r from-[#F97316] via-[#ED482F] to-[#EF4444]">
          <h1 className="text-base text-white">
            {streakTitle}
            <br />
            {streakSub}
          </h1>
          <AiOutlineFire className="text-white text-4xl" />
          {streak > 0 && (
            <div className="absolute -bottom-3 right-5 flex gap-2 items-center text-[#FFFFFF80] font-medium">
              <h2 className="text-5xl">{streak}</h2>
              <p className="text-xl">{streak > 1 ? "days" : "day"}</p>
            </div>
          )}
        </div>

        <div
          className="flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA] cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => useRedirect("/home/questions")}
        >
          <p className="text-sm font-medium">{t('home.questionBank.title')}</p>
          <IoArrowForwardSharp className="text-lg -rotate-45 cursor-pointer" />
        </div>

        <div
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const isPremium = user?.isPremium === true || user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE");
            if (!isPremium) {
              setShowUpgradeModal(true);
              return;
            }
            useRedirect("/home/weak-spot-tracker");
          }}
          className={`flex gap-2 items-center justify-between p-4 rounded-xl border border-[#DADADA] cursor-pointer transition-colors ${JSON.parse(localStorage.getItem("user") || "{}").isPremium
            ? "hover:bg-gray-50"
            : "opacity-40"
            }`}
        >
          <div className="flex items-center gap-2">
            {!JSON.parse(localStorage.getItem("user") || "{}").isPremium && (
              <svg width="16" height="13" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#9CA3AF" />
              </svg>
            )}
            <p className="text-sm font-medium">{t('home.weakSpotTracker.title')}</p>
          </div>
          <IoArrowForwardSharp className="text-lg -rotate-45 cursor-pointer" />
        </div>
      </div>
      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A" />
            </svg>
          </div>
          <h3 className="text-[20px] font-bold text-gray-900 text-center">Premium Feature</h3>
          <p className="text-[14px] text-secondary text-center">
            Weak Spot Tracker is a premium feature. Upgrade your plan to get advanced analytics and track your weak spots.
          </p>
          <button
            onClick={() => {
              setShowUpgradeModal(false);
              useRedirect("/profile?open=subscription");
            }}
            className="w-full h-[48px] bg-primary text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade To Premium
          </button>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-[14px] text-secondary hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AiTutor;
