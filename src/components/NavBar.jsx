import React from "react";
import { NavLink } from "react-router-dom";
import 'tailwindcss/tailwind.css'
const Navbar = () => {
  return (
    <>
       <div className="menu">
          <ul className="flex flex-row">
            <div className="p-5"><li> <NavLink to="/DebankCreator">Debank Tool</NavLink> </li></div>
            <div className="p-5"><li> <NavLink to="/FindUsers">Arkham Query Tool</NavLink> </li></div>
          </ul>
      </div>
    </>
  );
};

export {Navbar};

//<Logo />