import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext"; // Adjust path as needed
import { toast } from "react-hot-toast";
import cookies from "js-cookie";

export default function ManageBorrows() {
  const server = import.meta.env.VITE_API_URL;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "librarian") {
      fetchBorrows();
      fetchStats();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [filter, currentPage, isAuthenticated, authLoading, user]);

  const fetchBorrows = async () => {
    try {
      const token = cookies.get("authToken");
      const params = new URLSearchParams();

      if (filter !== "all") {
        if (filter === "overdue") {
          params.append("overdue", "true");
        } else {
          params.append("status", filter);
        }
      }

      params.append("page", currentPage);

      const res = await axios.get(`${server}/api/borrows?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle both paginated and non-paginated responses
      if (res.data.data) {
        setBorrows(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setBorrows(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch borrows:", err);
      toast.error("Failed to load borrowing records");
    }
  };

  const fetchStats = async () => {
    try {
      const token = cookies.get("authToken");
      const res = await axios.get(`${server}/api/borrow-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manual return function for librarian
  const handleManualReturn = async (borrowId) => {
    const confirmed = window.confirm(
      "Mark this book as returned? This action cannot be undone."
    );
    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [borrowId]: "returning" }));

    try {
      const token = cookies.get("authToken");
      const res = await axios.post(
        `${server}/api/borrows/${borrowId}/manual-return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.fine > 0) {
        toast.success(`Book returned! Fine calculated: ${res.data.fine} Taka`);
      } else {
        toast.success("Book returned successfully!");
      }

      fetchBorrows();
      fetchStats();
    } catch (err) {
      console.error("Failed to return book:", err);
      toast.error(
        "Failed to return book: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [borrowId]: null }));
    }
  };

  // Clear fine function for librarian
  const handleClearFine = async (borrowId) => {
    const confirmed = window.confirm(
      "Clear all fines for this borrow? This indicates payment has been received."
    );
    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [borrowId]: "clearing" }));

    try {
      const token = cookies.get("authToken");
      await axios.post(
        `${server}/api/borrows/${borrowId}/clear-fine`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Fine cleared successfully!");
      fetchBorrows();
      fetchStats();
    } catch (err) {
      console.error("Failed to clear fine:", err);
      toast.error(
        "Failed to clear fine: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [borrowId]: null }));
    }
  };

  const getStatusBadge = (status, returnDate) => {
    const today = new Date();
    const dueDate = new Date(returnDate);

    if (status === "returned") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Returned
        </span>
      );
    } else if (
      status === "overdue" ||
      (status === "borrowed" && today > dueDate)
    ) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Overdue
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Borrowed
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBorrowerInfo = (borrow) => {
    if (borrow.borrower) {
      return (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {borrow.borrower.email}
          </div>
          <div className="text-sm text-gray-500 capitalize">
            {borrow.borrower.role}
          </div>
        </div>
      );
    }
    return <span className="text-gray-500">Unknown</span>;
  };

  const getDaysOverdue = (returnDate, status) => {
    if (status === "returned") return null;
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const filteredBorrows = borrows.filter((borrow) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      borrow.publication?.title?.toLowerCase().includes(searchLower) ||
      borrow.publication?.author?.toLowerCase().includes(searchLower) ||
      borrow.borrower?.email?.toLowerCase().includes(searchLower)
    );
  });

  // Show loading spinner while checking authentication
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check authentication and role
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the librarian dashboard.
          </p>
          <Link
            to="/signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "librarian") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only librarians can access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Current role: {user?.role || "Unknown"}
          </p>
          <Link
            to="/my-borrows"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View My Borrows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Manage Borrows
        </h1>
        <p className="text-gray-600">
          Complete borrowing management with manual controls
        </p>
        <p className="text-sm text-gray-500 mt-1">Welcome, {user.name}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {stats.total_borrowed || 0}
          </div>
          <div className="text-sm text-blue-800">Currently Borrowed</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stats.total_returned || 0}
          </div>
          <div className="text-sm text-green-800">Total Returned</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {stats.overdue_count || 0}
          </div>
          <div className="text-sm text-red-800">Overdue</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.total_fines || 0} Taka
          </div>
          <div className="text-sm text-yellow-800">Total Fines</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats.active_borrowers || 0}
          </div>
          <div className="text-sm text-purple-800">Active Borrowers</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by book title, author, or borrower email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("borrowed")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "borrowed"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Active ({stats.total_borrowed || 0})
          </button>
          <button
            onClick={() => setFilter("overdue")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "overdue"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Overdue ({stats.overdue_count || 0})
          </button>
          <button
            onClick={() => setFilter("returned")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "returned"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Returned
          </button>
        </div>
      </div>

      {/* Borrows Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div>
                      <div className="text-4xl mb-4">📚</div>
                      <div>
                        {searchTerm
                          ? "No matching records found"
                          : "No borrowing records found"}
                      </div>
                      {(filter !== "all" || searchTerm) && (
                        <button
                          onClick={() => {
                            setFilter("all");
                            setSearchTerm("");
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBorrows.map((borrow) => {
                  const daysOverdue = getDaysOverdue(
                    borrow.return_date,
                    borrow.status
                  );
                  const isActivelyBorrowed =
                    borrow.status === "borrowed" || borrow.status === "overdue";
                  const hasFine = parseFloat(borrow.total_fine) > 0;

                  return (
                    <tr key={borrow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-8 rounded object-cover"
                              src={
                                borrow.publication?.cover_url ||
                                "https://picsum.photos/100/150"
                              }
                              alt={borrow.publication?.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {borrow.publication?.title || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {borrow.publication?.author || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {borrow.publication?.type || "book"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getBorrowerInfo(borrow)}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium">Borrowed:</span>{" "}
                            {formatDate(borrow.borrow_date)}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span>{" "}
                            {formatDate(borrow.return_date)}
                          </div>
                          {borrow.actual_return_date && (
                            <div>
                              <span className="font-medium">Returned:</span>{" "}
                              {formatDate(borrow.actual_return_date)}
                            </div>
                          )}
                          {daysOverdue && (
                            <div className="text-red-600 text-xs font-medium">
                              {daysOverdue} days overdue
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(borrow.status, borrow.return_date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {hasFine ? (
                          <div className="space-y-1">
                            <span className="text-red-600 font-medium">
                              {borrow.total_fine} Taka
                            </span>
                            {borrow.fine_rate > 0 && (
                              <div className="text-xs text-gray-500">
                                Rate: {borrow.fine_rate} Taka/day
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {/* Manual Return Button */}
                          {isActivelyBorrowed && (
                            <button
                              onClick={() => handleManualReturn(borrow.id)}
                              disabled={
                                actionLoading[borrow.id] === "returning"
                              }
                              className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded transition-colors"
                            >
                              {actionLoading[borrow.id] === "returning"
                                ? "Processing..."
                                : "Mark Returned"}
                            </button>
                          )}

                          {/* Clear Fine Button */}
                          {hasFine && (
                            <button
                              onClick={() => handleClearFine(borrow.id)}
                              disabled={actionLoading[borrow.id] === "clearing"}
                              className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded transition-colors"
                            >
                              {actionLoading[borrow.id] === "clearing"
                                ? "Processing..."
                                : "Clear Fine"}
                            </button>
                          )}

                          {/* Status info for returned books */}
                          {borrow.status === "returned" && !hasFine && (
                            <span className="text-xs text-gray-500">
                              Complete
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Summary */}
      {filteredBorrows.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Librarian Actions
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <span className="font-medium">Mark Returned:</span> Use when a
              book is physically returned to the library
            </p>
            <p>
              <span className="font-medium">Clear Fine:</span> Use when a
              borrower has paid their fine in person
            </p>
            <p className="text-xs text-blue-600 mt-2">
              All actions are permanent and will update the system immediately
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
