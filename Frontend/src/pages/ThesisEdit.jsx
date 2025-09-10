// src/pages/ThesisEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ThesisEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/publications/${id}?type=thesis`)
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load thesis data");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:8000/api/publications/${id}`, {
        ...form,
        type: "thesis", // so backend knows it's thesis
      });
      navigate(`/thesis/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading thesis...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Thesis</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 shadow rounded-xl"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Publisher</label>
          <input
            type="text"
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Publication Year</label>
          <input
            type="number"
            name="publication_year"
            value={form.publication_year}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Shelf Location</label>
          <input
            type="text"
            name="shelf_location"
            value={form.shelf_location}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Total Copies</label>
            <input
              type="number"
              name="total_copies"
              value={form.total_copies}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Available Copies</label>
            <input
              type="number"
              name="available_copies"
              value={form.available_copies}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Cover URL</label>
          <input
            type="text"
            name="cover_url"
            value={form.cover_url}
            onChange={handleChange}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
