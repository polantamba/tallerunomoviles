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
        padding: 30,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 50
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00ff22',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: {
        fontSize: 40,
        color: '#1e293b',
        fontWeight: 'bold'
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    email: {
        color: '#94a3b8',
        marginTop: 5
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
        gap: 10,
    },
    box: {
        flex: 1,
        backgroundColor: '#004ab1',
        padding: 20,
        alignItems: 'center',
        borderRadius: 8
    },
    label: {
        color: '#cbd5e1',
        fontSize: 12,
        marginBottom: 10
    },
    value: {
        fontSize: 24,
        color: '#03ff31',
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#ef4444',
        padding: 15,
        alignItems: 'center',
        borderRadius: 8
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
