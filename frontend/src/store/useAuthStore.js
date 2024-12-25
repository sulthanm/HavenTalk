import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdating: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check/");
      set({ authUser: res.data });
    } catch (err) {
      console.log("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      console.log("Error in signup:", err);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
      console.log("Error in logout:", err);
    } finally {
      set({ isLoggingOut: false });
    }
  },
  login: async (formData)=> {
    set({ isLoggingIn: true });
    try {
        const res = await axiosInstance.post("/auth/login", formData);
        set({ authUser: res.data });
        toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "LogIn failed");
      console.log("Error in login:", err);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
        const res = await axiosInstance.put("/auth/update-profile", formData);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
      console.log("Error in updateProfile:", err);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
