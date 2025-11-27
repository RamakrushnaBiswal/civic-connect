import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white px-10 py-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <a href="/"><img src="/logo.png" alt="Logo" className="h-20 w-20 mr-2" /></a>
      </div>
      <div className="hidden md:flex gap-8 items-center">
        <a href="/" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
        <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</a>
        <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium">Services</a>
        {user && (
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">Dashboard</Link>
        )}
        <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium">Contact</Link>
        {!user ? (
          <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 font-semibold transition cursor-pointer">Sign In</Link>
        ) : (
          <div className="relative">
            <button
              className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full shadow font-semibold transition cursor-pointer flex items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.name}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowLogoutConfirm(true)}
                >Logout</button>
                {/* Logout Confirmation Popup */}
                {showLogoutConfirm && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
                      <p className="mb-4 text-lg">Are you sure you want to logout?</p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          onClick={() => {
                            // Use central logout that clears JWT/localStorage and redirects
                            logout({ redirect: true });
                            setDropdownOpen(false);
                            setShowLogoutConfirm(false);
                          }}
                        >Yes</button>
                        <button
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                          onClick={() => setShowLogoutConfirm(false)}
                        >No</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Mobile menu button */}
      <button
        className="md:hidden flex items-center text-blue-600 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden animate-fade-in">
          <a href="/" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">Home</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">About</a>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">Contact</Link>
          {user ? (
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">Dashboard</Link>
          ) : (
            <a href="#report" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">Reports</a>
          )}
          <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium py-2 w-full text-center">Services</a>
          {!user ? (
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 font-semibold transition mt-2 w-full text-center">Sign In</Link>
          ) : (
            <div className="relative w-full flex flex-col items-center">
              <button
                className="bg-gray-100 text-gray-800 px-5 py-2 rounded-full shadow font-semibold transition cursor-pointer flex items-center gap-2 w-full justify-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.name}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowLogoutConfirm(true)}
                  >Logout</button>
                  {/* Logout Confirmation Popup */}
                  {showLogoutConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-50">
                      <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
                        <p className="mb-4 text-lg">Are you sure you want to logout?</p>
                        <div className="flex justify-center gap-4">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => {
                                logout({ redirect: true });
                                setDropdownOpen(false);
                                setShowLogoutConfirm(false);
                              }}
                          >Yes</button>
                          <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setShowLogoutConfirm(false)}
                          >No</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
