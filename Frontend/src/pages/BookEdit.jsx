import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    publication_year: "",
    publisher: "",
    department: "",
    type: "book",
    total_copies: "",
    available_copies: "",
    shelf_location: "",
    description: "",
    cover_url: "",
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/publications/${id}`)
      .then(res => {
        setBook(res.data);
        setForm(res.data);
      })
      .catch(() => setBook(null));
  }, [id]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/publications/${id}`, form);
      alert("Book updated successfully!");
      navigate(`/books/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update book.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Book</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">ISBN</label>
          <input
            type="text"
            name="isbn"
            value={form.isbn || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Publication Year */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Publication Year</label>
          <input
            type="number"
            name="publication_year"
            value={form.publication_year || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Publisher</label>
          <input
            type="text"
            name="publisher"
            value={form.publisher || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={form.department || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Total Copies */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Total Copies</label>
          <input
            type="number"
            name="total_copies"
            value={form.total_copies || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Available Copies */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Available Copies</label>
          <input
            type="number"
            name="available_copies"
            value={form.available_copies || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Shelf Location */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Shelf Location</label>
          <input
            type="text"
            name="shelf_location"
            value={form.shelf_location || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            rows="4"
          />
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Cover URL</label>
          <input
            type="text"
            name="cover_url"
            value={form.cover_url || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/books/${id}`}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
