import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const WelcomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>A CAZAR!</Text>
        <Text style={styles.subtitle}>Empieza a Jugar YAA!!</Text>
      </View>
      
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnMain} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.textMain}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSec} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.textSec}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', padding: 40 },
  content: { alignItems: 'center', marginBottom: 120 },
  title: { fontSize: 50, fontWeight: '900', color: '#ffffff', letterSpacing: -2 },
  subtitle: { fontSize: 12, color: '#32be5e', letterSpacing: 5, textTransform: 'uppercase', fontWeight: 'bold', backgroundColor: 'rgba(50, 190, 94, 0.1)', padding: 5 },
  buttons: { width: '100%', gap: 15 },
  btnMain: { backgroundColor: '#ffffff', paddingVertical: 20, alignItems: 'center', borderLeftWidth: 8, borderLeftColor: '#32be5e' },
  textMain: { color: '#000000', fontWeight: '900', fontSize: 14, letterSpacing: 2 },
  btnSec: { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)', paddingVertical: 20, alignItems: 'center', backgroundColor: '#0a0a0a' },
  textSec: { color: '#ffffff', fontWeight: '600', fontSize: 14, letterSpacing: 2 },
});