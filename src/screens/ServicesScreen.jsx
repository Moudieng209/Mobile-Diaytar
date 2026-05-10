import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, ActivityIndicator,
  Text, RefreshControl, TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getServices } from '../services/servicesService';

const PURPLE = '#6C63FF';

export default function ServicesListScreen({ navigation }) {
  const [services,   setServices]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const { data } = await getServices();
      setServices(data);
    } catch { } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchServices(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={PURPLE} />;

  return (
    <View style={s.container}>
      <FlatList
        data={services}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.headerTitle}>Nos services</Text>
            <Text style={s.headerSub}>Choisissez et réservez</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate('RendezVousForm', { serviceId: item.id, serviceNom: item.nom })}
            activeOpacity={0.85}
          >
            <View style={s.cardIconWrap}>
              <Ionicons name="cut-outline" size={24} color={PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardNom}>{item.nom}</Text>
              {item.description ? <Text style={s.cardDesc}>{item.description}</Text> : null}
              <View style={s.cardMeta}>
                <View style={s.metaChip}>
                  <Ionicons name="cash-outline" size={13} color={PURPLE} style={{ marginRight: 3 }} />
                  <Text style={s.metaPrix}>{item.prix} FCFA</Text>
                </View>
                <View style={s.metaChip}>
                  <Ionicons name="time-outline" size={13} color="#888" style={{ marginRight: 3 }} />
                  <Text style={s.metaDuree}>{item.duree} min</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={s.emptyWrap}>
            <Ionicons name="cut-outline" size={48} color="#ccc" />
            <Text style={s.emptyText}>Aucun service disponible</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PURPLE} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F4F3FF' },
  header:       { marginBottom: 16 },
  headerTitle:  { fontSize: 22, fontWeight: '800', color: '#222' },
  headerSub:    { fontSize: 14, color: '#888', marginTop: 2 },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 2 },
  cardIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardNom:      { fontSize: 16, fontWeight: '700', color: '#222' },
  cardDesc:     { fontSize: 13, color: '#888', marginTop: 2 },
  cardMeta:     { flexDirection: 'row', gap: 10, marginTop: 6 },
  metaChip:     { flexDirection: 'row', alignItems: 'center' },
  metaPrix:     { fontSize: 13, color: PURPLE, fontWeight: '600' },
  metaDuree:    { fontSize: 13, color: '#888' },
  emptyWrap:    { alignItems: 'center', marginTop: 80 },
  emptyText:    { fontSize: 16, color: '#aaa', marginTop: 12 },
});