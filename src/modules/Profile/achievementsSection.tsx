"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmModal from "./confirmModal";
import { Achievement } from "@/src/libs/types";
import { getUserAchievements } from "@/src/services/api/user.api";
import { useInitialFetch } from "@/src/libs/helpersWithUseClient";
import { useTranslation } from "@/src/libs/i18n";

const PAGE_LIMIT = 10;

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skip, setSkip] = useState(0);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);

  const [achievementOpen, setAchievementOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const fetchAchievements = async (currentSkip: number, isFirst = false) => {
    try {
      setLoading(true);

      const res = await getUserAchievements({
        skip: currentSkip,
        take: PAGE_LIMIT,
        include: "achievement",
        orderBy: "createdAt|desc",
      });

      let list = (res as any)?.list || [];

      list = list.map((item: any) => ({
        id: item.id,
        title: item.achievement?.title || "Untitled",
        description: item.achievement?.description || "",
        image: item.achievement?.image || "",
        buttonName: item.achievement?.buttonName || "Continue",
        code: item.achievement?.code || "#3B5BDB",
      }));

      if (isFirst) {
        setAchievements(list);
      } else {
        setAchievements((prev) => [...prev, ...list]);
      }

      setHasMore(res.hasMany);
    } catch (err) {
      console.error("Failed to fetch achievements", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useInitialFetch(() => fetchAchievements(0, true));

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          !initialLoading &&
          hasMore
        ) {
          const newSkip = skip + PAGE_LIMIT;
          setSkip(newSkip);
          fetchAchievements(newSkip);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, hasMore, skip]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center mt-20 text-center">
      <div className="text-[50px] mb-3">🏆</div>
      <p className="text-lg font-medium">{t('achievements.empty')}</p>
      <p className="text-sm text-gray-400 mt-1">
        Start learning to unlock achievements
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-[22px] font-semibold text-center mt-4 mb-4">
        {t('profile.achievements')}
      </h3>

      <div className="flex-1 overflow-y-auto px-5 scrollbar">
        {/* Loading */}
        {initialLoading ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <AchievementSkeleton key={i} />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          // EMPTY STATE
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-4">
            {achievements.map((item) => (
              <AchievementCard
                key={item.id}
                icon={item.image}
                title={item.title}
                onClick={() => {
                  setSelectedAchievement(item);
                  setAchievementOpen(true);
                }}
              />
            ))}

            {/* Loader */}
            {loading && (
              <div className="col-span-2">
                <AchievementSkeleton />
              </div>
            )}

            {/* Observer trigger */}
            {hasMore && <div ref={observerRef} className="h-10" />}
          </div>
        )}
      </div>

      {achievementOpen && selectedAchievement && (
        <ConfirmModal
          type="achievement"
          achievement={selectedAchievement}
          onClose={() => setAchievementOpen(false)}
        />
      )}
    </div>
  );
};

const AchievementCard = ({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[16px] p-3 shadow-md text-center cursor-pointer hover:shadow-lg transition"
    >
      <div className="flex justify-center mb-[2px]">
        <img
          src={icon}
          alt="achievement"
          className="w-24 h-24 object-contain"
        />
      </div>

      <p className="text-[16px] font-medium">{title}</p>
    </div>
  );
};

const AchievementSkeleton = () => {
  return (
    <div className="bg-white rounded-[16px] p-3 shadow-md animate-pulse">
      <div className="w-full h-[80px] bg-gray-200 rounded mb-4"></div>

      <div className="h-[18px] bg-gray-200 rounded w-[60%] mx-auto"></div>
    </div>
  );
};

export default AchievementsSection;
