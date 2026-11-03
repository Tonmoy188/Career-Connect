
import { Link } from "react-router-dom";
import { MapPin, Clock3, ArrowUpRight } from "lucide-react";

export default function JobCard({ job }) {
  const company = job.company || "Company";
  const jobType = job.type || job.jobType || "Full-time";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-extrabold text-indigo-700">
          {company.charAt(0).toUpperCase()}
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {jobType}
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">{company}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">
        {job.title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {job.location || "Location not specified"}
        </span>

        <span className="flex items-center gap-1">
          <Clock3 size={14} />
          {job.createdAt
            ? new Date(job.createdAt).toLocaleDateString()
            : "Recently posted"}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Salary</p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {job.salary || "Negotiable"}
          </p>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center gap-1 text-sm font-bold text-indigo-700 hover:text-indigo-900"
        >
          Details <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
