import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebase/Config'; 

export const RegisterScreen = ({ navigation }: any) => {
    const [nick, setNick] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registrar = () => {
        if (!nick || !age || !email || !password) {
            Alert.alert("Error", "Llena todos los datos");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                const data = {
                    uid: user.uid,
                    username: nick,
                    age: age,
                    email: email,
                    maxScore: 0,
                    insectsCaught: 0
                };

                set(ref(db, 'usuarios/' + user.uid), data)
                    .then(() => {
                        Alert.alert("¡Éxito!", "Cuenta creada. Por favor inicia sesión.");
                        navigation.navigate('Login'); 
                    });
            })
            .catch((error) => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>REGISTRO</Text>
            
            <View style={styles.form}>
                <Text style={styles.label}>NICK</Text>
                <TextInput 
                    style={styles.input} 
                    value={nick} 
                    onChangeText={setNick} 
                    placeholder="Tu Nick" 
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>EDAD</Text>
                <TextInput 
                    style={styles.input} 
                    value={age} 
                    onChangeText={setAge} 
                    keyboardType="numeric" 
                    placeholder="Tu Edad" 
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>CORREO</Text>
                <TextInput 
                    style={styles.input} 
                    value={email} 
                    onChangeText={setEmail} 
                    keyboardType="email-address" 
                    autoCapitalize='none' 
                    placeholder="correo@test.com" 
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput 
                    style={styles.input} 
                    value={password} 
                    onChangeText={setPassword} 
                    secureTextEntry 
                    placeholder="******" 
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={styles.button} onPress={registrar}>
                    <Text style={styles.buttonText}>CREAR CUENTA</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.link}>Volver al Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, 
        backgroundColor: '#000000', 
        padding: 30, justifyContent: 'center' },
    title: { fontSize: 30, fontWeight: 'bold', color: '#36c150', marginBottom: 30, textAlign: 'center' },
    form: { gap: 15 },
    label: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    input: { backgroundColor: '#1e293b', color: '#fff', padding: 15, borderRadius: 8 },
    button: { backgroundColor: '#36c150', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#000', fontWeight: 'bold' },
    link: { color: '#94a3b8', textAlign: 'center', marginTop: 20 }
});