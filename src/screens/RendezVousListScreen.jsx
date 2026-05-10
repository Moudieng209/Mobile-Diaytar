import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { getRendezVous } from '../services/rendezVousService';
import RendezVousItem from '../components/RendezVousItem';

export default function RendezVousListScreen({ navigation }) {
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRendezVous = async () => {
    try {
      const { data } = await getRendezVous();
      setRendezVous(data);
    } catch {
      /* handle silently */
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRendezVous(); }, []);

  // Rafraîchir la liste quand on revient de l'écran détail
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchRendezVous);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchRendezVous(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#6C63FF" />;

  return (
    <View style={s.container}>
      <FlatList
        data={rendezVous}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <RendezVousItem
            item={item}
            onPress={() => navigation.navigate('RendezVousDetail', { rdv: item })} // ← navigation vers détail
          />
        )}
        ListEmptyComponent={<Text style={s.empty}>Aucun rendez-vous</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  empty: { textAlign: 'center', marginTop: 40, color: '#aaa' },
});