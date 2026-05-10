import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/axiosConfig';
import { connexion, inscription, deconnexion } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données au démarrage
  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('token');
      const savedUser = await AsyncStorage.getItem('user');

      if (savedToken && savedUser) {
        // On remet le token dans les headers axios
        API.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
        // On remet l'utilisateur dans l'état
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.log("Erreur chargement stockage", e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await connexion({ email, password });
    
    // Sauvegarde persistante
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.utilisateur));
    
    API.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    setUser(data.utilisateur);
  };

  const register = async (userData) => {
    const { data } = await inscription(userData);
  };

  const updateUser = async (newUserData) => {
  setUser(newUserData);
  await AsyncStorage.setItem('user', JSON.stringify(newUserData));
};


  const logout = async () => {
    try {
      await deconnexion();
    } catch {}
    // Nettoyage complet
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    delete API.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};