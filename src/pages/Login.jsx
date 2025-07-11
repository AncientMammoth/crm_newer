import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import React, { useState, useRef } from "react";
import { loginUser } from "../api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from 'framer-motion';
import { LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const navigate = useNavigate();
  const { register, setValue } = useForm();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleInputChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("secretKey", value);

    if (value.length === 6) {
      setLoginError("");
      setLoading(true);
      try {
        // The loginUser function now returns the token and the full user object
        const { token, user } = await loginUser(value);

        if (!token || !user) {
          setLoginError("Invalid secret key. Please try again.");
          if(inputRef.current) inputRef.current.value = "";
          setLoading(false);
          return;
        }

        // Clear previous session data
        localStorage.clear();

        // Store the new token and essential user info
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user.userName);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userRecordId", user.id); // The airtable_id

        // If the user is NOT an admin, store all the IDs they need
        if (user.role !== 'admin') {
          localStorage.setItem("accountIds", JSON.stringify(user.accounts || []));
          localStorage.setItem("projectIds", JSON.stringify(user.projects || []));
          localStorage.setItem("updateIds", JSON.stringify(user.updates || []));
          localStorage.setItem("taskIds", JSON.stringify(user.tasksAssignedTo || []));
          localStorage.setItem("createdTaskIds", JSON.stringify(user.tasksCreatedBy || []));
        }

        setLoading(false);

        // Redirect based on the user's role
        if (user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/"); // Redirect regular users to their main dashboard
        }

      } catch (err) {
        setLoginError(err.message || "Authentication failed. Please try again.");
        if(inputRef.current) inputRef.current.value = "";
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-card px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 p-10 bg-[#333333] rounded-2xl border border-border"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-secondary rounded-full border border-border">
                <LockClosedIcon className="h-8 w-8 text-foreground" />
            </div>
            <h2 className="text-4xl font-light text-center text-foreground">
              Sign in to your account
            </h2>
            <p className="text-base text-muted-foreground text-center max-w-xs leading-relaxed">
              Enter your 6-digit secret key to continue
            </p>
          </div>
          <form className="space-y-6 w-full" autoComplete="off" onSubmit={e => e.preventDefault()}>
            <input
              id="secretKey"
              {...register("secretKey")}
              type="password"
              placeholder="● ● ● ● ● ●"
              className="block w-full rounded-lg border border-border bg-secondary shadow-sm focus:border-primary focus:ring-primary text-foreground placeholder-muted-foreground py-4 px-5 text-center tracking-[1.5em] text-2xl font-mono placeholder:tracking-normal"
              disabled={loading}
              autoFocus
              maxLength={6}
              ref={inputRef}
              onChange={handleInputChange}
              inputMode="numeric"
            />
          </form>
          {loginError && (
            <div className="text-red-500 text-center text-sm font-medium">{loginError}</div>
          )}
          {loading && (
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
