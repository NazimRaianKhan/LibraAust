// src/pages/AddPublication.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../state/AuthContext"; // Add this import
import { toast } from "react-hot-toast"; // Add this import
import cookies from "js-cookie"; // Add this import

export default function AddPublication() {
  const server = import.meta.env.VITE_API_URL;
  const { user, isAuthenticated } = useAuth(); // Add this
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    publication_year: "",
    publisher: "",
    department: "",
    type: "book",
    total_copies: 1,
    available_copies: 1,
    shelf_location: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const departments = ["CSE", "EEE", "BBA", "ME", "TE", "CE", "IPE", "ARCH"];
  const currentYear = new Date().getFullYear();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Check if user is librarian
    if (!isAuthenticated || user?.role !== "librarian") {
      toast.error("Only librarians can add publications");
      return;
    }

    // Validation (frontend side)
    if (Number(form.available_copies) > Number(form.total_copies)) {
      toast.error("Available copies cannot exceed total copies");
      return;
    }

    if (
      form.publication_year &&
      (form.publication_year < 1000 || form.publication_year > currentYear)
    ) {
      toast.error(`Publication year must be between 1000 and ${currentYear}`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("cover", file);

      const token = cookies.get("authToken");

      // DON'T set Content-Type header manually - let browser set it
      await axios.post(`${server}/api/publications`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove the Content-Type header - browser will set it automatically with boundary
        },
      });

      toast.success("Publication added successfully!");
      // reset form
      setForm({
        title: "",
        author: "",
        isbn: "",
        publication_year: "",
        publisher: "",
        department: "",
        type: "book",
        total_copies: 1,
        available_copies: 1,
        shelf_location: "",
        description: "",
      });
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add publication";
      toast.error(errorMessage);

      // Log detailed error for debugging
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  }

  // Check if user is librarian
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to add publications.
          </p>
        </div>
      </div>
    );
  }

  if (user?.role !== "librarian") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only librarians can add publications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add Publication</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter publication title"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter author name"
          />
        </div>

        {/* ISBN & Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ISBN (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Publication Year
            </label>
            <input
              name="publication_year"
              value={form.publication_year}
              onChange={handleChange}
              type="number"
              min="1000"
              max={currentYear}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`e.g. ${currentYear}`}
            />
          </div>
        </div>

        {/* Publisher & Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Publisher</label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Publisher name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type & Shelf Location */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Document Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="book">Book</option>
              <option value="thesis">Thesis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Shelf Location
            </label>
            <input
              name="shelf_location"
              value={form.shelf_location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., A-15-3"
            />
          </div>
        </div>

        {/* Copies */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Copies
            </label>
            <input
              name="total_copies"
              type="number"
              min="0"
              value={form.total_copies}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Available Copies
            </label>
            <input
              name="available_copies"
              type="number"
              min="0"
              max={form.total_copies}
              value={form.available_copies}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter description or summary"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-2">Preview:</div>
              <img
                src={previewUrl}
                alt="preview"
                className="w-40 h-auto rounded shadow"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {loading ? "Uploading..." : "Add Publication"}
          </button>
        </div>
      </form>
    </div>
  );
}
