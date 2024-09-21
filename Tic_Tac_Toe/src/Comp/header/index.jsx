// import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import React from "react";

import { navItems } from "../../Constants";

export const Header = () => {

  return (
    <div className="sticky top-0 z-20 w-full py-2 px-10 bg-primary flex justify-between">
      <div className="flex  items-center gap-x-3">
        {navItems.map((navItem, idx) => {
          return (
            <NavLink
              key={idx}
              to={navItem.path}
              className={({ isActive }) =>
                `text-white text-lg font-light uppercase ${
                  isActive && "text-purple-900"
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