import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  HeartPulse,
  ShieldCheck,
  
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Dashboard() {
  const measurements = [
    {
      name: "Blood Glucose",
      value: "94",
      unit: "mg/dL",
      status: "Within range",
      trend: "+2.4%",
      direction: "up",
    },
    {
      name: "HbA1c",
      value: "5.4",
      unit: "%",
      status: "Within range",
      trend: "-0.2%",
      direction: "down",
    },
    {
      name: "Hemoglobin",
      value: "14.2",
      unit: "g/dL",
      status: "Within range",
      trend: "+1.1%",
      direction: "up",
    },
    {
      name: "WBC",
      value: "7.4",
      unit: "10³/µL",
      status: "Within range",
      trend: "Stable",
      direction: "stable",
    },
  ];

  const activities = [
    {
      title: "Complete Blood Count analyzed",
      date: "18 Sep 2026",
      type: "Report",
    },
    {
      title: "Health trend updated",
      date: "16 Sep 2026",
      type: "Health",
    },
    {
      title: "Lipid Profile analyzed",
      date: "12 Sep 2026",
      type: "Report",
    },
    {
      title: "AI health insight generated",
      date: "10 Sep 2026",
      type: "AI",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.05] blur-[150px]" />

          <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[150px]" />

          <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium text-cyan-300">
                  <Activity size={14} />
                  Health dashboard
                </div>

                <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                  Your health,
                  <span className="block text-cyan-400">
                    at a glance.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                  Monitor health measurements, report activity and
                  AI-generated insights from one central dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                <CalendarDays
                  size={17}
                  className="text-cyan-400"
                />

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Last updated
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    18 September 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =====================================================
            HEALTH SCORE
        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Score */}

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-cyan-400/[0.08] to-white/[0.02] p-7 sm:p-9"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Overall health score
                  </p>

                  <p className="mt-2 text-5xl font-bold tracking-tight">
                    82
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-sm text-emerald-400">
                      Good range
                    </span>
                  </div>
                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-cyan-400/10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/10">
                    <HeartPulse
                      size={27}
                      className="text-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-[82%] rounded-full bg-cyan-400" />
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-600">
                Demonstration score based on the sample dashboard data.
                It is not a clinical assessment.
              </p>
            </motion.div>

            {/* Score breakdown */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                    Health overview
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Current indicators
                  </h2>
                </div>

                <Activity
                  size={22}
                  className="text-slate-700"
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <OverviewItem
                  label="Metabolic"
                  value="84"
                  status="Stable"
                />

                <OverviewItem
                  label="Blood"
                  value="88"
                  status="Stable"
                />

                <OverviewItem
                  label="Nutrition"
                  value="76"
                  status="Monitor"
                />

                <OverviewItem
                  label="Recent activity"
                  value="82"
                  status="Good"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            MEASUREMENTS
        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Measurements
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Key health parameters
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Recent sample values extracted from available reports.
              </p>
            </div>

            <Link
              to="/reports"
              className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              View reports
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {measurements.map((item, index) => (
              <MeasurementCard
                key={item.name}
                {...item}
                delay={index * 0.05}
              />
            ))}
          </div>
        </section>

        {/* =====================================================
            TREND SECTION
        ===================================================== */}

        <section className="border-y border-white/[0.06] bg-slate-900/20">
          <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Health trends
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Understand changes over time.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Looking at trends can provide more context than viewing
                  an individual measurement alone.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
                <button className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-medium text-slate-950">
                  6 Months
                </button>

                <button className="rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-white">
                  1 Year
                </button>
              </div>
            </div>

            {/* Chart */}

            <div className="mt-10 rounded-3xl border border-white/[0.08] bg-slate-950/70 p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Health score trend
                  </p>

                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      82
                    </span>

                    <span className="text-xs text-emerald-400">
                      +8.2% over period
                    </span>
                  </div>
                </div>

                <TrendingUp
                  size={20}
                  className="text-cyan-400"
                />
              </div>

              <div className="relative mt-10 h-[280px]">
                {/* Grid */}

                <div className="absolute inset-0 flex flex-col justify-between">
                  {[100, 80, 60, 40, 20].map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-3"
                    >
                      <span className="w-7 text-right text-[10px] text-slate-700">
                        {value}
                      </span>

                      <div className="h-px flex-1 bg-white/[0.05]" />
                    </div>
                  ))}
                </div>

                {/* Bars */}

                <div className="absolute bottom-0 left-10 right-0 top-0 flex items-end justify-between gap-3">
                  {[58, 63, 61, 68, 72, 69, 76, 74, 79, 82].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group flex h-full flex-1 items-end justify-center"
                      >
                        <div
                          style={{
                            height: `${height}%`,
                          }}
                          className="w-full max-w-12 rounded-t-lg bg-cyan-400/60 transition-all duration-300 group-hover:bg-cyan-400"
                        />
                      </div>
                    )
                  )}
                </div>

                {/* Labels */}

                <div className="absolute -bottom-7 left-10 right-0 flex justify-between">
                  {[
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                  ].map((month) => (
                    <span
                      key={month}
                      className="text-[10px] text-slate-700"
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI INSIGHTS
        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            {/* Main AI card */}

            <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.06] to-white/[0.02] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Brain size={22} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400">
                    AI insight
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Your recent measurements appear relatively stable.
                  </h2>
                </div>
              </div>

              <p className="mt-7 text-sm leading-7 text-slate-400">
                Based on the demonstration data currently displayed,
                several sample parameters are represented within their
                configured ranges. Monitoring changes over time can provide
                additional context.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <InsightPoint text="Recent report values available" />

                <InsightPoint text="Health trend currently positive" />

                <InsightPoint text="Multiple parameters tracked" />

                <InsightPoint text="Continue monitoring trends" />
              </div>

              <Link
                to="/health-ai"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-5 py-3 text-sm font-medium text-cyan-400 transition hover:bg-cyan-400/10"
              >
                Explore Health AI
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Health categories */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-9">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Categories
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Health areas
                  </h2>
                </div>

                <Heart
                  size={21}
                  className="text-slate-700"
                />
              </div>

              <div className="mt-8 space-y-5">
                <Category
                  name="Metabolic health"
                  value="84%"
                />

                <Category
                  name="Blood health"
                  value="88%"
                />

                <Category
                  name="Nutrition"
                  value="76%"
                />

                <Category
                  name="Activity"
                  value="81%"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACTIVITY
        ===================================================== */}

        <section className="border-t border-white/[0.06] bg-slate-900/20">
          <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Timeline
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Recent activity
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                A history of important activity across your MediSense
                workspace.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/60">
              {activities.map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-center gap-5 border-b border-white/[0.06] px-6 py-6 last:border-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    {item.type === "AI" ? (
                      <Brain size={18} />
                    ) : item.type === "Health" ? (
                      <HeartPulse size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {item.date}
                    </p>
                  </div>

                  <ChevronRight
                    size={17}
                    className="text-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SAFETY
        ===================================================== */}

        <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <div>
                <h3 className="font-semibold">
                  Important health information notice
                </h3>

                <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500">
                  Dashboard values shown here are demonstration data for
                  the MediSense project. Health scores and AI-generated
                  insights should not be interpreted as medical diagnoses
                  or as a substitute for professional medical care.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* =============================================================
   OVERVIEW ITEM
============================================================= */

function OverviewItem({
  label,
  value,
  status,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {label}
        </span>

        <span className="text-lg font-bold text-cyan-400">
          {value}
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-cyan-400/70"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-600">
        {status}
      </p>
    </div>
  );
}

/* =============================================================
   MEASUREMENT CARD
============================================================= */

function MeasurementCard({
  name,
  value,
  unit,
  status,
  trend,
  direction,
  delay,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:-translate-y-1 hover:border-cyan-400/20"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500">
          {name}
        </p>

        {direction === "up" ? (
          <ArrowUpRight
            size={17}
            className="text-emerald-400"
          />
        ) : direction === "down" ? (
          <ArrowDownRight
            size={17}
            className="text-cyan-400"
          />
        ) : (
          <Activity
            size={17}
            className="text-slate-600"
          />
        )}
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {value}
        </span>

        <span className="text-xs text-slate-600">
          {unit}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-emerald-400">
          {status}
        </span>

        <span className="text-xs text-slate-600">
          {trend}
        </span>
      </div>
    </motion.div>
  );
}

/* =============================================================
   INSIGHT POINT
============================================================= */

function InsightPoint({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <CheckCircle2
        size={15}
        className="shrink-0 text-cyan-400"
      />

      <span className="text-xs text-slate-400">
        {text}
      </span>
    </div>
  );
}

/* =============================================================
   CATEGORY
============================================================= */

function Category({
  name,
  value,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {name}
        </span>

        <span className="text-sm font-semibold text-white">
          {value}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-cyan-400/70"
          style={{
            width: value,
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;