import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",

    password: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setError("Please enter your email and password.");

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,

            password: form.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to sign in. Please check your credentials.",
        );

        return;
      }

      /*

       * Store the JWT returned by the backend.

       * Protected MediSense API requests will use

       * this token for authentication.

       */

      localStorage.setItem(
        "medisense_token",

        data.token,
      );

      /*

       * Store the authenticated user's basic

       * information for frontend use.

       */

      localStorage.setItem(
        "medisense_user",

        JSON.stringify(data.user),
      );

      localStorage.setItem(
        "medisense_remember",

        String(rememberMe),
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login request failed:",

        error,
      );

      setError(
        "Unable to connect to the MediSense server. Please make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side */}

        <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex">
          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-3xl" />

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
                AI-powered health intelligence
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
                Your health.
                <span className="block text-cyan-400">Better understood.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">
                Access your medical reports, health trends, AI insights and
                healthcare tools from one secure workspace.
              </p>

              {/* Feature cards */}

              <div className="mt-10 space-y-3">
                <Feature
                  icon={ShieldCheck}
                  title="Health information in one place"
                  text="Organize reports and health insights in a single workspace."
                />

                <Feature
                  icon={Sparkles}
                  title="Understand complex information"
                  text="Use AI-powered explanations to make health information easier to understand."
                />

                <Feature
                  icon={Activity}
                  title="Track your health journey"
                  text="Monitor trends and prepare better questions for healthcare professionals."
                />
              </div>
            </div>

            {/* Bottom */}

            <p className="text-xs leading-5 text-slate-600">
              MediSense is an educational health-information platform prototype
              and does not provide medical diagnosis or treatment.
            </p>
          </div>
        </section>

        {/* Right side */}

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
              <p className="text-sm font-medium text-cyan-400">WELCOME BACK</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to MediSense
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Continue to your personal health workspace.
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300">
                {error}
              </div>
            )}

            {/* Form */}

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
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
                    id="email"
                    type="email"
                    autoComplete="email"
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <span className="text-xs font-medium text-slate-600">
                    Password reset coming soon
                  </span>
                </div>

                <div className="relative mt-2">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={(e) =>
                      handleChange(
                        "password",

                        e.target.value,
                      )
                    }
                    placeholder="Enter your password"
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
              </div>

              {/* Remember */}

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-cyan-400"
                />

                <span className="text-sm text-slate-500">Remember me</span>
              </label>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Create one
              </Link>
            </p>

            {/* Security */}

            <div className="mt-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-cyan-400"
              />

              <p className="text-xs leading-5 text-slate-600">
                Your login is securely processed by the MediSense backend.
                Passwords are verified on the server and successful
                authentication returns a JWT used to access protected MediSense
                features.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,

  title,

  text,
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

export default Login;
