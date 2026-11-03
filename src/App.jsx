import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  Search,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Send,
  UserRound,
  LoaderCircle,
  Mail,
  Phone,
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/footer";
import JobCard from "./components/jobcard";
import { categories } from "./data/jobs";
import api from "./lib/api";
import jobService from "./lib/jobService";
import useAuthStore from "./store/authStore";
import ReceivedApplications from "./components/ReceivedApplications";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const getList = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getJob = (data) => data?.job || data?.data || data;

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoaderCircle className="animate-spin text-indigo-600" size={34} />
    </div>
  );
}

function ErrorMessage({ children }) {
  return (
    <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {children}
    </p>
  );
}

function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    let active = true;

    if (token && !user) {
      useAuthStore.getState().fetchMe().finally(() => {
        if (active) setChecking(false);
      });
    } else {
      setChecking(false);
    }

    return () => {
      active = false;
    };
  }, [token, user]);

  if (checking) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getAll()
      .then((data) => setFeatured(getList(data, "jobs").slice(0, 3)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your next chapter starts here
            </span>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.1] tracking-tight text-slate-950 sm:text-6xl">
              Find work that
              <span className="text-indigo-600"> moves you forward.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Discover opportunities, connect with companies, and take the next
              step in your career with confidence.
            </p>
            <Link to="/jobs" className={`${buttonClass} mt-8`}>
              Explore jobs <ArrowRight size={18} />
            </Link>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Easy job discovery
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                Simple applications
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white p-6 shadow-2xl shadow-indigo-100 sm:p-8">
            <p className="text-sm text-slate-500">Career overview</p>
            <h2 className="mt-1 text-xl font-bold">Opportunities await</h2>
            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-indigo-50 p-5">
                <BriefcaseBusiness className="text-indigo-600" />
                <p className="mt-4 text-2xl font-black">Explore</p>
                <p className="mt-1 text-sm text-slate-500">Job openings</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-5">
                <UserRound className="text-emerald-600" />
                <p className="mt-4 text-2xl font-black">Connect</p>
                <p className="mt-1 text-sm text-slate-500">With employers</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-100 p-5">
              <p className="font-bold">Your next opportunity</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Search by job title, location, or category to find a role that
                matches your goals.
              </p>
              <Link
                to="/jobs"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-700"
              >
                Start searching <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <PageHeading
          eyebrow="Featured opportunities"
          title="Latest job openings"
          description="Explore the latest opportunities published by employers."
        />
        {loading ? (
          <Loading />
        ) : featured.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No job listings yet. Check back soon.
          </p>
        )}
        <div className="mt-8 text-center">
          <Link to="/jobs" className={buttonClass}>
            Browse all jobs <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5">
          <PageHeading
            eyebrow="Explore by interest"
            title="Find your field"
            description="Browse opportunities in the areas that interest you."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/jobs?category=${encodeURIComponent(category)}`}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <BriefcaseBusiness className="text-indigo-600" size={25} />
                <h3 className="mt-4 font-bold">{category}</h3>
                <p className="mt-1 text-xs text-slate-500">Explore jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <PageHeading
          eyebrow="Why CareerConnect"
          title="A simpler way to move forward"
          description="A straightforward experience for finding work and managing opportunities."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["01", "Discover relevant roles", "Search by title and filter by category."],
            ["02", "Apply with confidence", "Review job requirements before applying."],
            ["03", "Track your progress", "Keep your applications organized in one place."],
          ].map(([number, title, description]) => (
            <article
              key={number}
              className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-100"
            >
              <p className="text-sm font-black text-indigo-600">{number}</p>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-indigo-700 px-5 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-200">Your next step</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Ready to find your next role?
            </h2>
            <p className="mt-3 text-indigo-100">
              Explore the opportunities available to you.
            </p>
          </div>
          <Link
            to="/jobs"
            className="rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 hover:bg-indigo-50"
          >
            Find a job <ArrowRight size={17} className="ml-2 inline" />
          </Link>
        </div>
      </section>
    </>
  );
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    new URLSearchParams(window.location.search).get("category") || "All"
  );
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    jobService.getAll({
      search: search || undefined,
      category: category === "All" ? undefined : category,
      type: type === "All" ? undefined : type,
    })
      .then((data) => setJobs(getList(data, "jobs")))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load jobs.")
      )
      .finally(() => setLoading(false));
  }, [search, category, type]);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12">
      <PageHeading
        eyebrow="Opportunities"
        title="Find your next job"
        description="Search openings and narrow the results by category or job type."
      />

      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[2fr_1fr_1fr]">
        <label className="relative block">
          <span className="sr-only">Search jobs</span>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />
          <input
            className={`${inputClass} pl-11`}
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          className={inputClass}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">All job types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
          <option>Remote</option>
        </select>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-900">{jobs.length}</strong> jobs found
        </p>
        <button
          onClick={() => {
            setSearch("");
            setCategory("All");
            setType("All");
          }}
          className="text-sm font-semibold text-indigo-700"
        >
          Clear filters
        </button>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <Loading />
      ) : jobs.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Search className="mx-auto text-slate-400" size={32} />
          <h2 className="mt-4 text-xl font-bold">No matching jobs</h2>
          <p className="mt-2 text-slate-500">
            Try another search or clear your filters.
          </p>
        </div>
      )}
    </section>
  );
}

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobService.getById(id)
      .then((data) => setJob(getJob(data)))
      .catch((err) =>
        setError(err.response?.data?.message || "Job not found.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setApplying(true);
    setError("");
    setMessage("");

    try {
      await jobService.apply(id, coverLetter);
      setMessage("Application submitted successfully.");
      setCoverLetter("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;

  if (!job || error) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Job not found</h1>
        <p className="mt-3 text-slate-500">{error || "This listing is unavailable."}</p>
        <Link to="/jobs" className={`${buttonClass} mt-6`}>Back to jobs</Link>
      </section>
    );
  }

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [];

  return (
    <section className="mx-auto grid max-w-7xl gap-7 px-5 py-12 lg:grid-cols-[1fr_340px]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9">
        <Link to="/jobs" className="text-sm font-semibold text-indigo-700">
          ← All jobs
        </Link>
        <p className="mt-7 text-sm text-slate-500">{job.company}</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{job.title}</h1>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {job.location}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
            {job.category}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {job.type || job.jobType}
          </span>
        </div>

        <div className="my-8 border-t border-slate-100" />
        <h2 className="text-xl font-bold">Job description</h2>
        <p className="mt-3 whitespace-pre-line leading-8 text-slate-600">
          {job.description}
        </p>

        <h2 className="mt-8 text-xl font-bold">Requirements</h2>
        <ul className="mt-4 grid gap-3">
          {requirements.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-start gap-3 text-slate-600">
              <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      </article>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">Salary</p>
        <p className="mt-2 text-xl font-extrabold">{job.salary || "Negotiable"}</p>
        <p className="mt-5 text-sm text-slate-500">Application deadline</p>
        <p className="mt-2 text-lg font-bold">
          {job.deadline
            ? new Date(job.deadline).toLocaleDateString()
            : "No deadline set"}
        </p>
        <div className="my-6 border-t border-slate-100" />
        {message && (
          <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {message}
          </p>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {user ? (
          <form onSubmit={handleApply} className="mt-5 grid gap-3">
            <label className="text-sm font-semibold">
              Cover letter
              <textarea
                className={`${inputClass} mt-2`}
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and explain why you're suitable for this role."
                required
              />
            </label>
            <button className={`${buttonClass} w-full`} disabled={applying}>
              {applying ? "Submitting..." : "Apply now"}
              <Send size={16} />
            </button>
          </form>
        ) : (
          <Link to="/login" className={`${buttonClass} mt-6 w-full`}>
            Log in to apply <ArrowRight size={17} />
          </Link>
        )}
      </aside>
    </section>
  );
}

function AuthPage({ register = false }) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = register
      ? await registerUser(name, email, password)
      : await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <UserRound size={27} />
        </div>
        <h1 className="text-3xl font-extrabold">
          {register ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {register
            ? "Join CareerConnect and explore new opportunities."
            : "Log in to access your career dashboard."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
          {register && (
            <label className="grid gap-2 text-sm font-semibold">
              Full name
              <input
                required
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </label>
          )}
          <label className="grid gap-2 text-sm font-semibold">
            Email address
            <input
              required
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Password
            <input
              required
              minLength={6}
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <button className={`${buttonClass} mt-2 w-full`} disabled={loading}>
            {loading ? "Please wait..." : register ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {register ? "Already registered? " : "New to CareerConnect? "}
          <Link
            className="font-bold text-indigo-700"
            to={register ? "/login" : "/register"}
          >
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12">
      <PageHeading
        eyebrow="Your workspace"
        title={`Welcome, ${user?.name || "there"}`}
        description="Manage your profile, job posts, and applications."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["/profile", "My Profile", "View and update your personal information."],
          ["/my-jobs", "My Job Posts", "Manage the jobs you publish."],
          ["/applications", "My Applications", "Track jobs you've applied for."],
          ["/jobs/new", "Post a Job", "Publish a new opportunity."],
        ].map(([to, title, description]) => (
          <Link
            key={to}
            to={to}
            className="rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm"
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-700">
              Open <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : ""
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setSkills(Array.isArray(user?.skills) ? user.skills.join(", ") : "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const result = await updateProfile({
      name,
      bio,
      skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
    });

    if (result.success) setMessage("Profile updated successfully.");
    else setError(result.message);

    setSaving(false);
  };

  return (
    <section className="mx-auto max-w-2xl px-5 py-12">
      <PageHeading title="My Profile" description="Manage your professional information." />
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <label className="grid gap-2 text-sm font-semibold">
          Full name
          <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Email address
          <input className={inputClass} value={user?.email || ""} disabled />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Skills (separate with commas)
          <input className={inputClass} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, JavaScript, UI/UX" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Professional bio
          <textarea className={inputClass} rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button className={buttonClass} disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </section>
  );
}

function JobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    type: "Full-time",
    salary: "",
    deadline: "",
    description: "",
    requirements: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // When editing, load the existing job into the form.
  useEffect(() => {
    if (!isEdit) return;

    jobService
      .getById(id)
      .then((data) => {
        const job = getJob(data);
        setForm({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          category: job.category || "",
          type: job.type || "Full-time",
          salary: job.salary || "",
          deadline: job.deadline ? String(job.deadline).slice(0, 10) : "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : "",
        });
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load this job.")
      );
  }, [id, isEdit]);

  const update = (e) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        deadline: form.deadline || null,
        requirements: form.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (isEdit) {
        await jobService.update(id, payload);
      } else {
        await jobService.create(payload);
      }

      navigate("/my-jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Could not publish this job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <PageHeading title={isEdit ? "Edit job post" : "Create a job post"} description="Enter the details candidates need to understand the opportunity." />
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <label className="grid gap-2 text-sm font-semibold">
          Job title
          <input name="title" required className={inputClass} value={form.title} onChange={update} placeholder="e.g. React Developer" />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Company name
          <input name="company" required className={inputClass} value={form.company} onChange={update} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            Location
            <input name="location" required className={inputClass} value={form.location} onChange={update} placeholder="Dhaka or Remote" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Category
            <select name="category" required className={inputClass} value={form.category} onChange={update}>
              <option value="">Select category</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Job type
            <select name="type" className={inputClass} value={form.type} onChange={update}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Salary
            <input name="salary" className={inputClass} value={form.salary} onChange={update} placeholder="e.g. ৳40,000/month" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Application deadline
            <input name="deadline" type="date" className={inputClass} value={form.deadline} onChange={update} />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold">
          Job description
          <textarea name="description" required className={inputClass} rows={5} value={form.description} onChange={update} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Requirements (one per line)
          <textarea name="requirements" required className={inputClass} rows={4} value={form.requirements} onChange={update} />
        </label>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <button className={buttonClass} disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Publish job"} <Send size={16} />
        </button>
      </form>
    </section>
  );
}



function MyJobs() {
  const user = useAuthStore((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadJobs = async () => {
      try {
        if (!user?._id) {
          await useAuthStore.getState().fetchMe();
        }

        const currentUser = useAuthStore.getState().user;

        if (!currentUser?._id) {
          throw new Error("Could not identify the logged-in user. Please log in again.");
        }

        const data = await jobService.getAll();
        const allJobs = getList(data, "jobs");

        console.log("Current user:", currentUser);
        console.log("Jobs received:", allJobs);

        const myJobs = allJobs.filter((job) => {
          const owner = job.postedBy?._id || job.postedBy;
          return owner && String(owner) === String(currentUser._id);
        });

        console.log("My published jobs:", myJobs);

        if (active) setJobs(myJobs);
      } catch (err) {
        console.error("My Jobs loading error:", err);

        if (active) {
          setError(err.response?.data?.message || err.message || "Could not load your job posts.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJobs();

    return () => {
      active = false;
    };
  }, [user?._id]);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job post?")) return;

    try {
      await jobService.remove(id);
      setJobs((current) => current.filter((job) => job._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this job.");
    }
  };

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeading
          title="My Job Posts"
          description="Manage the job opportunities you've published."
        />
        <Link to="/jobs/new" className={buttonClass}>
          Create job <ArrowRight size={16} />
        </Link>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <Loading />
      ) : jobs.length ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <article
              key={job._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div>
                <h2 className="font-bold">{job.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {job.company} · {job.location}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link className="text-sm font-semibold text-indigo-700" to={`/jobs/${job._id}`}>
                  View
                </Link>
                <Link className="text-sm font-semibold text-emerald-700" to={`/my-jobs/${job._id}/applications`}>
                  Applications
                </Link>
                <Link className="text-sm font-semibold text-slate-700" to={`/jobs/${job._id}/edit`}>
                  Edit
                </Link>
                <button onClick={() => deleteJob(job._id)} className="text-sm font-semibold text-red-600">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          You haven't published any jobs yet.
        </p>
      )}
    </section>
  );
}



function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    jobService
      .getMyApplications()
      .then((data) => {
        setApplications(getList(data, "applications"));
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Could not load your applications."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12">
      <PageHeading
        title="My Applications"
        description="Review your applications and follow their status."
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <Loading />
      ) : applications.length ? (
        <div className="grid gap-4">
          {applications.map((application) => {
            const job = application.job || {};

            return (
              <article
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold">
                      {job.title || "Job listing"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.company || ""} · {job.location || ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    {application.status || "Pending"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Job category: {job.category || "Not specified"}
                </p>

                <Link
                  to={job._id ? `/jobs/${job._id}` : "/jobs"}
                  className="mt-4 inline-flex text-sm font-semibold text-indigo-700"
                >
                  View job details →
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Send className="mx-auto text-slate-400" size={32} />
          <h2 className="mt-4 text-xl font-bold">
            No applications yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Explore jobs and submit your first application.
          </p>
          <Link to="/jobs" className={`${buttonClass} mt-5`}>
            Explore jobs
          </Link>
        </div>
      )}
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-16">
      <PageHeading
        eyebrow="About us"
        title="Better connections. Better opportunities."
        description="CareerConnect helps candidates discover roles and employers publish opportunities."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-7 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold">Our mission</h2>
          <p className="mt-3 leading-7 text-slate-600">Make job discovery straightforward, accessible, and organized for candidates and employers.</p>
        </article>
        <article className="rounded-2xl bg-white p-7 ring-1 ring-slate-200">
          <h2 className="text-xl font-bold">Our vision</h2>
          <p className="mt-3 leading-7 text-slate-600">Create a trusted space where opportunities and talent can find one another.</p>
        </article>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <PageHeading eyebrow="Contact us" title="Let's talk" description="Have a question or feedback? Send us a message." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Mail className="text-indigo-600" size={22} />
          <p className="mt-3 text-sm font-bold">Email</p>
          <p className="mt-1 break-words text-sm text-slate-500">hello@careerconnect.example</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Phone className="text-indigo-600" size={22} />
          <p className="mt-3 text-sm font-bold">Phone</p>
          <p className="mt-1 text-sm text-slate-500">+880 1XXX-XXXXXX</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <MapPin className="text-indigo-600" size={22} />
          <p className="mt-3 text-sm font-bold">Office address</p>
          <p className="mt-1 text-sm text-slate-500">CareerConnect Office, Chattogram, Bangladesh</p>
        </div>
      </div>
      {sent ? (
        <p className="rounded-xl bg-emerald-50 p-4 text-emerald-700">Thanks! Your message has been recorded in this demo.</p>
      ) : (
        <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <input required className={inputClass} placeholder="Your name" />
          <input required type="email" className={inputClass} placeholder="Your email" />
          <input required className={inputClass} placeholder="Subject" />
          <textarea required className={inputClass} rows={5} placeholder="Your message" />
          <button className={buttonClass}>Send message <Send size={16} /></button>
        </form>
      )}
    </section>
  );
}

function NotFound() {
  return (
    <section className="px-5 py-20 text-center">
      <h1 className="text-4xl font-black">404</h1>
      <p className="mt-3 text-slate-500">We couldn't find that page.</p>
      <Link to="/" className={`${buttonClass} mt-6`}>Back home</Link>
    </section>
  );
}

function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (token && !user) {
      useAuthStore.getState().fetchMe();
    }
  }, [token, user]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
  path="/my-jobs/:jobId/applications"
  element={
    <ProtectedRoute>
      <ReceivedApplications />
    </ProtectedRoute>
  }
/>

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
          <Route path="/jobs/:id/edit" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}