// import { useLocation } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import React from "react";
import { navItems } from "../../Constants";

import Logo  from "../../../public/logo.jpg";

export const Header = () => {

  return (
    <div className="sticky top-0 z-20 w-full py-2 px-10 bg-primary flex justify-between">
      <div className="flex items-center gap-x-3">
        <Link to="/" className="flex items-center gap-x-2" >
        <img src={Logo} alt="logo" className="w-10 h-10" />
        <h1 className="text-white text-2xl font-bold">React Games</h1>
        </Link>
      </div>
      <div className="flex  items-center gap-x-3">
        {navItems.map((navItem, idx) => {
          return (
            <NavLink
              key={idx}
              to={navItem.path}
              className={({ isActive }) =>
                `text-white text-lg font-light uppercase ${
                  isActive && "text-purple-900  font-extrabold"
                }`
              }
            >
              {navItem.title}
            </NavLink>
          );
        })}

      </div>
    </div>
  );
};