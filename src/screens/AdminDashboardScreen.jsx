import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PURPLE = '#6C63FF';

const ACTIONS = [
  { label: 'Créer un service',       icon: 'add-circle-outline',  route: 'AdminCreateService', desc: 'Ajouter un nouveau service' },
  { label: 'Gérer les rendez-vous',  icon: 'calendar-outline',    route: 'AdminRendezVous',    desc: 'Confirmer, annuler, terminer' },
  { label: 'Voir tous les services', icon: 'cut-outline',         route: 'Services',           desc: 'Liste complète', secondary: true },
];

export default function AdminDashboardScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={s.scroll}>

      <View style={s.hero}>
        <Ionicons name="shield-outline" size={44} color="#fff" style={{ marginBottom: 10 }} />
        <Text style={s.heroTitle}>Espace admin</Text>
        <Text style={s.heroSub}>Gérez Diaytar en toute simplicité</Text>
      </View>

      {ACTIONS.map(({ label, icon, route, desc, secondary }) => (
        <TouchableOpacity
          key={route}
          style={[s.card, secondary && s.cardSecondary]}
          onPress={() => navigation.navigate(route)}
          activeOpacity={0.85}
        >
          <View style={[s.cardIconWrap, secondary && { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name={icon} size={24} color={PURPLE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardLabel}>{label}</Text>
            <Text style={s.cardDesc}>{desc}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:       { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 20 },
  hero:         { backgroundColor: PURPLE, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  heroTitle:    { fontSize: 24, fontWeight: '800', color: '#fff' },
  heroSub:      { fontSize: 13, color: '#D0CEFF', marginTop: 4 },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
  cardSecondary:{ borderWidth: 1.5, borderColor: PURPLE, elevation: 0 },
  cardIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardLabel:    { fontSize: 15, fontWeight: '700', color: '#222' },
  cardDesc:     { fontSize: 12, color: '#aaa', marginTop: 2 },
});