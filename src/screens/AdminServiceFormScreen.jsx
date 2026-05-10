import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { createService } from '../services/servicesService';
import InputField from '../components/InputField';

export default function AdminServiceFormScreen({ navigation }) {
  const [service, setService] = useState({ nom: '', description: '', prix: '', duree: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => setService((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const { nom, prix, duree } = service;
    if (!nom.trim() || !prix || !duree) return Alert.alert('Erreur', 'Nom, prix et durée sont obligatoires');

    setLoading(true);
    try {
      await createService({
        nom: service.nom.trim(),
        description: service.description.trim(),
        prix: parseFloat(service.prix),
        duree: parseInt(service.duree, 10),
      });
      Alert.alert('Succès', 'Service créé avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Impossible de créer le service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.title}>Nouveau service</Text>
      <InputField
        placeholder="Entrez le nom du service"
        value={service.nom}
        onChangeText={(text) => handleChange('nom', text)}
        icon="briefcase"
      />
      <InputField
        placeholder="Décrivez le service offert"
        value={service.description}
        onChangeText={(text) => handleChange('description', text)}
        icon="document-text"
      />
      <InputField
        placeholder="Prix en FCFA"
        value={service.prix}
        onChangeText={(text) => handleChange('prix', text)}
        keyboardType="numeric"
        icon="cash"
      />
      <InputField
        placeholder="Durée en minutes"
        value={service.duree}
        onChangeText={(text) => handleChange('duree', text)}
        keyboardType="numeric"
        icon="time"
      />
      <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={s.btnText}>{loading ? 'Envoi...' : 'Créer le service'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: '#6C63FF', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 15 },
  btn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});