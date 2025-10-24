import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white px-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold tracking-widest text-indigo-500">
          404
        </h1>
        <p className="text-2xl font-semibold mt-6">Page Not Found</p>
        <p className="mt-2 text-gray-400">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl bg-indigo-500 text-white font-semibold shadow-lg hover:bg-indigo-600 transition duration-300"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;