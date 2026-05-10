import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';

const PURPLE = '#6C63FF';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    const { prenom, nom, email, password } = form;
    const normalizedEmail = email.trim().toLowerCase();
    if (!prenom || !nom || !normalizedEmail || !password)
      return Alert.alert('Erreur', 'Champs obligatoires manquants');
    setLoading(true);
    try {
      await register({ ...form, email: normalizedEmail });
      Alert.alert('Succès', 'Compte créé ! Veuillez vous connecter.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Inscription échouée');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'prenom',    placeholder: 'Prénom',         icon: 'person-outline' },
    { key: 'nom',       placeholder: 'Nom',            icon: 'person-outline' },
    { key: 'email',     placeholder: 'Adresse email',  icon: 'mail-outline',         keyboardType: 'email-address' },
    { key: 'telephone', placeholder: 'Téléphone',      icon: 'call-outline',         keyboardType: 'phone-pad' },
    { key: 'password',  placeholder: 'Mot de passe',   icon: 'lock-closed-outline',  secure: true },
  ];

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

      <View style={s.header}>
        <View style={s.logoCircle}>
          <Ionicons name="cut-outline" size={30} color="#fff" />
        </View>
        <Text style={s.brand}>Diaytar</Text>
        <Text style={s.tagline}>Créez votre compte</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Inscription</Text>
        {fields.map(({ key, placeholder, keyboardType, secure, icon }) => (
          <InputField
            key={key}
            placeholder={placeholder}
            value={form[key]}
            onChangeText={v => handleChange(key, v)}
            keyboardType={keyboardType}
            secure={secure}
            icon={icon}
          />
        ))}
        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.75 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={s.btnInner}>
              <Text style={s.btnText}>Créer mon compte</Text>
              <Ionicons name="checkmark-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={s.link}>
          Déjà un compte ?{'  '}
          <Text style={s.linkBold}>Se connecter</Text>
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:    { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 24 },
  header:    { alignItems: 'center', marginBottom: 24, marginTop: 16 },
  logoCircle:{ width: 64, height: 64, borderRadius: 32, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  brand:     { fontSize: 22, fontWeight: '800', color: PURPLE, letterSpacing: 1 },
  tagline:   { fontSize: 13, color: '#888', marginTop: 2 },
  card:      { backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 20, elevation: 4 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 20 },
  btn:       { backgroundColor: PURPLE, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  btnInner:  { flexDirection: 'row', alignItems: 'center' },
  btnText:   { color: '#fff', fontWeight: '700', fontSize: 16 },
  link:      { textAlign: 'center', color: '#888', fontSize: 14, marginBottom: 24 },
  linkBold:  { color: PURPLE, fontWeight: '700' },
});