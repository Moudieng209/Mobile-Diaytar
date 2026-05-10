import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function InputField({ placeholder, value, onChangeText, secure = false, keyboardType = 'default', icon }) {
    return (
        <View style={styles.inputContainer}>
            {icon && <Icon name={icon} size={20} color="#6C63FF" style={styles.icon} />}
            <TextInput
                style={[styles.input, icon && styles.inputWithIcon]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secure}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 15,
        color: '#333',
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
});