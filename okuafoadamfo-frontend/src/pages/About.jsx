import React from "react";
import crop from "../assets/crop.jpg";
import plant from "../assets/plant.jpg";
import { motion } from "framer-motion";

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

const About = () => (
  <main className="bg-gradient-to-b from-green-50 to-green-100 min-h-[80vh] pt-[80px]">
    {/* Decorative Leaf SVG */}
    <div className="flex justify-center pt-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-20 w-20 text-green-400"
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
    </div>

    {/* About Section */}
    <section className="max-w-5xl mx-auto px-4 py-10">
      <motion.h1
        className="text-5xl font-extrabold text-green-900 text-center mb-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        About Okuani Adamfo
      </motion.h1>

      <motion.p
        className="text-green-700 text-xl font-medium text-center mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        Empowering Agriculture with AI
      </motion.p>

      <motion.div
        className="border-b border-green-200 mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
      />

      <motion.p
        className="text-gray-700 text-lg sm:text-xl text-center mb-6"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <span className="font-semibold text-green-800">Okuani Adamfo</span> is
        an innovative platform helping farmers, agronomists, and researchers
        detect plant diseases early using advanced AI.
      </motion.p>

      <motion.p
        className="text-gray-700 text-lg sm:text-xl text-center"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
      >
        Upload images of crops, get instant diagnoses, and use our multilingual
        translation tool to make plant health knowledge universally accessible.
      </motion.p>

      {/* Why Section */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-10 mt-12">
        <motion.div
          className="md:w-1/2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <h2 className="text-3xl font-bold text-green-900 mb-4 text-center md:text-left">
            Why Okuani Adamfo?
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 pl-5">
            <li>Early and accurate plant disease detection</li>
            <li>Multilingual image translation for global reach</li>
            <li>User-friendly interface for all skill levels</li>
            <li>Supports sustainable agriculture and food security</li>
            <li>Community-driven and constantly improving</li>
          </ul>
        </motion.div>
        <motion.div
          className="md:w-1/2 flex justify-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <img
            src={plant}
            alt="AI Detection"
            className="rounded-2xl shadow-xl border border-green-200 w-full max-w-sm"
          />
        </motion.div>
      </div>

      <motion.p
        className="text-gray-700 text-lg sm:text-xl text-center mt-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={7}
      >
        Join us to revolutionize agriculture. Whether you’re a farmer,
        researcher, or enthusiast, we’re here to support your journey to
        healthier crops and a sustainable future.
      </motion.p>
    </section>

    {/* How It Works */}
    <section className="bg-green-100/60 py-16 mt-6">
      <motion.h2
        className="text-4xl font-bold text-green-900 text-center mb-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        How It Works
      </motion.h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto px-4">
        <motion.img
          src={crop}
          alt="Process"
          className="w-full md:w-1/2 rounded-xl shadow border border-green-200"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        />
        <motion.ol
          className="list-decimal list-inside text-gray-800 text-lg space-y-5 bg-white/80 rounded-2xl p-6 shadow-lg w-full md:w-1/2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <li>
            <span className="text-green-800 font-semibold">
              Upload an Image:
            </span>{" "}
            Choose a clear photo of your crop showing symptoms.
          </li>
          <li>
            <span className="text-green-800 font-semibold">AI Analysis:</span>{" "}
            The AI scans for disease signs and patterns.
          </li>
          <li>
            <span className="text-green-800 font-semibold">
              Get Instant Results:
            </span>{" "}
            Receive a diagnosis with treatment advice.
          </li>
          <li>
            <span className="text-green-800 font-semibold">
              Translate Information:
            </span>{" "}
            Instantly view content in your preferred language.
          </li>
          <li>
            <span className="text-green-800 font-semibold">Take Action:</span>{" "}
            Protect your crops and maximize yield.
          </li>
        </motion.ol>
      </div>
    </section>
  </main>
);

export default About;
