import { Link, NavLink } from "react-router-dom";
import React, { useState } from "react";
import { navItems } from "../../Constants";
import Logo from "../../../public/logo.jpg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sticky top-0 z-20 w-full py-2 px-10 bg-primary flex justify-between items-center">
      <div className="flex items-center gap-x-3">
        <Link to="/" className="flex items-center gap-x-2">
          <img src={Logo} alt="logo" className="w-10 h-10" />
          <h1 className="text-white text-2xl font-bold">React Games</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        <button
          className="text-white text-2xl md:hidden"
          onClick={toggleMenu}
        >
          &#9776;
        </button>
        <div className={`md:flex ${isMenuOpen ? "slide-in" : "slide-out"} md:block`}>
          {navItems.map((navItem, idx) => {
            return (
              <NavLink
                key={idx}
                to={navItem.path}
                className={({ isActive }) =>
                  `text-white text-lg font-light uppercase ${
                    isActive && "text-purple-900 font-extrabold"
                  }`
                }
              >
                {navItem.title}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};