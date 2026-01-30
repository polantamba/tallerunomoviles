import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';


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
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a', 
    justifyContent: 'center', 
    paddingHorizontal: 30, 
  },
  
  content: { 
    alignItems: 'center', 
    marginBottom: 80, 
  },
  
  title: { 
    fontSize: 48, 
    fontWeight: '800', 
    color: '#f8fafc', 
    letterSpacing: -1, 
    textAlign: 'center',
    marginBottom: 10,
  },
  
  subtitle: { 
    fontSize: 13, 
    color: '#c084fc', 
    letterSpacing: 4, 
    textTransform: 'uppercase', 
    fontWeight: '700', 
    backgroundColor: 'rgba(192, 132, 252, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8, 
    overflow: 'hidden',
  },
  
  buttons: { 
    width: '100%', 
    gap: 16, 
  },
  
  btnMain: { 
    backgroundColor: '#6366f1', 
    paddingVertical: 18, 
    alignItems: 'center', 
    borderRadius: 16, 
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  
  textMain: { 
    color: '#ffffff', 
    fontWeight: '800', 
    fontSize: 16, 
    letterSpacing: 1,
  },
  
  btnSec: { 
    paddingVertical: 18, 
    alignItems: 'center', 
    backgroundColor: 'transparent', 
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155', 
  },
  
  textSec: { 
    color: '#94a3b8', 
    fontWeight: '600', 
    fontSize: 15, 
    letterSpacing: 1,
  },
});