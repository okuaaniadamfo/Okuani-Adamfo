import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronRight, Play, Users, TrendingUp, Globe, Leaf, Camera, BookOpen, ArrowRight, Check, Star } from "lucide-react";
import woman1 from "../assets/woman1.jpg";
import dan from "../assets/dan.jpeg";
import language from "../assets/language.jpeg";
import image1 from "../assets/early detection.jpg";
import adjoa from "../assets/adjoa.png";

// Enhanced SVG Icons
const LeafIcon = ({ className = "h-12 w-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.132 1.033.1 2.07-.098 3.1a7.34 7.34 0 01-1.99 3.936 7.32 7.32 0 01-3.936 1.99C6.07 11.9 5.033 11.868 4 11.736" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.88 12.04a7.32 7.32 0 01-1.99-3.936C5.033 11.868 4 11.9 4 11.736" />
  </svg>
);

const TractorIcon = ({ className = "h-12 w-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M5 17h-2v-6l2-2h4l2 4h4l2-2v6h-2" />
  </svg>
);

const SeedIcon = ({ className = "h-12 w-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12l10 10 10-10L12 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l8 8" />
  </svg>
);

const heroItems = [
  {
    image: woman1, // use the imported image variable
    title: "AI-Powered Crop Protection",
    subtitle: "Welcome to Okuani Adamfo",
    description: "Revolutionizing agriculture with intelligent disease detection and multilingual support for farmers worldwide.",
    primaryLink: { to: "/predict", label: "Start Detection", icon: Camera },
    secondaryLink: { to: "/community", label: "Join Community", icon: Users },
    stats: [
      { value: "50+", label: "Farmers Helped" },
      { value: "80%", label: "Model Accuracy Rate" },
      { value: "7", label: "Languages" }
    ]
  },
  {
    image: dan, // use another imported image
    title: "Break Language Barriers",
    subtitle: "Multilingual Translation",
    description: "Advanced image-to-text translation that makes agricultural knowledge accessible in your native language.",
    primaryLink: { to: "/translate", label: "Try Translation", icon: Globe },
    secondaryLink: { to: "/learn", label: "Learn More", icon: BookOpen },
    stats: [
      { value: "7+", label: "Languages" },
      { value: "1M+", label: "Translations" },
      { value: "24/7", label: "Available" }
    ]
  },
  {
    image: adjoa, 
    title: "Sustainable Farming Future",
    subtitle: "Empowering Growth",
    description: "Join thousands of farmers using smart technology to increase yields while protecting the environment.",
    primaryLink: { to: "/login", label: "Get Started", icon: TrendingUp },
    secondaryLink: { to: "/register", label: "Sign Up Free", icon: ArrowRight },
    stats: [
      { value: "40%", label: "Yield Increase" },
      { value: "60%", label: "Less Pesticide" },
      { value: "100+", label: "Countries" }
    ]
  },
];

// Floating background elements
const FloatingElements = () => {
  const icons = [
    { Icon: LeafIcon, delay: 0, duration: 8, x: "10%", y: "20%" },
    { Icon: TractorIcon, delay: 2, duration: 10, x: "80%", y: "15%" },
    { Icon: SeedIcon, delay: 4, duration: 7, x: "15%", y: "70%" },
    { Icon: LeafIcon, delay: 6, duration: 9, x: "85%", y: "75%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, duration, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-green-200/20"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-16 w-16 md:h-20 md:w-20" />
        </motion.div>
      ))}
    </div>
  );
};

// Stats Counter Component
const StatCounter = ({ value, label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const numValue = parseInt(value.replace(/[^0-9]/g, ''));
      if (numValue) {
        const timer = setTimeout(() => {
          let start = 0;
          const increment = numValue / 30;
          const counter = setInterval(() => {
            start += increment;
            if (start >= numValue) {
              setCount(numValue);
              clearInterval(counter);
            } else {
              setCount(Math.floor(start));
            }
          }, 50);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, value, delay]);

  const displayValue = value.includes('%') ? `${count}%` :
                      value.includes('+') ? `${count}+` :
                      value.includes('K') ? `${Math.floor(count/1000)}K+` :
                      value.includes('M') ? `${(count/1000000).toFixed(1)}M+` :
                      count.toString();

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-white">{displayValue}</div>
      <div className="text-sm text-green-100">{label}</div>
    </div>
  );
};

// Enhanced Hero Section
// Replace your existing HeroSection component with this fixed version

const HeroSection = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = heroItems[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700">
      <FloatingElements />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        style={{ y }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
            >
              {/* Brand Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Leaf className="h-4 w-4" />
                {currentItem.subtitle}
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  {currentItem.title}
                </h1>
                <p className="text-xl md:text-2xl text-green-100 leading-relaxed max-w-2xl">
                  {currentItem.description}
                </p>
              </div>

              {/* Action Buttons - FIXED */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="group flex items-center gap-3 px-8 py-4 bg-white text-green-800 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(currentItem.primaryLink.to)}
                >
                  <currentItem.primaryLink.icon className="h-5 w-5" />
                  {currentItem.primaryLink.label}
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-green-800 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigate(currentItem.secondaryLink.to)}
                >
                  <currentItem.secondaryLink.icon className="h-5 w-5" />
                  {currentItem.secondaryLink.label}
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                {currentItem.stats.map((stat, index) => (
                  <StatCounter
                    key={`${current}-${index}`}
                    value={stat.value}
                    label={stat.label}
                    delay={index * 200}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Image */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                transition={{ duration: 1, type: "spring" }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <motion.button
                    className="absolute inset-0 flex items-center justify-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </motion.button>
                </div>

                {/* Floating Elements Around Image */}
                <motion.div
                  className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="h-10 w-10 text-yellow-800" fill="currentColor" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {heroItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current ? 'bg-white w-8' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      title: "AI Disease Detection",
      description: "Advanced machine learning algorithms identify plant diseases with 95% accuracy in seconds.",
      image: image1, // use imported image
      icon: Camera,
      benefits: ["Instant Results", "High Accuracy", "Expert Recommendations"],
      // color: "from-blue-500 to-blue-600"
    },
    {
      title: "Multilingual Support",
      description: "Break down language barriers with real-time translation in 7+ local languages.",
      image: language, 
      icon: Globe,
      benefits: ["7+ Languages", "Real-time Translation", "Cultural Context"],
      // color: "from-purple-500 to-purple-600"
    },
    {
      title: "Farmer Empowerment",
      description: "Comprehensive tools and resources to help farmers increase yields sustainably.",
      image: adjoa, 
      icon: TrendingUp,
      benefits: ["Yield Optimization", "Sustainable Practices", "Expert Support"],
      // color: "from-green-500 to-green-600"
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-green-600">Okuani Adamfo</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cutting-edge technology meets traditional farming wisdom to create the future of agriculture
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -10 }}
            >
              {/* Feature Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${feature.color} opacity-80`} />
                
                {/* Icon Overlay */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors">
                  Learn More
                  <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <button className="group px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition-all duration-300">
            Explore All Features
            <ArrowRight className="inline h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden pt-8">
      {/* Added pt-8 for top padding */}
      <HeroSection />
      <FeaturesSection />
      
      {/* Additional sections can be added here */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-green-900 mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-green-700 mb-8">
              Join thousands of farmers already using Okuani Adamfo to protect their crops and increase yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;