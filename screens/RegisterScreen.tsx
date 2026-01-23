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