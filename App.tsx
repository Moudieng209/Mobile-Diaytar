import React, { useEffect }  from "react";

import { AuthProvider } from './src/context/AuthContext';

import AppNavigator from './src/navigation/AppNavigator';
import { listenForegroundNotifications } from './src/services/notificationService';
import { Alert } from 'react-native';

export default function App() {
  useEffect(() => {
    // Écoute les notifications en foreground
    const unsubscribe = listenForegroundNotifications((message) => {
      Alert.alert(
        message.notification?.title || 'Rendez-vous',
        message.notification?.body || 'Votre rendez-vous a été mis à jour'
      );
    });

    return unsubscribe; // Cleanup
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

