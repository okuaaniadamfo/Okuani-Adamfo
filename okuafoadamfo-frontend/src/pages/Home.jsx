import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import image1 from "../assets/early detection.jpg";
import image2 from "../assets/translate.jpg";
import image3 from "../assets/happyfarmer.jpg";
import image4 from "../assets/crop.jpg";

// Example SVG farm icons — replace or adjust these as needed
const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-14 w-14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c.132 1.033.1 2.07-.098 3.1a7.34 7.34 0 01-1.99 3.936 7.32 7.32 0 01-3.936 1.99C6.07 11.9 5.033 11.868 4 11.736"
    />
  </svg>
);

const TractorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10h4l3 3v4h4l3-3v-4h-4l-3-3H3z"
    />
  </svg>
);

const CropIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.5} />
    <path d="M12 4v8l6 2" stroke="currentColor" strokeWidth={1.5} />
  </svg>
);

const BarnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
    />
  </svg>
);

const heroItems = [
  {
    image: image4,
    title: "Welcome to Okuani Adamfo",
    description:
      "Empowering farmers and researchers with AI-powered plant disease detection and multilingual image translation.",
    primaryLink: { to: "/predict", label: "Predict Disease" },
    secondaryLink: { to: "/translate", label: "Translate Image" },
  },
  {
    image: image2,
    title: "Multilingual Image Translation",
    description:
      "Break down language barriers with our powerful image-to-text translation tools.",
    primaryLink: { to: "/translate", label: "Translate Image" },
    secondaryLink: { to: "/predict", label: "Predict Disease" },
  },
  {
    image: image3,
    title: "Empowering Farmers",
    description:
      "Equip farmers with the tools to protect crops and increase yields sustainably.",
    primaryLink: { to: "/about", label: "Learn More" },
    secondaryLink: { to: "/register", label: "Create Account" },
  },
];

// Animation variant for floating icons
const floatingIconVariants = {
  float: {
    y: [0, -20, 0], // float up and down
    transition: {
      yoyo: Infinity,
      duration: 6,
      ease: "easeInOut",
    },
  },
};

const Home = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = heroItems[current];

  return (
    <div className="bg-cream text-green-900 font-sans relative min-h-screen overflow-hidden">
      {/* Floating farm icons background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-10 left-10 text-green-500 drop-shadow-lg"
          variants={floatingIconVariants}
          animate="float"
          transition={{ duration: 6, repeat: Infinity, repeatType: "loop" }}
        >
          <LeafIcon />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-20 text-green-600 drop-shadow-lg"
          variants={floatingIconVariants}
          animate="float"
          transition={{ duration: 8, repeat: Infinity, repeatType: "loop" }}
        >
          <TractorIcon />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 text-green-700 drop-shadow-lg"
          variants={floatingIconVariants}
          animate="float"
          transition={{ duration: 7, repeat: Infinity, repeatType: "loop" }}
        >
          <CropIcon />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 text-green-800 drop-shadow-lg"
          variants={floatingIconVariants}
          animate="float"
          transition={{ duration: 9, repeat: Infinity, repeatType: "loop" }}
        >
          <BarnIcon />
        </motion.div>
      </div>

      {/* Hero Section with auto-changing content */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 py-20 bg-gradient-to-b from-green-50 to-green-100 z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12 relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              className="space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <div className="mb-4">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-700"
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
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-tight">
                {currentItem.title}
              </h1>
              <p className="text-lg text-gray-700">{currentItem.description}</p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={currentItem.primaryLink.to}
                  className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
                >
                  {currentItem.primaryLink.label}
                </Link>
                <Link
                  to={currentItem.secondaryLink.to}
                  className="px-6 py-3 bg-white border border-green-300 text-green-800 rounded-full font-semibold hover:bg-green-100 transition"
                >
                  {currentItem.secondaryLink.label}
                </Link>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <span>New here?</span>{" "}
                <Link
                  to="/register"
                  className="text-green-700 font-medium hover:underline"
                >
                  Create an account
                </Link>{" "}
                or{" "}
                <Link
                  to="/login"
                  className="text-green-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative w-full rounded-3xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current}
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full rounded-3xl object-cover"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Slanted divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className="relative block w-[calc(100%+1.3px)] h-[100px]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 100"
          >
            <path d="M1200 0L0 100L0 0H1200Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Why Section */}
      <section className="relative py-20 bg-white z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center text-green-800 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Okuani Adamfo Matters
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Early Disease Detection",
                desc: "Detect plant diseases early using AI-powered diagnostics and image recognition.",
                img: image1,
              },
              {
                title: "Multilingual Access",
                desc: "Break down language barriers with localized image-to-text translation.",
                img: image2,
              },
              {
                title: "Empowering Farmers",
                desc: "Equip farmers with the tools to protect crops and increase yields sustainably.",
                img: image3,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-green-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
