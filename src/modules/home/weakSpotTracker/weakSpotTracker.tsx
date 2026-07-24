
"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { getWeakSpotTracker } from "@/src/services/api/weakSpotTracker.api";
import { useRouter } from "next/navigation";


// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChartEntry {
  day: string;
  target: number;
  actual: number;
}

export interface WeakSpot {
  id: number;
  subject: string;
  metric: string;
  metricValue: number;
  metricLabel: string;
  progressColor: string;
  commonMistakes?: string[];
  recommendedLessons?: string[];
}

export interface HighlightCard {
  id: number;
  subject: string;
  tip: string;
  actionType: "quiz" | "notes";
  actionLabel: string;
}

export interface WeakSpotTrackerData {
  totalWeakAreas: number;
  improvementTrend: string;
  avgTimeOnWeakTopics: string;
  weeklyChart: ChartEntry[];
  monthlyChart: ChartEntry[];
  highlightCards: HighlightCard[];
  weakSpots: WeakSpot[];
}

// ─── API fetch — maps real API response to UI data shape ──────────────────────

const fetchWeakSpotData = async (): Promise<WeakSpotTrackerData> => {
  const res = await getWeakSpotTracker("all");
  return {
    totalWeakAreas: res.summary.totalWeakAreas,
    improvementTrend: `${res.summary.improvementTrendPercent}% this week`,
    avgTimeOnWeakTopics: `${res.summary.estimatedAverageStudyMinutes} min`,
    weeklyChart: (res.trend.weekly ?? []).map((e) => ({
      day: e.label,
      target: e.totalAssigned,
      actual: e.completed,
    })),
    monthlyChart: (res.trend.monthly ?? []).map((e) => ({
      day: e.label,
      target: e.totalAssigned,
      actual: e.completed,
    })),
    highlightCards: (res.recommendations ?? []).map((r, i) => ({
      id: i,
      subject: r.title,
      tip: r.message,
      actionType: r.type === "QUIZ" ? "quiz" : "notes",
      actionLabel: r.ctaLabel,
    })),
    weakSpots: (res.weakSpots ?? []).map((s, i) => ({
      id: i,
      subject: s.topic,
      metric: "Accuracy",
      metricValue: s.accuracyPercent,
      metricLabel: `${s.accuracyPercent}%`,
      progressColor:
        s.accuracyPercent < 40
          ? "#EF4444"
          : s.accuracyPercent < 65
            ? "#EAB308"
            : "#22C55E",
      commonMistakes: s.commonMistakes,
      recommendedLessons: s.recommendedLessons,
    })),
  };
};

// ─── Custom Bar Shape ─────────────────────────────────────────────────────────

const CustomBar = (props: any) => {
  const { x, y, width, height, payload } = props;
  if (!height || height <= 0) return null;
  const actual = payload?.actual ?? 0;
  const target = payload?.target ?? 1;
  const fillRatio = Math.min(actual / target, 1);
  const filledHeight = Math.round(height * fillRatio);
  const radius = 8;
  const uid = `clip-${x}-${y}`;
  return (
    <g>
      <clipPath id={uid}>
        <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} />
      </clipPath>
      <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill="white" stroke="#2563EB" strokeWidth={1.5} />
      {filledHeight > 0 && (
        <rect x={x} y={y + height - filledHeight} width={width} height={filledHeight} fill="#2563EB" clipPath={`url(#${uid})`} />
      )}
    </g>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

const WeakSpotRow = ({ spot }: { spot: WeakSpot }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-gray-200 rounded-[clamp(6px,0.6vw,10px)] overflow-hidden mb-[clamp(4px,0.6vw,10px)] last:mb-0">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-[clamp(10px,1vw,16px)] py-[clamp(7px,0.7vw,12px)] text-left bg-white"
      >
        <div className="flex flex-col gap-[clamp(3px,0.3vw,6px)] flex-1 pr-[clamp(8px,0.8vw,14px)]">
          <p className="font-semibold text-gray-900 text-[clamp(12px,0.85vw,15px)]">{spot.subject}</p>
          <p className="text-[clamp(11px,0.75vw,13px)] text-secondary">{spot.metric} {spot.metricLabel}</p>
          <div className="mt-[0.3vw] w-full h-[0.2vw] bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${spot.metricValue}%`, backgroundColor: spot.progressColor }}
            />
          </div>
        </div>
        {expanded
          ? <LuChevronUp className="text-[clamp(14px,1vw,18px)] text-secondary shrink-0" />
          : <LuChevronDown className="text-[clamp(14px,1vw,18px)] text-secondary shrink-0" />
        }
      </button>

      {expanded && spot.commonMistakes && (
        <div className="px-[clamp(10px,1vw,16px)] pb-[clamp(10px,1vw,16px)] pt-[clamp(5px,0.5vw,9px)] space-y-[clamp(5px,0.6vw,10px)] border-t border-gray-100">
          <div>
            <p className="text-[clamp(11px,0.75vw,13px)] font-semibold text-gray-700 mb-[clamp(2px,0.3vw,5px)]">Common mistakes</p>
            <ul className="space-y-[0.3vw]">
              {spot.commonMistakes.map((m, i) => (
                <li key={i} className="text-[clamp(11px,0.75vw,13px)] text-secondary flex items-start gap-[clamp(4px,0.4vw,8px)]">
                  <span className="mt-[0.4vw] w-[0.3vw] h-[0.3vw] rounded-full bg-secondary shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          {spot.recommendedLessons && (
            <div>
              <p className="text-[clamp(11px,0.75vw,13px)] font-semibold text-gray-700 mb-[clamp(4px,0.5vw,9px)]">Recommended Lessons</p>
              <div className="flex flex-wrap gap-[clamp(5px,0.5vw,9px)]">
                {spot.recommendedLessons.map((lesson, i) => (
                  <span key={i} className="px-[clamp(6px,0.6vw,10px)] py-[clamp(3px,0.3vw,6px)] rounded-full border border-gray-200 text-[clamp(10px,0.7vw,13px)] text-secondary cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    {lesson}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const WeakSpotTracker = () => {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [data, setData] = useState<WeakSpotTrackerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchWeakSpotData()
      .then((result) => { setData(result); setError(null); })
      .catch(() => setError("Failed to load data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const chartData = chartView === "weekly"
    ? data?.weeklyChart ?? []
    : data?.monthlyChart ?? [];

  return (
    <div className="px-[clamp(12px,1.2vw,20px)] min-h-screen flex-1 overflow-y-auto scrollbar py-[clamp(12px,1.2vw,20px)]" style={{ backgroundColor: '#F7F9FC' }}>
      <div
        className="border border-gray-200 p-[clamp(14px,1.5vw,24px)] flex flex-col gap-[clamp(10px,1vw,18px)]"
        style={{ borderRadius: 'clamp(16px,2.2vw,32px)', boxShadow: "0px 0px 1px 0px #00000040", backgroundColor: '#F7F9FC' }}
      >
        <h1 className="text-[1.1vw] font-bold text-gray-900">Weak Spot Tracker</h1>

        {error && (
          <div className="p-[0.6vw] bg-red-50 border border-red-200 rounded-xl text-[0.78vw] text-red-600">{error}</div>
        )}

        {/* Stat Cards — ratio 1:1:2 matching Figma 261:261:523 */}
        {/* Bottom: Progress trend + All weak spots — 50/50 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(6px,0.8vw,14px)]">
          {loading ? (
            <>
              <Skeleton className="h-[clamp(60px,5vw,80px)]" />
              <Skeleton className="h-[clamp(60px,5vw,80px)]" />
              <Skeleton className="col-span-2 h-[clamp(60px,5vw,80px)]" />
            </>
          ) : (
            <>
              <div className="rounded-[clamp(6px,0.6vw,10px)] px-[clamp(10px,1vw,16px)] py-[clamp(7px,0.7vw,12px)]" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-[clamp(11px,0.75vw,14px)] text-secondary mb-[clamp(2px,0.3vw,6px)]">⚠️ Total weak areas</p>
                <p className="text-[clamp(13px,1vw,18px)] font-roboto text-gray-900">{data?.totalWeakAreas ?? 0}</p>
              </div>
              <div className="rounded-[clamp(6px,0.6vw,10px)] px-[clamp(10px,1vw,16px)] py-[clamp(7px,0.7vw,12px)]" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-[clamp(11px,0.75vw,14px)] text-secondary mb-[clamp(2px,0.3vw,6px)]">📈 Improvement Trend</p>
                <p className="text-[clamp(13px,1vw,18px)] font-roboto text-gray-900">{data?.improvementTrend ?? ""}</p>
              </div>
              <div className="col-span-2 rounded-[clamp(6px,0.6vw,10px)] px-[clamp(10px,1vw,16px)] py-[clamp(7px,0.7vw,12px)]" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-[clamp(11px,0.75vw,14px)] text-secondary mb-[clamp(2px,0.3vw,6px)]">⏱️ Average Time on Weak Topics</p>
                <p className="text-[clamp(13px,1vw,18px)] font-roboto text-gray-900">{data?.avgTimeOnWeakTopics ?? ""}</p>
              </div>
            </>
          )}
        </div>

        {/* Highlight Cards — 3 equal cards matching Figma 413px each */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(6px,0.8vw,14px)]">
          {loading ? (
            <>
              <Skeleton className="h-[clamp(80px,7vw,110px)]" />
              <Skeleton className="h-[clamp(80px,7vw,110px)]" />
              <Skeleton className="h-[clamp(80px,7vw,110px)]" />
            </>
          ) : (
            data?.highlightCards.map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-[clamp(6px,0.6vw,10px)] p-[clamp(10px,1vw,16px)] flex flex-col gap-[clamp(5px,0.5vw,9px)]"
                style={{ boxShadow: "0px 0px 1px 0px #00000040", backgroundColor: '#ffffff' }}
              >
                <p className="font-semibold text-gray-900 text-[clamp(12px,0.85vw,16px)]">{card.subject}</p>
                <p className="text-[clamp(11px,0.75vw,14px)] text-secondary flex-1 line-clamp-2">{card.tip}</p>
                {/* <button className="self-start px-4 py-1.5 rounded-full text-sm font-medium text-white bg-primary"> */}
                <button
                  className="self-start px-[clamp(8px,0.8vw,14px)] py-[clamp(4px,0.4vw,8px)] rounded-full text-[clamp(11px,0.75vw,13px)] font-medium text-white bg-[#2563EB]"
                  onClick={() => {
                    if (card.actionType === "quiz") {
                      router.push("/home/questions");
                    } else {
                      router.push("/notes");
                    }
                  }}
                >
                  {card.actionLabel}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom: Progress trend + All weak spots — 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(6px,0.8vw,14px)]">

          {/* Progress Trend */}
          <div
            className="border border-gray-200 rounded-[clamp(6px,0.6vw,10px)] p-[clamp(10px,1vw,16px)] flex flex-col pointer-events-none"
            style={{ boxShadow: "0px 0px 1px 0px #00000040", backgroundColor: '#ffffff', minHeight: 'clamp(260px,22vw,420px)', height: 'clamp(300px,28vw,480px)' }}
          >
            <div className="flex items-center justify-between mb-[0.6vw]">
              <p className="text-[clamp(12px,0.85vw,16px)] font-semibold text-gray-900">Progress trend</p>
              <div className="flex bg-gray-100 rounded-full p-[clamp(2px,0.15vw,4px)] pointer-events-auto">
                {(["weekly", "monthly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={`px-[clamp(8px,0.8vw,14px)] py-[clamp(4px,0.35vw,7px)] rounded-full text-[clamp(10px,0.7vw,13px)] font-medium transition-all duration-200 ${
                      // chartView === v ? "bg-primary text-white shadow" : "text-secondary"
                      chartView === v ? "bg-[#2563EB] text-white shadow" : "text-secondary"
                      }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <Skeleton className="flex-1 w-full" />
            ) : (
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    barCategoryGap="25%"
                    margin={{ top: 10, right: 8, left: 8, bottom: 5 }}
                    style={{ outline: 'none' }}
                    tabIndex={-1}
                  >
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#9CA3AF", fontFamily: "inherit" }}
                      height={28}
                    />
                    <Bar dataKey="target" shape={<CustomBar />} maxBarSize={55} isAnimationActive={true} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* All Weak Spots */}
          <div
            className="rounded-[clamp(6px,0.6vw,10px)] p-[clamp(10px,1vw,16px)]"
            style={{ boxShadow: "0px 0px 1px 0px #00000040", backgroundColor: '#ffffff' }}
          >
            <p className="text-[clamp(12px,0.85vw,16px)] font-semibold text-gray-900 mb-[clamp(4px,0.6vw,10px)]">All weak spots</p>
            {loading ? (
              <div className="flex flex-col gap-[0.8vw]">
                <Skeleton className="h-[clamp(65px,5.5vw,90px)] w-full" />
                <Skeleton className="h-[clamp(65px,5.5vw,90px)] w-full" />
                <Skeleton className="h-[clamp(65px,5.5vw,90px)] w-full" />
              </div>
            ) : (
              data?.weakSpots.map((spot) => <WeakSpotRow key={spot.id} spot={spot} />)
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WeakSpotTracker;