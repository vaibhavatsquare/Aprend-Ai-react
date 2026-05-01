
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
    improvementTrend: `+${res.summary.improvementTrendPercent}% this week`,
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
      <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill="white" stroke="#1B2A4A" strokeWidth={1.5} />
      {filledHeight > 0 && (
        <rect x={x} y={y + height - filledHeight} width={width} height={filledHeight} fill="#1B2A4A" clipPath={`url(#${uid})`} />
      )}
    </g>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

const WeakSpotRow = ({ spot }: { spot: WeakSpot }) => {
  const [expanded, setExpanded] = useState(!!spot.commonMistakes);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 last:mb-0">
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white"
      >
        <div className="flex flex-col gap-1 flex-1 pr-3">
          <p className="font-semibold text-gray-900 text-[15px]">{spot.subject}</p>
          <p className="text-sm text-secondary">{spot.metric} {spot.metricLabel}</p>
          <div className="mt-1 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${spot.metricValue}%`, backgroundColor: spot.progressColor }}
            />
          </div>
        </div>
        {expanded
          ? <LuChevronUp className="text-xl text-secondary shrink-0" />
          : <LuChevronDown className="text-xl text-secondary shrink-0" />
        }
      </button>

      {expanded && spot.commonMistakes && (
        <div className="px-4 pb-4 pt-2 space-y-3 border-t border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Common mistakes</p>
            <ul className="space-y-1">
              {spot.commonMistakes.map((m, i) => (
                <li key={i} className="text-sm text-secondary flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-secondary shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          {spot.recommendedLessons && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Recommended Lessons</p>
              <div className="flex flex-wrap gap-2">
                {spot.recommendedLessons.map((lesson, i) => (
                  <span key={i} className="px-3 py-1 rounded-full border border-gray-200 text-xs text-secondary cursor-pointer hover:border-primary hover:text-primary transition-colors">
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
    <div className="px-4 h-[calc(100vh-80px)] overflow-y-auto scrollbar py-4">
      <div
        className="bg-white border border-gray-200 p-6 flex flex-col gap-4"
        style={{ borderRadius: 32, boxShadow: "0px 0px 1px 0px #00000040" }}
      >
        <h1 className="text-xl font-bold text-gray-900">Weak Spot Tracker</h1>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Stat Cards — ratio 1:1:2 matching Figma 261:261:523 */}
        <div className="flex gap-3">
          {loading ? (
            <>
              <Skeleton className="flex-1 h-[99px]" />
              <Skeleton className="flex-1 h-[99px]" />
              <Skeleton className="flex-[2] h-[99px]" />
            </>
          ) : (
            <>
              <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-l text-secondary mb-1">⚠️ Total weak areas</p>
                <p className="text-[26px] font-roboto text-gray-900">{data?.totalWeakAreas ?? 0}</p>
              </div>
              <div className="flex-1 rounded-xl px-4 py-3" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-l text-secondary mb-1">📈 Improvement Trend</p>
                <p className="text-[26px] font-roboto text-gray-900">{data?.improvementTrend ?? ""}</p>
              </div>
              <div className="flex-[2] rounded-xl px-4 py-3" style={{ backgroundColor: "#F7F7F8" }}>
                <p className="text-l text-secondary mb-1">⏱️ Average Time on Weak Topics</p>
                <p className="text-[26px] font-roboto text-gray-900">{data?.avgTimeOnWeakTopics ?? ""}</p>
              </div>
            </>
          )}
        </div>

        {/* Highlight Cards — 3 equal cards matching Figma 413px each */}
        <div className="flex gap-3">
          {loading ? (
            <>
              <Skeleton className="flex-1 h-[125px]" />
              <Skeleton className="flex-1 h-[125px]" />
              <Skeleton className="flex-1 h-[125px]" />
            </>
          ) : (
            data?.highlightCards.map((card) => (
              <div
                key={card.id}
                className="flex-1 border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
                style={{ boxShadow: "0px 0px 1px 0px #00000040" }}
              >
                <p className="font-semibold text-gray-900 text-[15px]">{card.subject}</p>
                <p className="text-sm text-secondary flex-1 line-clamp-2">{card.tip}</p>
                <button className="self-start px-4 py-1.5 rounded-full text-sm font-medium text-white bg-primary">
                  {card.actionLabel}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom: Progress trend + All weak spots — 50/50 */}
        <div className="flex gap-3">

          {/* Progress Trend */}
          <div
            className="flex-1 border border-gray-200 rounded-xl p-4 flex flex-col"
            style={{ boxShadow: "0px 0px 1px 0px #00000040", minHeight: 420 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-900">Progress trend</p>
              <div className="flex bg-gray-100 rounded-full p-0.5">
                {(["weekly", "monthly"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      chartView === v ? "bg-primary text-white shadow" : "text-secondary"
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
            className="flex-1 rounded-xl p-4 overflow-y-auto scrollbar"
            style={{ boxShadow: "0px 0px 1px 0px #00000040" }}
          >
            <p className="font-semibold text-gray-900 mb-3">All weak spots</p>
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-[98px] w-full" />
                <Skeleton className="h-[98px] w-full" />
                <Skeleton className="h-[98px] w-full" />
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