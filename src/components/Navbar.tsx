import React from "react";

const Navbar = () => {
    

    return (
        <nav className="w-full flex items-center justify-between p-4 bg-white shadow-md dark:bg-zinc-900">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                MyLogo
            </div>
            <ul className="flex space-x-8 text-gray-800 dark:text-gray-100 font-medium">
                <li>
                    <a href="#" className="hover:text-[#a374ff] transition-colors duration-200">Home</a>
                </li>
                <li>
                    <a href="#" className="hover:text-[#17f1d1] transition-colors duration-200">About</a>
                </li>
                <li>
                    <a href="#" className="hover:text-[#ffd074] transition-colors duration-200">Contact</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;