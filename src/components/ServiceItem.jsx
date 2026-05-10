import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ServiceItem({ item, onSelect }) {
    return (
        <View style={styles.card}>
            <Text style={styles.nom}>{item.nom}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.prix}>💰 {item.prix} FCFA · ⏱ {item.duree} min</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    nom: { fontSize: 16, fontWeight: 'bold' },
    desc: { color: '#555', marginVertical: 4 },
    prix: { color: '#2563EB', fontWeight: '600' },
});