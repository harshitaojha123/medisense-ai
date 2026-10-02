import {
  Activity,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",

    email: "",

    password: "",

    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));

    setError("");

    setSuccess("");
  };

  const passwordChecks = [
    {
      label: "At least 8 characters",

      valid: form.password.length >= 8,
    },

    {
      label: "Contains an uppercase letter",

      valid: /[A-Z]/.test(form.password),
    },

    {
      label: "Contains a number",

      valid: /\d/.test(form.password),
    },
  ];

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    setSuccess("");

    // -------------------------

    // FRONTEND VALIDATION

    // -------------------------

    if (!form.name.trim()) {
      setError("Please enter your full name.");

      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");

      return;
    }

    if (!form.password.trim()) {
      setError("Please create a password.");

      return;
    }

    if (!passwordChecks.every((check) => check.valid)) {
      setError("Please create a stronger password.");

      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");

      return;
    }

    if (!agree) {
      setError("Please accept the health-information notice.");

      return;
    }

    setLoading(true);

    try {
      // -------------------------

      // REAL BACKEND REQUEST

      // -------------------------

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),

            email: form.email.trim().toLowerCase(),

            password: form.password,
          }),
        },
      );

      const data = await response.json();

      // -------------------------

      // BACKEND ERROR

      // -------------------------

      if (!response.ok) {
        setError(
          data.message || "Unable to create your account. Please try again.",
        );

        return;
      }

      // -------------------------

      // SUCCESS

      // -------------------------

      setSuccess("Account created successfully! Redirecting to login...");

      setForm({
        name: "",

        email: "",

        password: "",

        confirmPassword: "",
      });

      setAgree(false);

      // Do NOT automatically store a token here.

      // User will login normally and receive JWT.

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(
        "Registration request failed:",

        error,
      );

      setError(
        "Unable to connect to the MediSense server. Make sure the backend is running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}

        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}

            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
                <Activity size={22} strokeWidth={2.5} />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Medi
                <span className="text-cyan-400">Sense</span>
              </span>
            </Link>

            {/* Main content */}

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm font-medium text-cyan-300">
                <Sparkles size={15} />
                Welcome to MediSense
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Build a clearer
                <span className="block text-cyan-400">health picture.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">
                Create your MediSense account and bring your health reports,
                insights and trends together in one organized workspace.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Benefit
                  icon={Activity}
                  title="Health dashboard"
                  text="Keep important health indicators organized."
                />

                <Benefit
                  icon={Sparkles}
                  title="AI insights"
                  text="Understand health information more easily."
                />

                <Benefit
                  icon={ShieldCheck}
                  title="Privacy focused"
                  text="Designed with sensitive health information in mind."
                />

                <Benefit
                  icon={User}
                  title="Personal workspace"
                  text="Build a health profile around your needs."
                />
              </div>
            </div>

            <p className="text-xs leading-5 text-slate-600">
              MediSense is an educational health-information platform prototype
              and does not provide medical diagnosis or treatment.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            {/* Mobile brand */}

            <div className="mb-10 flex justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                  <Activity size={21} />
                </div>

                <span className="text-2xl font-bold">
                  Medi
                  <span className="text-cyan-400">Sense</span>
                </span>
              </Link>
            </div>

            {/* Header */}

            <div>
              <p className="text-sm font-medium text-cyan-400">GET STARTED</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Set up your personal MediSense health workspace.
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}

              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <div className="relative mt-2">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      handleChange(
                        "name",

                        e.target.value,
                      )
                    }
                    placeholder="Your full name"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="register-email"
                  className="text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="register-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      handleChange(
                        "email",

                        e.target.value,
                      )
                    }
                    placeholder="you@example.com"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="register-password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      handleChange(
                        "password",

                        e.target.value,
                      )
                    }
                    placeholder="Create a password"
                    className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-white/[0.05]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Password requirements */}

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          check.valid
                            ? "bg-emerald-400/15 text-emerald-400"
                            : "bg-white/5 text-slate-600"
                        }`}
                      >
                        <Check size={10} />
                      </div>

                      <span
                        className={
                          check.valid ? "text-emerald-400" : "text-slate-600"
                        }
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm password */}

              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>

                <div className="relative mt-2">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange(
                        "confirmPassword",

                        e.target.value,
                      )
                    }
                    placeholder="Repeat your password"
                    className={`h-13 w-full rounded-xl border bg-white/[0.03] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 ${
                      form.confirmPassword && !passwordsMatch
                        ? "border-red-400/40"
                        : "border-white/10 focus:border-cyan-400/50"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {form.confirmPassword && !passwordsMatch && (
                  <p className="mt-2 text-xs text-red-400">
                    Passwords do not match.
                  </p>
                )}

                {passwordsMatch && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                    <Check size={13} />
                    Passwords match.
                  </p>
                )}
              </div>

              {/* Terms */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I understand that MediSense provides educational health
                  information and AI-generated insights, not medical diagnosis
                  or treatment.
                </span>
              </label>

              {/* Error */}

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}

              {success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-5 text-emerald-300">
                  {success}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !agree ||
                  !passwordsMatch ||
                  !passwordChecks.every((check) => check.valid)
                }
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Sign in */}

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>

            {/* Security */}

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-cyan-400"
              />

              <p className="text-xs leading-5 text-slate-600">
                Your password is securely sent to the MediSense backend, hashed
                before storage, and never stored as plain text. Authentication
                is handled using JWT-based sessions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Benefit({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-200">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

export default Register;
