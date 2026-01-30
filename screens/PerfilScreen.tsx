import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { supabase, setUsuarioActual, usuarioActual } from '../supabase/Config';

export const PerfilScreen = ({ navigation }: any) => {
    const [isEditing, setIsEditing] = useState(false);

    const [tempNombre, setTempNombre] = useState(usuarioActual?.nombre);
    const [tempEdad, setTempEdad] = useState(usuarioActual?.edad);
    const [tempPais, setTempPais] = useState(usuarioActual?.pais);
    const [tempFoto, setTempFoto] = useState(usuarioActual?.foto_perfil);
    const [newImageUri, setNewImageUri] = useState<string | null>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUsuarioActual(null);
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    };

    const pickImage = async (useCamera: boolean) => {
        if (!isEditing) return;

        let result;
        if (useCamera) {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) return Alert.alert("Error", "Permiso requerido");
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5
            });
        }

        if (!result.canceled) {
            setNewImageUri(result.assets[0].uri);
            setTempFoto(result.assets[0].uri);
        }
    };

    const saveChanges = async () => {
        try {
            let fotoFinalUrl = usuarioActual.foto_perfil;

            if (newImageUri) {
                const file = new File(newImageUri);
                const matrizBits = await file.bytes();

                const filePath = `usuarios/${usuarioActual.id}/foto.png`;

                await supabase.storage.from('jugadores').upload(filePath, matrizBits, {
                    contentType: 'image/png',
                    upsert: true
                });

                const { data } = supabase.storage.from('jugadores').getPublicUrl(filePath);
                fotoFinalUrl = data.publicUrl + `?t=${new Date().getTime()}`;
            }

            const { error } = await supabase
                .from('usuarios')
                .update({
                    nombre: tempNombre,
                    edad: tempEdad,
                    pais: tempPais,
                    foto_perfil: fotoFinalUrl
                })
                .eq('id', usuarioActual.id);

            if (error) throw error;

            Object.assign(usuarioActual, {
                nombre: tempNombre,
                edad: tempEdad,
                pais: tempPais,
                foto_perfil: fotoFinalUrl
            });

            setIsEditing(false);
            Alert.alert("Éxito", "Perfil actualizado");

        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => isEditing && Alert.alert("Foto", "Seleccionar", [
                    { text: "Galería", onPress: () => pickImage(false) },
                    { text: "Cámara", onPress: () => pickImage(true) },
                    { text: "Cancelar", style: "cancel" }
                ])}>
                    <Image source={{ uri: tempFoto || usuarioActual?.foto_perfil }} style={[styles.avatar, isEditing && styles.avatarEditing]} />
                    {isEditing && <Text style={styles.editPhotoText}>CAMBIAR FOTO</Text>}
                </TouchableOpacity>

                {isEditing ? (
                    <View style={styles.editForm}>
                        <TextInput style={styles.input} value={tempNombre} onChangeText={setTempNombre} placeholder="Nombre" placeholderTextColor="#666" />
                        <TextInput style={styles.input} value={tempEdad} onChangeText={setTempEdad} placeholder="Edad" keyboardType="numeric" placeholderTextColor="#666" />
                        <TextInput style={styles.input} value={tempPais} onChangeText={setTempPais} placeholder="País" placeholderTextColor="#666" />
                    </View>
                ) : (
                    <>
                        <Text style={styles.username}>{usuarioActual?.nombre}</Text>
                        <Text style={styles.email}>{usuarioActual?.correo}</Text>
                        <Text style={styles.details}>{usuarioActual?.pais} | {usuarioActual?.edad} años</Text>
                    </>
                )}
            </View>

            <View style={styles.stats}>
                <View style={styles.box}>
                    <Text style={styles.label}>ATRAPADOS</Text>
                    <Text style={styles.value}>{usuarioActual?.insectos_atrapados || 0}</Text>
                </View>

                <View style={styles.box}>
                    <Text style={styles.label}>RÉCORD</Text>
                    <Text style={styles.value}>{usuarioActual?.puntaje_maximo || 0}</Text>
                </View>
            </View>

            <TouchableOpacity style={[styles.button, isEditing ? styles.btnSave : styles.btnEdit]} onPress={isEditing ? saveChanges : () => setIsEditing(true)}>
                <Text style={styles.buttonText}>{isEditing ? "GUARDAR CAMBIOS" : "EDITAR PERFIL"}</Text>
            </TouchableOpacity>

            {!isEditing && (
                <TouchableOpacity style={[styles.button, styles.btnLogout]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#0f172a',
        padding: 25
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#6366f1',
        marginBottom: 15,
        backgroundColor: '#1e293b',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8,
    },
    avatarEditing: {
        opacity: 0.7,
        borderColor: '#f8fafc',
    },
    editPhotoText: {
        color: '#6366f1',
        fontWeight: '700',
        marginBottom: 10,
        fontSize: 14,
    },
    username: {
        fontSize: 28,
        fontWeight: '800',
        color: '#f8fafc',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    email: {
        color: '#6366f1',
        fontSize: 14,
        marginTop: 5,
        fontWeight: '600',
    },
    details: {
        color: '#94a3b8',
        marginTop: 5,
        fontSize: 14,
    },
    editForm: {
        width: '100%',
        gap: 15,
        marginTop: 15
    },
    input: {
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#334155',
        fontSize: 16,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 15
    },
    box: {
        flex: 1,
        backgroundColor: '#1e293b',
        paddingVertical: 20,
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        fontSize: 24,
        color: '#f8fafc',
        fontWeight: '800',
    },
    button: {
        padding: 18,
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    btnEdit: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: '#6366f1',
    },
    btnSave: {
        backgroundColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOpacity: 0.3,
        elevation: 5,
    },
    btnLogout: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#ef4444',
        marginTop: 10,
    },
    buttonText: {
        color: '#f8fafc',
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: 0.5,
    }
});