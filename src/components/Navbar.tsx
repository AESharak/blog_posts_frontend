import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      logout();
    }
  };

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Blog App
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-gray-300">
                Create Post
              </Link>
              <Link to="/my-posts" className="hover:text-gray-300">
                My Posts
              </Link>
              <span className="text-gray-400">
                Hello, {user?.first_name || user?.username}
              </span>
              <button
                onClick={handleLogout}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                aria-label="Logout"
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
