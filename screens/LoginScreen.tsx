import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase, setUsuarioActual } from '../supabase/Config';

export const LoginScreen = ({ navigation }: any) => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: correo,
                password: password,
            });

            if (error) throw error;

            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (userError) throw userError;

            setUsuarioActual(userData);
            navigation.replace('HomeTabs');

        } catch (error: any) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Correo" 
                placeholderTextColor="#aaa"
                value={correo} 
                onChangeText={setCorreo} 
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