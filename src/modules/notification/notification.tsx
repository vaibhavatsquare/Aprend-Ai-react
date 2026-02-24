"use client";

import React from "react";

type NotificationItem = {
    id: string;
    title: string;
    description: string;
    time: string;
    section: "Today" | "Yesterday";
};

const dummyData: NotificationItem[] = [
    {
        id: "1",
        title: "Project Alpha Due tomorrow",
        description: "Project Alpha Due tomorrow",
        time: "2h ago",
        section: "Today",
    },
    {
        id: "2",
        title: "Review Your Weak Spots",
        description:
            "Your daily quiz is ready! Let’s practice the areas that need a little more focus.",
        time: "2h ago",
        section: "Today",
    },
    {
        id: "3",
        title: "Progress snippet",
        description: "You improved by +12% yesterday! Keep it up",
        time: "1d ago",
        section: "Yesterday",
    },
    {
        id: "4",
        title: "Project Alpha Due tomorrow",
        description: "Project Alpha Due tomorrow",
        time: "2d ago",
        section: "Yesterday",
    },
];

const NotificationDropdown = () => {
    const today = dummyData.filter((n) => n.section === "Today");
    const yesterday = dummyData.filter(
        (n) => n.section === "Yesterday"
    );

    return (
        <div className="absolute top-[44px] right-0 w-[530px] 
           bg-white 
           rounded-xl 
           p-6 
           z-50
           border border-gray-100
           shadow-[0_25px_80px_rgba(0,0,0,0.15)]
           transition-all duration-300">

            <h2 className="text-xl font-semibold text-center mb-6">
                Notification
            </h2>

            {/* Scrollable Content */}
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar">
                {today.length > 0 && (
                    <>
                        <h3 className="font-medium text-[18px] text-secondary mb-3">
                            Today
                        </h3>
                        <div className="space-y-2 mb-4">
                            {today.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}

                {yesterday.length > 0 && (
                    <>
                        <h3 className="font-medium text-[18px] text-secondary mb-3">
                            Yesterday
                        </h3>
                        <div className="space-y-2">
                            {yesterday.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Card = ({ item }: { item: NotificationItem }) => {
  return (
    <div className="bg-[#F5F5F5] rounded-xl p-3 flex flex-col gap-1">
      
      {/* Title */}
      <h4 className="font-medium text-[18px] text-[#121212]">
        {item.title}
      </h4>

      {/* Description + Time Row */}
      <div className="flex justify-between items-start gap-4">
        <p className="text-[14px] text-secondary">
          {item.description}
        </p>

        <span className="text-xs text-secondary whitespace-nowrap">
          {item.time}
        </span>
      </div>

    </div>
  );
};

export default NotificationDropdown;
