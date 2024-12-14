import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdating: false,
    isCheckingAuth: true,
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check/");
            set({authUser: res.data})
        }catch(err) {
            console.log("Error in checkAuth:", err);
            set({authUser:null})
        }finally{
            set({isCheckingAuth: false})
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
            console.error("Error in signup:", err);
        } finally {
            set({ isSigningUp: false });
        }
    }
    
    
}));
