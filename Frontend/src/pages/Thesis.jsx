import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar.jsx";
import Filters from "../components/Filters.jsx";
import Pagination from "../components/Pagination.jsx";
import PublicationCard from "../components/PublicationCard.jsx";

export default function Thesis() {
  const [theses, setTheses] = useState([]); // always an array → no filter error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/publications?type=thesis")
      .then((res) => {
        // if backend returns data inside "data", handle both shapes
        const payload = res.data?.data || res.data || [];
        setTheses(payload);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch theses");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return theses.filter(
      (t) =>
        (!dept || t.department === dept) &&
        (!query || t.title?.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, dept, theses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [query, dept]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading theses...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">{error}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Thesis Repository</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white shadow-md rounded-xl p-4 mb-10">
        <SearchBar value={query} onChange={setQuery} placeholder="Search thesis..." />
        <Filters department={dept} onDepartmentChange={setDept} />
      </div>

      {/* Thesis Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">No theses found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {pageItems.map((t) => (
            <Link
              key={t.id}
              to={`/thesis/${t.id}`}
              className="block w-full hover:scale-[1.02] transition"
            >
              <PublicationCard item={t} />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
