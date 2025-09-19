// src/pages/ThesisEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function ThesisEdit() {
  const server = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [thesis, setThesis] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    department: "",
    publisher: "",
    publication_year: "",
    shelf_location: "",
    description: "",
    total_copies: "",
    available_copies: "",
    cover_url: "",
    type: "thesis",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const departments = ["CSE", "EEE", "BBA", "ME", "TE", "CE", "IPE", "ARCH"];
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    axios
      .get(`${server}/api/publications/${id}`)
      .then((res) => {
        setThesis(res.data);
        setForm(res.data);
        setPreviewUrl(res.data.cover_url || "");
      })
      .catch(() => setThesis(null));
  }, [id]);

  if (!thesis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-gray-600 text-lg">Thesis not found.</p>
        <Link
          to="/resources/thesis"
          className="mt-6 px-5 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        >
          ← Back to Thesis
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.author.trim()) {
      toast.error("Author is required");
      return;
    }
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
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      fd.set("type", "thesis"); // enforce thesis type
      if (coverFile) fd.append("cover", coverFile);

      const token = cookies.get("authToken");

      await axios.post(`${server}/api/publications/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Thesis updated successfully!");
      navigate(`/thesis/${id}`);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update thesis.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const removeCoverImage = () => {
    setCoverFile(null);
    setPreviewUrl("");
    setForm((prev) => ({ ...prev, cover_url: "" }));
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Thesis</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        {/* Cover Image Section */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Cover Image
          </label>
          <div className="space-y-4">
            {previewUrl && (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="w-32 h-40 object-cover rounded-lg border shadow"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: JPEG, PNG, JPG, GIF, SVG (Max size: 4MB)
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Title
          </label>
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
          <label className="block text-gray-700 font-semibold mb-1">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Department
          </label>
          <select
            name="department"
            value={form.department || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Publisher
          </label>
          <input
            type="text"
            name="publisher"
            value={form.publisher || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Publication Year */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Publication Year
          </label>
          <input
            type="number"
            name="publication_year"
            min="1000"
            max={currentYear}
            value={form.publication_year || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Total Copies */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Total Copies
          </label>
          <input
            type="number"
            name="total_copies"
            min="0"
            value={form.total_copies || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Available Copies */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Available Copies
          </label>
          <input
            type="number"
            name="available_copies"
            min="0"
            max={form.total_copies || undefined}
            value={form.available_copies || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Shelf Location */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Shelf Location
          </label>
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
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            rows="4"
          />
        </div>

        {/* Cover URL (fallback) */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Cover URL (Optional)
          </label>
          <input
            type="text"
            name="cover_url"
            value={form.cover_url || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Or paste an image URL here"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/thesis/${id}`}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
