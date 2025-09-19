import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../state/AuthContext"; // Adjust path as needed
import { toast } from "react-hot-toast";
import cookies from "js-cookie";

export default function ThesisDetail() {
  const server = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch thesis details
    axios
      .get(`${server}/api/publications/${id}`)
      .then((res) => setThesis(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load thesis details");
      });
  }, [id]);

  const handleDelete = async () => {
    if (!user || user.role !== "librarian") {
      toast.error("Only librarians can delete thesis");
      return;
    }

    if (window.confirm("Are you sure you want to delete this thesis?")) {
      try {
        const token = cookies.get("authToken");
        await axios.delete(`${server}/api/publications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thesis deleted successfully");
        navigate("/resources/thesis");
      } catch (err) {
        console.error(err);
        toast.error(
          "Failed to delete thesis: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to borrow thesis");
      return;
    }

    if (!user || user.role === "librarian") {
      toast.error("Only students and faculty can borrow thesis");
      return;
    }

    if (thesis.available_copies <= 0) {
      toast.error("This thesis is currently not available");
      return;
    }

    setLoading(true);
    try {
      const token = cookies.get("authToken");
      const res = await axios.post(
        `${server}/api/publications/${id}/borrow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const returnDate = new Date(res.data.return_date).toLocaleDateString();
      toast.success(
        `Thesis borrowed successfully! Please return by: ${returnDate}`
      );

      // Refresh thesis data to update available_copies
      const refreshed = await axios.get(`${server}/api/publications/${id}`);
      setThesis(refreshed.data);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || "Failed to borrow thesis";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!thesis) {
    return <p className="text-center mt-20 text-gray-600">Loading...</p>;
  }

  const canBorrow =
    isAuthenticated && user && ["student", "faculty"].includes(user.role);
  const canManage = isAuthenticated && user && user.role === "librarian";

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <Link
          to="/resources/thesis"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition shadow-sm"
        >
          ← Back
        </Link>

        {canManage && (
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
        )}
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
          <p className="text-lg text-gray-700 mb-2">
            <b>Author:</b> {thesis.author}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Department:</b> {thesis.department || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Publisher:</b> {thesis.publisher || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Year:</b> {thesis.publication_year || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Type:</b> {thesis.type}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Shelf:</b> {thesis.shelf_location || "N/A"}
          </p>
          <p className="text-gray-600 mb-2">
            <b>Total Copies:</b> {thesis.total_copies}
          </p>
          <p className="text-gray-600 mb-4">
            <b>Available Copies:</b>
            <span
              className={
                thesis.available_copies > 0
                  ? "text-green-600 font-semibold ml-2"
                  : "text-red-600 font-semibold ml-2"
              }
            >
              {thesis.available_copies}
            </span>
          </p>

          {thesis.description && (
            <p className="mt-6 text-gray-700 leading-relaxed">
              {thesis.description}
            </p>
          )}

          {/* Borrow Button - only show to students and faculty */}
          {canBorrow && (
            <button
              onClick={handleBorrow}
              disabled={thesis.available_copies <= 0 || loading}
              className={`mt-6 px-5 py-2 rounded-xl text-white shadow transition-colors
                ${
                  thesis.available_copies > 0 && !loading
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              {loading
                ? "Processing..."
                : thesis.available_copies > 0
                ? "Borrow Thesis"
                : "Not Available"}
            </button>
          )}

          {/* Show message if user can't borrow */}
          {isAuthenticated && user && !canBorrow && (
            <div className="mt-6 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl">
              Only students and faculty can borrow thesis.
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-xl">
              <p className="mb-2">Please log in to borrow thesis.</p>
              <Link
                to="/Signin"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Login here
              </Link>
            </div>
          )}

          {/* User info display for debugging - remove in production */}
          {isAuthenticated && user && (
            <div className="mt-4 text-xs text-gray-500">
              Logged in as: {user.name} ({user.role})
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
