import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

const PURPLE = '#6C63FF';

const MENU = [
  { label: 'Nos services',    icon: 'cut-outline',      route: 'Services',       desc: 'Coiffure, soins, beauté' },
  { label: 'Mes rendez-vous', icon: 'calendar-outline', route: 'RendezVousList', desc: 'Consulter & gérer' },
  { label: 'Mon profil',      icon: 'person-outline',   route: 'Profil',         desc: 'Infos personnelles' },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <ScrollView contentContainerStyle={s.scroll}>

      {/* Hero */}
      <View style={s.hero}>
        <Ionicons name="storefront-outline" size={44} color="#fff" style={{ marginBottom: 10 }} />
        <Text style={s.heroTitle}>Diaytar</Text>
        <Text style={s.heroSub}>Salon de coiffure & bien-être</Text>
        <View style={s.heroDivider} />
        <Text style={s.welcome}>Bonjour, {user?.prenom} !</Text>
      </View>

      {/* Bandeau admin */}
      {user?.role === 'admin' && (
        <TouchableOpacity
          style={s.adminBanner}
          onPress={() => navigation.navigate('AdminDashboard')}
          activeOpacity={0.85}
        >
          <View style={s.adminIconWrap}>
            <Ionicons name="shield-outline" size={22} color={PURPLE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.adminLabel}>Espace administrateur</Text>
            <Text style={s.adminSub}>Gérer les services & rendez-vous</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      )}

      <Text style={s.sectionTitle}>Que souhaitez-vous faire ?</Text>

      {/* Menu */}
      {MENU.map(({ label, icon, route, desc }) => (
        <TouchableOpacity
          key={route}
          style={s.card}
          onPress={() => navigation.navigate(route)}
          activeOpacity={0.85}
        >
          <View style={s.cardIconWrap}>
            <Ionicons name={icon} size={24} color={PURPLE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.cardLabel}>{label}</Text>
            <Text style={s.cardDesc}>{desc}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      ))}

      {/* Promo */}
      <View style={s.promo}>
        <Ionicons name="leaf-outline" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
        <Text style={s.promoText}>Profitez de -10% sur votre premier soin du visage !</Text>
      </View>

    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:        { flexGrow: 1, backgroundColor: '#F4F3FF', padding: 20 },
  hero:          { backgroundColor: PURPLE, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  heroTitle:     { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  heroSub:       { fontSize: 13, color: '#D0CEFF', marginTop: 2 },
  heroDivider:   { width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 12 },
  welcome:       { fontSize: 15, color: '#fff', fontWeight: '600' },
  adminBanner:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#FFD700', elevation: 2 },
  adminIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  adminLabel:    { fontSize: 15, fontWeight: '700', color: '#222' },
  adminSub:      { fontSize: 12, color: '#888', marginTop: 2 },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: '#555', marginBottom: 12 },
  card:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
  cardIconWrap:  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardLabel:     { fontSize: 15, fontWeight: '700', color: '#222' },
  cardDesc:      { fontSize: 12, color: '#888', marginTop: 2 },
  promo:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 12, padding: 14, marginTop: 8 },
  promoText:     { fontSize: 13, color: '#2E7D32', fontWeight: '600', flex: 1 },
});