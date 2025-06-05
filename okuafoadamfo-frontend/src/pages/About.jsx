import React, { useState, useEffect } from "react";
import { 
  Leaf, Eye, Globe, Users, Award, TrendingUp, 
  CheckCircle, ArrowRight, Play, Zap, Shield, 
  Brain, Camera, MessageSquare, BarChart3,
  Star, Quote, ChevronLeft, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import dan from "../assets/dan.jpeg"; 

// Mock images - in real app these would be imported from assets
const cropImage = "🌾";
const plantImage = "🌱";
const farmerImage = "👨🏿‍🌾";
const expertImage = "👩🏿‍🔬";

const STATS = [
  { number: "50K+", label: "Farmers Helped", icon: <Users className="w-6 h-6" /> },
  { number: "98%", label: "Accuracy Rate", icon: <Award className="w-6 h-6" /> },
  { number: "25+", label: "Crop Types", icon: <Leaf className="w-6 h-6" /> },
  { number: "12", label: "Languages", icon: <Globe className="w-6 h-6" /> }
];

const FEATURES = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Detection",
    description: "Advanced machine learning algorithms trained on thousands of plant disease images for accurate diagnosis.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Instant Analysis",
    description: "Upload a photo and get results in seconds. No waiting, no delays - just immediate actionable insights.",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Multilingual Support",
    description: "Access information in your local language with our built-in translation feature supporting 12+ languages.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Expert Community",
    description: "Connect with agricultural experts and fellow farmers for additional support and knowledge sharing.",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Crop Analytics",
    description: "Track your crop health over time with detailed analytics and personalized recommendations.",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Prevention Focus",
    description: "Early detection means better prevention. Stop diseases before they spread and save your harvest.",
    color: "bg-red-50 text-red-600"
  }
];

const TESTIMONIALS = [
  {
    name: "Kwame Asante",
    role: "Cocoa Farmer, Ashanti Region",
    avatar: farmerImage,
    quote: "Okuani Adamfo saved my entire cocoa plantation! The AI detected black pod disease 2 weeks before I noticed any symptoms. This platform is a game-changer for farmers like me.",
    rating: 5
  },
  {
    name: "Dr. Ama Boateng",
    role: "Agricultural Extension Officer",
    avatar: expertImage,
    quote: "As an extension officer, I recommend Okuani Adamfo to all farmers in my district. The accuracy is impressive and the multilingual feature helps me reach more farmers effectively.",
    rating: 5
  },
  {
    name: "Yaa Mensah",
    role: "Tomato Farmer, Greater Accra",
    avatar: "👩🏿‍🌾",
    quote: "The community feature is amazing! I not only get AI diagnosis but also advice from experienced farmers. My tomato yield increased by 40% this season.",
    rating: 5
  }
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Capture & Upload",
    description: "Take a clear photo of your crop showing any symptoms or concerns. Our AI works with any smartphone camera.",
    icon: <Camera className="w-6 h-6" />,
    color: "bg-blue-500"
  },
  {
    step: 2,
    title: "AI Analysis",
    description: "Our advanced machine learning model analyzes your image in seconds, scanning for over 100 different plant diseases.",
    icon: <Brain className="w-6 h-6" />,
    color: "bg-green-500"
  },
  {
    step: 3,
    title: "Get Diagnosis",
    description: "Receive detailed results including disease identification, severity level, and confidence score.",
    icon: <Eye className="w-6 h-6" />,
    color: "bg-purple-500"
  },
  {
    step: 4,
    title: "Treatment Plan",
    description: "Get personalized treatment recommendations including organic and chemical options with application guides.",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "bg-orange-500"
  },
  {
    step: 5,
    title: "Track Progress",
    description: "Monitor your crop's recovery and get follow-up recommendations to prevent future outbreaks.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-indigo-500"
  }
];

const FeatureCard = ({ feature, index }) => (
  <div className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
      {feature.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <ArrowRight className="w-5 h-5 text-green-600" />
    </div>
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 min-w-[350px]">
    <div className="flex items-center gap-1 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <Quote className="w-8 h-8 text-green-200 mb-4" />
    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
      "{testimonial.quote}"
    </p>
    <div className="flex items-center gap-4">
      <span className="text-4xl">{testimonial.avatar}</span>
      <div>
        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
      </div>
    </div>
  </div>
);

const ProcessStep = ({ step, index, total }) => (
  <div className="relative flex flex-col items-center text-center max-w-xs">
    <div className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg`}>
      {step.step}
    </div>
    <div className={`w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 ${step.color.replace('bg-', 'text-')}`}>
      {step.icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
    <p className="text-gray-600 leading-relaxed">{step.description}</p>
    
    {index < total - 1 && (
      <div className="hidden lg:block absolute top-8 left-full w-24 h-0.5 bg-gray-300">
        <ArrowRight className="absolute -top-2 right-0 w-4 h-4 text-gray-400" />
      </div>
    )}
  </div>
);

const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <main className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-3xl mb-8 shadow-2xl">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Okuani <span className="text-green-600">Adamfo</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 font-light mb-8 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing Agriculture with <span className="text-green-600 font-semibold">Artificial Intelligence</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {STATS.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 min-w-[160px]">
                  <div className="text-green-600 mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <button className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 mx-auto">
              <Play className="w-5 h-5" />
              Watch Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Our Mission: <span className="text-green-600">Healthier Crops</span>, Better Harvests
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-green-800">Okuani Adamfo</span> is more than just a plant disease detection platform—it's a comprehensive agricultural ecosystem that empowers farmers with cutting-edge AI technology.
                </p>
                <p>
                  We're bridging the gap between traditional farming wisdom and modern technology, making expert-level plant pathology accessible to every farmer, regardless of their location or resources.
                </p>
                <p>
                  Our vision extends beyond disease detection to create a sustainable future where technology serves agriculture, communities thrive, and food security is guaranteed for all.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Lightning Fast</div>
                  <div className="text-sm text-gray-600">Results in 3 seconds</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">98% Accurate</div>
                  <div className="text-sm text-gray-600">Clinically validated</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="text-8xl text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-12 shadow-2xl">
                {plantImage}
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern <span className="text-green-600">Agriculture</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to protect your crops, maximize yields, and build a sustainable farming operation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-green-600">Okuani Adamfo</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From photo to solution in 5 simple steps. Our AI-powered platform makes plant disease detection accessible to everyone.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStep 
                key={index} 
                step={step} 
                index={index} 
                total={PROCESS_STEPS.length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Trusted by Farmers Across <span className="text-green-200">Ghana</span>
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Real stories from real farmers who've transformed their agricultural practices with Okuani Adamfo.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex justify-center">
              <TestimonialCard testimonial={TESTIMONIALS[currentTestimonial]} />
            </div>
            
            <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                onClick={prevTestimonial}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextTestimonial}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Transform Your <span className="text-green-400">Farming?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of farmers who are already using AI to protect their crops and increase their yields. 
            Start your journey to smarter farming today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/predict">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3">
                <Camera className="w-5 h-5" />
                Start Detection Now
              </button>
            </Link>
            <Link to="/community">
              <button className="border-2 border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3">
                <MessageSquare className="w-5 h-5" />
                Join Community
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;