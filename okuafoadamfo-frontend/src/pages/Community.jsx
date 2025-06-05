// import React, { useState, useRef, useEffect } from "react";
// import { 
//   Mic, Send, Heart, MessageCircle, Share2, MoreVertical, 
//   Search, Bell, Users, Leaf, Camera, Paperclip, Smile,
//   MapPin, Calendar, Award, TrendingUp, BookOpen
// } from "lucide-react";

// const COMMUNITY_MESSAGES = [
//   {
//     id: 1,
//     user: "Dr. Ama Asante",
//     role: "Chief Agronomist",
//     message: "Good morning farmers! 🌅 If your maize leaves are turning yellow from the bottom up, it's likely nitrogen deficiency. Here's what you can do:\n\n• Apply compost or well-rotted manure\n• Use urea fertilizer (46-0-0) at 2 bags per acre\n• Consider foliar feeding with liquid fertilizer\n\nRemember to test your soil pH first! 🧪",
//     time: "08:15",
//     date: "Today",
//     avatar: "🧑🏿‍🌾",
//     likes: 24,
//     replies: 8,
//     location: "Kumasi",
//     images: ["🌽", "📊"],
//     verified: true,
//     isExpert: true
//   },
//   {
//     id: 2,
//     user: "Kwame Osei",
//     role: "Smallholder Farmer",
//     message: "Thank you Dr. Ama! 🙏 What about aphids on my tomatoes? They're multiplying fast and I need an organic solution.",
//     time: "08:22",
//     date: "Today",
//     avatar: "👨🏿‍🌾",
//     likes: 12,
//     replies: 5,
//     location: "Techiman",
//     replyTo: 1
//   },
//   {
//     id: 3,
//     user: "Yaa Mensah",
//     role: "Extension Officer",
//     message: "@Kwame Osei Here are 3 organic solutions that work great:\n\n🌿 Neem oil spray (2 tbsp per liter)\n🧄 Garlic + soap solution\n🐞 Release ladybugs (natural predators)\n\nSpray early morning or evening to avoid burning leaves. Results in 3-5 days!",
//     time: "08:25",
//     date: "Today",
//     avatar: "👩🏿‍🔬",
//     likes: 31,
//     replies: 12,
//     location: "Accra",
//     verified: true,
//     replyTo: 2
//   },
//   {
//     id: 4,
//     user: "Kojo Amponsah",
//     role: "Tech-Savvy Farmer",
//     message: "Has anyone tried the AI plant disease detector? 📱 I used it yesterday and it spotted early blight on my tomatoes before I even noticed! Saved my entire crop 🍅✨",
//     time: "08:30",
//     date: "Today",
//     avatar: "👨🏿‍💻",
//     likes: 18,
//     replies: 6,
//     location: "Cape Coast",
//     trending: true
//   },
//   {
//     id: 5,
//     user: "Akosua Frimpong",
//     role: "Organic Farmer",
//     message: "Good news everyone! 🎉 My intercropping experiment with maize and beans increased yield by 35%! The beans fixed nitrogen for the maize. Will share detailed photos and data soon 📈",
//     time: "08:35",
//     date: "Today",
//     avatar: "👩🏿‍🌾",
//     likes: 42,
//     replies: 15,
//     location: "Tamale",
//     images: ["🌽", "🫘", "📊"],
//     achievement: "Top Contributor"
//   },
//   {
//     id: 6,
//     user: "Farmer Joe",
//     role: "Livestock & Crops",
//     message: "Question: My chickens keep eating my vegetable seedlings 🐔😤 Any creative solutions that don't involve building expensive fencing?",
//     time: "08:40",
//     date: "Today",
//     avatar: "👨🏿‍🌾",
//     likes: 8,
//     replies: 11,
//     location: "Sunyani"
//   }
// ];

// const TRENDING_TOPICS = [
//   { tag: "#DroughtResistant", posts: 45 },
//   { tag: "#OrganicFarming", posts: 78 },
//   { tag: "#PlantDisease", posts: 34 },
//   { tag: "#SoilHealth", posts: 56 },
//   { tag: "#CropRotation", posts: 23 }
// ];

// const ONLINE_EXPERTS = [
//   { name: "Dr. Ama", status: "online", specialty: "Plant Pathology" },
//   { name: "Yaa M.", status: "online", specialty: "Extension" },
//   { name: "Prof. Kwaku", status: "away", specialty: "Soil Science" },
//   { name: "Mary A.", status: "online", specialty: "Livestock" }
// ];

// const MessageBubble = ({ message, isReply }) => {
//   const [showReplies, setShowReplies] = useState(false);
//   const [liked, setLiked] = useState(false);

//   return (
//     <div className={`${isReply ? 'ml-12 mt-2' : 'mt-6'} group`}>
//       <div className="flex items-start gap-3">
//         <div className="relative">
//           <span className="text-3xl">{message.avatar}</span>
//           {message.verified && (
//             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs">✓</span>
//             </div>
//           )}
//         </div>
        
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`font-bold ${message.isExpert ? 'text-green-700' : 'text-gray-900'}`}>
//               {message.user}
//             </span>
//             {message.achievement && (
//               <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
//                 <Award className="w-3 h-3 inline mr-1" />
//                 {message.achievement}
//               </span>
//             )}
//             {message.trending && (
//               <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
//                 <TrendingUp className="w-3 h-3 inline mr-1" />
//                 Trending
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
//             <span>{message.role}</span>
//             <span>•</span>
//             <MapPin className="w-3 h-3" />
//             <span>{message.location}</span>
//             <span>•</span>
//             <span>{message.time}</span>
//           </div>

//           <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 max-w-2xl">
//             <p className="text-gray-800 whitespace-pre-line leading-relaxed">
//               {message.message}
//             </p>
            
//             {message.images && (
//               <div className="flex gap-2 mt-3">
//                 {message.images.map((img, idx) => (
//                   <div key={idx} className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-2xl border border-green-100">
//                     {img}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
//             <button 
//               onClick={() => setLiked(!liked)}
//               className={`flex items-center gap-1 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
//             >
//               <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
//               <span>{message.likes + (liked ? 1 : 0)}</span>
//             </button>
            
//             <button 
//               onClick={() => setShowReplies(!showReplies)}
//               className="flex items-center gap-1 hover:text-blue-500 transition-colors"
//             >
//               <MessageCircle className="w-4 h-4" />
//               <span>{message.replies} replies</span>
//             </button>
            
//             <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
//               <Share2 className="w-4 h-4" />
//               <span>Share</span>
//             </button>
            
//             <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
//               <MoreVertical className="w-4 h-4" />
//             </button>
//           </div>

//           {showReplies && message.replies > 0 && (
//             <div className="mt-4 space-y-3">
//               <div className="text-sm text-blue-600 cursor-pointer hover:underline">
//                 View all {message.replies} replies
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Community = () => {
//   const [message, setMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, []);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       // Here you would typically send the message to your backend
//       console.log("Sending message:", message);
//       setMessage("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
//       <div className="max-w-6xl mx-auto flex">
//         {/* Sidebar */}
//         <div className="w-80 bg-white border-r border-gray-200 hidden lg:block">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
//                 <Leaf className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-gray-900">Agri Community</h2>
//                 <p className="text-sm text-gray-500">1,247 farmers online</p>
//               </div>
//             </div>
            
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search discussions..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
//           </div>

//           <div className="p-6">
//             <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <TrendingUp className="w-4 h-4" />
//               Trending Topics
//             </h3>
//             <div className="space-y-2">
//               {TRENDING_TOPICS.map((topic, idx) => (
//                 <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
//                   <span className="text-blue-600 font-medium">{topic.tag}</span>
//                   <span className="text-xs text-gray-500">{topic.posts} posts</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="p-6 border-t border-gray-200">
//             <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//               <Users className="w-4 h-4" />
//               Online Experts
//             </h3>
//             <div className="space-y-3">
//               {ONLINE_EXPERTS.map((expert, idx) => (
//                 <div key={idx} className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                       <span className="text-sm font-medium text-green-700">
//                         {expert.name.charAt(0)}
//                       </span>
//                     </div>
//                     <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
//                       expert.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
//                     }`}></div>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{expert.name}</p>
//                     <p className="text-xs text-gray-500">{expert.specialty}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Main Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-3">
//                   <span className="text-2xl">🌱</span>
//                   <div>
//                     <h1 className="text-xl font-bold text-gray-900">Agricultural Community</h1>
//                     <p className="text-sm text-gray-500">Share knowledge, solve problems together</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <Bell className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                   <BookOpen className="w-5 h-5 text-gray-600" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-1">
//             {COMMUNITY_MESSAGES.map((msg) => (
//               <MessageBubble key={msg.id} message={msg} />
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="bg-white border-t border-gray-200 p-4">
//             <div className="flex items-end gap-3 max-w-4xl mx-auto">
//               <div className="flex-1 relative">
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Share your farming knowledge or ask a question..."
//                   className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   rows="2"
//                 />
                
//                 <div className="absolute right-2 bottom-2 flex items-center gap-1">
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Paperclip className="w-4 h-4 text-gray-400" />
//                   </button>
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Camera className="w-4 h-4 text-gray-400" />
//                   </button>
//                   <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                     <Smile className="w-4 h-4 text-gray-400" />
//                   </button>
//                 </div>
//               </div>
              
//               <button
//                 onClick={() => setIsRecording(!isRecording)}
//                 className={`p-3 rounded-full transition-all ${
//                   isRecording 
//                     ? 'bg-red-500 text-white animate-pulse' 
//                     : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
//                 }`}
//               >
//                 <Mic className="w-5 h-5" />
//               </button>
              
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!message.trim()}
//                 className={`p-3 rounded-full transition-all ${
//                   message.trim()
//                     ? 'bg-green-600 hover:bg-green-700 text-white'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="mt-3 text-center">
//               <p className="text-sm text-gray-500">
//                 💡 Ask questions, share experiences, and help fellow farmers grow better crops!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Community;




import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, Send, Heart, MessageCircle, Share2, MoreVertical, 
  Search, Bell, Users, Leaf, Camera, Paperclip, Smile,
  MapPin, Calendar, Award, TrendingUp, BookOpen
} from "lucide-react";

const COMMUNITY_MESSAGES = [
  {
    id: 1,
    user: "Dr. Ama Asante",
    role: "Chief Agronomist",
    message: "Good morning farmers! 🌅 If your maize leaves are turning yellow from the bottom up, it's likely nitrogen deficiency. Here's what you can do:\n\n• Apply compost or well-rotted manure\n• Use urea fertilizer (46-0-0) at 2 bags per acre\n• Consider foliar feeding with liquid fertilizer\n\nRemember to test your soil pH first! 🧪",
    time: "08:15",
    date: "Today",
    avatar: "🧑🏿‍🌾",
    likes: 24,
    replies: 8,
    location: "Kumasi",
    images: ["🌽", "📊"],
    verified: true,
    isExpert: true
  },
  {
    id: 2,
    user: "Kwame Osei",
    role: "Smallholder Farmer",
    message: "Thank you Dr. Ama! 🙏 What about aphids on my tomatoes? They're multiplying fast and I need an organic solution.",
    time: "08:22",
    date: "Today",
    avatar: "👨🏿‍🌾",
    likes: 12,
    replies: 5,
    location: "Techiman",
    replyTo: 1
  },
  {
    id: 3,
    user: "Yaa Mensah",
    role: "Extension Officer",
    message: "@Kwame Osei Here are 3 organic solutions that work great:\n\n🌿 Neem oil spray (2 tbsp per liter)\n🧄 Garlic + soap solution\n🐞 Release ladybugs (natural predators)\n\nSpray early morning or evening to avoid burning leaves. Results in 3-5 days!",
    time: "08:25",
    date: "Today",
    avatar: "👩🏿‍🔬",
    likes: 31,
    replies: 12,
    location: "Accra",
    verified: true,
    replyTo: 2
  },
  {
    id: 4,
    user: "Kojo Amponsah",
    role: "Tech-Savvy Farmer",
    message: "Has anyone tried the AI plant disease detector? 📱 I used it yesterday and it spotted early blight on my tomatoes before I even noticed! Saved my entire crop 🍅✨",
    time: "08:30",
    date: "Today",
    avatar: "👨🏿‍💻",
    likes: 18,
    replies: 6,
    location: "Cape Coast",
    trending: true
  },
  {
    id: 5,
    user: "Akosua Frimpong",
    role: "Organic Farmer",
    message: "Good news everyone! 🎉 My intercropping experiment with maize and beans increased yield by 35%! The beans fixed nitrogen for the maize. Will share detailed photos and data soon 📈",
    time: "08:35",
    date: "Today",
    avatar: "👩🏿‍🌾",
    likes: 42,
    replies: 15,
    location: "Tamale",
    images: ["🌽", "🫘", "📊"],
    achievement: "Top Contributor"
  },
  {
    id: 6,
    user: "Farmer Joe",
    role: "Livestock & Crops",
    message: "Question: My chickens keep eating my vegetable seedlings 🐔😤 Any creative solutions that don't involve building expensive fencing?",
    time: "08:40",
    date: "Today",
    avatar: "👨🏿‍🌾",
    likes: 8,
    replies: 11,
    location: "Sunyani"
  }
];

const TRENDING_TOPICS = [
  { tag: "#DroughtResistant", posts: 45 },
  { tag: "#OrganicFarming", posts: 78 },
  { tag: "#PlantDisease", posts: 34 },
  { tag: "#SoilHealth", posts: 56 },
  { tag: "#CropRotation", posts: 23 }
];

const ONLINE_EXPERTS = [
  { name: "Dr. Ama", status: "online", specialty: "Plant Pathology" },
  { name: "Yaa M.", status: "online", specialty: "Extension" },
  { name: "Prof. Kwaku", status: "away", specialty: "Soil Science" },
  { name: "Mary A.", status: "online", specialty: "Livestock" }
];

const MessageBubble = ({ message, isReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className={`${isReply ? 'ml-12 mt-2' : 'mt-6'} group`}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <span className="text-3xl">{message.avatar}</span>
          {message.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold ${message.isExpert ? 'text-green-700' : 'text-gray-900'}`}>
              {message.user}
            </span>
            {message.achievement && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3 inline mr-1" />
                {message.achievement}
              </span>
            )}
            {message.trending && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Trending
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>{message.role}</span>
            <span>•</span>
            <MapPin className="w-3 h-3" />
            <span>{message.location}</span>
            <span>•</span>
            <span>{message.time}</span>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 max-w-2xl">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {message.message}
            </p>
            
            {message.images && (
              <div className="flex gap-2 mt-3">
                {message.images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center text-2xl border border-green-100">
                    {img}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{message.likes + (liked ? 1 : 0)}</span>
            </button>
            
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{message.replies} replies</span>
            </button>
            
            <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {showReplies && message.replies > 0 && (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-blue-600 cursor-pointer hover:underline">
                View all {message.replies} replies
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Community = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 hidden lg:block">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Agri Community</h2>
                <p className="text-sm text-gray-500">1,247 farmers online</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Topics
            </h3>
            <div className="space-y-2">
              {TRENDING_TOPICS.map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-blue-600 font-medium">{topic.tag}</span>
                  <span className="text-xs text-gray-500">{topic.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online Experts
            </h3>
            <div className="space-y-3">
              {ONLINE_EXPERTS.map((expert, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">
                        {expert.name.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      expert.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expert.name}</p>
                    <p className="text-xs text-gray-500">{expert.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Agricultural Community</h1>
                    <p className="text-sm text-gray-500">Share knowledge, solve problems together</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            {COMMUNITY_MESSAGES.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your farming knowledge or ask a question..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                />
                
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Camera className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-3 rounded-full transition-all ${
                  message.trim()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">
                💡 Ask questions, share experiences, and help fellow farmers grow better crops!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
