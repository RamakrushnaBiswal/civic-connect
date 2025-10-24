import React from "react";

const benefits = [
  {
    title: "Community Engagement",
    desc: "Connect with local groups and participate in events that matter to you.",
    img: "./b1.png",
  },
  {
    title: "Emergency Resources",
    desc: "Access vital helplines and resources quickly in times of need.",
    img: "./b2.png",
  },
  {
    title: "Collaboration",
    desc: "Work together on community projects and initiatives for positive change.",
    img: "./b3.png",
  },
  {
    title: "Stay Informed",
    desc: "Get updates on civic news, local policies, and upcoming events.",
    img: "./b4.png",
  },
  {
    title: "Easy Access",
    desc: "Find information and resources with a user-friendly interface.",
    img: "./b5.png",
  },
  {
    title: "Empowerment",
    desc: "Empower yourself and others to make a difference in your community.",
    img: "./b6.png",
  },
];

const Benefits = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6" id='services'>
      <h2 className="text-4xl font-bold text-blue-700 mb-10 text-center">Benefits of Civic Connect</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col items-center p-8 border border-blue-50"
          >
            <img
              src={benefit.img}
              alt={benefit.title}
              className="w-28 h-28 object-contain mb-5 rounded-xl bg-blue-50"
            />
            <h3 className="text-xl font-semibold text-blue-600 mb-2 text-center">{benefit.title}</h3>
            <p className="text-gray-600 text-center text-md">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
