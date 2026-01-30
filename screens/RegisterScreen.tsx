import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image} from 'react-native';
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
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Tu Nombre" placeholderTextColor="#aaa" />

                <Text style={styles.label}>EDAD</Text>
                <TextInput style={styles.input} value={edad} onChangeText={setEdad} keyboardType="numeric" placeholder="Tu Edad" placeholderTextColor="#aaa" />

                <Text style={styles.label}>PAÍS</Text>
                <TextInput style={styles.input} value={pais} onChangeText={setPais} placeholder="Tu País" placeholderTextColor="#aaa" />

                <Text style={styles.label}>CORREO</Text>
                <TextInput style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize='none' placeholder="correo@test.com" placeholderTextColor="#aaa" />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="******" placeholderTextColor="#aaa" />

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

    container: {
        flexGrow: 1,
        backgroundColor: '#0f172a',
        padding: 30,
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f8fafc',
        marginBottom: 30,
        textAlign: 'center',
        letterSpacing: -1,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30
    },
    avatarPreview: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#1e293b',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#6366f1',
        overflow: 'hidden',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarImage: {
        width: '100%',
        height: '100%'
    },
    avatarPlaceholder: {
        color: '#6366f1',
        fontSize: 40,
        fontWeight: 'bold'
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 15
    },
    form: {
        gap: 20
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6366f1',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#334155',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    link: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '700',
    },
    linkBack: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 14,
    }
});