import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Check if we're on the login or register page
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;
  
  // Items that should remain active on auth pages
  const getActiveItemsForAuthPage = () => {
    if (isLoginPage) return ["/login", "/register"];
    if (isRegisterPage) return ["/register", "/login"];
    return [];
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07 },
    }),
  };

  const navigationItems = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Predict Disease" },
    { to: "/about", label: "About" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
    { to: "/api", label: "API" },
  ];

  return (
    <motion.header
      className={`p-4 fixed w-full top-0 z-50 shadow-md transition-all duration-300 ${
        isScrolled
          ? "bg-green-100/80 backdrop-blur-md"
          : "bg-gradient-to-r from-green-200 via-green-50 to-green-100"
      }`}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <motion.span
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-9 w-9 text-green-700"
              viewBox="0 0 32 32"
              fill="none"
            >
              <ellipse cx="16" cy="16" rx="14" ry="14" fill="#34D399" />
              <path
                d="M16 6C10 14 18 18 12 26"
                stroke="#065F46"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 6C22 14 14 18 20 26"
                stroke="#047857"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
          <span>
            <span className="font-extrabold text-2xl text-green-800 tracking-tight">
              Okuani Adamfo
            </span>
            <span className="block text-xs text-green-600 font-medium leading-tight">
              Plant Disease AI & Image Translator
            </span>
          </span>
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden text-green-800 focus:outline-none transition-all duration-300 ${
            isAuthPage ? "blur-sm opacity-50" : ""
          }`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Animated Menu */}
        <AnimatePresence>
          {(isMobileMenuOpen || window.innerWidth >= 768) && (
            <motion.div
              key="mobileMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full md:w-auto mt-4 md:mt-0 overflow-hidden"
            >
              <nav className="flex flex-col md:flex-row gap-2 md:gap-6">
                {navigationItems.map((link, i) => {
                  const isCurrentPage = location.pathname === link.to;
                  const activeItems = getActiveItemsForAuthPage();
                  const isActiveOnAuthPage = activeItems.includes(link.to);
                  // Only blur on auth pages, but always keep login/register links clickable
                  const shouldBlur = false
                    // isAuthPage &&
                    // !isActiveOnAuthPage &&
                    // link.to !== "/login" &&
                    // link.to !== "/register";

                  return (
                    <motion.div
                      key={link.to}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={navItemVariants}
                    >
                      <Link
                        to={link.to}
                        className={`text-green-800 font-medium relative group transition-all duration-300 ${
                          shouldBlur 
                            ? "blur-sm opacity-40 pointer-events-none"
                            : isCurrentPage
                            ? "text-green-600 font-bold"
                            : ""
                        }`}
                      >
                        <span
                          className={`transition-colors ${
                            isCurrentPage
                              ? "text-green-600"
                              : "group-hover:text-green-600"
                          }`}
                        >
                          {link.label}
                        </span>
                        <span
                          className={`absolute left-0 -bottom-1 h-0.5 bg-green-600 transition-all ${
                            isCurrentPage
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/community"
                  className="px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transform hover:scale-105 transition font-semibold text-center transition-all duration-300"
                >
                  Join Our Community
                </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default NavBar;