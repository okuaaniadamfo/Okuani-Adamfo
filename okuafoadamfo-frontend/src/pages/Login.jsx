import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Loader2, Lock, User, Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("https://okuani-adamfo-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        // Optional: Save token or user data here
        // localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        alert(data.error || "Invalid username or password");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center px-4 py-12 overflow-hidden">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-green-100 p-8 z-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-8" custom={1} variants={fadeUp}>
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Sign in to access crop disease detection tools
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          animate="visible"
        >
          {/* Username Input */}
          <motion.div className="space-y-2" custom={2} variants={fadeUp}>
            <label htmlFor="username" className="text-sm text-gray-700 font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User className="h-4 w-4" />
              </span>
              <input
                id="username"
                type="text"
                placeholder="john_doe"
                className="w-full border rounded-lg py-2 pl-10 pr-3 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div className="space-y-2" custom={3} variants={fadeUp}>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-gray-700 font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-green-600 hover:text-green-800"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                className="w-full border rounded-lg py-2 pl-10 pr-3 shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Submit Button with Loader */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all text-white font-semibold py-2 rounded-lg shadow-md disabled:opacity-70"
            variants={fadeUp}
            custom={4}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </motion.button>
        </motion.form>

        <motion.div className="mt-6 text-center text-sm" variants={fadeUp} custom={5}>
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-800">
              Register now
            </Link>
          </p>
        </motion.div>

        <motion.div className="mt-6 text-center text-xs text-gray-500" variants={fadeUp} custom={6}>
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-green-600 hover:text-green-800 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-green-600 hover:text-green-800 underline">
            Privacy Policy
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
