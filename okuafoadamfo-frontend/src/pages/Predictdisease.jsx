import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function predictdisease() {
  const [image, setImage] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript((prev) => prev + " " + transcript);
      setTextInput((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    } else {
      setImage(null);
    }
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submit prediction request (mock)");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-12 px-4 pt-[90px]">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-green-900 mb-8"
      >
        Predict Crop Disease
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Image Input */}
        <div>
          <label
            htmlFor="imageInput"
            className="block text-green-800 font-semibold mb-2"
          >
            Upload Crop Image
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-green-700 cursor-pointer rounded border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <AnimatePresence>
            {image && (
              <motion.div
                key="image-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="mt-4 flex flex-col items-center"
              >
                <motion.img
                  src={image}
                  alt="Preview"
                  className="rounded-lg max-h-64 object-contain border border-green-300 shadow-md mb-3"
                  layout
                />
                <motion.button
                  type="button"
                  onClick={() => setImage(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-md transition-transform transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove Picture
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Input */}
        <div>
          <label
            htmlFor="textInput"
            className="block text-green-800 font-semibold mb-2"
          >
            Describe Symptoms / Notes
          </label>
          <motion.textarea
            id="textInput"
            rows={4}
            className="w-full border border-green-300 rounded p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Describe any visible symptoms or issues..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>

        {/* Voice Input */}
        <div>
          <label className="block text-green-800 font-semibold mb-2">
            Voice Input (Click to Record)
          </label>
          <div className="flex items-center space-x-4">
            <motion.button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-transform transform ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </motion.button>
            <motion.span
              className={`text-sm font-semibold ${
                isRecording ? "text-red-600" : "text-green-700"
              }`}
              animate={{ opacity: isRecording ? 1 : 0.7, scale: isRecording ? 1.2 : 1 }}
              transition={{ duration: 0.4, yoyo: Infinity }}
            >
              {isRecording ? "Recording..." : "Not recording"}
            </motion.span>
          </div>
          <AnimatePresence>
            {voiceTranscript && (
              <motion.p
                key="transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="mt-2 text-gray-700 italic border border-green-200 rounded p-2 max-h-24 overflow-auto bg-green-50"
              >
                {voiceTranscript}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition-transform transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Predict Disease
        </motion.button>
      </motion.form>
    </div>
  );
}
