import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // ← ajouter TouchableOpacity
import Ionicons from 'react-native-vector-icons/Ionicons';

const statutConfig = {
  'en_attente': { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', icon: 'time-outline',            label: 'En attente' },
  'confirmé':   { color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.15)', icon: 'checkmark-circle-outline', label: 'Confirmé'   },
  'annulé':     { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)',  icon: 'close-circle-outline',     label: 'Annulé'     },
  'terminé':    { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.15)',icon: 'flag-outline',             label: 'Terminé'    },
};

export default function RendezVousItem({ item, onPress }) {
  const config = statutConfig[item.statut] || {
    color: '#333', bgColor: '#eee', icon: 'help-circle-outline', label: item.statut
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.service}>{item.Service?.nom || 'Service'}</Text>
        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.statutText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{item.date} à {item.heure}</Text>
      </View>

      {item.notes ? (
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={16} color="#555" />
          <Text style={styles.infoText}>{item.notes}</Text>
        </View>
      ) : null}

      {/* Flèche indiquant que c'est cliquable */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Voir les détails</Text>
        <Ionicons name="chevron-forward-outline" size={16} color="#6C63FF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  service: {
    fontSize: 17, fontWeight: 'bold', color: '#1a1a1a',
    flex: 1, marginRight: 10,
  },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, gap: 5,
  },
  statutText: { fontSize: 12, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 6,
  },
  infoText: { color: '#666', fontSize: 14, marginLeft: 8 },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    marginTop: 10, gap: 4,
  },
  footerText: { fontSize: 13, color: '#6C63FF', fontWeight: '600' },
});