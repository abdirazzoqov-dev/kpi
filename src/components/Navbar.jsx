import React, { useState } from 'react';
import logo from "../assets/logo.png"; // Logo manzilingiz
import profile from "../assets/profile.jpg"; // Logo manzilingiz

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 mr-2" />
          <div className="text-white text-3xl font-bold">SGCC KPI</div>
        </div>
        <div className="hidden md:block">
          <ul className="flex space-x-4">
            <li><a href="#dashboard" className="text-white hover:text-gray-400">Boshqaruv Paneli</a></li>
            <li><a href="#reports" className="text-white hover:text-gray-400">Hisobotlar</a></li>
            <li><a href="#analytics" className="text-white hover:text-gray-400">Tahlillar</a></li>
            <li><a href="#settings" className="text-white hover:text-gray-400">Sozlamalar</a></li>
            <li><a href="#help" className="text-white hover:text-gray-400">Yordam</a></li>
          </ul>
        </div>
        <div className="md:hidden" onClick={toggleMenu}>
          <button className="text-white focus:outline-none">
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex items-center">
         
          <img
            src={profile} // O'rnini bosadigan rasm URL
            alt="User  Profile"
            className="w-10 h-10 rounded-full mr-4"
          />
           <div className="text-white mr-4">Ism Familiya</div>
        </div>
      </div>
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleMenu}></div>
      <div className={`fixed right-0 top-0 h-full w-64 bg-gray-800 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center p-4">
          <img
            src="https://via.placeholder.com/40" // O'rnini bosadigan rasm URL
            alt="User  Profile"
            className="w-10 h-10 rounded-full mr-2"
          />
          <div className="text-white">Ism Familiya</div>
        </div>
        <ul className="flex flex-col items-start p-4 space-y-4">
          <li><a href="#dashboard" className="text-white hover:text-gray-400">Boshqaruv Paneli</a></li>
          <li><a href="#reports" className="text-white hover:text-gray-400">Hisobotlar</a></li>
          <li><a href="#analytics" className="text-white hover:text-gray-400">Tahlillar</a></li>
          < li><a href="#settings" className="text-white hover:text-gray-400">Sozlamalar</a></li>
          <li><a href="#help" className="text-white hover:text-gray-400">Yordam</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;