import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ref, set } from 'firebase/database';
import { db, setUsuarioActual } from '../firebase/Config';

export const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registrarUsuario() {
        if (name === '' || email === '' || password === '') {
            Alert.alert("Error", "Llena todo");
            return;
        }

        const nuevoUsuario = {
            username: name,
            email: email,
            password: password,
            maxScore: 0,
            insectsCaught: 0
        };

        set(ref(db, 'usuarios/' + name), nuevoUsuario)
            .then(() => {
                setUsuarioActual(nuevoUsuario);
                Alert.alert("Listo", "Usuario creado");
                navigation.replace('HomeTabs');
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>NUEVA CUENTA</Text>

            <View style={styles.form}>
                <Text style={styles.label}>USUARIO (ID)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: JuanPerez"
                    placeholderTextColor="#64748b"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>CORREO</Text>
                <TextInput
                    style={styles.input}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize='none'
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

                <TouchableOpacity style={styles.button} onPress={registrarUsuario}>
                    <Text style={styles.buttonText}>REGISTRAR</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Volver al Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#2c0085',
        justifyContent: 'center',
        padding: 30
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#38c53b',
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
        backgroundColor: '#4c3782',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#4ace46',
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