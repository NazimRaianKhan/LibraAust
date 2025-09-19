import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import Filters from "../components/Filters.jsx";
import Pagination from "../components/Pagination.jsx";
import PublicationCard from "../components/PublicationCard.jsx";
import axios from "axios";

export default function Books() {
  const server = import.meta.env.VITE_API_URL;
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    axios
      .get(`${server}/api/publications?type=book`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = useMemo(() => {
    return books.filter(
      (b) =>
        (!dept || b.department === dept) &&
        (!query || b.title.toLowerCase().includes(query.toLowerCase()))
    );
  }, [books, query, dept]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, dept]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Books</h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white shadow-md rounded-xl p-4 mb-10">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search books..."
        />
        <Filters department={dept} onDepartmentChange={setDept} />
      </div>

      {/* Books Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {pageItems.map((b) => (
          <Link
            key={b.id}
            to={`/books/${b.id}`}
            className="block w-full hover:scale-[1.02] transition"
          >
            <PublicationCard item={b} />
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
