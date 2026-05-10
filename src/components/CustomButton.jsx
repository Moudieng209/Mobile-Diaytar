import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function CustomButton({ title, onPress, color = '#2563EB', loading = false }) {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onPress}
            disabled={loading}
        >
            {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.text}>{title}</Text>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 6,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});