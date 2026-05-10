import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, ActivityIndicator,
  Text, RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { getAllRendezVous, confirmerRendezVous, annulerRendezVous, terminerRendezVous } from '../services/rendezVousService';

const PURPLE = '#6C63FF';

const STATUT_CONFIG = {
  'en_attente': { bg: 'rgba(245, 158, 11, 0.15)', color: '#856404', icon: 'time-outline', label: 'En attente' },
  'confirmé':   { bg: 'rgba(16, 185, 129, 0.15)', color: '#065F46', icon: 'checkmark-circle-outline', label: 'Confirmé' },
  'annulé':     { bg: 'rgba(239, 68, 68, 0.15)',  color: '#991B1B', icon: 'close-circle-outline', label: 'Annulé' },
  'terminé':    { bg: 'rgba(107, 114, 128, 0.15)', color: '#374151', icon: 'flag-outline', label: 'Terminé' },
};

function RDVCard({ item, onAction }) {
  const st = STATUT_CONFIG[item.statut] ?? STATUT_CONFIG['en_attente'];

  return (
    <View style={c.card}>
      <View style={c.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={c.service}>{item.Service?.nom || 'Service'}</Text>
          
          <View style={c.infoRow}>
            <Ionicons name="person-outline" size={14} color={PURPLE} style={{ marginRight: 6 }} />
            <Text style={c.infoText}>{item.Utilisateur?.prenom} {item.Utilisateur?.nom}</Text>
          </View>
          
          <View style={c.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#888" style={{ marginRight: 6 }} />
            <Text style={c.infoText}>{item.date}</Text>
            <Ionicons name="time-outline" size={14} color="#888" style={{ marginLeft: 12, marginRight: 6 }} />
            <Text style={c.infoText}>{item.heure}</Text>
          </View>

          {item.notes ? (
            <View style={c.infoRow}>
              <Ionicons name="document-text-outline" size={14} color="#aaa" style={{ marginRight: 6 }} />
              <Text style={[c.infoText, { color: '#aaa', fontStyle: 'italic' }]}>{item.notes}</Text>
            </View>
          ) : null}
        </View>

        <View style={[c.badge, { backgroundColor: st.bg }]}>
          <Ionicons name={st.icon} size={13} color={st.color} style={{ marginRight: 4 }} />
          <Text style={[c.badgeText, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>

      {/* Actions dynamiques */}
      {(item.statut === 'en_attente' || item.statut === 'confirmé') && (
        <View style={c.actions}>
          {item.statut === 'en_attente' && (
            <TouchableOpacity 
              style={[c.actionBtn, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]} 
              onPress={() => onAction(item.id, 'confirm')}
            >
              <Ionicons name="checkmark-circle" size={18} color="#065F46" style={{ marginRight: 6 }} />
              <Text style={[c.actionText, { color: '#065F46' }]}>Confirmer</Text>
            </TouchableOpacity>
          )}

          {item.statut === 'confirmé' && (
            <TouchableOpacity 
              style={[c.actionBtn, { backgroundColor: 'rgba(108, 99, 255, 0.1)' }]} 
              onPress={() => onAction(item.id, 'finish')}
            >
              <Ionicons name="flag" size={18} color={PURPLE} style={{ marginRight: 6 }} />
              <Text style={[c.actionText, { color: PURPLE }]}>Terminer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[c.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]} 
            onPress={() => onAction(item.id, 'cancel')}
          >
            <Ionicons name="close-circle" size={18} color="#991B1B" style={{ marginRight: 6 }} />
            <Text style={[c.actionText, { color: '#991B1B' }]}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function AdminRendezVousScreen() {
  const { user } = useAuth();
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRendezVous = async () => {
    try {
      setError(null);
      if (!user) return;
      const { data } = await getAllRendezVous();
      setRendezVous(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRendezVous(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchRendezVous(); }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'confirm')     await confirmerRendezVous(id);
      else if (action === 'finish') await terminerRendezVous(id);
      else                          await annulerRendezVous(id);
      fetchRendezVous();
    } catch {
      Alert.alert('Erreur', "Impossible de modifier le rendez-vous");
    }
  };

  if (loading) return (
    <View style={s.center}>
      <ActivityIndicator size="large" color={PURPLE} />
    </View>
  );

  return (
    <View style={s.container}>
      {error && (
        <View style={s.errorWrap}>
          <Ionicons name="alert-circle-outline" size={20} color="#721c24" />
          <Text style={s.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        data={rendezVous}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <RDVCard item={item} onAction={handleAction} />}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={s.emptyText}>Aucun rendez-vous trouvé</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PURPLE} />
        }
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f8d7da', 
    padding: 12, 
    margin: 16, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#f5c6cb' 
  },
  errorText: { color: '#721c24', marginLeft: 8, fontSize: 13, fontWeight: '600' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#aaa', marginTop: 15, fontWeight: '500' },
});

const c = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  service: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoText: { fontSize: 14, color: '#666', fontWeight: '500' },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  actions: { 
    flexDirection: 'row', 
    gap: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0', 
    paddingTop: 15 
  },
  actionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderRadius: 12 
  },
  actionText: { fontSize: 13, fontWeight: '800' },
});