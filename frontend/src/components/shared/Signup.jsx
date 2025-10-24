/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ setUser }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the URL has a token after Google OAuth
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Store the token
      localStorage.setItem("token", token);

      // Fetch user profile from the backend
      fetch("http://localhost:5000/api/user/profile", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUser(data.user);
            navigate("/"); // Redirect to home or wherever you want
          } else {
            setError(data.message || "Failed to fetch user profile.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Network error while fetching profile.");
        });
    }
  }, [navigate, setUser]);

  const handleGoogleSignup = () => {
    // Redirect to the backend's Google OAuth endpoint
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <img src="/logo.png" alt="Logo" className="h-20 w-20 mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">{error}</div>}
        
        <div className="mt-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition shadow"
            onClick={handleGoogleSignup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.45 2.34 30.65 0 24 0 14.61 0 6.27 5.7 2.13 14.07l8.44 6.56C12.7 14.13 17.89 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.19 5.59C43.73 37.13 46.1 31.27 46.1 24.5z"/>
              <path fill="#FBBC05" d="M10.57 28.63c-1.13-3.36-1.13-6.97 0-10.33l-8.44-6.56C.41 15.61 0 19.72 0 24c0 4.28.41 8.39 2.13 12.26l8.44-6.56z"/>
              <path fill="#EA4335" d="M24 48c6.65 0 12.45-2.19 16.99-5.98l-7.19-5.59c-2.01 1.35-4.59 2.13-7.3 2.13-6.11 0-11.3-4.63-13.43-10.63l-8.44 6.56C6.27 42.3 14.61 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;