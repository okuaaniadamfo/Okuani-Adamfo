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
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await apiClient.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get diagnosis combining voice and/or image
export const getDiagnosis = async (data) => {
  const response = await apiClient.post('/diagnose', data);
  return response.data;
};

// Localize output (translate and generate speech)
export const localizeOutput = async (data) => {
  const response = await apiClient.post('/output/localize', data);
  return response.data;
};