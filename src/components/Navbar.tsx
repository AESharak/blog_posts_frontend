import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaBars, FaTimes, FaPen, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <div className="container-content">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <span className="bg-primary-600 text-white p-2 rounded-md">
              <FaPen className="h-4 w-4" />
            </span>
            <span className="text-xl font-serif font-bold text-secondary-900">
              Blog App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-secondary-700 hover:text-primary-600 font-medium"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="text-secondary-700 hover:text-primary-600 font-medium"
                >
                  Create Post
                </Link>
                <Link
                  to="/my-posts"
                  className="text-secondary-700 hover:text-primary-600 font-medium"
                >
                  My Posts
                </Link>

                <div className="relative ml-3 flex items-center space-x-3">
                  <span className="text-secondary-800 font-medium">
                    {user?.first_name || user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    tabIndex={0}
                    aria-label="Logout"
                    className="btn-danger flex items-center space-x-1"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-secondary-700 hover:text-primary-600 p-2"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-200 py-4">
          <div className="container-content flex flex-col space-y-4">
            <Link
              to="/"
              className="text-secondary-700 hover:text-primary-600 font-medium py-2"
              onClick={closeMenu}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="text-secondary-700 hover:text-primary-600 font-medium py-2"
                  onClick={closeMenu}
                >
                  Create Post
                </Link>
                <Link
                  to="/my-posts"
                  className="text-secondary-700 hover:text-primary-600 font-medium py-2"
                  onClick={closeMenu}
                >
                  My Posts
                </Link>
                <div className="pt-2 border-t border-secondary-200">
                  <div className="flex items-center space-x-2 text-secondary-800 py-2">
                    <FaUser className="h-4 w-4" />
                    <span>{user?.first_name || user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    tabIndex={0}
                    aria-label="Logout"
                    className="btn-danger w-full justify-center mt-2"
                  >
                    <FaSignOutAlt className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2 border-t border-secondary-200">
                <Link
                  to="/login"
                  className="btn-outline w-full justify-center"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full justify-center"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
