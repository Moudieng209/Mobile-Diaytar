import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Tab.Screen
        name="RendezVousList"
        component={RendezVousListScreen}
        options={{
          title: 'Rendez-vous',
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
        }}
      />
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs">
            {(props) => <MainTabs {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="RendezVousForm"
            component={RendezVousFormScreen}
            options={{ headerShown: true, title: 'Rendez-vous' }}
          />
          {}
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
        </>
      )}
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