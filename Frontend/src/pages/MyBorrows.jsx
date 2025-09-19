import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext"; // Adjust path as needed
import { toast } from "react-hot-toast";
import cookies from "js-cookie";

export default function MyBorrows() {
  const server = import.meta.env.VITE_API_BASE_URL;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchBorrows();
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  const fetchBorrows = async () => {
    try {
      const token = cookies.get("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${server}/api/my-borrows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrows(res.data);
    } catch (err) {
      console.error("Failed to fetch borrows:", err);
      toast.error("Failed to load your borrowing history");
    } finally {
      setLoading(false);
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

  const getDaysUntilDue = (returnDate) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Show loading spinner while checking authentication
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your borrowing history.
          </p>
          <Link
            to="/Signin"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Check if user role allows borrowing
  if (user && user.role === "librarian") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Librarian Account
          </h2>
          <p className="text-gray-600 mb-6">
            Librarians don't have personal borrowing history.
          </p>
          <Link
            to="/manage-borrows"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage All Borrows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Borrowed Books
        </h1>
        <p className="text-gray-600">
          Track your borrowing history and due dates
        </p>
        {user && (
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user.name}!
          </p>
        )}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            📋 <strong>Note:</strong> To return books, please visit the library
            in person. The librarian will process your return and update the
            system.
          </p>
        </div>
      </div>

      {borrows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No borrowing history
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't borrowed any books yet.
          </p>
          <div className="space-x-4">
            <Link
              to="/resources/books"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Books
            </Link>
            <Link
              to="/resources/thesis"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Thesis
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrows.map((borrow) => {
                  const daysUntilDue = getDaysUntilDue(borrow.return_date);
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

                  return (
                    <tr key={borrow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                              {borrow.publication?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {borrow.publication?.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(borrow.borrow_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-900">
                          {formatDate(borrow.return_date)}
                        </div>
                        {borrow.status === "borrowed" && (
                          <div
                            className={`text-xs ${
                              isOverdue
                                ? "text-red-600"
                                : isDueSoon
                                ? "text-yellow-600"
                                : "text-gray-500"
                            }`}
                          >
                            {isOverdue
                              ? `${Math.abs(daysUntilDue)} days overdue`
                              : isDueSoon
                              ? `${daysUntilDue} days left`
                              : `${daysUntilDue} days left`}
                          </div>
                        )}
                        {borrow.actual_return_date && (
                          <div className="text-xs text-green-600">
                            Returned: {formatDate(borrow.actual_return_date)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(borrow.status, borrow.return_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {borrow.total_fine > 0 ? (
                          <span className="text-red-600 font-medium">
                            {borrow.total_fine} Taka
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Return Instructions */}
      {borrows.some(
        (b) => b.status === "borrowed" || b.status === "overdue"
      ) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            📖 How to Return Books
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>• Visit the library during operating hours</p>
            <p>• Bring your books to the librarian's desk</p>
            <p>• The librarian will scan and process your return</p>
            <p>
              • Any fines will be calculated and need to be paid at the library
            </p>
            <p>• Your borrowing history will be updated automatically</p>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {borrows.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {
                borrows.filter(
                  (b) => b.status === "borrowed" || b.status === "overdue"
                ).length
              }
            </div>
            <div className="text-sm text-blue-800">Currently Borrowed</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {borrows.filter((b) => b.status === "returned").length}
            </div>
            <div className="text-sm text-green-800">Returned</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {
                borrows.filter((b) => {
                  const today = new Date();
                  const dueDate = new Date(b.return_date);
                  return (
                    (b.status === "borrowed" || b.status === "overdue") &&
                    today > dueDate
                  );
                }).length
              }
            </div>
            <div className="text-sm text-red-800">Overdue</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {borrows
                .reduce((sum, b) => sum + parseFloat(b.total_fine || 0), 0)
                .toFixed(2)}{" "}
              Taka
            </div>
            <div className="text-sm text-yellow-800">Total Fines</div>
          </div>
        </div>
      )}
    </div>
  );
}
