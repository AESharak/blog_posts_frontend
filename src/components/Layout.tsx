import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-content">{children}</div>
      </main>
      <footer className="bg-white border-t border-secondary-200 py-8">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">Blog App</h3>
              <p className="text-secondary-600">
                Share your thoughts and ideas with the world through our simple
                and elegant blogging platform.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/create"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Create Post
                  </a>
                </li>
                <li>
                  <a
                    href="/my-posts"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    My Posts
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold mb-4">Contact</h4>
              <p className="text-secondary-600">
                Have questions? Reach out to us at support@blogapp.com
              </p>
            </div>
          </div>
          <div className="border-t border-secondary-200 mt-8 pt-6 text-center text-secondary-600">
            <p>
              &copy; {new Date().getFullYear()} Blog App. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
