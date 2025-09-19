import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-6 py-24 text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-sm">
          Welcome to KFR Library
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Your gateway to AUST knowledge and resources
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/resources"
            className="px-6 py-3 rounded-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 transition"
          >
            Browse Books
          </Link>
          <Link
            to="/about/kfr"
            className="px-6 py-3 rounded-lg font-semibold border border-white text-white hover:bg-white/10 transition"
          >
            About KFR
          </Link>
        </div>
      </div>
    </section>
  );
}
