import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-4 mt-10 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-7 w-7 mr-2" />
          <span className="font-bold text-lg text-blue-600">Civic Connect</span>
        </div>
        <div className="text-gray-500 text-sm text-center md:text-right">
          &copy; {new Date().getFullYear()} Civic Connect. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-600 transition" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 19c7.732 0 11.946-6.41 11.946-11.946 0-.182 0-.364-.012-.545A8.548 8.548 0 0022 4.59a8.19 8.19 0 01-2.357.646A4.118 4.118 0 0021.448 3.2a8.224 8.224 0 01-2.605.996A4.107 4.107 0 0015.448 3c-2.266 0-4.104 1.838-4.104 4.104 0 .322.036.637.106.938A11.654 11.654 0 013 4.15a4.104 4.104 0 001.27 5.477A4.073 4.073 0 012.8 9.1v.052A4.106 4.106 0 004.096 13.2a4.093 4.093 0 01-1.085.145c-.265 0-.522-.026-.773-.075a4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
          </a>
          <a href="#" className="hover:text-blue-600 transition" aria-label="GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.34-2.221-.253-4.555-1.112-4.555-4.945 0-1.092.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.594 1.028 2.686 0 3.842-2.337 4.688-4.566 4.937.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481A10.013 10.013 0 0022 12.012C22 6.484 17.523 2 12 2z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
