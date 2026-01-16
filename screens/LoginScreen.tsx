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
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        padding: 30
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
        textAlign: 'center'
    },
    form: {
        marginBottom: 30
    },
    label: {
        color: '#cbd5e1',
        marginBottom: 8,
        fontSize: 12,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#334155',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#006f50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: '#0f172a',
        fontWeight: 'bold',
        fontSize: 16
    },
    link: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 20
    },
});