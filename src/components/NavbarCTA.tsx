import React from "react";

const NavbarCTA = () => {
    return (
        <button
            id="navbar-cta"
            className="px-5 py-2 rounded-full group 
            transition-all duration-500 
            border-2 border-[#a374ff] bg-transparent shadow-lg
            text-white font-extrabold text-sm
            hover:bg-[#a374ff] hover:animate-pulse hover:cursor-pointer"
        >
            <span className="group-hover:animate-bounce">CONTACT</span>
        </button>
    );
};

export default NavbarCTA;