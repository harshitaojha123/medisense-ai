import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  HeartPulse,
  Lock,
  Mail,
  Pencil,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+91 00000 00000",
    dateOfBirth: "15 March 2000",
    bloodGroup: "O+",
  });

  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm font-medium text-cyan-300">
                <User size={16} />
                Your Profile
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Manage your health profile.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Keep your personal information, health preferences and
                MediSense settings organized in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditing((prev) => !prev)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Pencil size={17} />
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      {/* Profile workspace */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Profile card */}
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-28">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-3xl font-bold text-slate-950 shadow-xl shadow-cyan-400/10">
                AM
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                MediSense member
              </p>

              <div className="mt-6 w-full border-t border-white/10 pt-6">
                <ProfileStat
                  icon={FileText}
                  label="Reports analyzed"
                  value="10"
                />

                <ProfileStat
                  icon={Activity}
                  label="Health insights"
                  value="24"
                />

                <ProfileStat
                  icon={CalendarDays}
                  label="Member since"
                  value="2026"
                />
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-cyan-400"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Privacy first
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your health information should only be shared with
                    services you trust.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="space-y-8">
            {/* Personal information */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <SectionHeader
                icon={User}
                title="Personal information"
                description="Basic information associated with your account."
              />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <ProfileField
                  label="Full name"
                  value={profile.name}
                  editing={editing}
                  onChange={(value) =>
                    handleChange("name", value)
                  }
                />

                <ProfileField
                  label="Email address"
                  value={profile.email}
                  editing={editing}
                  onChange={(value) =>
                    handleChange("email", value)
                  }
                  icon={Mail}
                />

                <ProfileField
                  label="Phone number"
                  value={profile.phone}
                  editing={editing}
                  onChange={(value) =>
                    handleChange("phone", value)
                  }
                />

                <ProfileField
                  label="Date of birth"
                  value={profile.dateOfBirth}
                  editing={editing}
                  onChange={(value) =>
                    handleChange("dateOfBirth", value)
                  }
                  icon={CalendarDays}
                />
              </div>
            </section>

            {/* Health profile */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <SectionHeader
                icon={HeartPulse}
                title="Health profile"
                description="Optional information that can provide context for your health workspace."
              />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <ProfileField
                  label="Blood group"
                  value={profile.bloodGroup}
                  editing={editing}
                  onChange={(value) =>
                    handleChange("bloodGroup", value)
                  }
                />

                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Health profile status
                  </label>

                  <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                    <span className="text-sm text-slate-300">
                      Basic profile complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
                <p className="text-xs leading-6 text-slate-500">
                  Health information shown in this frontend prototype is
                  sample data. In the production version, sensitive health
                  information should be stored and processed using
                  appropriate security and privacy controls.
                </p>
              </div>
            </section>

            {/* Preferences */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <SectionHeader
                icon={Settings}
                title="Preferences"
                description="Control how MediSense communicates with you."
              />

              <div className="mt-7 divide-y divide-white/10">
                <PreferenceRow
                  icon={Bell}
                  title="Health notifications"
                  description="Receive updates about reports and health insights."
                  enabled
                />

                <PreferenceRow
                  icon={Activity}
                  title="Health trend reminders"
                  description="Get reminders to review your health trends."
                  enabled
                />

                <PreferenceRow
                  icon={Mail}
                  title="Product updates"
                  description="Receive information about new MediSense features."
                />
              </div>
            </section>

            {/* Security */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <SectionHeader
                icon={Lock}
                title="Security & account"
                description="Manage your account security settings."
              />

              <div className="mt-7 space-y-3">
                <AccountAction
                  icon={Lock}
                  title="Change password"
                  description="Update your account password."
                />

                <AccountAction
                  icon={ShieldCheck}
                  title="Privacy settings"
                  description="Review how your information is handled."
                />

                <AccountAction
                  icon={User}
                  title="Account preferences"
                  description="Manage your general account settings."
                />
              </div>
            </section>

            {/* Connected health workspace */}
            <section className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                    <HeartPulse size={22} />
                  </div>

                  <h2 className="mt-6 text-2xl font-bold">
                    Continue your health journey
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    Review your latest reports, explore AI-powered health
                    insights, or check your health dashboard.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Link
                    to="/dashboard"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Open Dashboard
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/reports"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    View Reports
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </section>

      {/* Footer notice */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex gap-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-cyan-400"
            />

            <p className="max-w-4xl text-sm leading-6 text-slate-500">
              MediSense is an educational health-information platform
              prototype. Profile information and AI-generated insights are
              not a substitute for professional medical advice, diagnosis,
              or treatment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
  icon: Icon = User,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="relative mt-2">
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          value={value}
          disabled={!editing}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 w-full rounded-xl border bg-slate-900 pl-11 pr-4 text-sm outline-none transition ${
            editing
              ? "border-cyan-400/30 text-white focus:border-cyan-400/60"
              : "border-white/10 text-slate-400"
          }`}
        />
      </div>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-500" />

        <span className="text-sm text-slate-500">
          {label}
        </span>
      </div>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function PreferenceRow({
  icon: Icon,
  title,
  description,
  enabled = false,
}) {
  const [active, setActive] = useState(enabled);

  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400">
          <Icon size={18} />
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setActive((prev) => !prev)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          active ? "bg-cyan-400" : "bg-slate-700"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            active ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function AccountAction({
  icon: Icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition group-hover:text-cyan-400">
        <Icon size={18} />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
      />
    </button>
  );
}

export default Profile;