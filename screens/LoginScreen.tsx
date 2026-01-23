import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get, child } from 'firebase/database';
import { auth, db, setUsuarioActual } from '../firebase/Config';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const userId = userCredential.user.uid;
                
                get(child(ref(db), `usuarios/${userId}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        setUsuarioActual(snapshot.val());
                        navigation.replace('HomeTabs');
                    } else {
                        Alert.alert("Error", "Datos no encontrados");
                    }
                });
            })
            .catch((error) => {
                Alert.alert("Error", "Login fallido: " + error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Correo" 
                placeholderTextColor="#aaa"
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize='none'
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                placeholderTextColor="#aaa"
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.buttonText}>ENTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Crear cuenta</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000', padding: 30, justifyContent: 'center', gap: 20 },
    title: { fontSize: 30, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    input: { backgroundColor: '#334155', color: '#fff', padding: 15, borderRadius: 8 },
    button: { backgroundColor: '#006f50', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#94a3b8', textAlign: 'center', marginTop: 10 }
});