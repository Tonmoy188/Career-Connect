
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BriefcaseBusiness,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import useAuthStore from "../store/authStore";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-indigo-700"
        : "text-slate-600 hover:text-indigo-700"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-950"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <BriefcaseBusiness size={20} />
          </span>
          Career<span className="text-indigo-600">Connect</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navClass}>Home</NavLink>
          <NavLink to="/jobs" className={navClass}>Find Jobs</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          <NavLink to="/contact" className={navClass}>Contact</NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-indigo-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 md:hidden">
          <nav className="grid gap-4">
            <NavLink onClick={closeMenu} to="/" className={navClass}>Home</NavLink>
            <NavLink onClick={closeMenu} to="/jobs" className={navClass}>Find Jobs</NavLink>
            <NavLink onClick={closeMenu} to="/about" className={navClass}>About</NavLink>
            <NavLink onClick={closeMenu} to="/contact" className={navClass}>Contact</NavLink>

            {user ? (
              <>
                <NavLink onClick={closeMenu} to="/dashboard" className={navClass}>
                  Dashboard
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-sm font-semibold text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink onClick={closeMenu} to="/login" className={navClass}>Login</NavLink>
                <Link
                  onClick={closeMenu}
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
