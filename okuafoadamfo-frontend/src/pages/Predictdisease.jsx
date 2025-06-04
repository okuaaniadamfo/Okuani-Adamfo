import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVoiceFile, uploadImageFile } from "../api/services.js";

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

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const languagesWithSpeakers = ["tw", "ee", "ki"];

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

  // Updated generateSolutionAudio function with fixes
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

    // Join solutions into one string for API
    // diagnosis.prediction.raw_response.solutions is an array of strings
const solutionsArray = diagnosis.prediction.raw_response.solutions;

// Prepare request body exactly as API expects:
const requestBody = {
  prediction: {
    raw_response: {
      solutions: solutionsArray
    }
  },
  language: selectedLanguage,
  speaker_id: selectedSpeaker  // Use speaker_id, not speaker
};


    console.log("Sending request to solutions-to-audio API:", requestBody);

    try {
      const res = await fetch("https://okuani-adamfo-api.onrender.com/upload/solutions-to-audio", {
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

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 pt-[90px]">
      <motion.h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-8 text-center">
        Predict Crop Disease
      </motion.h1>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Language Select */}
        <div>
          <label htmlFor="languageSelect" className="font-semibold">Select Language</label>
          <select
            id="languageSelect"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mt-1"
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
            <label htmlFor="speakerSelect" className="font-semibold">Select Speaker</label>
            <select
              id="speakerSelect"
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mt-1"
            >
              {availableSpeakers.map((spk) => (
                <option key={spk} value={spk}>
                  {spk}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="font-semibold">Upload Crop Image  </label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
          {image && (
            <div className="mt-3">
              <img src={image} alt="Preview" className="max-h-48 rounded shadow" />
            </div>
          )}
        </div>

        {/* Text Input */}
        <div>
          <label className="font-semibold">Symptom Description</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded mt-1"
            rows={4}
            placeholder="Describe symptoms..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>

        {/* Voice Controls */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded text-white ${
              isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <div className="italic text-gray-600">Voice transcript: {voiceTranscript}</div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded"
          >
            {isLoading ? "Predicting..." : "Predict Disease"}
          </button>
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
            <h2 className="text-xl font-bold text-green-900 mb-4 text-center">Diagnosis Results</h2>
            <div className="space-y-3">
              <p>
                <strong>Predicted Disease:</strong> {diagnosis.prediction.raw_response.predicted_class}
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
              <ul className="list-disc list-inside">
                {diagnosis.prediction.raw_response.solutions.map((sol, idx) => (
                  <li key={idx}>{sol}</li>
                ))}
              </ul>

              <div className="flex space-x-4 mt-6 justify-center">
                <button
                  onClick={handleReadAloud}
                  disabled={isSpeaking}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  {isSpeaking ? "Speaking..." : "Read Aloud"}
                </button>

                {availableSpeakers.length > 0 && (
                  <button
                    onClick={generateSolutionAudio}
                    disabled={isAudioLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    {isAudioLoading ? "Generating Audio..." : "Generate Solution Audio"}
                  </button>
                )}
              </div>

              {/* Audio Playback */}
              {solutionAudioBase64 && (
                <audio controls className="mt-4 w-full">
                  <source src={`data:audio/mp3;base64,${solutionAudioBase64}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
