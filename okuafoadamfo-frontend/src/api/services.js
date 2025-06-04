import apiClient from './config.js';


// Upload voice file for ASR
export const uploadVoiceFile = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const response = await apiClient.post('/upload/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Upload image for crop disease detection
export const uploadImageFile = async (imageFile) => {
  if (!imageFile) throw new Error('No image file provided');

  const formData = new FormData();
  formData.append('file', imageFile); // or 'file' - check backend

  try {
    const response = await apiClient.post('https://okuani-adamfo-api.onrender.com/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};



/*export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append("file", file); // ✅ Must match backend key

  try {
    const response = await fetch("https://plant-disease-api-zwyx.onrender.com/predict/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image file:", error);
    throw error;
  }
}
  */


// Get diagnosis combining voice and/or image
/*
export const getDiagnosis = async (data) => {
  const response = await apiClient.post('/diagnose', data);
  return response.data;
};
*/

// Localize output (translate and generate speech)
export const localizeOutput = async (data) => {
  const response = await apiClient.post('/output/localize', data);
  return response.data;
};