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
        <TouchableOpacity 
          style={styles.btnMain}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.textMain}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSec}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.textSec}>REGISTRARSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#36c150',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#36c150',
    letterSpacing: 2,
  },
  buttons: {
    width: '100%',
    gap: 15,
  },
  btnMain: {
    backgroundColor: '#32be5e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textMain: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSec: {
    borderWidth: 1,
    borderColor: '#36c150',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textSec: {
    color: '#fafafa',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

