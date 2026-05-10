import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createRendezVous } from '../services/rendezVousService';
import { formatDateISO, formatTimeHHMM } from '../utils/helpers';
import InputField from '../components/InputField';

export default function CreateRendezVousScreen({ route, navigation }) {
  const { serviceId, serviceNom } = route.params;
  const [date, setDate] = useState(new Date());
  const [heure, setHeure] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createRendezVous({
        serviceId,
        date: formatDateISO(date),
        heure: formatTimeHHMM(heure),
        notes,
      });
      Alert.alert('Succès', 'Rendez-vous créé !', [
        { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'RendezVousList' }) },
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.message || 'Création échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>RDV — {serviceNom}</Text>

      <Text style={s.label}>Date</Text>
      <TouchableOpacity style={s.picker} onPress={() => setShowDate(true)}>
        <Text>{formatDateISO(date)}</Text>
      </TouchableOpacity>
      {showDate && (
        <DateTimePicker value={date} mode="date" minimumDate={new Date()} onChange={(_, d) => { setShowDate(Platform.OS === 'ios'); if (d) setDate(d); }} />
      )}

      <Text style={s.label}>Heure</Text>
      <TouchableOpacity style={s.picker} onPress={() => setShowTime(true)}>
        <Text>{formatTimeHHMM(heure)}</Text>
      </TouchableOpacity>
      {showTime && (
        <DateTimePicker value={heure} mode="time" onChange={(_, t) => { setShowTime(Platform.OS === 'ios'); if (t) setHeure(t); }} />
      )}

      <Text style={s.label}>Notes (optionnel)</Text>
      <InputField
        placeholder="Ajoutez des informations complémentaires..."
        value={notes}
        onChangeText={setNotes}
        icon="document-text"
      />

      <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Confirmer</Text>}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 24, color: '#6C63FF' },
  label: { fontSize: 14, color: '#888', marginBottom: 6, marginTop: 12 },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14 },
  btn: { backgroundColor: '#6C63FF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});