import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { annulerRendezVous } from '../services/rendezVousService';

const PURPLE = '#6C63FF';

const STATUT_CONFIG = {
  en_attente: { color: '#f59e0b', bg: '#FFF8E1', icon: 'time-outline',         label: 'En attente' },
  confirmé:   { color: '#10b981', bg: '#E8F5E9', icon: 'checkmark-circle-outline', label: 'Confirmé' },
  annulé:     { color: '#ef4444', bg: '#FFEBEE', icon: 'close-circle-outline',  label: 'Annulé' },
  terminé:    { color: '#6b7280', bg: '#F3F4F6', icon: 'flag-outline',          label: 'Terminé' },
};

export default function RendezVousDetailScreen({ route, navigation }) {
  const { rdv } = route.params;
  const [loading, setLoading] = useState(false);

  const statut = STATUT_CONFIG[rdv.statut] || STATUT_CONFIG['en_attente'];

  const handleAnnuler = () => {
    Alert.alert(
      'Annuler le rendez-vous',
      'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await annulerRendezVous(rdv.id);
              Alert.alert('Succès', 'Rendez-vous annulé.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('Erreur', err.response?.data?.message || 'Annulation échouée');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Formatage date lisible
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const canCancel = rdv.statut === 'en_attente' || rdv.statut === 'confirmé';

  return (
    <ScrollView contentContainerStyle={s.scroll}>

      {/* HEADER SERVICE */}
      <View style={s.headerCard}>
        <View style={s.serviceIcon}>
          <Ionicons name="cut-outline" size={30} color={PURPLE} />
        </View>
        <Text style={s.serviceNom}>{rdv.Service?.nom || 'Service'}</Text>
        <View style={[s.badge, { backgroundColor: statut.bg }]}>
          <Ionicons name={statut.icon} size={14} color={statut.color} style={{ marginRight: 5 }} />
          <Text style={[s.badgeText, { color: statut.color }]}>{statut.label}</Text>
        </View>
      </View>

      {/* DETAILS */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Détails du rendez-vous</Text>

        <Row icon="calendar-outline" label="Date" value={formatDate(rdv.date)} />
        <Row icon="time-outline"     label="Heure" value={rdv.heure} />
        {rdv.Service?.prix   && <Row icon="cash-outline"     label="Prix"   value={`${rdv.Service.prix} FCFA`} />}
        {rdv.Service?.duree  && <Row icon="hourglass-outline" label="Durée" value={`${rdv.Service.duree} min`} />}
        {rdv.notes           && <Row icon="document-text-outline" label="Notes" value={rdv.notes} />}
      </View>

      {/* BOUTON ANNULER */}
      {canCancel && (
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={handleAnnuler}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <>
              <Ionicons name="close-circle-outline" size={22} color="#ef4444" style={{ marginRight: 10 }} />
              <Text style={s.cancelText}>Annuler le rendez-vous</Text>
            </>
          )}
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

// Composant ligne réutilisable
function Row({ icon, label, value }) {
  return (
    <View style={s.row}>
      <View style={s.rowIcon}>
        <Ionicons name={icon} size={20} color={PURPLE} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowLabel}>{label}</Text>
        <Text style={s.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 20 },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  serviceIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#F4F3FF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  serviceNom: { fontSize: 20, fontWeight: '800', color: '#222', marginBottom: 10 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '800', color: '#BBB',
    marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8F8FF',
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#F4F3FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  rowLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  rowValue: { fontSize: 15, color: '#333', fontWeight: '600', marginTop: 1 },

  cancelBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#ef4444',
    borderRadius: 15, padding: 16, marginBottom: 20,
  },
  cancelText: { color: '#ef4444', fontWeight: '800', fontSize: 16 },
});