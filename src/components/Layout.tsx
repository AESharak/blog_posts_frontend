import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="container mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Blog App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
