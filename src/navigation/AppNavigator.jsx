import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RendezVousListScreen from '../screens/RendezVousListScreen';
import RendezVousFormScreen from '../screens/RendezVousFormScreen';
import RendezVousDetailScreen from '../screens/RendezVousDetailScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfilScreen from '../screens/ProfilScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminServiceFormScreen from '../screens/AdminServiceFormScreen';
import AdminRendezVousScreen from '../screens/AdminRendezVousScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Écran de connexion requis pour les sections protégées
function RequireAuthScreen({ navigation, message }) {
  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#F8F9FF', padding: 30
    }}>
      <Icon name="lock-closed-outline" size={64} color="#6C63FF" />
      <Text style={{
        fontSize: 18, fontWeight: '800', color: '#1a1a1a',
        marginTop: 20, textAlign: 'center'
      }}>
        Connexion requise
      </Text>
      <Text style={{
        fontSize: 14, color: '#888', textAlign: 'center',
        marginTop: 10, marginBottom: 30, lineHeight: 20
      }}>
        {message}
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#6C63FF', borderRadius: 14,
          paddingVertical: 14, paddingHorizontal: 40
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
          Se connecter
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 14 }}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={{ color: '#6C63FF', fontSize: 14, fontWeight: '600' }}>
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Onglet principal avec accès conditionnel aux sections protégées
function MainTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <Icon name="list" color={color} size={size} />,
        }}
      />

      {/* ← Rendez-vous protégé */}
      <Tab.Screen
        name="RendezVousList"
        options={{
          title: 'Rendez-vous',
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
        }}
      >
        {(props) => user
          ? <RendezVousListScreen {...props} />
          : <RequireAuthScreen {...props} message="Connectez-vous pour gérer vos rendez-vous" />
        }
      </Tab.Screen>

      {/* ← Profil protégé */}
      <Tab.Screen
        name="Profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
        }}
      >
        {(props) => user
          ? <ProfilScreen {...props} />
          : <RequireAuthScreen {...props} message="Connectez-vous pour accéder à votre profil" />
        }
      </Tab.Screen>

      {user?.role === 'admin' && (
        <Tab.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }) => <Icon name="settings" color={color} size={size} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function AppNavigatorContent() {
  const { user, loading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('onboardingDone').then(val => {
      setOnboardingDone(val === 'true');
    });
  }, []);

  if (loading || onboardingDone === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!onboardingDone) {
    return <OnboardingScreen onDone={() => setOnboardingDone(true)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Login/Register toujours accessibles via navigation */}
      <Stack.Screen name="MainTabs">
        {(props) => <MainTabs {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="RendezVousForm"
        component={RendezVousFormScreen}
        options={{ headerShown: true, title: 'Rendez-vous' }}
      />
      <Stack.Screen
        name="RendezVousDetail"
        component={RendezVousDetailScreen}
        options={{ headerShown: true, title: 'Détails du rendez-vous' }}
      />
      <Stack.Screen
        name="AdminCreateService"
        component={AdminServiceFormScreen}
        options={{ headerShown: true, title: 'Créer un service' }}
      />
      <Stack.Screen
        name="AdminRendezVous"
        component={AdminRendezVousScreen}
        options={{ headerShown: true, title: 'Gérer rendez-vous' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppNavigatorContent />
    </NavigationContainer>
  );
}