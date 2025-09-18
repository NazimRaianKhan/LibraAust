import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../state/AuthContext";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      "px-3 py-2 rounded-lg text-sm " +
      (isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100")
    }
  >
    {children}
  </NavLink>
);

export default function Navbar() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [librarianOpen, setLibrarianOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileLibrarianOpen, setMobileLibrarianOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isLibrarian = isAuthenticated && user?.role === 'librarian';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            LibraAust
          </Link>
        </div>

        {/* Centered nav */}
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

        {/* Right side (login/profile) */}
        <div className="flex-shrink-0 flex items-center gap-2">
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
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-200">
        <div className="container mx-auto flex flex-col gap-2 py-2 px-4">
          <NavItem to="/">Home</NavItem>

          {/* Resources collapsible */}
          <div className="flex flex-col">
            <button
              type="button"
              className="text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              onClick={() => setMobileResourcesOpen((v) => !v)}
            >
              <span>Resources</span>
              <span>{mobileResourcesOpen ? "▴" : "▾"}</span>
            </button>
            {mobileResourcesOpen && (
              <div className="ml-4 mt-1">
                <NavLink
                  to="/resources/books"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileResourcesOpen(false)}
                >
                  Books
                </NavLink>
                <NavLink
                  to="/resources/thesis"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileResourcesOpen(false)}
                >
                  Thesis
                </NavLink>
              </div>
            )}
          </div>

          {/* Librarian collapsible - only show if user is librarian */}
          {isLibrarian && (
            <div className="flex flex-col">
              <button
                type="button"
                className="text-left px-3 py-2 rounded-lg text-sm text-blue-700 hover:bg-blue-50 flex items-center justify-between font-medium"
                onClick={() => setMobileLibrarianOpen((v) => !v)}
              >
                <span>Librarian</span>
                <span>{mobileLibrarianOpen ? "▴" : "▾"}</span>
              </button>
              {mobileLibrarianOpen && (
                <div className="ml-4 mt-1">
                  <NavLink
                    to="/add-publication"
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileLibrarianOpen(false)}
                  >
                    Add Publication
                  </NavLink>
                  <NavLink
                    to="/manage-borrows"
                    className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileLibrarianOpen(false)}
                  >
                    Manage Borrows
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* About collapsible */}
          <div className="flex flex-col">
            <button
              type="button"
              className="text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              onClick={() => setMobileAboutOpen((v) => !v)}
            >
              <span>About</span>
              <span>{mobileAboutOpen ? "▴" : "▾"}</span>
            </button>
            {mobileAboutOpen && (
              <div className="ml-4 mt-1">
                <NavLink
                  to="/about/kfr"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileAboutOpen(false)}
                >
                  About KFR
                </NavLink>
                <NavLink
                  to="/about/rules"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileAboutOpen(false)}
                >
                  Rules & Regulations
                </NavLink>
              </div>
            )}
          </div>

          <NavItem to="/contact">Contact</NavItem>

          {/* Show My Borrows for students/faculty in mobile */}
          {isAuthenticated && user?.role !== 'librarian' && (
            <NavItem to="/my-borrows">My Borrows</NavItem>
          )}
        </div>
      </div>
    </header>
  );
}