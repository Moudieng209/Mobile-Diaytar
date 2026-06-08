import messaging from '@react-native-firebase/messaging';
import API from '../api/axiosConfig';

// Demander la permission (surtout iOS)
export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  console.log('Auth status:', authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

// Récupérer le token FCM et l'envoyer à ton backend
export async function registerDeviceToken() {
  try {
    const enabled = await requestNotificationPermission();
    if (!enabled) return;

    const token = await messaging().getToken();
    if (token) {
      // On envoie le token à ton API pour le stocker en base
      await API.post('/api/auth/fcm-token', { fcmToken: token });
      console.log('FCM Token enregistré:', token);
    }

    // Si le token est rafraîchi, on met à jour
    messaging().onTokenRefresh(async (newToken) => {
      await API.post('/api/auth/fcm-token', { fcmToken: newToken });
    });
  } catch (err) {
    console.error('Erreur FCM token:', err);
  }
}

// Notification reçue quand app est OUVERTE (foreground)
export function listenForegroundNotifications(onNotification) {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('Notification foreground:', remoteMessage);
    onNotification?.(remoteMessage);
  });
}

// Notification cliquée quand app était en ARRIÈRE-PLAN
export function listenBackgroundOpen(onOpen) {
  return messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('App ouverte via notification background:', remoteMessage);
    onOpen?.(remoteMessage);
  });
}

// Notification cliquée quand app était FERMÉE
export async function checkInitialNotification() {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('App ouverte depuis notification (fermée):', remoteMessage);
    return remoteMessage;
  }
  return null;
}