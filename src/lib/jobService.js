import api from "./api";

const jobService = {
  // Get all jobs, optionally with search and filters
  getAll: async (filters = {}) => {
    const { data } = await api.get("/jobs", {
      params: filters,
    });
    return data;
  },

  // Get one job by ID
  getById: async (id) => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  // Create a job
  create: async (jobData) => {
    const { data } = await api.post("/jobs", jobData);
    return data;
  },

  // Update a job
  update: async (id, jobData) => {
    const { data } = await api.put(`/jobs/${id}`, jobData);
    return data;
  },

  // Delete a job
  remove: async (id) => {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },

  // Apply for a job
  apply: async (jobId, coverLetter) => {
    const { data } = await api.post(`/applications/${jobId}`, {
      coverLetter,
    });
    return data;
  },

  // Get applications submitted by the logged-in user
  getMyApplications: async () => {
    const { data } = await api.get("/applications/my");
    return data;
  },

  // Get applications received for an employer's job
  getReceivedApplications: async (jobId) => {
    const { data } = await api.get(`/applications/received/${jobId}`);
    return data;
  },

  // Update an application's status
  updateApplicationStatus: async (applicationId, status) => {
    const { data } = await api.patch(
      `/applications/${applicationId}/status`,
      { status }
    );
    return data;
  },
};

export default jobService;