import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ThesisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/publications/${id}`)
      .then(res => setThesis(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this thesis?")) {
      await axios.delete(`http://localhost:8000/api/publications/${id}`);
      navigate("/resources/thesis");
    }
  };

  const handleBorrow = async () => {
    try {
      await axios.post(`http://localhost:8000/api/publications/${id}/borrow`);
      alert("Thesis borrowed successfully!");
      const refreshed = await axios.get(`http://localhost:8000/api/publications/${id}`);
      setThesis(refreshed.data);
    } catch (err) {
      alert("Failed to borrow thesis.");
    }
  };

  if (!thesis) {
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <Link
          to="/resources/thesis"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition shadow-sm"
        >
          ← Back
        </Link>

        <div className="flex gap-2">
          <Link
            to={`/thesis/${id}/edit`}
            className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        <div className="p-6 flex justify-center items-center bg-gray-50">
          <img
            src={thesis.cover_url || "https://picsum.photos/400/600"}
            alt={thesis.title}
            className="w-full max-w-xs rounded-xl shadow-lg"
          />
        </div>

        <div className="p-8 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{thesis.title}</h1>
          <p className="text-lg text-gray-700 mb-2"><b>Author:</b> {thesis.author}</p>
          <p className="text-gray-600 mb-2"><b>Department:</b> {thesis.department}</p>
          <p className="text-gray-600 mb-2"><b>Publisher:</b> {thesis.publisher}</p>
          <p className="text-gray-600 mb-2"><b>Year:</b> {thesis.publication_year}</p>
          <p className="text-gray-600 mb-2"><b>Type:</b> {thesis.type}</p>
          <p className="text-gray-600 mb-2"><b>Shelf:</b> {thesis.shelf_location}</p>
          <p className="text-gray-600 mb-2"><b>Total Copies:</b> {thesis.total_copies}</p>
          <p className="text-gray-600 mb-2"><b>Available Copies:</b> {thesis.available_copies}</p>
          <p className="mt-6 text-gray-700 leading-relaxed">{thesis.description}</p>

          {/* Borrow Button */}
          <button
            onClick={handleBorrow}
            disabled={thesis.available_copies <= 0}
            className={`mt-6 px-5 py-2 rounded-xl text-white shadow 
              ${thesis.available_copies > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {thesis.available_copies > 0 ? "Borrow Thesis" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}
