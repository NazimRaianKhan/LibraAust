import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      {/* ✅ Center the whole navbar */}
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
        </nav>

        {/* Right side (login/profile) */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {!user ? (
            <Link to="/signin" className="btn btn-primary">
              Login / Sign up
            </Link>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  👤
                </div>
                <span className="font-medium">{user.name}</span>
              </button>
              <button className="btn btn-outline" onClick={logout}>
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
        </div>
      </div>
    </header>
  );
}
