
import { create } from "zustand";
import api from "../lib/api";

const TOKEN_KEY = "career-connect-token";

// Safely access localStorage
const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const saveToken = (token) => {
  if (!token) return false;

  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
};

const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore storage errors
  }
};

// Support common API response formats
const getUser = (data) => data?.user || data?.data?.user || null;
const getToken = (data) =>
  data?.token || data?.accessToken || data?.data?.token || null;

const useAuthStore = create((set, get) => ({
  user: null,
  token: getStoredToken(),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      const token = getToken(data);
      const user = getUser(data);

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token."
        );
      }

      if (!saveToken(token)) {
        throw new Error("Could not save your login session in the browser.");
      }

      set({
        user,
        token,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      };
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });

    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const token = getToken(data);
      const user = getUser(data);

      if (!token) {
        throw new Error(
          "Registration succeeded, but the server did not return an authentication token."
        );
      }

      if (!saveToken(token)) {
        throw new Error("Could not save your login session in the browser.");
      }

      set({
        user,
        token,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.",
      };
    }
  },

  fetchMe: async () => {
    const token = get().token || getStoredToken();

    if (!token) {
      set({ user: null, token: null });
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");
      const user = getUser(data);

      if (!user) {
        console.error("Invalid /auth/me response:", data);
        return null;
      }

      set({ user, token });

      return user;
    } catch (error) {
      console.error(
        "Failed to restore logged-in user:",
        error.response?.data || error.message
      );

      // Only clear the session when authentication is rejected.
      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        removeToken();
        set({ user: null, token: null });
      }

      return null;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, loading: false });
  },

  updateProfile: async (profile) => {
    try {
      const { data } = await api.patch("/auth/profile", profile);
      const user = getUser(data);

      if (!user) {
        return {
          success: false,
          message: "Profile updated, but user data was not returned.",
        };
      }

      set({ user });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Profile update failed",
      };
    }
  },
}));

export default useAuthStore;
