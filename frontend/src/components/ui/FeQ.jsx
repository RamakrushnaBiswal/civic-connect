import React, { useState } from "react";

const faqs = [
  {
    question: "What is Civic Connect?",
    answer:
      "Civic Connect is a platform designed to help citizens engage with their communities, access resources, and stay informed about local events and services.",
  },
  {
    question: "How do I find nearby emergency services?",
    answer:
      "You can use the Nearby Places feature to quickly locate hospitals, police stations, fire stations, and other essential services around you.",
  },
  {
    question: "Is Civic Connect free to use?",
    answer:
      "Yes, Civic Connect is completely free for all users. Our goal is to make civic resources accessible to everyone.",
  },
  {
    question: "How can I participate in community events?",
    answer:
      "Browse the Events section to discover upcoming community events and register to participate or volunteer.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach out to our support team via the Contact page or email us at support@civicconnect.com.",
  },
];

const FeQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="max-w-2xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md border border-blue-100">
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-blue-700 focus:outline-none"
              onClick={() => handleToggle(idx)}
              aria-expanded={openIdx === idx}
            >
              {faq.question}
              <span className={`ml-4 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeQ;
