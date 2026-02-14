import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { toast } from "react-hot-toast";
import cookies from "js-cookie";

export default function ManageBorrows() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [borrows, setBorrows] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [extendModal, setExtendModal] = useState({ show: false, borrowId: null, days: 7 });

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === 'librarian') {
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
      
      if (filter !== 'all') {
        if (filter === 'overdue') {
          params.append('overdue', 'true');
        } else {
          params.append('status', filter);
        }
      }
      
      params.append('page', currentPage);

      const res = await axios.get(`http://localhost:8000/api/borrows?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.data) {
        setBorrows(res.data.data);
        setTotalPages(res.data.last_page || 1);
      } else {
        setBorrows(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch borrows:', err);
      toast.error("Failed to load borrowing records");
    }
  };

  const fetchStats = async () => {
    try {
      const token = cookies.get("authToken");
      const res = await axios.get('http://localhost:8000/api/borrow-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualReturn = async (borrowId) => {
    const confirmed = window.confirm("Mark this book as returned? This action cannot be undone.");
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [borrowId]: 'returning' }));
    
    try {
      const token = cookies.get("authToken");
      const res = await axios.post(
        `http://localhost:8000/api/borrows/${borrowId}/manual-return`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (res.data.fine > 0) {
        toast.success(`Book returned! Fine calculated: ${res.data.fine} Taka`);
      } else {
        toast.success('Book returned successfully!');
      }
      
      fetchBorrows();
      fetchStats();
    } catch (err) {
      console.error('Failed to return book:', err);
      toast.error('Failed to return book: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [borrowId]: null }));
    }
  };

  const handleClearFine = async (borrowId) => {
    const confirmed = window.confirm("Clear all fines for this borrow? This indicates payment has been received.");
    if (!confirmed) return;

    setActionLoading(prev => ({ ...prev, [borrowId]: 'clearing' }));
    
    try {
      const token = cookies.get("authToken");
      await axios.post(
        `http://localhost:8000/api/borrows/${borrowId}/clear-fine`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success('Fine cleared successfully!');
      fetchBorrows();
      fetchStats();
    } catch (err) {
      console.error('Failed to clear fine:', err);
      toast.error('Failed to clear fine: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [borrowId]: null }));
    }
  };

  const handleExtendDueDate = async () => {
    const { borrowId, days } = extendModal;
    
    if (!days || days < 1 || days > 30) {
      toast.error('Please enter a valid number of days (1-30)');
      return;
    }

    setActionLoading(prev => ({ ...prev, [borrowId]: 'extending' }));
    
    try {
      const token = cookies.get("authToken");
      const res = await axios.post(
        `http://localhost:8000/api/borrows/${borrowId}/extend-due-date`,
        { days: parseInt(days) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      toast.success(`Due date extended by ${days} days! New due date: ${new Date(res.data.new_due_date).toLocaleDateString()}`);
      setExtendModal({ show: false, borrowId: null, days: 7 });
      fetchBorrows();
      fetchStats();
    } catch (err) {
      console.error('Failed to extend due date:', err);
      toast.error('Failed to extend due date: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [borrowId]: null }));
    }
  };

  const getStatusBadge = (status, returnDate) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    
    if (status === 'returned') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Returned</span>;
    } else if (status === 'overdue' || (status === 'borrowed' && today > dueDate)) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Overdue</span>;
    } else {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Borrowed</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBorrowerInfo = (borrow) => {
    if (borrow.borrower) {
      return (
        <div>
          <div className="text-sm font-medium text-gray-900">{borrow.borrower.email}</div>
          <div className="text-sm text-gray-500 capitalize">{borrow.borrower.role}</div>
        </div>
      );
    }
    return <span className="text-gray-500">Unknown</span>;
  };

  const getDaysOverdue = (returnDate, status) => {
    if (status === 'returned') return null;
    const today = new Date();
    const dueDate = new Date(returnDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const filteredBorrows = borrows.filter(borrow => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      borrow.publication?.title?.toLowerCase().includes(searchLower) ||
      borrow.publication?.author?.toLowerCase().includes(searchLower) ||
      borrow.borrower?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the librarian dashboard.</p>
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

  if (!user || user.role !== 'librarian') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only librarians can access this page.</p>
          <p className="text-sm text-gray-500 mb-6">Current role: {user?.role || 'Unknown'}</p>
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
      {/* Extend Due Date Modal */}
      {extendModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setExtendModal({ show: false, borrowId: null, days: 7 })}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Extend Due Date
              </h3>
              <p className="text-purple-100 mt-1">Give the borrower more time to return</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Number of Days to Extend
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={extendModal.days}
                    onChange={(e) => setExtendModal(prev => ({ ...prev, days: e.target.value }))}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Enter days (1-30)"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    days
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Maximum extension: 30 days. This will clear any existing fines.
                </p>
              </div>

              {/* Quick select buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick select:</p>
                <div className="flex gap-2">
                  {[7, 14, 21, 30].map(days => (
                    <button
                      key={days}
                      onClick={() => setExtendModal(prev => ({ ...prev, days }))}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        extendModal.days == days
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                          : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleExtendDueDate}
                  disabled={actionLoading[extendModal.borrowId] === 'extending'}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
                >
                  {actionLoading[extendModal.borrowId] === 'extending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Extending...
                    </span>
                  ) : (
                    'Confirm Extension'
                  )}
                </button>
                <button
                  onClick={() => setExtendModal({ show: false, borrowId: null, days: 7 })}
                  disabled={actionLoading[extendModal.borrowId] === 'extending'}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Borrows</h1>
        <p className="text-gray-600">Complete borrowing management with manual controls</p>
        <p className="text-sm text-gray-500 mt-1">Welcome, {user.name}!</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total_borrowed || 0}</div>
          <div className="text-sm text-blue-800">Currently Borrowed</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.total_returned || 0}</div>
          <div className="text-sm text-green-800">Total Returned</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.overdue_count || 0}</div>
          <div className="text-sm text-red-800">Overdue</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.total_fines || 0} Taka</div>
          <div className="text-sm text-yellow-800">Total Fines</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.active_borrowers || 0}</div>
          <div className="text-sm text-purple-800">Active Borrowers</div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by book title, author, or borrower email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('borrowed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'borrowed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active ({stats.total_borrowed || 0})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Overdue ({stats.overdue_count || 0})
          </button>
          <button
            onClick={() => setFilter('returned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'returned' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div>
                      <div className="text-4xl mb-4">📚</div>
                      <div>
                        {searchTerm ? 'No matching records found' : 'No borrowing records found'}
                      </div>
                      {(filter !== 'all' || searchTerm) && (
                        <button 
                          onClick={() => {
                            setFilter('all');
                            setSearchTerm('');
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
                  const daysOverdue = getDaysOverdue(borrow.return_date, borrow.status);
                  const isActivelyBorrowed = borrow.status === 'borrowed' || borrow.status === 'overdue';
                  const hasFine = parseFloat(borrow.total_fine) > 0;
                  
                  return (
                    <tr key={borrow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-8 rounded object-cover"
                              src={borrow.publication?.cover_url || "https://picsum.photos/100/150"}
                              alt={borrow.publication?.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {borrow.publication?.title || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {borrow.publication?.author || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {borrow.publication?.type || 'book'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getBorrowerInfo(borrow)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <div><span className="font-medium">Borrowed:</span> {formatDate(borrow.borrow_date)}</div>
                          <div><span className="font-medium">Due:</span> {formatDate(borrow.return_date)}</div>
                          {borrow.actual_return_date && (
                            <div><span className="font-medium">Returned:</span> {formatDate(borrow.actual_return_date)}</div>
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
                            <span className="text-red-600 font-medium">{borrow.total_fine} Taka</span>
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
                              disabled={actionLoading[borrow.id] === 'returning'}
                              className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded transition-colors"
                            >
                              {actionLoading[borrow.id] === 'returning' ? 'Processing...' : 'Mark Returned'}
                            </button>
                          )}
                          
                          {/* Extend Due Date Button */}
                          {isActivelyBorrowed && (
                            <button
                              onClick={() => setExtendModal({ show: true, borrowId: borrow.id, days: 7 })}
                              disabled={actionLoading[borrow.id] === 'extending'}
                              className="text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-1 rounded transition-colors"
                            >
                              Extend Due Date
                            </button>
                          )}
                          
                          {/* Clear Fine Button */}
                          {hasFine && (
                            <button
                              onClick={() => handleClearFine(borrow.id)}
                              disabled={actionLoading[borrow.id] === 'clearing'}
                              className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded transition-colors"
                            >
                              {actionLoading[borrow.id] === 'clearing' ? 'Processing...' : 'Clear Fine'}
                            </button>
                          )}
                          
                          {/* Status info for returned books */}
                          {borrow.status === 'returned' && !hasFine && (
                            <span className="text-xs text-gray-500">Complete</span>
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
          <h3 className="text-lg font-medium text-blue-900 mb-2">Librarian Actions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><span className="font-medium">Mark Returned:</span> Use when a book is physically returned to the library</p>
            <p><span className="font-medium">Extend Due Date:</span> Give borrowers more time (up to 30 days extension)</p>
            <p><span className="font-medium">Clear Fine:</span> Use when a borrower has paid their fine in person</p>
            <p className="text-xs text-blue-600 mt-2">All actions are permanent and will update the system immediately</p>
          </div>
        </div>
      )}
    </div>
  );
}