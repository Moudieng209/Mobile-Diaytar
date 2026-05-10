import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

const PURPLE = '#6C63FF';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email,    setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    const loginEmail = email.trim().toLowerCase();
    if (!loginEmail || !password)
      return Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    setLoading(true);
    try {
      await login(loginEmail, password);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.logoCircle}>
            <Ionicons name="cut-outline" size={36} color="#fff" />
          </View>
          <Text style={s.brand}>Diaytar</Text>
          <Text style={s.tagline}>Votre beauté, notre priorité</Text>
        </View>

        {/* ── Card formulaire ── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Connexion</Text>

          <InputField
            placeholder="Adresse email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
          <InputField
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secure
            icon="lock-closed-outline"
          />

          <TouchableOpacity style={s.forgot}>
            <Text style={s.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btn, loading && { opacity: 0.75 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={s.btnInner}>
                <Text style={s.btnText}>Se connecter</Text>
                <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={s.link}>
            Pas encore de compte ?{'  '}
            <Text style={s.linkBold}>S'inscrire</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll:      { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 24, justifyContent: 'center' },
  header:      { alignItems: 'center', marginBottom: 28 },
  logoCircle:  { width: 72, height: 72, borderRadius: 36, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  brand:       { fontSize: 26, fontWeight: '800', color: PURPLE, letterSpacing: 1 },
  tagline:     { fontSize: 13, color: '#888', marginTop: 2 },
  card:        { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20, elevation: 4 },
  cardTitle:   { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 20 },
  forgot:      { alignSelf: 'flex-end', marginBottom: 16 },
  forgotText:  { fontSize: 13, color: PURPLE },
  btn:         { backgroundColor: PURPLE, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnInner:    { flexDirection: 'row', alignItems: 'center' },
  btnText:     { color: '#fff', fontWeight: '700', fontSize: 16 },
  link:        { textAlign: 'center', color: '#888', fontSize: 14 },
  linkBold:    { color: PURPLE, fontWeight: '700' },
});