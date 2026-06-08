import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const API = axios.create({
  baseURL: 'http://192.168.1.150:3000', 
});

// Cet intercepteur attache automatiquement le token à chaque appel API
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token envoyé au serveur !");
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;