import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { setUsuarioActual, usuarioActual } from '../firebase/Config';

export const PerfilScreen = ({ navigation }: any) => {

    const handleLogout = () => {
        setUsuarioActual(null);
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{usuarioActual?.username?.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.username}>{usuarioActual?.username}</Text>
                <Text style={styles.email}>{usuarioActual?.email}</Text>
            </View>

            <View style={styles.stats}>
                <View style={styles.box}>
                    <Text style={styles.label}>ATRAPADOS</Text>
                    <Text style={styles.value}>{usuarioActual?.insectsCaught || 0}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.label}>RÉCORD</Text>
                    <Text style={styles.value}>{usuarioActual?.maxScore || 0}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 25,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 50
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 25,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 2,
        borderColor: '#32be5e',
        transform: [{ rotate: '45deg' }],
    },
    avatarText: {
        fontSize: 45,
        color: '#32be5e',
        fontWeight: '900',
        transform: [{ rotate: '-45deg' }],
    },
    username: {
        fontSize: 32,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 3,
        textTransform: 'uppercase'
    },
    email: {
        color: '#32be5e',
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 40,
        gap: 20
    },
    box: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        paddingVertical: 20,
        alignItems: 'center',
        borderRadius: 0,
        borderLeftWidth: 4,
        borderLeftColor: '#32be5e',
        
    },
    label: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    value: {
        fontSize: 28,
        color: '#ffffff',
        fontWeight: '900'
    },
    button: {
        backgroundColor: '#ef4444',
        padding: 20,
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 4,
        textTransform: 'uppercase'
    }
});