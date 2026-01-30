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
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        padding: 30
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f8fafc',
        marginBottom: 40,
        textAlign: 'center',
        letterSpacing: -1,
    },
    form: {
        marginBottom: 20
    },
    label: {
        color: '#94a3b8',
        marginBottom: 8,
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: 18,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#334155',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6366f1',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    link: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 25,
        fontSize: 14,
        fontWeight: '600',
    },
});