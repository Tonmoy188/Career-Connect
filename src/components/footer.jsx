import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <BriefcaseBusiness className="text-indigo-400" />
            CareerConnect
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            Connecting talented people with opportunities that help them grow.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-1 hover:border-indigo-400 hover:text-white">Facebook</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-1 hover:border-indigo-400 hover:text-white">LinkedIn</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-1 hover:border-indigo-400 hover:text-white">X</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 px-3 py-1 hover:border-indigo-400 hover:text-white">GitHub</a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/jobs" className="hover:text-white">Find jobs</Link>
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link to="/my-jobs" className="hover:text-white">My job posts</Link>
            <Link to="/applications" className="hover:text-white">My applications</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Company</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link to="/about" className="hover:text-white">About us</Link>
            <Link to="/contact" className="hover:text-white">Contact us</Link>
            <Link to="/register" className="hover:text-white">Create an account</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Mail size={16} /> hello@careerconnect.example</p>
            <p className="flex items-center gap-2"><Phone size={16} /> +880 1XXX-XXXXXX</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> Bangladesh</p>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Email, phone, and office details are placeholders for the assignment.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CareerConnect. Built for your next opportunity.
      </div>
    </footer>
  );
}