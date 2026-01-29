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
                 aspect: [1,1], 
                 quality: 0.5 
             });
        } else {
             result = await ImagePicker.launchImageLibraryAsync({ 
                 mediaTypes: ['images'],
                 allowsEditing: true, 
                 aspect: [1,1], 
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
                        <TextInput style={styles.input} value={tempNombre} onChangeText={setTempNombre} placeholder="Nombre" placeholderTextColor="#666"/>
                        <TextInput style={styles.input} value={tempEdad} onChangeText={setTempEdad} placeholder="Edad" keyboardType="numeric" placeholderTextColor="#666"/>
                        <TextInput style={styles.input} value={tempPais} onChangeText={setTempPais} placeholder="País" placeholderTextColor="#666"/>
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
    container: { flexGrow: 1, backgroundColor: '#000000', padding: 25 },
    header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#32be5e', marginBottom: 15, backgroundColor: '#222' },
    avatarEditing: { opacity: 0.7, borderColor: '#fff' },
    editPhotoText: { color: '#32be5e', fontWeight: 'bold', marginBottom: 10 },
    username: { fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: 2, textTransform: 'uppercase' },
    email: { color: '#32be5e', fontSize: 12, marginTop: 5, fontWeight: 'bold' },
    details: { color: '#888', marginTop: 5 },
    editForm: { width: '100%', gap: 10, marginTop: 10 },
    input: { backgroundColor: '#1e293b', color: '#fff', padding: 10, borderRadius: 5, textAlign: 'center' },
    stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, gap: 20 },
    box: { flex: 1, backgroundColor: '#0a0a0a', paddingVertical: 20, alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#32be5e' },
    label: { color: '#64748b', fontSize: 10, fontWeight: '900', marginBottom: 5 },
    value: { fontSize: 28, color: '#ffffff', fontWeight: '900' },
    button: { padding: 20, alignItems: 'center', borderRadius: 4, marginBottom: 10 },
    btnEdit: { backgroundColor: '#006f50' },
    btnSave: { backgroundColor: '#32be5e' },
    btnLogout: { backgroundColor: '#ef4444' },
    buttonText: { color: '#ffffff', fontWeight: '900', fontSize: 14, letterSpacing: 2 }
});