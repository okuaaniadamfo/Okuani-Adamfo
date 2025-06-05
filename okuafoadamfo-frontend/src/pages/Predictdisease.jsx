import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVoiceFile, uploadImageFile } from "../api/services.js";
import AppleScab1 from "../assets/AppleScab1.JPG";
import TomatoEarlyBlight1 from "../assets/TomatoEarlyBlight1.JPG";
import CornCommonRust1 from "../assets/CornCommonRust1.JPG";

const SAMPLE_IMAGES = [
  { url: AppleScab1, label: "Apple Scab" },
  { url: TomatoEarlyBlight1, label: "Tomato Early Blight" },
  { url: CornCommonRust1, label: "Corn Common Rust" }
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
  const [errorr, setErrorr] = useState(null);

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
      }
    }
    fetchSpeakers();
  }, [selectedLanguage]);

  // Setup SpeechRecognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition API is not supported in this browser.");
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
    } else {
      setImage(null);
      setImageFile(null);
    }
  };

  const startRecording = async () => {
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
          setError("Failed to process voice input");
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
      setError("Failed to start recording");
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

    try {
      let imageResult = null;
      if (imageFile) {
        imageResult = await uploadImageFile(imageFile);
        if (imageResult) {
          setDiagnosis(imageResult);
        } else {
          setError("No prediction data returned.");
        }
      }
    } catch (error) {
      console.error("Prediction error:", error);
      setError("Failed to get prediction. Please try again.");
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
      Confidence level: ${confidence}.
      Description: ${description}.
      Recommended solutions: ${solutions.join(". ")}.
    `;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = selectedLanguage === "en" ? "en-US" : selectedLanguage;
    utterance.rate = 1;
    utterance.onend = () => setIsSpeaking(false);

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
      setError("Error generating solution audio.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleTranslate = async () => {
    const requestData = {
      text: diagnosis.prediction.raw_response.solutions.join("\n"),
      targetLanguage: selectedLanguage
    };

    console.log('Sending request with:', requestData);

    try {
      const response = await fetch('https://okuani-adamfo-api.onrender.com/upload/translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Raw response:', response);

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
      setErrorr(null);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
      setTranslatedText('');
    }
  };

  return (
  <div className="min-h-screen bg-green-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-12 pt-[90px]">
    <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-6 text-center max-w-xl">
      Predict Crop Disease
    </motion.h1>

    {error && (
      <div className="text-red-600 mb-4 text-center max-w-xl px-2">{error}</div>
    )}
    
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full bg-white rounded-xl shadow-lg p-5 sm:p-8 space-y-6"
    >
      {/* Language Select */}
      <div>
        <label htmlFor="languageSelect" className="font-semibold block mb-1">
          Select Language:
        </label>
        <select
          id="languageSelect"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Speaker Select */}
      {availableSpeakers.length > 0 && (
        <div>
          <label htmlFor="speakerSelect" className="font-semibold block mb-1">
            Select Speaker:
          </label>
          <select
            id="speakerSelect"
            value={selectedSpeaker}
            onChange={(e) => setSelectedSpeaker(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {availableSpeakers.map((spk) => (
              <option key={spk} value={spk}>
                {spk}
              </option>
            ))}
          </select>

          {/* Sample Images Section - Added right below Speaker Select */}
          <div className="mt-4">
            <label className="font-semibold block mb-2 text-gray-700">Try sample images:</label>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={async () => {
                    setImage(img.url);
                    setDiagnosis(null);
                    setError("");
                    setIsLoading(true);
                    try {
                      const response = await fetch(img.url);
                      const blob = await response.blob();
                      const file = new File([blob], `sample_${img.label.replace(/\s+/g, '_')}.jpg`, { type: blob.type });
                      setImageFile(file);
                    } catch (err) {
                      setError("Failed to load sample image");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="group flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:border-green-400 transition-colors"
                >
                  <div className="relative w-full h-24 overflow-hidden rounded-md mb-1">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-green-700">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="font-semibold block mb-1">Upload Your Crop Image:</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
          </div>
        </div>
        {image && (
          <div className="mt-3 flex justify-center">
            <img
              src={image}
              alt="Preview"
              className="max-w-full max-h-48 rounded shadow object-contain"
            />
          </div>
        )}
      </div>

      {/* Rest of the form remains the same */}
      {/* Symptom Description - Beautified */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Symptom Description
    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
  </label>
  <div className="relative">
    <textarea
      className="block w-full rounded-lg border-0 bg-gray-50 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm"
      rows={4}
      placeholder="e.g., Yellow spots on leaves, wilting stems, brown edges..."
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
    />
    <div className="absolute bottom-2 right-2 flex items-center text-xs text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      {textInput.length}/500
    </div>
  </div>
</div>

{/* Voice Controls - Beautified */}
<div className="space-y-3 pt-2">
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <motion.button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all ${
        isRecording
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {isRecording ? (
        <>
          <svg
            className="mr-2 h-4 w-4 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
          Recording...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
          Record Voice
        </>
      )}
    </motion.button>

    <div className="flex-1 rounded-lg bg-gray-50 p-3">
      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-700">Transcript:</span>{" "}
        {voiceTranscript || (
          <span className="text-gray-400">No voice input detected</span>
        )}
      </p>
    </div>
  </div>
</div>

{/* Submit Button - Beautified */}
<div className="pt-4">
  <motion.button
    type="submit"
    disabled={isLoading}
    whileHover={{ scale: isLoading ? 1 : 1.02 }}
    whileTap={{ scale: isLoading ? 1 : 0.98 }}
    className={`flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-lg font-bold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 ${
      isLoading ? "cursor-not-allowed opacity-90" : ""
    }`}
  >
    {isLoading ? (
      <>
        <svg
          className="mr-3 h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Analyzing...
      </>
    ) : (
      <>
        <svg
          className="mr-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        Predict Disease
      </>
    )}
  </motion.button>
</div>
    </form>

    {/* Diagnosis Results */}
<AnimatePresence>
  {diagnosis && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-xl w-full mt-10 bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold mb-2 text-green-900">Prediction Result</h2>
      <p>
        <strong>Disease:</strong> {diagnosis.prediction.raw_response.predicted_class}
      </p>
      <p>
        <strong>Confidence:</strong> {diagnosis.prediction.raw_response.confidence}
      </p>
      <p>
        <strong>Description:</strong> {diagnosis.prediction.raw_response.description}
      </p>
      <p>
        <strong>Solutions:</strong>
      </p>
      <ul className="list-disc list-inside mb-4">
        {diagnosis.prediction.raw_response.solutions.map((sol, i) => (
          <li key={i}>{sol}</li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <button
          onClick={handleReadAloud}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full sm:w-auto"
        >
          {isSpeaking ? "Stop Reading" : "Read Aloud"}
        </button>
        <button
          onClick={handleTranslate}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
        >
          Translate
        </button>

        {languagesWithSpeakers.includes(selectedLanguage) && (
          <button
            onClick={generateSolutionAudio}
            disabled={isAudioLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto"
          >
            {isAudioLoading ? "Generating Audio..." : "Generate Solution Audio"}
          </button>
        )}
      </div>

      {solutionAudioBase64 && (
        <audio
          controls
          className="mt-4 w-full"
          src={`data:audio/wav;base64,${solutionAudioBase64}`}
        />
      )}
      
      <div className="mt-6 flex flex-col items-center space-y-4">
        {translatedText && (
          <p className="text-lg text-gray-800 font-medium text-center">
            <span className="text-green-700 font-semibold">Translation:</span> {translatedText}
          </p>
        )}

        {error && (
          <p className="text-red-600 font-semibold text-center">
            Error: {error}
          </p>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
  </div>
);

}
