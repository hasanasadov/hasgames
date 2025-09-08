// src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-star  text-white pt-6 ">
      <div className="max-w-7xl mx-auto pb-8 px-4 md:px-6 ">
        {/* Glass panel */}
        <div className="relative rounded-3xl border border-white/20 bg-white/12 backdrop-blur-2xl shadow-xl shadow-black/30 px-5 py-6 md:px-8 md:py-7">
          {/* subtle top glow line */}
          <div className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          {/* corner glow */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl ring-1 ring-white/10" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Has <span className="text-white/70">React Games</span>
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Mini oyunlar, təmiz kod və şüşə estetikası ✨
              </p>
            </div>

            {/* Links */}
            <nav className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <a
                href="https://github.com/hasanasadov/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 px-3 py-2 text-sm font-semibold backdrop-blur transition"
                aria-label="Hasanali Asadov GitHub"
              >
                {/* GitHub icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-white/90"
                >
                  <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.86 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.79.62-3.38-1.37-3.38-1.37-.46-1.2-1.14-1.52-1.14-1.52-.93-.65.07-.64.07-.64 1.03.07 1.57 1.07 1.57 1.07.91 1.59 2.39 1.13 2.98.86.09-.68.36-1.13.65-1.39-2.23-.26-4.57-1.14-4.57-5.1 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.06a9.2 9.2 0 0 1 5 0c1.9-1.33 2.74-1.06 2.74-1.06.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.77 0 3.97-2.35 4.83-4.59 5.09.37.33.69.97.69 1.96 0 1.41-.01 2.54-.01 2.88 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href="https://github.com/hasanasadov/hasgames"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white text-slate-900 hover:shadow-lg px-3 py-2 text-sm font-semibold transition"
                aria-label="Source Code"
              >
                {/* Code icon */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-slate-900/90"
                >
                  <path d="M9.4 16.6 5.8 13l3.6-3.6L8 8l-5 5 5 5 1.4-1.4zm5.2 0L18.2 13l-3.6-3.6L16 8l5 5-5 5-1.4-1.4zM13.4 6l-2.8 12 1.9.4L15.3 6.4 13.4 6z" />
                </svg>
                <span>Source Code</span>
              </a>
            </nav>
          </div>

          {/* Divider */}
          <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Bottom row */}
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/70">
              © {year} Hasanali Asadov — All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                React
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Tailwind
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 backdrop-blur">
                Glass UI
              </span>
            </div>
          </div>

          {/* soft glare */}
          <div className="pointer-events-none absolute -top-10 left-10 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
