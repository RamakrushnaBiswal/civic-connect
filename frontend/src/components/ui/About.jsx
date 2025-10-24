import React from "react";

const About = () => {
  return (
    <section className="max-w-5xl mx-auto py-16 px-6 flex flex-col md:flex-row items-center gap-30" id="about">
      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="./p1.png"
          alt="Team Spirit Illustration"
          className="w-96 h-96 object-contain drop-shadow-lg rounded-xl bg-blue-50"
        />
      </div>
      {/* About Text */}
      <div className="flex-1">
        <h2 className="text-4xl font-bold text-blue-700 mb-6">About Civic Connect</h2>
        <p className="text-lg text-gray-700 mb-4">
          Civic Connect is a platform designed to empower citizens and communities. Our mission is to bridge the gap between people and local resources, making civic engagement accessible, transparent, and impactful.
        </p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li>Connect with local organizations and events</li>
          <li>Access emergency helplines and resources</li>
          <li>Collaborate on community projects</li>
          <li>Stay informed about civic news and updates</li>
        </ul>
        <p className="text-md text-gray-500">
          Join us in building stronger, more connected communities. Civic Connect is for everyone who wants to make a difference.
        </p>
      </div>
    </section>
  );
};

export default About;
