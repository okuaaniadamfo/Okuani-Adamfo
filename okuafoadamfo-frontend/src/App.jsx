import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from 'react';
import { testConnection } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Error from "./components/Error";
import About from "./pages/About";
// Remove this line:
// import PredictDisease from "./pages/PredictDisease.jsx";

// Change to this (without .jsx extension):
import PredictDisease from "./pages/PredictDisease";

const App = () => {
  // Add the useEffect hook here
  useEffect(() => {
    const testBackend = async () => {
      try {
        const result = await testConnection();
        console.log('Backend response:', result);
      } catch (error) {
        console.error('Failed to connect to backend:', error);
      }
    };
    testBackend();
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<PredictDisease />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
