import {
  Activity,
  Brain,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      name: "Home",
      path: "/",
      icon: Activity,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
    },
    {
      name: "Health AI",
      path: "/health-ai",
      icon: Brain,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      {/* =====================================================
          DESKTOP NAVBAR
      ===================================================== */}

      <div className="mx-auto hidden h-[76px] max-w-7xl items-center px-6 lg:flex lg:px-8">

        {/* LOGO */}

        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
            <Activity
              size={21}
              strokeWidth={2.5}
            />
          </div>

          <div className="text-2xl font-bold tracking-tight text-white">
            Medi<span className="text-cyan-400">Sense</span>
          </div>
        </Link>

        {/* CENTER NAVIGATION */}

        <div className="mx-auto flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* RIGHT SIDE */}

        <div className="flex shrink-0 items-center gap-1">

          <Link
            to="/assistant"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <MessageCircle size={17} />
            AI Assistant
          </Link>

          <Link
            to="/hospitals"
            title="Find healthcare facilities"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <MapPin size={18} />
          </Link>

          <div className="mx-2 h-6 w-px bg-white/10" />

          <Link
            to="/login"
            className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="ml-1 whitespace-nowrap rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET NAVBAR
      ===================================================== */}

      <div className="flex h-[76px] items-center justify-between px-5 lg:hidden">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
            <Activity
              size={21}
              strokeWidth={2.5}
            />
          </div>

          <div className="text-2xl font-bold tracking-tight text-white">
            Medi<span className="text-cyan-400">Sense</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 lg:hidden">
          <div className="mx-auto max-w-xl px-5 py-4">

            <div className="flex flex-col gap-1">

              {links.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {link.name}
                  </NavLink>
                );
              })}

              <NavLink
                to="/assistant"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <MessageCircle size={18} />
                AI Assistant
              </NavLink>

              <NavLink
                to="/hospitals"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <MapPin size={18} />
                Hospital Finder
              </NavLink>

              <div className="my-2 h-px bg-white/10" />

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-300"
              >
                Get Started
              </Link>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;