import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  FileSearch,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const features = [
    {
      icon: FileSearch,
      title: "Medical Report Analysis",
      description:
        "Upload medical reports and extract important health parameters using AI-assisted analysis.",
    },
    {
      icon: Brain,
      title: "AI Health Intelligence",
      description:
        "Understand symptoms, laboratory values and health indicators in one intelligent platform.",
    },
    {
      icon: HeartPulse,
      title: "Health Risk Insights",
      description:
        "Track important health indicators and view understandable risk-oriented insights.",
    },
    {
      icon: ShieldCheck,
      title: "Explainable Results",
      description:
        "Understand the factors behind an AI-generated insight instead of receiving a black-box result.",
    },
    {
      icon: Stethoscope,
      title: "Healthcare Guidance",
      description:
        "Receive general educational information based on the health information you provide.",
    },
    {
      icon: Activity,
      title: "Health Dashboard",
      description:
        "Monitor reports, measurements and health trends from a single dashboard.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload",
      description:
        "Upload a medical report, laboratory document or supported medical image.",
    },
    {
      number: "02",
      icon: FileSearch,
      title: "Extract",
      description:
        "Relevant information is extracted and organized from your document.",
    },
    {
      number: "03",
      icon: Brain,
      title: "Analyze",
      description:
        "AI models analyze the available information and identify relevant patterns.",
    },
    {
      number: "04",
      icon: Sparkles,
      title: "Understand",
      description:
        "View simple explanations, trends and educational health insights.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden">
        {/* Background glow */}

        <div className="pointer-events-none absolute -left-60 top-20 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.08] blur-[150px]" />

        <div className="pointer-events-none absolute -right-60 top-40 h-[600px] w-[600px] rounded-full bg-blue-500/[0.08] blur-[150px]" />

        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-400/[0.04] blur-[130px]" />

        <div className="relative mx-auto max-w-[1500px] px-6 sm:px-8 lg:px-12">
          <div className="grid min-h-[calc(100vh-78px)] items-center gap-16 py-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-24 xl:gap-28">
            {/* =====================================================
                HERO LEFT
            ===================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 max-w-2xl"
            >
              {/* Badge */}

              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-sm font-medium text-cyan-300">
                <Sparkles size={15} />
                AI-powered health intelligence
              </div>

              {/* Heading */}

              <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[68px] xl:text-[76px]">
                Understand your
                <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  health better.
                </span>
              </h1>

              {/* Description */}

              <p className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                MediSense AI transforms complex medical information into
                understandable health insights using AI-powered report
                analysis and intelligent health tracking.
              </p>

              {/* Buttons */}

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/reports"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300 hover:shadow-cyan-400/20"
                >
                  Analyze a Report

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/health-ai"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <Brain size={17} />
                  Explore Health AI
                </Link>
              </div>

              {/* Trust points */}

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2
                    size={16}
                    className="text-cyan-400"
                  />
                  AI-assisted analysis
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2
                    size={16}
                    className="text-cyan-400"
                  />
                  Explainable insights
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2
                    size={16}
                    className="text-cyan-400"
                  />
                  Health tracking
                </div>
              </div>
            </motion.div>

            {/* =====================================================
                HERO RIGHT — HEALTH DASHBOARD
            ===================================================== */}

            <motion.div
              initial={{ opacity: 0, x: 45 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="relative"
            >
              {/* Glow */}

              <div className="absolute -inset-10 rounded-[4rem] bg-cyan-400/[0.06] blur-3xl" />

              {/* Dashboard */}

              <div className="relative rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-7">
                {/* Dashboard Header */}

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                      MediSense AI
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-white">
                      Health Intelligence
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10 text-cyan-400">
                    <Activity size={20} />
                  </div>
                </div>

                {/* Health Score */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-sm text-slate-500">
                        Overall Health Score
                      </p>

                      <p className="mt-2 text-5xl font-bold tracking-tight">
                        82
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        <span className="text-xs font-medium text-emerald-400">
                          Good range
                        </span>
                      </div>
                    </div>

                    {/* Score Circle */}

                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-[8px] border-cyan-400/15 sm:h-28 sm:w-28">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/10 sm:h-24 sm:w-24">
                        <span className="text-xl font-bold text-cyan-400">
                          82%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-medium text-slate-500">
                      HbA1c
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      5.4%
                    </p>

                    <p className="mt-1 text-xs text-emerald-400">
                      Normal
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-medium text-slate-500">
                      Glucose
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      94
                    </p>

                    <p className="mt-1 text-xs text-emerald-400">
                      mg/dL
                    </p>
                  </div>
                </div>

                {/* AI Insight */}

                <div className="mt-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-5">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Brain size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        AI Insight
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Your recent measurements show relatively stable
                        indicators. Continue monitoring your health trends.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white/[0.03] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Reports
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      12
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Trends
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      +8%
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] p-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-600">
                      Insights
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      24
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section className="border-t border-white/[0.06] bg-slate-900/30">
        <div className="mx-auto max-w-[1500px] px-6 py-32 sm:px-8 lg:px-12">
          {/* Heading */}

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              One health platform
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Everything you need to understand your health information.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              MediSense brings report analysis, health intelligence,
              tracking and educational guidance together in one modern
              platform.
            </p>
          </div>

          {/* Feature Cards */}

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-50px",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className="group min-h-[245px] rounded-2xl border border-white/[0.08] bg-slate-950/70 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/20 hover:bg-slate-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition-all duration-300 group-hover:bg-cyan-400 group-hover:text-slate-950">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}

      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1500px] px-6 py-32 sm:px-8 lg:px-12">
          {/* Heading */}

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Simple workflow
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              From report to insight.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
              A simple AI-assisted workflow designed to make complex
              health information easier to understand.
            </p>
          </div>

          {/* Steps */}

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[245px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-colors hover:border-cyan-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Icon size={21} />
                    </div>

                    <span className="text-sm font-bold tracking-wider text-slate-700">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="px-6 pb-32 sm:px-8 lg:px-12">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[28px] border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.10] via-slate-900 to-blue-500/[0.08] px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Glow */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-3xl" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Get started
              </p>

              <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
                Turn your health data into something you can understand.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
                Upload a report and explore the MediSense AI health
                analysis experience.
              </p>
            </div>

            <Link
              to="/reports"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Analyze a Report

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/[0.06] bg-slate-950">
        <div className="mx-auto max-w-[1500px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <p className="text-xs leading-6 text-slate-500">
                MediSense AI is an educational and health-information
                project. Its AI-generated insights are not a medical
                diagnosis and should not replace consultation with a
                qualified healthcare professional.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 text-sm text-slate-600 sm:flex-row">
            <p>
              © 2026 MediSense AI. Built for intelligent health insights.
            </p>

            <p>
              AI • Healthcare • Explainability
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
