import React from "react";

const helplines = [
  {
    label: "Police",
    number: "100",
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2v-7a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
    ),
  },
  {
    label: "Ambulance",
    number: "102",
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17v-1a4 4 0 014-4h0a4 4 0 014 4v1M6 21h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2z" /></svg>
    ),
  },
  {
    label: "Fire Brigade",
    number: "101",
    icon: (
      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    label: "Disaster Management",
    number: "108",
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1v-4h-1m-4 0h-1v-4h-1" /></svg>
    ),
  },
  {
    label: "City Emergency",
    number: "112",
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
    ),
  },
  {
    label: "Women Helpline",
    number: "1091",
    icon: (
      <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20v-2a6 6 0 0112 0v2" /></svg>
    ),
  },
];

const HelpLine = () => {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {helplines.map((hl, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-lg flex flex-col items-center justify-center py-10 px-6 border border-blue-100 hover:scale-105 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-center mb-3">
              {hl.icon}
            </div>
            <span className="text-lg font-semibold text-gray-700 mb-1">{hl.label}</span>
            <span className="text-2xl font-bold text-blue-700 tracking-wide mb-1">{hl.number}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HelpLine;
