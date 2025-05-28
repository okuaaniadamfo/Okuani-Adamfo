import React, { useState } from "react";
import { Leaf, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../components/Navbar";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirm) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      // await apiRegister({ name, email, password });
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 to-green-50">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-green-200 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-green-900">Create Account</h1>
            <p className="mt-2 text-gray-600">Sign up to start using Akuafo Adamfo</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirm" className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="confirm"
                  type="password"
                  required
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-800">
              Sign In
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
