import React, { useState } from "react";
import { Lock, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
      const res = await fetch("https://okuani-adamfo-api.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          phoneNumber,
          password,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Registration successful!");
        navigate("/dashboard");
      } else if (res.status === 400) {
        alert(data.error || "Registration failed: Username or phone number already registered.");
      } else {
        alert(data.error || "Registration failed due to an unknown error.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-100 to-green-50 pt-30">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-green-200 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-green-900">Create Account</h1>
            <p className="mt-2 text-gray-600">Sign up to start using Okuani Adamfo</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="johndoe123"
                className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* First Name */}
            <div>
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="John"
                className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="Doe"
                className="w-full border rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="+233..."
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="password"
                  required
                  className="pl-10 w-full border rounded py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 mb-1">Confirm Password</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
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
