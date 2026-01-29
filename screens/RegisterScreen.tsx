import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { supabase } from '../supabase/Config';

export const RegisterScreen = ({ navigation }: any) => {
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [pais, setPais] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted) {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });
            if (!result.canceled) setImageUri(result.assets[0].uri);
        } else {
            Alert.alert("Error", "Permiso denegado");
        }
    };

    const registrar = async () => {
        if (!nombre || !edad || !pais || !correo || !password) {
            Alert.alert("Error", "Llena todos los campos");
            return;
        }

        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: correo,
                password: password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No se pudo crear usuario");

            const userId = authData.user.id;
            let fotoUrl = null;

            if (imageUri) {
                const file = new File(imageUri);
                const matrizBits = await file.bytes();

                const filePath = `usuarios/${userId}/foto.png`;

                const { error: uploadError } = await supabase.storage
                    .from('jugadores')
                    .upload(filePath, matrizBits, { 
                        contentType: 'image/png', 
                        upsert: true 
                    });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('jugadores').getPublicUrl(filePath);
                fotoUrl = data.publicUrl;
            }

            const { error: dbError } = await supabase
                .from('usuarios')
                .insert([{
                    id: userId,
                    nombre: nombre,
                    edad: edad,
                    pais: pais,
                    correo: correo,
                    puntaje_maximo: 0,
                    insectos_atrapados: 0,
                    foto_perfil: fotoUrl
                }]);

            if (dbError) throw dbError;

            Alert.alert("Éxito", "Cuenta creada");
            navigation.replace('Login');

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>REGISTRO</Text>
            
            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarPreview}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.avatarPlaceholder}>+</Text>
                    )}
                </TouchableOpacity>
                <View style={styles.photoButtons}>
                    <TouchableOpacity onPress={pickImage}><Text style={styles.link}>Galería</Text></TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto}><Text style={styles.link}>Cámara</Text></TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>NOMBRE</Text>
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu Nombre" placeholderTextColor="#aaa"/>

                <Text style={styles.label}>EDAD</Text>
                <TextInput style={styles.input} value={edad} onChangeText={setEdad} keyboardType="numeric" placeholder="Tu Edad" placeholderTextColor="#aaa"/>

                <Text style={styles.label}>PAÍS</Text>
                <TextInput style={styles.input} value={pais} onChangeText={setPais} placeholder="Tu País" placeholderTextColor="#aaa"/>

                <Text style={styles.label}>CORREO</Text>
                <TextInput style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize='none' placeholder="correo@test.com" placeholderTextColor="#aaa"/>

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="******" placeholderTextColor="#aaa"/>

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={registrar} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "CARGANDO..." : "CREAR CUENTA"}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.linkBack}>Volver al Login</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#000000', padding: 30, justifyContent: 'center' },
    title: { fontSize: 30, fontWeight: 'bold', color: '#36c150', marginBottom: 20, textAlign: 'center' },
    avatarSection: { alignItems: 'center', marginBottom: 20 },
    avatarPreview: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#36c150', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarPlaceholder: { color: '#36c150', fontSize: 40 },
    photoButtons: { flexDirection: 'row', gap: 20, marginTop: 10 },
    form: { gap: 15 },
    label: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    input: { backgroundColor: '#1e293b', color: '#fff', padding: 15, borderRadius: 8 },
    button: { backgroundColor: '#36c150', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#1e293b' },
    buttonText: { color: '#000', fontWeight: 'bold' },
    link: { color: '#36c150', fontSize: 12, fontWeight: 'bold' },
    linkBack: { color: '#94a3b8', textAlign: 'center', marginTop: 30 }
});