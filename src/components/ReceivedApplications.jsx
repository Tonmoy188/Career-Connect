
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, LoaderCircle, UserRound } from "lucide-react";
import jobService from "../lib/jobService";

const statuses = [
  "Pending",
  "Reviewed",
  "Shortlisted",
  "Rejected",
  "Accepted",
];

export default function ReceivedApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  useEffect(() => {
    let active = true;

    jobService
      .getReceivedApplications(jobId)
      .then((data) => {
        const list = Array.isArray(data)
  ? data
  : Array.isArray(data?.applications)
    ? data.applications
    : Array.isArray(data?.data?.applications)
      ? data.data.applications
      : Array.isArray(data?.data)
        ? data.data
        : [];

        if (active) setApplications(list);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Could not load applications."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    setUpdating(applicationId);
    setError("");

    try {
      await jobService.updateApplicationStatus(applicationId, status);

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update application status."
      );
    } finally {
      setUpdating("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoaderCircle className="animate-spin text-indigo-600" size={34} />
      </div>
    );
  }

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12">
      <Link
        to="/my-jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700"
      >
        <ArrowLeft size={17} />
        Back to my jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-950">
          Received Applications
        </h1>
        <p className="mt-2 text-slate-500">
          Review candidates and manage their application status.
        </p>
      </div>

      {error && (
        <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <UserRound className="mx-auto text-slate-400" size={34} />
          <h2 className="mt-4 text-xl font-bold">
            No applications received yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Applications for this job will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => {
            const applicant =
              application.applicant || application.user || {};

            return (
              <article
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {applicant.name || "Applicant"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {applicant.email || "No email provided"}
                    </p>
                  </div>

                  <div className="min-w-40">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Application status
                    </label>

                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      value={application.status || "Pending"}
                      disabled={updating === application._id}
                      onChange={(e) =>
                        updateStatus(application._id, e.target.value)
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updating === application._id && (
                      <p className="mt-1 text-xs text-slate-400">
                        Updating...
                      </p>
                    )}
                  </div>
                </div>

                {Array.isArray(applicant.skills) &&
                  applicant.skills.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold">Cover letter</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {application.coverLetter ||
                      "No cover letter submitted."}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
