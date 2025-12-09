import React from "react";

const NavbarCTA = () => {
    return (
        <button
            id="navbar-cta"
            className="px-7 py-3 rounded-full group 
            transition-all duration-500 
            border-2 border-[#a374ff] bg-transparent shadow-lg
            text-[#a374ff] font-semibold
            hover:bg-[#a374ff] hover:text-white hover:font-extrabold hover:animate-pulse hover:cursor-pointer"
        >
            <span className="group-hover:animate-bounce">CONTACT</span>
        </button>
    );
};

export default NavbarCTA;