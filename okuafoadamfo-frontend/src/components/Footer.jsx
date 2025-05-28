import React, { useEffect, useRef } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaArrowUp,
} from "react-icons/fa";
import { motion, useInView } from "framer-motion";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <footer className="bg-gradient-to-b from-green-800 to-black text-white pt-16 pb-10 relative">
      {/* Wavy Top Border */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C200,120 400,0 600,120 C800,0 1000,120 1200,0 L1200,120 L0,120 Z"
            className="fill-green-800"
          ></path>
        </svg>
      </div>

      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8"
        ref={ref}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "About Akuafo Adamfo",
              content: (
                <p className="text-sm sm:text-base text-gray-300">
                  Akuafo Adamfo leverages AI to help farmers detect plant
                  diseases early and accurately. We also offer image
                  translation for multilingual support.
                </p>
              ),
            },
            {
              title: "Quick Links",
              content: (
                <ul className="space-y-2 text-sm sm:text-base">
                  {["/", "/predict", "/translate", "/about", "/contact"].map(
                    (path, i) => (
                      <li key={i}>
                        <a
                          href={path}
                          className="text-gray-300 hover:text-white transition-all transform hover:translate-x-1"
                        >
                          {path === "/"
                            ? "Home"
                            : path.replace("/", "").replace(/^\w/, (c) => c.toUpperCase())}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              ),
            },
            {
              title: "Contact",
              content: (
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center space-x-2">
                    <FaEnvelope />
                    <a
                      href="mailto:support@cropguard.com"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      support@cropguard.com
                    </a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FaPhone />
                    <a
                      href="tel:+233123456789"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      +233 123 456 789
                    </a>
                  </li>
                </ul>
              ),
            },
            {
              title: "Stay Updated",
              content: (
                <form className="flex flex-col space-y-3 sm:space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="p-2 rounded-lg bg-green-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="bg-white text-green-900 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition-all transform hover:scale-105"
                  >
                    Subscribe
                  </button>
                </form>
              ),
            },
          ].map((section, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={sectionVariants}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4">
                {section.title}
              </h3>
              {section.content}
            </motion.div>
          ))}
        </div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-6 mt-10"
        >
          {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="text-white hover:text-green-300 transition-all transform hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]"
              aria-label="social"
            >
              <Icon size={24} />
            </a>
          ))}
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
        >
          <button
            onClick={scrollToTop}
            className="bg-white text-green-900 p-3 rounded-full shadow-lg hover:bg-green-200 transition-all hover:scale-110 animate-pulse"
            aria-label="Back to top"
          >
            <FaArrowUp size={20} />
          </button>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 border-t border-green-700 pt-6 text-sm sm:text-base text-gray-300"
        >
          © {new Date().getFullYear()} Akuafo Adamfo. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
