import { useState } from "react";
import {
  Activity,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  UserRound,
} from "lucide-react";


const initialForm = {
  HighBP: 1,
  HighChol: 1,
  CholCheck: 1,
  BMI: 28,
  Smoker: 0,
  Stroke: 0,
  HeartDiseaseorAttack: 0,
  PhysActivity: 1,
  Fruits: 1,
  Veggies: 1,
  HvyAlcoholConsump: 0,
  AnyHealthcare: 1,
  NoDocbcCost: 0,
  GenHlth: 2,
  MentHlth: 2,
  PhysHlth: 3,
  DiffWalk: 0,
  Sex: 1,
  Age: 8,
  Education: 5,
  Income: 7,
};


const fieldLabels = {
  HighBP: "High Blood Pressure",
  HighChol: "High Cholesterol",
  CholCheck: "Cholesterol Check",
  BMI: "BMI",
  Smoker: "Smoking",
  Stroke: "Previous Stroke",
  HeartDiseaseorAttack: "Heart Disease / Heart Attack",
  PhysActivity: "Physical Activity",
  Fruits: "Fruit Intake",
  Veggies: "Vegetable Intake",
  HvyAlcoholConsump: "Heavy Alcohol Consumption",
  AnyHealthcare: "Healthcare Access",
  NoDocbcCost: "Unable to See Doctor Due to Cost",
  GenHlth: "General Health",
  MentHlth: "Mental Health Days",
  PhysHlth: "Physical Health Days",
  DiffWalk: "Difficulty Walking",
  Sex: "Sex",
  Age: "Age Group",
  Education: "Education Level",
  Income: "Income Level",
};


const yesNoFields = [
  "HighBP",
  "HighChol",
  "CholCheck",
  "Smoker",
  "Stroke",
  "HeartDiseaseorAttack",
  "PhysActivity",
  "Fruits",
  "Veggies",
  "HvyAlcoholConsump",
  "AnyHealthcare",
  "NoDocbcCost",
  "DiffWalk",
];


const getDirectionIcon = (direction) => {
  if (direction === "increased") {
    return (
      <TrendingUp className="h-4 w-4 text-rose-400" />
    );
  }

  return (
    <TrendingDown className="h-4 w-4 text-emerald-400" />
  );
};


const getRiskStyles = (band) => {
  if (band === "higher") {
    return {
      text: "text-rose-300",
      border: "border-rose-400/20",
      bg: "bg-rose-400/10",
    };
  }

  if (band === "moderate") {
    return {
      text: "text-amber-300",
      border: "border-amber-400/20",
      bg: "bg-amber-400/10",
    };
  }

  return {
    text: "text-emerald-300",
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/10",
  };
};


const HealthAI = () => {
  const [form, setForm] = useState(initialForm);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [showAdvanced, setShowAdvanced] =
    useState(false);


  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: Number(value),
    }));
  };


  const handleAnalyze = async () => {
    setError("");
    setResult(null);
    setAnalyzing(true);

    try {
      const token =
        localStorage.getItem(
          "medisense_token"
        );

      if (!token) {
        setError(
          "Your session has expired. Please log in again."
        );

        return;
      }


      const response = await fetch(
        "http://localhost:5000/api/ai/diabetes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to analyze health data."
        );
      }


      setResult(data.data);

    } catch (err) {

      console.error(
        "Diabetes analysis failed:",
        err
      );

      setError(
        err.message ||
        "Unable to connect to MediSense AI."
      );

    } finally {
      setAnalyzing(false);
    }
  };


  const riskStyles =
    result
      ? getRiskStyles(
          result.prediction?.risk_band
        )
      : null;


  return (
    <div className="min-h-screen bg-[#050b12] text-white">

      {/* HERO */}

      <section className="border-b border-white/10 bg-gradient-to-b from-cyan-500/[0.08] to-transparent">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">

              <Brain className="h-4 w-4" />

              MediSense Diabetes AI

            </div>


            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">

              Diabetes Risk
              <span className="text-cyan-400">
                {" "}Screening
              </span>

            </h1>


            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">

              Analyze health indicators using
              the MediSense machine-learning model,
              understand the factors influencing
              the result, and prepare for a
              conversation with a healthcare
              professional.

            </p>

          </div>

        </div>

      </section>


      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">


          {/* INPUT PANEL */}

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 lg:p-8">

            <div className="flex items-start justify-between gap-6">

              <div>

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-cyan-400/10 p-3">

                    <Activity className="h-5 w-5 text-cyan-400" />

                  </div>

                  <div>

                    <h2 className="text-xl font-semibold">
                      Health Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Provide the information used by
                      the diabetes screening model.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            <div className="mt-8 grid gap-5 sm:grid-cols-2">


              {/* BMI */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  BMI
                </label>

                <input
                  type="number"
                  value={form.BMI}
                  min="10"
                  max="70"
                  step="0.1"
                  onChange={(e) =>
                    handleChange(
                      "BMI",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50"
                />

              </div>


              {/* Age */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Age Group
                </label>

                <select
                  value={form.Age}
                  onChange={(e) =>
                    handleChange(
                      "Age",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                >
                  {Array.from(
                    { length: 13 },
                    (_, index) => index + 1
                  ).map((value) => (
                    <option
                      key={value}
                      value={value}
                    >
                      Age category {value}
                    </option>
                  ))}
                </select>

              </div>


              {/* Basic yes/no fields */}

              {yesNoFields
                .slice(0, 6)
                .map((field) => (

                  <div key={field}>

                    <label className="mb-2 block text-sm text-slate-300">
                      {fieldLabels[field]}
                    </label>

                    <select
                      value={form[field]}
                      onChange={(e) =>
                        handleChange(
                          field,
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                    >

                      <option value={0}>
                        No
                      </option>

                      <option value={1}>
                        Yes
                      </option>

                    </select>

                  </div>

                ))}

            </div>


            {/* ADVANCED INPUTS */}

            <button
              type="button"
              onClick={() =>
                setShowAdvanced(
                  !showAdvanced
                )
              }
              className="mt-7 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
            >

              <span>
                Additional health factors
              </span>

              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}

            </button>


            {showAdvanced && (

              <div className="mt-5 grid gap-5 sm:grid-cols-2">

                {yesNoFields
                  .slice(6)
                  .map((field) => (

                    <div key={field}>

                      <label className="mb-2 block text-sm text-slate-300">
                        {fieldLabels[field]}
                      </label>

                      <select
                        value={form[field]}
                        onChange={(e) =>
                          handleChange(
                            field,
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                      >

                        <option value={0}>
                          No
                        </option>

                        <option value={1}>
                          Yes
                        </option>

                      </select>

                    </div>

                  ))}


                {/* General Health */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    General Health
                  </label>

                  <select
                    value={form.GenHlth}
                    onChange={(e) =>
                      handleChange(
                        "GenHlth",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  >

                    <option value={1}>
                      Excellent
                    </option>

                    <option value={2}>
                      Very Good
                    </option>

                    <option value={3}>
                      Good
                    </option>

                    <option value={4}>
                      Fair
                    </option>

                    <option value={5}>
                      Poor
                    </option>

                  </select>

                </div>


                {/* Mental Health */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Mental Health Days
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={form.MentHlth}
                    onChange={(e) =>
                      handleChange(
                        "MentHlth",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  />

                </div>


                {/* Physical Health */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Physical Health Days
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={form.PhysHlth}
                    onChange={(e) =>
                      handleChange(
                        "PhysHlth",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  />

                </div>


                {/* Sex */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Sex
                  </label>

                  <select
                    value={form.Sex}
                    onChange={(e) =>
                      handleChange(
                        "Sex",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  >

                    <option value={0}>
                      Female
                    </option>

                    <option value={1}>
                      Male
                    </option>

                  </select>

                </div>


                {/* Education */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Education Level
                  </label>

                  <select
                    value={form.Education}
                    onChange={(e) =>
                      handleChange(
                        "Education",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  >

                    {Array.from(
                      { length: 6 },
                      (_, index) => index + 1
                    ).map((value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        Level {value}
                      </option>
                    ))}

                  </select>

                </div>


                {/* Income */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Income Level
                  </label>

                  <select
                    value={form.Income}
                    onChange={(e) =>
                      handleChange(
                        "Income",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0b121b] px-4 py-3 text-white outline-none focus:border-cyan-400/50"
                  >

                    {Array.from(
                      { length: 8 },
                      (_, index) => index + 1
                    ).map((value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        Level {value}
                      </option>
                    ))}

                  </select>

                </div>

              </div>

            )}


            {error && (

              <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">

                {error}

              </div>

            )}


            <button
              type="button"
              disabled={analyzing}
              onClick={handleAnalyze}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {analyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Running AI analysis...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  Analyze Diabetes Risk
                </>
              )}

            </button>


            <div className="mt-4 flex items-start gap-3 text-xs leading-5 text-slate-500">

              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

              <p>
                MediSense provides an AI-based
                screening signal for educational
                and decision-support purposes.
                It does not diagnose diabetes.
              </p>

            </div>

          </section>


          {/* RESULT PANEL */}

          <section className="space-y-6">

            {!result && (

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">

                  <HeartPulse className="h-7 w-7 text-cyan-400" />

                </div>

                <h2 className="mt-6 text-xl font-semibold">
                  Your AI result will appear here
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">

                  Complete the health information
                  and run the diabetes screening
                  model to see the result and
                  explainable factors.

                </p>

              </div>

            )}


            {result && (

              <>

                {/* SCORE */}

                <div
                  className={`rounded-3xl border ${riskStyles.border} ${riskStyles.bg} p-8`}
                >

                  <p className="text-sm text-slate-400">
                    Diabetes risk screening signal
                  </p>


                  <div className="mt-3 flex items-end gap-3">

                    <span
                      className={`text-6xl font-semibold ${riskStyles.text}`}
                    >
                      {
                        result.prediction
                          ?.risk_probability
                      }%
                    </span>

                  </div>


                  <div
                    className={`mt-4 inline-flex rounded-full border ${riskStyles.border} px-3 py-1 text-sm capitalize ${riskStyles.text}`}
                  >
                    {
                      result.prediction
                        ?.risk_band
                    } screening signal
                  </div>


                  <p className="mt-5 text-sm leading-6 text-slate-400">

                    This probability is generated
                    by the trained MediSense Random
                    Forest model. It is not a
                    clinical diagnosis.

                  </p>

                </div>


                {/* EXPLANATION */}

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-cyan-400/10 p-2.5">

                      <Brain className="h-5 w-5 text-cyan-400" />

                    </div>

                    <div>

                      <h2 className="font-semibold">
                        Why did the model produce this signal?
                      </h2>

                      <p className="text-xs text-slate-500">
                        Local SHAP-based explanation
                      </p>

                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {result.explainability
                      ?.top_factors
                      ?.map((factor) => (

                        <div
                          key={factor.feature}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3"
                        >

                          <div className="flex items-center gap-3">

                            {getDirectionIcon(
                              factor.direction
                            )}

                            <div>

                              <p className="text-sm font-medium">
                                {fieldLabels[
                                  factor.feature
                                ] ||
                                  factor.feature}
                              </p>

                              <p className="text-xs text-slate-500">
                                Value: {factor.value}
                              </p>

                            </div>

                          </div>


                          <span className="text-xs capitalize text-slate-400">
                            {factor.direction}
                          </span>

                        </div>

                      ))}

                  </div>


                  <p className="mt-5 text-xs leading-5 text-slate-500">

                    SHAP values describe how features
                    influenced this model prediction.
                    They do not prove that a feature
                    caused the health outcome.

                  </p>

                </div>


                {/* CARE NAVIGATOR */}

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-7">

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-cyan-400/10 p-3">

                      <Stethoscope className="h-6 w-6 text-cyan-400" />

                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
                        AI Care Navigator
                      </p>

                      <h2 className="mt-2 text-xl font-semibold">
                        Consider discussing diabetes-related
                        health with a healthcare professional
                      </h2>

                    </div>

                  </div>


                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">

                    <div className="flex items-center gap-3">

                      <UserRound className="h-5 w-5 text-cyan-400" />

                      <div>

                        <p className="text-xs text-slate-500">
                          Suggested specialty
                        </p>

                        <p className="font-semibold">
                          Endocrinology / Diabetes Care
                        </p>

                      </div>

                    </div>


                    <p className="mt-4 text-sm leading-6 text-slate-400">

                      This suggestion is based on the
                      diabetes-focused screening result.
                      It is intended to help you identify
                      an appropriate area of healthcare
                      discussion, not to determine that
                      you require a specific doctor.

                    </p>

                  </div>


                  <div className="mt-5">

                    <p className="text-sm font-medium">
                      Questions to discuss
                    </p>


                    <div className="mt-3 space-y-2">

                      {[
                        "Should I repeat glucose or HbA1c testing?",
                        "How should I monitor my blood sugar?",
                        "Are there lifestyle changes I should consider?",
                        "Should any additional screening be discussed?",
                      ].map((question) => (

                        <div
                          key={question}
                          className="flex gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300"
                        >

                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                          {question}

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </>

            )}

          </section>

        </div>

      </main>

    </div>
  );
};


export default HealthAI;