import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Lock, User, Leaf, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef(null);

  const navigate = useNavigate();  
  
  // Focus username input on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Auto-clear notifications
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors above');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch("https://okuani-adamfo-api.onrender.com/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          rememberMe
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (res.ok) {
        showNotification('success', 'Login successful! Redirecting...');
        
        // Handle token storage based on remember me
        if (data.token) {
          if (rememberMe) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            sessionStorage.setItem("authToken", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
          }
        }
        
        // Simulate navigation after delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Handle specific error cases
        if (res.status === 401) {
          showNotification('error', 'Invalid username or password');
        } else if (res.status === 429) {
          showNotification('error', 'Too many login attempts. Please try again later.');
        } else if (res.status === 500) {
          showNotification('error', 'Server error. Please try again later.');
        } else {
          showNotification('error', data.message || data.error || 'Login failed');
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        showNotification('error', 'Request timed out. Please check your connection.');
      } else {
        showNotification('error', 'Network error. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
    } else {
      setPassword(value);
    }
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const NotificationBanner = ({ type, message }) => {
    if (!message) return null;
    
    const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
    const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
    
    return (
      <motion.div
        className={`${bgColor} border rounded-lg p-3 mb-4 flex items-center gap-2`}
        variants={slideIn}
        initial="hidden"
        animate="visible"
        role="alert"
        aria-live="polite"
      >
        <Icon className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
        <span className={`text-sm ${textColor}`}>{message}</span>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12 pt-25 overflow-hidden">
      <div className="pt-15" />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 z-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-8" custom={1} variants={fadeUp}>
          <motion.div 
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 mb-6 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Leaf className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            Sign in to access your crop disease detection tools
          </p>
        </motion.div>

        <NotificationBanner type={notification.type} message={notification.message} />

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          animate="visible"
          noValidate
        >
          {/* Username Input */}
          <motion.div className="space-y-2" custom={2} variants={fadeUp}>
            <label htmlFor="username" className="text-sm text-gray-700 font-medium block">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                <User className="h-4 w-4" />
              </span>
              <input
                ref={usernameRef}
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`w-full border-2 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none ${
                  errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50'
                } hover:border-gray-300`}
                required
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                aria-describedby={errors.username ? "username-error" : undefined}
                aria-invalid={!!errors.username}
              />
            </div>
            {errors.username && (
              <motion.span
                id="username-error"
                className="text-red-600 text-xs flex items-center gap-1 mt-1"
                variants={slideIn}
                initial="hidden"
                animate="visible"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </motion.span>
            )}
          </motion.div>

          {/* Password Input */}
          <motion.div className="space-y-2" custom={3} variants={fadeUp}>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm text-gray-700 font-medium">
                Password
              </label>
              <button
                type="button"
                className="text-xs text-green-600 hover:text-green-800 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
                onClick={() => showNotification('info', 'Password reset functionality would be implemented here')}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full border-2 rounded-xl py-3 pl-12 pr-12 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:ring-4 focus:ring-green-100 focus:border-green-400 focus:outline-none ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50'
                } hover:border-gray-300`}
                required
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <motion.span
                id="password-error"
                className="text-red-600 text-xs flex items-center gap-1 mt-1"
                variants={slideIn}
                initial="hidden"
                animate="visible"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </motion.span>
            )}
          </motion.div>

          {/* Remember Me Checkbox */}
          <motion.div className="flex items-center" custom={4} variants={fadeUp}>
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors duration-200"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
              Remember me for 30 days
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-green-200"
            variants={fadeUp}
            custom={5}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </motion.button>
        </motion.form>

        <motion.div className="mt-8 text-center text-sm" variants={fadeUp} custom={6}>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              className="font-semibold text-green-600 hover:text-green-800 transition-colors duration-200 hover:underline focus:outline-none focus:underline"
               onClick={() => {
        showNotification("info", "Redirecting to signup page...");
        navigate("/register");
      }}
      >
              Create Account
            </button>
          </p>
        </motion.div>

        <motion.div className="mt-6 text-center text-xs text-gray-500 leading-relaxed" variants={fadeUp} custom={7}>
          By signing in, you agree to our{" "}
          <button
            className="text-green-600 hover:text-green-800 underline transition-colors duration-200 focus:outline-none"
            onClick={() => showNotification('info', 'Terms of Service would click here')}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            className="text-green-600 hover:text-green-800 underline transition-colors duration-200 focus:outline-none"
            onClick={() => showNotification('info', 'Privacy Policy would open here')}
          >
            Privacy Policy
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;