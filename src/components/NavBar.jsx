import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LibraryBig, Home } from "lucide-react";

export default function NavBar() {
  const { pathname } = useLocation();
  const isLibrary = pathname.startsWith("/library");

  return (
    <nav className="fixed top-4 left-4 z-20">
      {isLibrary ? (
        <Link to="/" className="neon-link flex items-center gap-2 text-neon-blue font-semibold">
          <Home size={18} />
          <span>Entry</span>
        </Link>
      ) : (
        <Link to="/library" className="neon-link flex items-center gap-2 text-neon-blue font-semibold">
          <LibraryBig size={18} />
          <span>Library</span>
        </Link>
      )}
    </nav>
  );
}
