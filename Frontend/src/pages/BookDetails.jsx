// src/pages/BookDetails.jsx
import { useParams, Link } from "react-router-dom";
import { sampleBooks } from "../lib/data.js";

export default function BookDetails() {
  const { id } = useParams();
  const book = sampleBooks.find(b => String(b.id) === id);

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-gray-600 text-lg">Book not found.</p>
        <Link
          to="/resources/books"
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          ← Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12 px-4">
      {/* Back button */}
      <div className="w-full max-w-5xl mb-6">
        <Link
          to="/resources/books"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition shadow-sm"
        >
          ← Back
        </Link>
      </div>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Book Cover */}
        <div className="p-6 flex justify-center items-center bg-gray-50">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full max-w-xs rounded-xl shadow-lg"
          />
        </div>

        {/* Book Info */}
        <div className="p-8 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Department:</span> {book.department}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Published:</span> {book.year}
          </p>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">Type:</span> {book.type}
          </p>

          {/* Tags */}
          <div className="mt-2">
            <span className="font-semibold text-gray-700">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {book.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
