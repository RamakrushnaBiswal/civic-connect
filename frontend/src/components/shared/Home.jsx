import About from "../ui/About";
import Benefits from "../ui/Benefits";
import FeQ from "../ui/FeQ";
import HelpLine from "../ui/HelpLine";
import NearBy from "../ui/NearBy";
import ReportForm from "../ui/ReportForm";
import Chatbot from "../shared/Chatbot";
import Services from "../ui/Services";
import Statitcs from "../ui/Statitcs";

const Home = () => {
  return (
    <>
    <section className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] px-6 py-10 gap-40 bg-gray-50">
      {/* Left Side: Text */}
      <div className="flex-1 flex flex-col items-start justify-center max-w-xl mt-20">
        <h1 className="text-4xl md:text-7xl font-bold text-blue-700 mb-6">Welcome to Civic Connect</h1>
        <p className="text-lg text-gray-700 mb-4">
          Civic Connect is your gateway to community engagement, local resources, and civic participation. Our platform empowers citizens to connect, collaborate, and make a positive impact in their neighborhoods. Discover events, share ideas, and stay informed about what matters most to you.
        </p>
        <a href="#report" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition">Get Started</a>
      </div>
      {/* Right Side: Image */}
      <div className="flex items-center justify-center">
        <img src="/p2.png" alt="Civic Connect" className="w-auto h-72 drop-shadow-lg" />
      </div>
    </section>
    <Services/>
    <About/>
    <NearBy />
    <HelpLine />
    <Benefits />
    <ReportForm />
    <FeQ />
    <Chatbot />
    <Statitcs />
  </>
  );
};

export default Home;
