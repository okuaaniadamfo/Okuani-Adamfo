import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVoiceFile, uploadImageFile } from "../api/services.js";
import AppleScab1 from "../assets/AppleScab1.JPG";
import TomatoEarlyBlight1 from "../assets/TomatoEarlyBlight1.JPG";
import CornCommonRust1 from "../assets/CornCommonRust1.JPG";


const SAMPLE_IMAGES = [
  { url: AppleScab1, label: "Apple Leaf" },
  { url: TomatoEarlyBlight1, label: "Tomato Leaf" },
  { url: CornCommonRust1, label: "Corn Leaf" }
];

export default function PredictDisease() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("tw");
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [solutionAudioBase64, setSolutionAudioBase64] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [translationError, setTranslationError] = useState(null); // Renamed to avoid conflict with `error`

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const languagesWithSpeakers = ["tw", "ee", "ki"];

  // Fetch supported languages from your API
  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await fetch("https://okuani-adamfo-api.onrender.com/upload/languages");
        const data = await res.json();
        if (data.supportedLanguages) {
          setSupportedLanguages(data.supportedLanguages);
          if (data.defaultLanguage) {
            setSelectedLanguage(data.defaultLanguage);
          }
        }
      } catch (err) {
        console.error("Failed to fetch supported languages:", err);
        setError("Failed to load supported languages."); // Added error handling for UI
      }
    }
    fetchLanguages();
  }, []);

  // Fetch speakers for selected language from your API
  useEffect(() => {
    async function fetchSpeakers() {
      if (!languagesWithSpeakers.includes(selectedLanguage)) {
        setAvailableSpeakers([]);
        setSelectedSpeaker("");
        return;
      }

      try {
        const res = await fetch(
          `https://okuani-adamfo-api.onrender.com/output/speakers/${selectedLanguage}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setAvailableSpeakers(data.availableSpeakers || []);
        setSelectedSpeaker(data.defaultSpeaker || "");
      } catch (err) {
        console.error("Failed to fetch speakers:", err);
        setAvailableSpeakers([]);
        setSelectedSpeaker("");
        setError("Failed to load speakers for this language."); // Added error handling for UI
      }
    }
    fetchSpeakers();
  }, [selectedLanguage]);

  // Setup SpeechRecognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Speech Recognition API is not supported in this browser."); // Changed alert to setError
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage;
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
      setError("Speech recognition error: " + event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, [selectedLanguage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      setDiagnosis(null); // Clear previous diagnosis when a new image is selected
      setTranslatedText(''); // Clear previous translation
      setSolutionAudioBase64(null); // Clear previous audio
      setError(""); // Clear any previous errors
    } else {
      setImage(null);
      setImageFile(null);
    }
  };

  const handleSampleImageSelect = async (imgUrl) => {
    setIsLoading(true);
    setError("");
    setDiagnosis(null);
    setTranslatedText('');
    setSolutionAudioBase64(null);
    setImage(imgUrl); // Display the selected sample image

    try {
      // Fetch the image as a blob and create a File object for prediction
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], `sample_image_${Date.now()}.jpg`, { type: blob.type });
      setImageFile(file);
      // Automatically submit after selecting sample image for demonstration
      // await handleSubmit(new Event('submit')); // This would trigger prediction right away
    } catch (err) {
      console.error("Failed to load sample image:", err);
      setError("Failed to load sample image. Please try another or upload your own.");
      setImage(null);
      setImageFile(null);
    } finally {
      setIsLoading(false);
    }
  };


  const startRecording = async () => {
    setError(""); // Clear previous errors
    setVoiceTranscript(""); // Clear previous transcript
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });

        try {
          setIsLoading(true);
          const result = await uploadVoiceFile(audioFile);
          if (result.transcription) {
            setVoiceTranscript(result.transcription);
            setTextInput((prev) => prev + " " + result.transcription);
          }
        } catch (error) {
          console.error("Error uploading voice:", error);
          setError("Failed to process voice input.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      if (recognitionRef.current && !isRecording) {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording. Please ensure microphone access is granted.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDiagnosis(null);
    setSolutionAudioBase64(null); // clear old audio
    setTranslatedText(''); // clear old translation
    setTranslationError(null);

    if (!imageFile && !textInput.trim()) {
      setError("Please upload an image or provide a symptom description.");
      setIsLoading(false);
      return;
    }

    try {
      let imageResult = null;
      if (imageFile) {
        imageResult = await uploadImageFile(imageFile);
        if (imageResult) {
          setDiagnosis(imageResult);
        } else {
          setError("No prediction data returned from image analysis. The image might not be clear enough or depict a recognized disease.");
        }
      }
      // You can extend this logic to also send textInput for prediction if your backend supports it
      // For now, assuming image is primary for prediction.
    } catch (error) {
      console.error("Prediction error:", error);
      setError("Failed to get prediction. Please try again or try a different image/description.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = () => {
    if (!diagnosis?.prediction?.raw_response) return;

    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const { predicted_class, confidence, description, solutions } = diagnosis.prediction.raw_response;
    const fullText = `
      The predicted disease is ${predicted_class}.
      Confidence level: ${(confidence * 100).toFixed(2)} percent.
      Description: ${description}.
      Recommended solutions: ${solutions.join(". ")}.
    `;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage;
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setError("Failed to read aloud. Your browser might not support this language or feature.");
      setIsSpeaking(false);
    };

    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const generateSolutionAudio = async () => {
    if (!diagnosis?.prediction?.raw_response?.solutions?.length) {
      setError("No solutions to convert to audio.");
      return;
    }

    if (!selectedSpeaker) {
      setError("Please select a speaker.");
      return;
    }

    setError("");
    setIsAudioLoading(true);
    setSolutionAudioBase64(null);

    const solutionsArray = diagnosis.prediction.raw_response.solutions;
    const combinedSolutionsText = solutionsArray.join(". ") + ".";

    const requestBody = {
      text: combinedSolutionsText,
      language: selectedLanguage,
      speaker_id: selectedSpeaker,
    };

    console.log("Sending request to TTS API:", requestBody);

    try {
      const res = await fetch("https://okuani-adamfo-api.onrender.com/upload/localizelanguage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error response:", errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.audio) {
        setSolutionAudioBase64(data.audio);
      } else {
        setError("Failed to generate audio from solutions.");
      }
    } catch (err) {
      console.error("Error generating solution audio:", err);
      setError("Error generating solution audio. Please try again or select a different speaker.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!diagnosis?.prediction?.raw_response?.solutions?.length) {
      setTranslationError("No solutions to translate.");
      return;
    }

    const requestData = {
      text: diagnosis.prediction.raw_response.solutions.join("\n"),
      targetLanguage: selectedLanguage
    };

    console.log('Sending translation request with:', requestData);
    setTranslationError(null);
    setTranslatedText(''); // Clear previous translation before new one

    try {
      const response = await fetch('https://okuani-adamfo-api.onrender.com/upload/translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Unexpected error with status ${response.status}`);
        }
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      console.log('Translated Text:', data.translatedText);

      setTranslatedText(data.translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError(err.message);
      setTranslatedText('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-12 pt-25">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-4xl"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent mb-4">
          🌱 Crop Disease Predictor
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Upload an image of your crop or describe symptoms to get instant disease diagnosis and treatment recommendations
        </p>
      </motion.div>


      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 max-w-xl w-full text-center"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-7 border border-green-200"
      >
        {/* Language Selection */}
        <div>
          <label htmlFor="languageSelect" className="font-semibold block mb-2 text-gray-700 text-lg">
            Select Language
          </label>
          <div className="relative">
            <select
              id="languageSelect"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block appearance-none w-full bg-gray-50 border border-gray-300 text-gray-800 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-green-500 transition duration-200"
            >
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Speaker Selection (conditional) */}
        <AnimatePresence>
          {availableSpeakers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="speakerSelect" className="font-semibold block mb-2 text-gray-700 text-lg">
                Select Speaker
              </label>
              <div className="relative">
                <select
                  id="speakerSelect"
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="block appearance-none w-full bg-gray-50 border border-gray-300 text-gray-800 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-green-500 transition duration-200"
                >
                  {availableSpeakers.map((spk) => (
                    <option key={spk} value={spk}>
                      {spk}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sample Images Section */}
        <div>
          <label className="font-semibold block mb-3 text-gray-700 text-lg">Or, try with a sample image:</label>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-2 px-2 custom-scrollbar"> {/* Added custom-scrollbar for better aesthetics */}
            {SAMPLE_IMAGES.map((img, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center p-2 rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-200 ease-in-out bg-white shadow-md cursor-pointer"
                onClick={() => handleSampleImageSelect(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-24 h-24 object-cover rounded-md border border-gray-100 mb-1"
                />
                <span className="text-xs font-medium text-gray-700 text-center">{img.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="font-semibold block mb-2 text-gray-700 text-lg">Upload Your Crop Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-green-50 file:text-green-700
                       hover:file:bg-green-100 cursor-pointer
                       border border-gray-300 rounded-lg p-2"
          />
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex justify-center items-center bg-gray-100 rounded-lg p-3 shadow-inner"
              >
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-52 object-contain rounded-md border border-gray-200"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Input */}
        <div>
          <label htmlFor="symptomDescription" className="font-semibold block mb-2 text-gray-700 text-lg">Symptom Description:</label>
          <textarea
            id="symptomDescription"
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 text-gray-800 placeholder-gray-400"
            rows={4}
            placeholder="e.g., 'Leaves have yellow spots and are wilting.'"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>

        {/* Voice Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center justify-center px-5 py-2.5 rounded-full text-white font-medium shadow-md transition-all duration-300 ease-in-out
              ${isRecording
                ? "bg-red-600 hover:bg-red-700 transform active:scale-95"
                : "bg-green-600 hover:bg-green-700 transform active:scale-95"
              }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              <>
                <motion.span
                  className="w-3 h-3 bg-white rounded-full mr-2"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                Stop Recording
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10.707 1.293a1 1 0 00-1.414 0l-5 5a1 1 0 001.414 1.414L10 8.414l4.293 4.293a1 1 0 001.414-1.414l-5-5z" clipRule="evenodd" fillRule="evenodd"></path>
                </svg>
                Start Recording
              </>
            )}
          </button>
          <div className="italic text-gray-600 break-words max-w-full text-sm sm:text-base">
            <span className="font-semibold text-gray-700">Voice transcript:</span>{" "}
            {voiceTranscript || <span className="text-gray-400">No voice input yet.</span>}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || (!imageFile && !textInput.trim())}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors duration-200 text-lg shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </>
            ) : (
              "Predict Disease"
            )}
          </motion.button>
        </div>
      </form>

      {/* Diagnosis Results */}
      <AnimatePresence>
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl w-full mt-10 bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-green-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-green-800 border-b pb-2 border-green-200">Prediction Result</h2>
            <div className="space-y-3 text-gray-700 text-lg">
              <p>
                <strong>Disease:</strong> <span className="font-medium text-green-700">{diagnosis.prediction.raw_response.predicted_class}</span>
              </p>
              <p>
                <strong>Confidence:</strong> <span className="font-medium text-green-700">{diagnosis.prediction.raw_response.confidence}</span>
              </p>
              <p>
                <strong>Description:</strong> {diagnosis.prediction.raw_response.description}
              </p>
              <div>
                <strong>Solutions:</strong>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  {diagnosis.prediction.raw_response.solutions.map((sol, i) => (
                    <li key={i}>{sol}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReadAloud}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 text-base font-medium"
              >
                {isSpeaking ? "Stop Reading" : "Read Aloud"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTranslate}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 text-base font-medium"
              >
                Translate Solutions
              </motion.button>
            </div>
            <div className="mt-6 flex justify-center">  
               {languagesWithSpeakers.includes(selectedLanguage) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateSolutionAudio}
                  disabled={isAudioLoading}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 text-base font-medium
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAudioLoading ? "Generating Audio..." : "Generate Solution Audio"}
                </motion.button>
              )}
            </div>

             
            

            <AnimatePresence>
              {solutionAudioBase64 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 border-t border-gray-200 pt-4"
                >
                  <h3 className="font-semibold text-gray-700 mb-2">Solution Audio:</h3>
                  <audio
                    controls
                    className="w-full rounded-lg shadow-sm"
                    src={`data:audio/wav;base64,${solutionAudioBase64}`}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 border-t border-gray-200 pt-4"
                >
                  <h3 className="font-semibold text-gray-700 mb-2">Translated Solutions:</h3>
                  <p className="text-gray-800 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {translatedText}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {translationError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center"
                  role="alert"
                >
                  <strong className="font-bold">Translation Error:</strong>
                  <span className="block sm:inline ml-2">{translationError}</span>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { uploadVoiceFile, uploadImageFile } from "../api/services.js";
// import AppleScab1 from "../assets/AppleScab1.JPG";
// import TomatoEarlyBlight1 from "../assets/TomatoEarlyBlight1.JPG";
// import CornCommonRust1 from "../assets/CornCommonRust1.JPG";


// const SAMPLE_IMAGES = [
//   { url: AppleScab1, label: "Apple Scab" },
//   { url: TomatoEarlyBlight1, label: "Tomato Early Blight" },
//   { url: CornCommonRust1, label: "Corn Common Rust" }
// ];

// export default function PredictDisease() {
//   const [image, setImage] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [textInput, setTextInput] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [voiceTranscript, setVoiceTranscript] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [diagnosis, setDiagnosis] = useState(null);
//   const [error, setError] = useState("");
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [supportedLanguages, setSupportedLanguages] = useState({});
//   const [selectedLanguage, setSelectedLanguage] = useState("tw");
//   const [availableSpeakers, setAvailableSpeakers] = useState([]);
//   const [selectedSpeaker, setSelectedSpeaker] = useState("");
//   const [solutionAudioBase64, setSolutionAudioBase64] = useState(null);
//   const [isAudioLoading, setIsAudioLoading] = useState(false);
//   const [translatedText, setTranslatedText] = useState('');
//   const [errorr, setErrorr] = useState(null);

//   const recognitionRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const speechSynthesisRef = useRef(window.speechSynthesis);

//   const languagesWithSpeakers = ["tw", "ee", "ki"];

//   // Fetch supported languages from your API
//   useEffect(() => {
//     async function fetchLanguages() {
//       try {
//         const res = await fetch("https://okuani-adamfo-api.onrender.com/upload/languages");
//         const data = await res.json();
//         if (data.supportedLanguages) {
//           setSupportedLanguages(data.supportedLanguages);
//           if (data.defaultLanguage) {
//             setSelectedLanguage(data.defaultLanguage);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch supported languages:", err);
//       }
//     }
//     fetchLanguages();
//   }, []);

//   // Fetch speakers for selected language from your API
//   useEffect(() => {
//     async function fetchSpeakers() {
//       if (!languagesWithSpeakers.includes(selectedLanguage)) {
//         setAvailableSpeakers([]);
//         setSelectedSpeaker("");
//         return;
//       }

//       try {
//         const res = await fetch(
//           `https://okuani-adamfo-api.onrender.com/output/speakers/${selectedLanguage}`
//         );
//         if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//         const data = await res.json();
//         setAvailableSpeakers(data.availableSpeakers || []);
//         setSelectedSpeaker(data.defaultSpeaker || "");
//       } catch (err) {
//         console.error("Failed to fetch speakers:", err);
//         setAvailableSpeakers([]);
//         setSelectedSpeaker("");
//       }
//     }
//     fetchSpeakers();
//   }, [selectedLanguage]);

//   // Setup SpeechRecognition
//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
//       alert("Speech Recognition API is not supported in this browser.");
//       return;
//     }
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage;
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognitionRef.current = recognition;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setVoiceTranscript((prev) => prev + " " + transcript);
//       setTextInput((prev) => prev + " " + transcript);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setIsRecording(false);
//       setError("Speech recognition error: " + event.error);
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//     };
//   }, [selectedLanguage]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       setImageFile(file);
//     } else {
//       setImage(null);
//       setImageFile(null);
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//         const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });

//         try {
//           setIsLoading(true);
//           const result = await uploadVoiceFile(audioFile);
//           if (result.transcription) {
//             setVoiceTranscript(result.transcription);
//             setTextInput((prev) => prev + " " + result.transcription);
//           }
//         } catch (error) {
//           console.error("Error uploading voice:", error);
//           setError("Failed to process voice input");
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       mediaRecorder.start();
//       if (recognitionRef.current && !isRecording) {
//         recognitionRef.current.start();
//         setIsRecording(true);
//       }
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       setError("Failed to start recording");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
//       mediaRecorderRef.current.stop();
//       mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
//     }

//     if (recognitionRef.current && isRecording) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setDiagnosis(null);
//     setSolutionAudioBase64(null); // clear old audio

//     try {
//       let imageResult = null;
//       if (imageFile) {
//         imageResult = await uploadImageFile(imageFile);
//         if (imageResult) {
//           setDiagnosis(imageResult);
//         } else {
//           setError("No prediction data returned.");
//         }
//       }
//     } catch (error) {
//       console.error("Prediction error:", error);
//       setError("Failed to get prediction. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReadAloud = () => {
//     if (!diagnosis?.prediction?.raw_response) return;

//     if (isSpeaking) {
//       speechSynthesisRef.current.cancel();
//       setIsSpeaking(false);
//       return;
//     }

//     const { predicted_class, confidence, description, solutions } = diagnosis.prediction.raw_response;
//     const fullText = `
//       The predicted disease is ${predicted_class}.
//       Confidence level: ${confidence}.
//       Description: ${description}.
//       Recommended solutions: ${solutions.join(". ")}.
//     `;

//     const utterance = new SpeechSynthesisUtterance(fullText);
//     utterance.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage;
//     utterance.rate = 1;
//     utterance.onend = () => setIsSpeaking(false);

//     speechSynthesisRef.current.speak(utterance);
//     setIsSpeaking(true);
//   };

//   const generateSolutionAudio = async () => {
//     if (!diagnosis?.prediction?.raw_response?.solutions?.length) {
//       setError("No solutions to convert to audio.");
//       return;
//     }

//     if (!selectedSpeaker) {
//       setError("Please select a speaker.");
//       return;
//     }

//     setError("");
//     setIsAudioLoading(true);
//     setSolutionAudioBase64(null);

//     const solutionsArray = diagnosis.prediction.raw_response.solutions;
//     const combinedSolutionsText = solutionsArray.join(". ") + ".";

//     const requestBody = {
//       text: combinedSolutionsText,
//       language: selectedLanguage,
//       speaker_id: selectedSpeaker,
//     };

//     console.log("Sending request to TTS API:", requestBody);

//     try {
//       const res = await fetch("https://okuani-adamfo-api.onrender.com/upload/localizelanguage", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.error("API error response:", errorText);
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success && data.audio) {
//         setSolutionAudioBase64(data.audio);
//       } else {
//         setError("Failed to generate audio from solutions.");
//       }
//     } catch (err) {
//       console.error("Error generating solution audio:", err);
//       setError("Error generating solution audio.");
//     } finally {
//       setIsAudioLoading(false);
//     }
//   };

//   const handleTranslate = async () => {
//     const requestData = {
//       text: diagnosis.prediction.raw_response.solutions.join("\n"),
//       targetLanguage: selectedLanguage
//     };

//     console.log('Sending request with:', requestData);

//     try {
//       const response = await fetch('https://okuani-adamfo-api.onrender.com/upload/translate-text', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       console.log('Raw response:', response);

//       if (!response.ok) {
//         let errorData;
//         try {
//           errorData = await response.json();
//         } catch {
//           throw new Error(`Unexpected error with status ${response.status}`);
//         }
//         throw new Error(errorData.error || 'Translation failed');
//       }

//       const data = await response.json();
//       console.log('Translated Text:', data.translatedText);

//       setTranslatedText(data.translatedText);
//       setErrorr(null);
//     } catch (err) {
//       console.error('Translation error:', err);
//       setError(err.message);
//       setTranslatedText('');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-green-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-12 pt-[90px]">
//   <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-6 text-center max-w-xl">
//     Predict Crop Disease
//   </motion.h1>

//   {error && (
//     <div className="text-red-600 mb-4 text-center max-w-xl px-2">{error}</div>
//   )}
//   <form
//     onSubmit={handleSubmit}
//     className="max-w-xl w-full bg-white rounded-xl shadow-lg p-5 sm:p-8 space-y-6"
//   >
//     {/* Language Select */}
//     <div>
//       <label htmlFor="languageSelect" className="font-semibold block mb-1">
//         Select Language:
//       </label>
//       <select
//         id="languageSelect"
//         value={selectedLanguage}
//         onChange={(e) => setSelectedLanguage(e.target.value)}
//         className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//       >
//         {Object.entries(supportedLanguages).map(([code, name]) => (
//           <option key={code} value={code}>
//             {name}
//           </option>
//         ))}
//       </select>
//     </div>

//     {/* Speaker Select */}
//     {availableSpeakers.length > 0 && (
//       <div>
//         <label htmlFor="speakerSelect" className="font-semibold block mb-1">
//           Select Speaker:
//         </label>
//         <select
//           id="speakerSelect"
//           value={selectedSpeaker}
//           onChange={(e) => setSelectedSpeaker(e.target.value)}
//           className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
//         >
//           {availableSpeakers.map((spk) => (
//             <option key={spk} value={spk}>
//               {spk}
//             </option>
//           ))}
//         </select>
//       </div>
//     )}
//     {/* Sample Images */}
//     <div className="mb-4">
//       <div className="mb-2 font-semibold text-gray-800">Try with a sample image:</div>
//       <div className="flex gap-4 overflow-x-auto pb-2">
//         {SAMPLE_IMAGES.map((img, idx) => (
//           <button
//             key={idx}
//             type="button"
//             className="focus:outline-none border-2 border-transparent hover:border-green-500 rounded-lg transition-shadow shadow hover:shadow-lg bg-white"
//             onClick={async () => {
//               setImage(img.url);
//               setImageFile(null); // Clear file input
//               setDiagnosis(null);
//               setError("");
//               setIsLoading(true);
//               try {
//                 // Fetch the image as a blob and create a File object for prediction
//                 const response = await fetch(img.url);
//                 const blob = await response.blob();
//                 const file = new File([blob], `sample${idx + 1}.jpg`, { type: blob.type });
//                 setImageFile(file);
//               } catch (err) {
//                 setError("Failed to load sample image.");
//               } finally {
//                 setIsLoading(false);
//               }
//             }}
//           >
//             <img
//               src={img.url}
//               alt={img.label}
//               className="w-24 h-24 object-cover rounded-lg"
//             />
//             <div className="text-xs text-center mt-1 text-gray-700">{img.label}</div>
//           </button>
//         ))}
//       </div>
//     </div>
//     {/* Image Upload */}
//     <div>
//       <label className="font-semibold block mb-1">Upload Crop Image:</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="mt-1 w-full border rounded  focus:outline-none focus:ring-2 focus:ring-green-500 p-3"
//       />
//       {image && (
//         <div className="mt-3">
//           <img
//             src={image}
//             alt="Preview"
//             className="max-w-full max-h-48 rounded shadow object-contain"
//           />
//         </div>
//       )}
//     </div>

//     {/* Text Input */}
//     <div>
//       <label className="font-semibold block mb-1">Symptom Description:</label>
//       <textarea
//         className="w-full border border-gray-300 p-2 rounded mt-1 resize-y min-h-[100px] sm:min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
//         rows={4}
//         placeholder="Describe symptoms..."
//         value={textInput}
//         onChange={(e) => setTextInput(e.target.value)}
//       />
//     </div>

//     {/* Voice Controls */}
//     <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
//       <button
//         type="button"
//         onClick={isRecording ? stopRecording : startRecording}
//         className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
//           isRecording
//             ? "bg-red-600 hover:bg-red-700"
//             : "bg-green-600 hover:bg-green-700"
//         }`}
//       >
//         {isRecording ? "Stop Recording" : "Start Recording"}
//       </button>
//       <div className="italic text-gray-600 break-words max-w-full">
//         Voice transcript: {voiceTranscript || <span className="text-gray-400">None</span>}
//       </div>
//     </div>

//     {/* Submit Button */}
//     <div>
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded transition-colors duration-200"
//       >
//         {isLoading ? "Predicting..." : "Predict Disease"}
//       </button>
//     </div>
//   </form>

  


//   {/* Diagnosis Results */}
//   <AnimatePresence>
//     {diagnosis && (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         className="max-w-xl w-full mt-10 bg-white rounded-xl shadow-lg p-6"
//       >
//         <h2 className="text-xl font-bold mb-2 text-green-900">Prediction Result</h2>
//         <p>
//           <strong>Disease:</strong> {diagnosis.prediction.raw_response.predicted_class}
//         </p>
//         <p>
//           <strong>Confidence:</strong> {diagnosis.prediction.raw_response.confidence}
//         </p>
//         <p>
//           <strong>Description:</strong> {diagnosis.prediction.raw_response.description}
//         </p>
//         <p>
//           <strong>Solutions:</strong>
//         </p>
//         <ul className="list-disc list-inside mb-4">
//           {diagnosis.prediction.raw_response.solutions.map((sol, i) => (
//             <li key={i}>{sol}</li>
//           ))}
//         </ul>

//         <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
//           <button
//             onClick={handleReadAloud}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
//           >
//             {isSpeaking ? "Stop Reading" : "Read Aloud"}
//           </button>
//           <button
//     onClick={handleTranslate}
//     className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
//   >
//     Translate
//   </button>

//           {languagesWithSpeakers.includes(selectedLanguage) && (
//             <button
//               onClick={generateSolutionAudio}
//               disabled={isAudioLoading}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto"
//             >
//               {isAudioLoading ? "Generating Audio..." : "Generate Solution Audio"}
//             </button>
//           )}
//         </div>

//         {solutionAudioBase64 && (
//           <audio
//             controls
//             className="mt-4 w-full"
//             src={`data:audio/wav;base64,${solutionAudioBase64}`}
//           />
//         )}
//         <div className="mt-6 flex flex-col items-center space-y-4">
  

//   {translatedText && (
//     <p className="text-lg text-gray-800 font-medium text-center">
//       <span className="text-green-700 font-semibold">Translation:</span> {translatedText}
//     </p>
//   )}

//   {error && (
//     <p className="text-red-600 font-semibold text-center">
//       Error: {error}
//     </p>
//   )}
// </div>
    
//       </motion.div>
//     )}
//   </AnimatePresence>
// </div>

//   );
// }
