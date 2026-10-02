import { motion } from "framer-motion";

import {
  Activity,
  ArrowUp,
  Brain,
  FileText,
  HeartPulse,
  Lightbulb,
  MessageCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

/*
|--------------------------------------------------------------------------
| MediSense Local Health Knowledge
|--------------------------------------------------------------------------
| This assistant does NOT call Gemini, OpenAI or any external chatbot API.
| Answers are selected locally from a curated knowledge base.
|--------------------------------------------------------------------------
*/

const knowledgeBase = [
  {
    id: "diabetes",
    keywords: [
      "what is diabetes",
      "diabetes",
      "diabetes meaning",
    ],
    title: "What is diabetes?",
    category: "Diabetes",
    answer:
      "Diabetes is a health condition involving elevated blood glucose levels. It can develop when the body does not produce enough insulin, does not use insulin effectively, or both. MediSense can help you understand diabetes-related information, but it cannot diagnose diabetes.",
  },

  {
    id: "screening",
    keywords: [
      "risk screening",
      "diabetes screening",
      "screening result",
      "what does my result mean",
      "my diabetes result",
      "risk result",
    ],
    title: "What does my diabetes screening result mean?",
    category: "MediSense AI",
    answer:
      "Your MediSense result is an ML-based screening signal generated from the information you entered. It represents how the trained model classified the supplied feature pattern. It is not a diagnosis and should not be interpreted as proof that you have or do not have diabetes. You can use it as a starting point for a discussion with a qualified healthcare professional.",
  },

  {
    id: "hba1c",
    keywords: [
      "hba1c",
      "a1c",
      "ha1c",
      "what is hba1c",
      "hba1c meaning",
    ],
    title: "What does HbA1c mean?",
    category: "Testing",
    answer:
      "HbA1c is a blood test that reflects average blood glucose levels over roughly the previous two to three months. Healthcare professionals may use HbA1c along with other information when evaluating glucose control or diabetes. Your MediSense screening result does not replace laboratory testing.",
  },

  {
    id: "glucose",
    keywords: [
      "glucose",
      "blood glucose",
      "blood sugar",
      "fasting glucose",
      "blood sugar test",
    ],
    title: "What is blood glucose?",
    category: "Testing",
    answer:
      "Blood glucose, commonly called blood sugar, is the amount of glucose present in your blood. Glucose is an important energy source for the body. Different glucose tests can be performed under different conditions, so interpretation should be based on the specific test and guidance from a healthcare professional.",
  },

  {
    id: "shap",
    keywords: [
      "shap",
      "explain shap",
      "what is shap",
      "shap factors",
      "model factors",
    ],
    title: "What is SHAP?",
    category: "MediSense AI",
    answer:
      "SHAP is an explainability method used to describe how individual input features influenced a machine-learning prediction. In MediSense, the SHAP section shows features that had stronger influence on the model's output for the submitted information. These values describe model behavior; they do not prove that a feature caused a medical outcome.",
  },

  {
    id: "ai-diagnosis",
    keywords: [
      "is this diagnosis",
      "is my result a diagnosis",
      "does this diagnose diabetes",
      "diagnosis",
      "medical diagnosis",
    ],
    title: "Is my MediSense result a diagnosis?",
    category: "Safety",
    answer:
      "No. The MediSense diabetes model provides an ML-based screening signal, not a medical diagnosis. A healthcare professional may consider your medical history, symptoms, examination and appropriate testing when evaluating your health.",
  },

  {
    id: "doctor",
    keywords: [
      "doctor",
      "doctor questions",
      "what should i ask my doctor",
      "questions for doctor",
      "prepare doctor",
      "prepare for doctor",
      "prepare for visit",
    ],
    title: "What should I ask my doctor?",
    category: "Visit Preparation",
    answer:
      "You can consider discussing: whether glucose or HbA1c testing is appropriate, how you should monitor blood sugar if relevant, which health factors are important to monitor, whether any additional screening should be discussed, and how your personal health history affects your risk.",
  },

  {
    id: "diabetes-care",
    keywords: [
      "diabetes specialist",
      "diabetes care",
      "endocrinology",
      "endocrinologist",
      "specialist",
      "find doctor",
    ],
    title: "Which specialty can I explore?",
    category: "Care Navigation",
    answer:
      "For a diabetes-focused screening result, MediSense can help you explore Endocrinology / Diabetes Care as a relevant area of healthcare discussion. This is a navigation suggestion, not a determination that you require a particular specialist.",
  },

  {
    id: "monitoring",
    keywords: [
      "monitor blood sugar",
      "monitor glucose",
      "monitoring",
      "how should i monitor",
      "track blood sugar",
    ],
    title: "How should I think about blood sugar monitoring?",
    category: "Diabetes",
    answer:
      "The appropriate way to monitor blood glucose depends on your health situation and any guidance you have received from a healthcare professional. If you are concerned about diabetes or your screening result, you can ask a healthcare professional what measurements or tests are appropriate for you.",
  },

  {
    id: "lifestyle",
    keywords: [
      "lifestyle",
      "lifestyle changes",
      "exercise",
      "physical activity",
      "diet",
      "food",
    ],
    title: "What lifestyle factors can I discuss?",
    category: "Wellness",
    answer:
      "You can discuss areas such as physical activity, food choices, weight management where relevant, sleep, smoking, alcohol use and other personal health factors with a healthcare professional. The appropriate changes depend on your individual circumstances.",
  },

  {
    id: "reports",
    keywords: [
      "medical report",
      "blood report",
      "latest report",
      "report",
      "cbc",
      "lab report",
    ],
    title: "How can MediSense help with reports?",
    category: "Reports",
    answer:
      "MediSense can organize uploaded reports and, where report data is available in the application, help you understand what individual parameters represent. Medical report values should always be interpreted using the report's reference ranges and appropriate clinical context.",
  },

  {
    id: "trends",
    keywords: [
      "health trends",
      "trend",
      "trends",
      "changes over time",
      "measurements",
    ],
    title: "How can I understand health trends?",
    category: "Health Tracking",
    answer:
      "A health trend looks at how a measurement changes across multiple time points. Looking at repeated measurements can provide useful context, but individual values should be interpreted using their units, reference ranges, timing and your overall health situation.",
  },

  {
    id: "medisense",
    keywords: [
      "how does medisense work",
      "what is medisense",
      "how does the ai work",
      "how does this app work",
    ],
    title: "How does MediSense work?",
    category: "MediSense",
    answer:
      "MediSense combines health information management with an AI/ML screening workflow. In the current diabetes workflow, submitted health indicators are sent to the MediSense backend, which communicates with the diabetes machine-learning service. The result can then be explained using SHAP-based model explanations and connected to healthcare-navigation and visit-preparation features.",
  },
];

const suggestions = [
  "What does my diabetes screening result mean?",
  "What does HbA1c mean?",
  "What is SHAP?",
  "What should I ask my doctor?",
];

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/*
|--------------------------------------------------------------------------
| Local answer matching
|--------------------------------------------------------------------------
*/

function findAnswer(question) {
  const normalizedQuestion = normalize(question);

  if (!normalizedQuestion) {
    return null;
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;

    for (const keyword of item.keywords) {
      const normalizedKeyword = normalize(keyword);

      if (
        normalizedQuestion.includes(
          normalizedKeyword
        )
      ) {
        score += normalizedKeyword.split(" ").length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}

/*
|--------------------------------------------------------------------------
| Fallback
|--------------------------------------------------------------------------
*/

function getFallbackAnswer(question) {
  return {
    title: "Let's narrow that down",
    category: "MediSense Health Guide",
    answer:
      `I don't have a specific answer for "${question}" in the current MediSense Health Guide. Try asking about diabetes screening, HbA1c, blood glucose, SHAP explanations, health reports, health trends, or preparing questions for a healthcare professional.`,
  };
}

function Assistant() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text:
        "Hello! I'm the MediSense Health Guide. I can explain diabetes-related information, help you understand your MediSense screening result, explain SHAP factors, and help prepare questions for a healthcare professional.",
      category: "MediSense",
    },
  ]);

  const [dashboardContext, setDashboardContext] =
    useState(null);

  const [insights, setInsights] = useState([]);

  const [loadingContext, setLoadingContext] =
    useState(true);

  const [searchParams] = useSearchParams();

  /*
  |--------------------------------------------------------------------------
  | Load real MediSense context
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadContext = async () => {
      const token = localStorage.getItem(
        "medisense_token"
      );

      if (!token) {
        setLoadingContext(false);
        return;
      }

      try {
        const [dashboardResponse, insightResponse] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/dashboard`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              `${import.meta.env.VITE_API_URL}/api/insights`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        if (dashboardResponse.ok) {
          const dashboardData =
            await dashboardResponse.json();

          setDashboardContext(
            dashboardData.data ||
              dashboardData
          );
        }

        if (insightResponse.ok) {
          const insightData =
            await insightResponse.json();

          setInsights(
            insightData.data ||
              insightData.insights ||
              []
          );
        }
      } catch (error) {
        console.error(
          "Assistant context loading failed:",
          error
        );
      } finally {
        setLoadingContext(false);
      }
    };

    loadContext();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Current diabetes insight
  |--------------------------------------------------------------------------
  */

  const diabetesInsight = useMemo(() => {
    return insights.find(
      (insight) =>
        insight.insight_type ===
          "diabetes_risk" ||
        insight.type === "diabetes_risk"
    );
  }, [insights]);

  /*
  |--------------------------------------------------------------------------
  | Dynamic context values
  |--------------------------------------------------------------------------
  */

  const reportCount =
    dashboardContext?.reportStats?.total ??
    dashboardContext?.reportStats?.totalReports ??
    dashboardContext?.reports?.length ??
    0;

  const parameterCount =
    dashboardContext?.latestMetrics?.length ??
    0;

  /*
  |--------------------------------------------------------------------------
  | Send message
  |--------------------------------------------------------------------------
  */

  const sendMessage = (customMessage = null) => {
    const textToSend =
      customMessage !== null
        ? customMessage
        : message;

    const trimmedMessage =
      textToSend.trim();

    if (!trimmedMessage) {
      return;
    }

    const userMessage = {
      id:
        Date.now(),
      role: "user",
      text: trimmedMessage,
    };

    const matched =
      findAnswer(trimmedMessage) ||
      getFallbackAnswer(trimmedMessage);

    let answerText = matched.answer;

    /*
    |--------------------------------------------------------------------------
    | Add real diabetes result context where appropriate
    |--------------------------------------------------------------------------
    */

    const normalized = normalize(
      trimmedMessage
    );

    const asksAboutResult =
      normalized.includes("my result") ||
      normalized.includes("screening result") ||
      normalized.includes("risk result") ||
      normalized.includes("my diabetes");

    if (
      asksAboutResult &&
      diabetesInsight
    ) {
      const probability =
        diabetesInsight.confidence;

      if (
        probability !== undefined &&
        probability !== null
      ) {
        answerText += ` Your saved MediSense screening insight currently contains a model confidence/risk value of ${probability}%. Remember that this is a model-generated screening signal, not a diagnosis.`;
      }
    }

    const assistantMessage = {
      id:
        Date.now() + 1,
      role: "assistant",
      text: answerText,
      category:
        matched.category ||
        "MediSense",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | URL-driven visit preparation
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const topic =
      searchParams.get("topic");

    if (topic === "visit-prep") {
      const question =
        "What should I ask my doctor?";

      setTimeout(() => {
        sendMessage(question);
      }, 150);
    }
  }, [searchParams]);

  /*
  |--------------------------------------------------------------------------
  | New conversation
  |--------------------------------------------------------------------------
  */

  const newConversation = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text:
          "New conversation started. What would you like to understand?",
        category: "MediSense",
      },
    ]);

    setMessage("");
  };

  /*
  |--------------------------------------------------------------------------
  | Suggestion
  |--------------------------------------------------------------------------
  */

  const useSuggestion = (suggestion) => {
    setMessage(suggestion);
  };

  /*
  |--------------------------------------------------------------------------
  | Quick action
  |--------------------------------------------------------------------------
  */

  const handleQuickAction = (question) => {
    setMessage(question);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================================================================
          HEADER
      ================================================================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.06] blur-[150px]" />

        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-500/[0.05] blur-[150px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium text-cyan-300">
                <Sparkles size={14} />
                MediSense Health Guide
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Ask questions.
                <span className="block text-cyan-400">
                  Understand your health.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Get instant explanations about
                diabetes, your MediSense screening,
                health reports, SHAP explanations and
                doctor-visit preparation.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <Brain size={18} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Assistant status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-sm text-slate-300">
                    Local guide ready
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          MAIN
      ================================================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ============================================================
              CHAT
          ============================================================= */}

          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <MessageCircle size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Health conversation
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Local MediSense knowledge guide
                  </p>
                </div>
              </div>

              <button
                title="New conversation"
                onClick={newConversation}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* ==========================================================
                MESSAGES
            =========================================================== */}

            <div className="min-h-[560px] space-y-7 px-5 py-7 sm:px-8">
              {messages.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={`flex gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.role ===
                    "assistant" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Brain size={17} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      item.role === "user"
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-white/[0.06] bg-white/[0.03] text-slate-300"
                    }`}
                  >
                    {item.category &&
                      item.role ===
                        "assistant" && (
                        <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-cyan-400">
                          {item.category}
                        </p>
                      )}

                    <p className="text-sm leading-7">
                      {item.text}
                    </p>
                  </div>

                  {item.role === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400">
                      <User size={17} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* ==========================================================
                SUGGESTIONS
            =========================================================== */}

            <div className="border-t border-white/[0.06] px-5 py-5 sm:px-7">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb
                  size={15}
                  className="text-cyan-400"
                />

                <span className="text-xs font-medium text-slate-500">
                  Try asking
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestions.map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() =>
                        useSuggestion(
                          suggestion
                        )
                      }
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-xs text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ==========================================================
                INPUT
            =========================================================== */}

            <div className="border-t border-white/[0.06] p-5 sm:p-6">
              <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-slate-950/80 p-2 focus-within:border-cyan-400/30">
                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey
                    ) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask MediSense about diabetes, reports, SHAP or your next healthcare conversation..."
                  className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    !message.trim()
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp size={18} />
                </button>
              </div>

              <p className="mt-3 text-center text-[10px] text-slate-700">
                MediSense provides educational
                information and does not replace
                professional medical evaluation.
              </p>
            </div>
          </div>

          {/* ============================================================
              SIDEBAR
          ============================================================= */}

          <aside className="space-y-6">
            {/* ==========================================================
                HEALTH CONTEXT
            =========================================================== */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <HeartPulse size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Health context
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Connected to MediSense
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <ContextItem
                  icon={FileText}
                  title={`${reportCount} reports`}
                  text={
                    loadingContext
                      ? "Loading..."
                      : reportCount > 0
                      ? "Available"
                      : "No reports yet"
                  }
                />

                <ContextItem
                  icon={Activity}
                  title={`${parameterCount} health metrics`}
                  text={
                    loadingContext
                      ? "Loading..."
                      : parameterCount > 0
                      ? "Tracked"
                      : "No metrics yet"
                  }
                />

                <ContextItem
                  icon={Brain}
                  title={
                    diabetesInsight
                      ? "Diabetes insight"
                      : "Diabetes screening"
                  }
                  text={
                    diabetesInsight
                      ? "Available"
                      : "Run Health AI"
                  }
                />
              </div>
            </div>

            {/* ==========================================================
                DIABETES RESULT
            =========================================================== */}

            {diabetesInsight && (
              <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
                <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-400">
                  Saved AI insight
                </p>

                <h2 className="mt-3 text-sm font-semibold">
                  Diabetes screening
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  A diabetes screening insight is
                  available in your MediSense account.
                </p>

                <Link
                  to="/health-ai"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  View Health AI
                  <ArrowUp
                    size={14}
                    className="rotate-45"
                  />
                </Link>
              </div>
            )}

            {/* ==========================================================
                QUICK ACTIONS
            =========================================================== */}

            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold">
                Quick actions
              </h2>

              <div className="mt-5 space-y-2">
                <QuickAction
                  icon={FileText}
                  text="Explain latest report"
                  onClick={() =>
                    handleQuickAction(
                      "Explain my latest report"
                    )
                  }
                />

                <QuickAction
                  icon={Activity}
                  text="Review health trends"
                  onClick={() =>
                    handleQuickAction(
                      "Help me understand my health trends"
                    )
                  }
                />

                <QuickAction
                  icon={Stethoscope}
                  text="Prepare doctor questions"
                  onClick={() =>
                    handleQuickAction(
                      "What should I ask my doctor?"
                    )
                  }
                />

                <QuickAction
                  icon={Brain}
                  text="Explain my diabetes screening"
                  onClick={() =>
                    handleQuickAction(
                      "What does my diabetes screening result mean?"
                    )
                  }
                />
              </div>
            </div>

            {/* ==========================================================
                CARE NAVIGATOR
            =========================================================== */}

            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6">
              <Stethoscope
                size={20}
                className="text-cyan-400"
              />

              <h2 className="mt-5 text-sm font-semibold">
                Diabetes Care Navigator
              </h2>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                Explore Endocrinology / Diabetes Care
                if you want to discuss your screening
                result with a healthcare professional.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  to="/hospitals?specialty=endocrinology"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Find Diabetes Care
                  <ArrowUp
                    size={14}
                    className="rotate-45"
                  />
                </Link>

                <button
                  onClick={() =>
                    handleQuickAction(
                      "What should I ask my doctor?"
                    )
                  }
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Prepare for Visit
                </button>
              </div>
            </div>

            {/* ==========================================================
                RESPONSIBLE AI
            =========================================================== */}

            <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.03] p-6">
              <ShieldCheck
                size={20}
                className="text-cyan-400"
              />

              <h2 className="mt-5 text-sm font-semibold">
                Responsible AI
              </h2>

              <p className="mt-3 text-xs leading-6 text-slate-500">
                This Health Guide uses a predefined
                MediSense knowledge base rather than a
                generative chatbot. It is designed for
                education and question preparation,
                not diagnosis or treatment.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ================================================================
          CAPABILITIES
      ================================================================= */}

      <section className="border-y border-white/[0.06] bg-slate-900/20">
        <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              What the Health Guide can help with
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              A health guide built around your MediSense experience.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Instead of pretending to be a general-purpose
              chatbot, this assistant focuses on the health
              workflows available in MediSense.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <CapabilityCard
              icon={FileText}
              title="Report explanations"
              text="Understand what common medical report parameters represent."
            />

            <CapabilityCard
              icon={Activity}
              title="Health trends"
              text="Learn how repeated measurements can be interpreted over time."
            />

            <CapabilityCard
              icon={Stethoscope}
              title="Doctor preparation"
              text="Generate useful questions to discuss during a healthcare visit."
            />

            <CapabilityCard
              icon={Brain}
              title="AI explanations"
              text="Understand diabetes screening signals and SHAP-based model explanations."
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          EXAMPLE QUESTIONS
      ================================================================= */}

      <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 lg:px-12">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Questions you can ask
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                These questions are handled directly by
                the MediSense Health Guide.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "What is diabetes?",
              "What does my diabetes screening result mean?",
              "What does HbA1c mean?",
              "What is SHAP?",
              "Is my MediSense result a diagnosis?",
              "What should I ask my doctor?",
            ].map((question) => (
              <button
                key={question}
                onClick={() => {
                  setMessage(question);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-slate-950/50 px-5 py-4 text-left text-sm text-slate-400 transition hover:border-cyan-400/20 hover:text-white"
              >
                <span>{question}</span>

                <ArrowUp
                  size={15}
                  className="ml-4 shrink-0 rotate-45 text-slate-700"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SAFETY
      ================================================================= */}

      <section className="px-6 pb-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px] rounded-3xl border border-amber-400/10 bg-amber-400/[0.03] p-7 sm:p-9">
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
                The MediSense Health Guide provides
                educational and informational content.
                Its responses are selected from a
                predefined knowledge base and are not a
                diagnosis, treatment instruction or
                substitute for qualified medical care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| CONTEXT ITEM
|--------------------------------------------------------------------------
*/

function ContextItem({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
        <Icon size={15} />
      </div>

      <div className="flex-1">
        <p className="text-xs font-medium text-slate-300">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-600">
          {text}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| QUICK ACTION
|--------------------------------------------------------------------------
*/

function QuickAction({
  icon: Icon,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
    >
      <Icon
        size={15}
        className="text-cyan-400"
      />

      {text}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| CAPABILITY CARD
|--------------------------------------------------------------------------
*/

function CapabilityCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        <Icon size={20} />
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500">
        {text}
      </p>
    </div>
  );
}

export default Assistant;