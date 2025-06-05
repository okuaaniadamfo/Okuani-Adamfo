import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home"; 
import Error from "./components/Error";
import About from "./pages/About";
import PredictDisease from "./pages/Predictdisease";
import Api from "./pages/Api";
import PaymentPrompt from "./pages/PaymentPrompt";
import Community from "./pages/Community";


const App = () => (
  <BrowserRouter>
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow">
        <Routes>
          {/* Redirect root path to login */}
          <Route path="/" element={ <Home />} />

          {/* Move Home to a different route if you want to access it later */}
          <Route path="/home" element={<Home />} />
          
          <Route path="/predict" element={<PredictDisease />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/api" element={<Api />} />
          <Route path="/payment-prompt" element={<PaymentPrompt />} />
          <Route path="/community" element={<Community />} /> 
          {/* Add more routes as needed */}

          <Route path="*" element={<Error />} />

        </Routes>
      </div>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;