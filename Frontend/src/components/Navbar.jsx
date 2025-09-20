import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../state/AuthContext";

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "px-3 py-2 rounded-lg text-sm " +
      (isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100")
    }
    onClick={onClick}
  >
    {children}
  </NavLink>
);

const SidebarNavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 " +
      (isActive 
        ? "bg-blue-600 text-white shadow-sm" 
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
    }
    onClick={onClick}
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Desktop dropdown states
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [librarianOpen, setLibrarianOpen] = useState(false);
  
  // Mobile sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarResourcesOpen, setSidebarResourcesOpen] = useState(false);
  const [sidebarAboutOpen, setSidebarAboutOpen] = useState(false);
  const [sidebarLibrarianOpen, setSidebarLibrarianOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    closeSidebar();
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setSidebarResourcesOpen(false);
    setSidebarAboutOpen(false);
    setSidebarLibrarianOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSidebar();
      }
    };
    
    if (sidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const isLibrarian = isAuthenticated && user?.role === 'librarian';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-extrabold tracking-tight">
              LibraAust
            </Link>
          </div>

          {/* Desktop nav - centered */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
            <NavItem to="/">Home</NavItem>

            {/* Resources dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                onClick={() => setResourcesOpen((v) => !v)}
              >
                Resources ▾
              </button>
              {resourcesOpen && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-44 bg-white rounded-md shadow-lg overflow-hidden border border-gray-100">
                    <NavLink
                      to="/resources/books"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Books
                    </NavLink>
                    <NavLink
                      to="/resources/thesis"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setResourcesOpen(false)}
                    >
                      Thesis
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Librarian dropdown - only show if user is librarian */}
            {isLibrarian && (
              <div
                className="relative"
                onMouseEnter={() => setLibrarianOpen(true)}
                onMouseLeave={() => setLibrarianOpen(false)}
              >
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-1 font-medium"
                  onClick={() => setLibrarianOpen((v) => !v)}
                >
                  Librarian ▾
                </button>
                {librarianOpen && (
                  <div className="absolute left-0 top-full pt-2 z-50">
                    <div className="w-48 bg-white rounded-md shadow-lg overflow-hidden border border-gray-100">
                      <NavLink
                        to="/add-publication"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setLibrarianOpen(false)}
                      >
                        Add Publication
                      </NavLink>
                      <NavLink
                        to="/manage-borrows"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setLibrarianOpen(false)}
                      >
                        Manage Borrows
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                onClick={() => setAboutOpen((v) => !v)}
              >
                About ▾
              </button>
              {aboutOpen && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="w-44 bg-white rounded-md shadow-lg overflow-hidden border border-gray-100">
                    <NavLink
                      to="/about/kfr"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAboutOpen(false)}
                    >
                      About KFR
                    </NavLink>
                    <NavLink
                      to="/about/rules"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setAboutOpen(false)}
                    >
                      Rules & Regulations
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            <NavItem to="/contact">Contact</NavItem>

            {/* Show My Borrows for students/faculty */}
            {isAuthenticated && user?.role !== 'librarian' && (
              <NavItem to="/my-borrows">My Borrows</NavItem>
            )}
          </nav>

          {/* Desktop login/profile section */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-2">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : !isAuthenticated ? (
              <Link
                to="/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Login / Sign up
              </Link>
            ) : (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
                  </div>
                  <span className="font-medium">
                    {user?.name || user?.email || "Profile"}
                  </span>
                  {isLibrarian && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Librarian
                    </span>
                  )}
                </button>
                <button
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition duration-200"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="bg-gray-600 block h-0.5 w-6 rounded-sm mb-1"></span>
                <span className="bg-gray-600 block h-0.5 w-6 rounded-sm mb-1"></span>
                <span className="bg-gray-600 block h-0.5 w-6 rounded-sm"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link 
              to="/" 
              className="text-xl font-extrabold tracking-tight"
              onClick={closeSidebar}
            >
              LibraAust
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Profile Section (if authenticated) */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  closeSidebar();
                }}
                className="flex items-center gap-3 w-full hover:bg-gray-100 px-3 py-3 rounded-lg transition duration-200"
              >
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">
                    {user?.name || user?.email || "Profile"}
                  </div>
                  {isLibrarian && (
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mt-1">
                      Librarian
                    </div>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <SidebarNavItem to="/" onClick={closeSidebar}>
              🏠 Home
            </SidebarNavItem>

            {/* Resources Section */}
            <div>
              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between transition duration-200"
                onClick={() => setSidebarResourcesOpen((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  📚 Resources
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    sidebarResourcesOpen ? 'rotate-180' : ''
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div
                className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
                  sidebarResourcesOpen ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <NavLink
                  to="/resources/books"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                  onClick={closeSidebar}
                >
                  📖 Books
                </NavLink>
                <NavLink
                  to="/resources/thesis"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                  onClick={closeSidebar}
                >
                  🎓 Thesis
                </NavLink>
              </div>
            </div>

            {/* Librarian Section - only show if user is librarian */}
            {isLibrarian && (
              <div>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-blue-700 hover:bg-blue-50 flex items-center justify-between transition duration-200"
                  onClick={() => setSidebarLibrarianOpen((v) => !v)}
                >
                  <span className="flex items-center gap-2">
                    👩‍💼 Librarian
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      sidebarLibrarianOpen ? 'rotate-180' : ''
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div
                  className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
                    sidebarLibrarianOpen ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <NavLink
                    to="/add-publication"
                    className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                    onClick={closeSidebar}
                  >
                    ➕ Add Publication
                  </NavLink>
                  <NavLink
                    to="/manage-borrows"
                    className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                    onClick={closeSidebar}
                  >
                    📋 Manage Borrows
                  </NavLink>
                </div>
              </div>
            )}

            {/* About Section */}
            <div>
              <button
                type="button"
                className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center justify-between transition duration-200"
                onClick={() => setSidebarAboutOpen((v) => !v)}
              >
                <span className="flex items-center gap-2">
                  ℹ️ About
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    sidebarAboutOpen ? 'rotate-180' : ''
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div
                className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ${
                  sidebarAboutOpen ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <NavLink
                  to="/about/kfr"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                  onClick={closeSidebar}
                >
                  🏢 About KFR
                </NavLink>
                <NavLink
                  to="/about/rules"
                  className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition duration-200"
                  onClick={closeSidebar}
                >
                  📋 Rules & Regulations
                </NavLink>
              </div>
            </div>

            <SidebarNavItem to="/contact" onClick={closeSidebar}>
              📞 Contact
            </SidebarNavItem>

            {/* Show My Borrows for students/faculty */}
            {isAuthenticated && user?.role !== 'librarian' && (
              <SidebarNavItem to="/my-borrows" onClick={closeSidebar}>
                📚 My Borrows
              </SidebarNavItem>
            )}
          </nav>

          {/* Sidebar Footer - Auth Section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {loading ? (
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : !isAuthenticated ? (
              <Link
                to="/signin"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition duration-200"
                onClick={closeSidebar}
              >
                Login / Sign up
              </Link>
            ) : (
              <button
                className="w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg font-medium transition duration-200"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}