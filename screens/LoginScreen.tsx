import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ref, get, child } from 'firebase/database';
import { db, setUsuarioActual } from '../firebase/Config';

export const LoginScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function login() {
        if (username === '' || password === '') {
            Alert.alert("Error", "Faltan datos");
            return;
        }

        const dbRef = ref(db);

        get(child(dbRef, 'usuarios/' + username)).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.password === password) {
                    setUsuarioActual(userData);
                    navigation.replace('HomeTabs');
                } else {
                    Alert.alert("Error", "Contraseña incorrecta");
                }
            } else {
                Alert.alert("Error", "Usuario no encontrado");
            }
        }).catch(() => {
            Alert.alert("Error", "Revisa tu conexión");
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ACCESO</Text>

            <View style={styles.form}>
                <Text style={styles.label}>USUARIO</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu nombre de usuario"
                    placeholderTextColor="#64748b"
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="****"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>ENTRAR</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Crear cuenta nueva</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        backgroundColor: '#000000', 
        padding: 40, 
        justifyContent: 'center' 
    },
    title: { 
        fontSize: 50, 
        fontWeight: '900', 
        color: '#ffffff', 
        textAlign: 'center',
        letterSpacing: -2,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#32be5e', 
        letterSpacing: 5,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        backgroundColor: 'rgba(50, 190, 94, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: 50,
    },
    form: { 
        gap: 20 
    },
    label: { 
        fontSize: 12,
        color: '#a0a0a0', 
        letterSpacing: 3,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginBottom: -10,
        marginLeft: 2,
    },
    input: { 
        backgroundColor: '#0a0a0a', 
        color: '#ffffff', 
        padding: 18, 
        borderRadius: 0,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        fontSize: 16,
    },
    button: { 
        backgroundColor: '#ffffff', 
        paddingVertical: 20, 
        borderRadius: 0, 
        alignItems: 'center', 
        marginTop: 15,
        borderLeftWidth: 8,
        borderLeftColor: '#32be5e',
    },
    buttonText: { 
        color: '#000000', 
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    link: { 
        color: '#32be5e', 
        textAlign: 'center', 
        marginTop: 25,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    }
});