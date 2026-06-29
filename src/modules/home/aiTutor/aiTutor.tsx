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
import { getUserProfile } from "@/src/services/api/user.api";

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
  const [conversationId, setConversationId] = useState<string | null>(() => {
    try {
      return localStorage.getItem("aiTutor_conversationId") || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const recognitionRef = useRef<any>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const accumulatedTranscriptRef = useRef("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isGeneratingFlashcard, setIsGeneratingFlashcard] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const searchParams = useSearchParams();
  const hasTriggeredUpload = useRef(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [showWebcamModal, setShowWebcamModal] = useState(false);

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
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      isRecordingRef.current = true;
      setIsConverting(false);
    };

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results as SpeechRecognitionResultList);
      const newTranscript = results
        .map((result: SpeechRecognitionResult) => result[0].transcript)
        .join(" ");

      // Append new transcript to accumulated text
      const fullTranscript = accumulatedTranscriptRef.current
        ? `${accumulatedTranscriptRef.current} ${newTranscript}`
        : newTranscript;

      accumulatedTranscriptRef.current = fullTranscript;
      setMessage(fullTranscript);
    };

    recognition.onend = () => {
      // Auto-restart if user is still intending to record
      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore if already starting
        }
        return;
      }
      setIsRecording(false);
      setIsConverting(false);
    };

    recognition.onerror = (event: any) => {
      // Restart on recoverable silence errors
      if (event.error === "no-speech" && isRecordingRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore
        }
        return;
      }
      isRecordingRef.current = false;
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
        setShowUploadImageModal(true);
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

  const [messages, setMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("aiTutor_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      const serializableMessages = messages.filter((m) => !m.audio);
      localStorage.setItem("aiTutor_messages", JSON.stringify(serializableMessages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleImage = async (e: any) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Check if file is a video — not supported
    if (file.type.startsWith("video/")) {
      antMessage.error("Video uploads are not supported. Please upload an image instead.");
      if (inputRef.current) inputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      antMessage.error("Only image files are supported. Please upload a JPG, PNG, or similar image.");
      if (inputRef.current) inputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const outPutUrl = await uploadImage(file);

      setUploadedImageUrl(outPutUrl);  // real S3 public URL

      // Local preview
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);

    } catch (err) {
      console.error("Upload failed", err);
      antMessage.error("Failed to upload image. Please try again.");
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
        localStorage.setItem("aiTutor_conversationId", res.conversationId);
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

  const handleSendAudio = useCallback(async () => {
    if (recordingState === "stopped" && audioUrl) {
      setMessages((prev) => [
        ...prev,
        { role: "user", message: null, audio: audioUrl },
      ]);

      try {
        setLoading(true);
        const res = await sendAiMessage({
          message: "I sent a voice message.",
          imageUrl: "",
          conversationId,
        });

        if (!conversationId) {
          setConversationId(res.conversationId);
          localStorage.setItem("aiTutor_conversationId", res.conversationId);
        }

        setMessages((prev) => [
          ...prev,
          { role: "tutor", message: res.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "tutor", message: t('errors.somethingWentWrong') },
        ]);
      } finally {
        setLoading(false);
        resetRecording();
      }
    }
  }, [recordingState, audioUrl, conversationId, resetRecording, t]);

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
      antMessage.success(t('aiTutor.notesSaved'));
    }
  };

  // const handleGenerateFlashcard = async () => {
  //   if (!conversationId) return;

  //   try {
  //     setIsGeneratingFlashcard(true);

  //     const res = await generateFlashcards(conversationId);

  //     console.log("Flashcards generated:", res);

  //   } catch (err) {
  //     console.error("Flashcard generation failed", err);
  //   } finally {
  //     setIsGeneratingFlashcard(false);
  //     antMessage.success(t('success.saved'));
  //   }
  // };

  const handleGenerateFlashcard = async () => {
    if (!conversationId) return;

    // ✅ Check 1 - BEFORE API call, read from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isPremium = user?.isPremium === true ||
      user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE");
    const canCreateFlashcards = user?.freePlan?.canCreateFlashcards;
    const remainingFlashcardsToday = user?.freePlan?.remainingFlashcardsToday;

    if (!isPremium && (!canCreateFlashcards || remainingFlashcardsToday <= 0)) {
      // setModalMessage("You've used all 12 daily flashcards. Upgrade to Premium for unlimited flashcards.");
      setModalMessage(t('limits.dailyFlashcard'));
      setShowUpgradeModal(true);
      return;
    }

    try {
      setIsGeneratingFlashcard(true);
      const res = await generateFlashcards(conversationId);
      antMessage.success(t('aiTutor.flashcardsGenerated'));

      // ✅ Refresh user profile so counts update in localStorage
      const updatedUser = await getUserProfile();
      localStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (err: any) {
      const errorMessage = err?.message || "";

      // ✅ Check 2 - AFTER API call, in case localStorage was stale
      if (errorMessage.toLowerCase().includes("limit reached") ||
        errorMessage.toLowerCase().includes("daily free")) {
        // setModalMessage("You've used all 12 daily flashcards. Upgrade to Premium for unlimited flashcards.");
        setModalMessage(t('limits.dailyFlashcard'));
        setShowUpgradeModal(true);
      } else {
        // antMessage.error("Failed to generate flashcards. Please try again.");
        antMessage.error(t('errors.somethingWentWrong'));
      }
    } finally {
      setIsGeneratingFlashcard(false);
    }
  };
  const [showMenu, setShowMenu] = useState(false);

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem("aiTutor_messages");
    localStorage.removeItem("aiTutor_conversationId");
  };

  

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleOpenCamera = () => {
    setShowUploadImageModal(false);
    if (isMobile()) {
      setTimeout(() => cameraInputRef.current?.click(), 300);
    } else {
      setTimeout(() => startWebcam(), 300);
    }
  };

  const startWebcam = async () => {
    setShowWebcamModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      antMessage.error("Camera access denied. Please allow camera permission.");
      setShowWebcamModal(false);
    }
  };

  const stopWebcam = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setShowWebcamModal(false);
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "webcam_photo.jpg", { type: "image/jpeg" });
      stopWebcam();

      // Preview
      const previewUrl = URL.createObjectURL(blob);
      setSelectedImage(previewUrl);

      // Upload
      try {
        setIsUploading(true);
        const outPutUrl = await uploadImage(file);
        setUploadedImageUrl(outPutUrl);
      } catch (err) {
        antMessage.error("Failed to upload photo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }, "image/jpeg");
  };

  const streak = Number(localStorage.getItem("streak")) || 0;

  const streakTitle =
    streak === 0
      ? t('home.streak.startJourney')
      : t('home.streak.studiedDays', { count: streak });

  const streakSub =
    streak === 0
      ? t('home.streak.consistencyMessage')
      : t('home.streak.keepItUp');

  return (
    <div className="px-4 grid grid-cols-3 gap-2">
      {/* Header  */}
      <div
        className="h-[calc(100vh-100px)] mt-1 mb-4 py-4 rounded-xl col-span-2 flex flex-col gap-4"
        style={{
          // boxShadow: "0px 0px 4px 0px #00000040",
          backgroundColor: '#F7F9FC'
        }}
      >
        <div className="mx-4 flex relative justify-center items-center" style={{ backgroundColor: '#F7F9FC' }}>
          <GoArrowLeft
            className="text-xl absolute left-0 cursor-pointer"
            onClick={() => useBack()}
          />
          <h1 className="text-base font-semibold">AI Tutor</h1>
          {messages.length > 0 && (
            <div className="absolute right-0">
              <button
                onClick={() => setShowMenu((p) => !p)}
                className="w-8 h-8 flex flex-col items-center justify-center gap-[4px] rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="w-[3px] h-[3px] rounded-full bg-gray-500" />
                <span className="w-[3px] h-[3px] rounded-full bg-gray-500" />
                <span className="w-[3px] h-[3px] rounded-full bg-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div
                    className="absolute right-0 top-10 z-20 bg-white rounded-xl py-1 min-w-[160px]"
                    style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.12)' }}
                  >
                    <button
                      onClick={() => { handleClearChat(); setShowMenu(false); }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors  cursor-pointer"
                    >
                      Clear Chat
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-4 relative flex-1 flex flex-col gap-2 overflow-y-auto scrollbar" style={{ backgroundColor: '#F7F9FC' }}>
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
            <div className="px-4 grid grid-cols-2 gap-3  ">
              <div
                className={`w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] transition-all bg-white
    ${!conversationId || isSavingNote ? "opacity-50 pointer-events-none" : "cursor-pointer"}
  `}
                onClick={handleGenerateNote}
              >
                <p className="text-sm text-secondary">
                  {/* {isSavingNote ? t('common.saving') : t('notes.title')} */}
                  {isSavingNote ? t('common.saving') : t('aiTutor.saveNotes')}
                </p>

                {isSavingNote ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ backgroundColor: '#ffffff' }} />
                ) : (
                  <NotesIcon />
                )}
              </div>
              <div
                className={`w-full flex gap-2 items-center justify-between rounded-full px-4 py-2.5 border border-[#DADADA] transition-all bg-white
    ${!conversationId || isGeneratingFlashcard
                    ? "opacity-50 pointer-events-none"
                    : "cursor-pointer"
                  }
  `}
                onClick={handleGenerateFlashcard}
              >
                <p className="text-sm text-secondary">
                  {/* {isGeneratingFlashcard ? t('common.generating') : t('flashcards.title')} */}
                  {isGeneratingFlashcard ? t('common.generating') : t('aiTutor.generateFlashcards')}
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
              backgroundColor: '#ffffff',
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
                        setShowUploadImageModal(true);
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
                      onClick={(e) => e.stopPropagation()}
                    />
                    <input
                      ref={cameraInputRef}
                      onChange={handleImage}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-sm text-red-500 px-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      {/* Listening... */}
                      {t('common.listening')}...
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    className="flex-1 resize-none outline-none transition-all duration-150"
                    // placeholder="Ask Your AI Tutor"
                    placeholder={t('home.aiTutor.ready')}
                    value={message}
                    rows={1}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!loading && !isConverting && !isRecording && !isUploading) {
                          handleSendMessage();
                        }
                      }
                    }}
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
                  onClick={async () => {
                    if (!recognitionRef.current) return;

                    if (!isRecording) {
                      accumulatedTranscriptRef.current = ""; // reset on new recording
                      setMessage("");
                      isRecordingRef.current = true;
                      recognitionRef.current.start();
                    } else {
                      isRecordingRef.current = false; // stop auto-restart
                      setIsConverting(true);
                      recognitionRef.current.stop();
                      // Wait briefly for onresult to fire and set the message
                      await new Promise((resolve) => setTimeout(resolve, 500));
                      handleSendMessage();
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
                      {t('common.listening')}...
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
              {/* <p className="text-xl">{streak > 1 ? "days" : "day"}</p> */}
              <p className="text-xl">{t('home.streak.days')}</p>

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
              setModalMessage("Weak Spot Tracker is a premium feature. Upgrade your plan to get advanced analytics and track your weak spots.");
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
          <h3 className="text-[20px] font-bold text-gray-900 text-center">
            {/* Premium Feature */}
            {t('common.premiumFeature')}
          </h3>
          <p className="text-[14px] text-secondary text-center">
            {modalMessage}
          </p>
          <button
            onClick={() => {
              setShowUpgradeModal(false);
              useRedirect("/profile?open=subscription");
            }}
            // className="w-full h-[48px] bg-primary text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
            className="w-full h-[48px] text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '175% 700%',
              backgroundPosition: 'center',
              boxShadow: '0px 0px 50px 0px #1953CB40',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            {/* Upgrade To Premium */}
            {t('subscription.upgradeToPremium')}
          </button>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-[14px] text-secondary hover:text-gray-700 transition-colors"
          >
            {/* Maybe later */}
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
      {/* UPLOAD IMAGE MODAL */}
      <Modal
        open={showUploadImageModal}
        onCancel={() => setShowUploadImageModal(false)}
        footer={null}
        centered
        width={380}
      >
        <div className="flex flex-col items-center gap-8 py-4">
          <h3 className="text-[20px] font-bold text-gray-900">{t('aiTutor.uploadImage')}</h3>

          <div className="flex gap-10 justify-center">
            {/* Camera */}
            <div
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={handleOpenCamera}
            >
              {/* <div className="w-[100px] h-[100px] rounded-full bg-primary flex items-center justify-center"> */}
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                style={{
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '1400% 900%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}>
                <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-primary">{t('aiTutor.camera')}</p>
            </div>

            {/* Gallery */}
            <div
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => {
                setShowUploadImageModal(false);
                setTimeout(() => {          // ✅ wait for modal to fully close
                  inputRef.current?.click();
                }, 300);
              }}
            >
              {/* <div className="w-[100px] h-[100px] rounded-full bg-[#1B2A4A] flex items-center justify-center">
                <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M3.75 6h16.5A1.5 1.5 0 0121.75 7.5v9a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 013.75 6z" />
                </svg>
              </div> */}
              <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center"
                style={{
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '1400% 900%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}>
                <svg width="42" height="42" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M3.75 6h16.5A1.5 1.5 0 0121.75 7.5v9a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 013.75 6z" />
                </svg>
              </div>
              <p className="text-[16px] font-medium text-primary">{t('aiTutor.gallery')}</p>
            </div>
          </div>
        </div>
      </Modal>
    {/* WEBCAM MODAL */}
      <Modal
        open={showWebcamModal}
        onCancel={stopWebcam}
        footer={null}
        centered
        width={720}
        title="Take a Photo"
      >
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4 w-full">
            <button
              onClick={stopWebcam}
              className="flex-1 h-[44px] rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTakePhoto}
              className="flex-1 h-[44px] rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundImage: "url('/images/buttonBg.svg')",
                backgroundSize: '350% 700%',
                backgroundPosition: 'center',
                boxShadow: '0px 0px 50px 0px #1953CB40',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            >
              Take Photo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AiTutor;
