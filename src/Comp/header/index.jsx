import { Link, NavLink } from "react-router-dom";
import React, { useState } from "react";
import { navItems } from "../../Constants";
import Logo from "../../../public/logo.jpg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  const linkClass = ({ isActive }) =>
    [
      "px-3 py-2 rounded-lg text-sm md:text-base font-semibold transition",
      "text-white/90 hover:text-white hover:bg-white/10",
      "border",
      isActive
        ? "bg-white/20 border-white/30 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45)]"
        : "border-transparent",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 w-full bg-star">
      {/* Glass bar */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-3">
        <div
          className={[
            "flex items-center justify-between gap-3",
            "rounded-2xl border border-white/20",
            "bg-white/10 backdrop-blur-xl backdrop-saturate-150",
            "shadow-lg",
            "px-3 md:px-4 py-2",
            "relative",
          ].join(" ")}
        >
          {/* subtle inner ring */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/10" />

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-95 transition"
            onClick={closeMenu}
          >
            <img
              src={Logo}
              alt="logo"
              className="w-9 h-9 rounded-xl border border-white/20 object-cover"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 text-xl md:text-2xl font-extrabold tracking-tight">
              Has React Games
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            {navItems.map((item, i) => (
              <NavLink key={i} to={item.path} className={linkClass}>
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggler */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white hover:bg-white/15 transition"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Open menu"
          >
            <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer + overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMenu}
          />
          {/* drawer */}
          <div
            className={[
              "absolute right-0 top-0 h-full w-72",
              "bg-white/15 border-l border-white/25",
              "backdrop-blur-2xl backdrop-saturate-150",
              "shadow-2xl",
              "p-4",
              "animate-[slideIn_.18s_ease]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-semibold">Menu</span>
              <button
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-white hover:bg-white/15 transition"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            <div className="mt-2 grid gap-1.5">
              <NavLink to="/" className={linkClass} end onClick={closeMenu}>
                Home
              </NavLink>
              {navItems.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  className={linkClass}
                  onClick={closeMenu}
                >
                  {item.title}
                </NavLink>
              ))}
            </div>

            {/* small note / footer */}
            <div className="mt-auto absolute bottom-4 left-4 right-4 text-[12px] text-white/60">
              <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
                Enjoy the games! ✨
              </div>
            </div>
          </div>
        </div>
      )}

      {/* keyframes for drawer */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(16px); opacity: .0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </header>
  );
};

export default Header;
