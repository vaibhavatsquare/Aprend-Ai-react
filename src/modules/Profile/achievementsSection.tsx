"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "./confirmModal";
import { Achievement } from "@/src/libs/types";
import { getUserAchievements } from "@/src/services/api/user.api";

const PAGE_LIMIT = 10;

const dummyAchievements: Achievement[] = [
  {
    id: "1",
    icon: "🔥",
    title: "7-day streak!",
    description: "You maintained your streak",
    buttonText: "Keep going",
    buttonColor: "#E74C3C"
  },
  {
    id: "2",
    icon: "📘",
    title: "Module Complete",
    description: "You completed a module",
    buttonText: "Continue",
    buttonColor: "#3B5BDB"
  },
  {
    id: "3",
    icon: "🏅",
    title: "You're a Star",
    description: "Great performance",
    buttonText: "Awesome",
    buttonColor: "#1A936F"
  }
];

const AchievementsSection = () => {

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skip, setSkip] = useState(0);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [hasMore, setHasMore] = useState(true);

  const [achievementOpen, setAchievementOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const fetchAchievements = async (currentSkip: number, isFirst = false) => {
    try {

      setLoading(true);

      const res = await getUserAchievements({
        skip: currentSkip,
        take: PAGE_LIMIT
      });

      let list = res?.data || [];

      // 👇 fallback dummy if empty
      if (!list.length && isFirst) {
        list = dummyAchievements;
      }

      if (isFirst) {
        setAchievements(list);
      } else {
        setAchievements((prev) => [...prev, ...list]);
      }

      setHasMore(list.length === PAGE_LIMIT);

    } catch (err) {
      console.error("Failed to fetch achievements", err);

      // fallback dummy
      if (isFirst) {
        setAchievements(dummyAchievements);
      }

    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements(0, true);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {

      const nextSkip = skip + PAGE_LIMIT;
      setSkip(nextSkip);

      fetchAchievements(nextSkip);
    }
  };

  return (
    <div className="flex flex-col h-full">

      <h3 className="text-[22px] font-semibold text-center mt-4 mb-4">
        Achievements
      </h3>

      <div
        className="flex-1 overflow-y-auto px-5 scrollbar"
        onScroll={handleScroll}
      >

        {/* shimmer */}
        {initialLoading && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <AchievementSkeleton key={i} />
            ))}
          </div>
        )}

        {!initialLoading && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-4">

            {achievements.map((item) => (
              <AchievementCard
                key={item.id}
                icon={item.icon}
                title={item.title}
                onClick={() => {
                  setSelectedAchievement(item);
                  setAchievementOpen(true);
                }}
              />
            ))}

          </div>
        )}

        {loading && !initialLoading && (
          <p className="text-center text-sm text-gray-400">
            Loading...
          </p>
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
  onClick
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
      <div className="text-[70px]">{icon}</div>

      <p className="text-[18px] font-medium">
        {title}
      </p>
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