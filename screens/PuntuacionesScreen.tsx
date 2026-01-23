import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/Config';

export const PuntuacionesScreen = ({ navigation }: any) => {
  const [listaUsuarios, setListaUsuarios] = useState<any>([]);

  useEffect(() => {
    const dbRef = ref(db, 'usuarios/');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
          const arrayData = Object.keys(data).map(key => ({
            id: key, 
            ...data[key]
          }));
          arrayData.sort((a:any, b:any) => b.maxScore - a.maxScore);
          setListaUsuarios(arrayData);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MEJORES JUGADORES</Text>
      
      <FlatList
        data={listaUsuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
              <Text style={styles.rank}>#{index + 1}</Text>
              
              <View style={styles.info}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.email}>{item.email}</Text>
              </View>
              
              <Text style={styles.score}>{item.maxScore}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#050505', 
    padding: 20 
  },
  title: { 
    fontSize: 26, 
    color: '#ffffff', 
    fontWeight: '900', 
    textAlign: 'center', 
    marginTop: 50, 
    marginBottom: 40,
    letterSpacing: 8,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(50, 190, 94, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    marginBottom: 15,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  rank: { 
    fontSize: 20, 
    color: '#32be5e', 
    fontWeight: '900', 
    marginRight: 15,
    width: 35,
    textAlign: 'center',
  },
  info: { 
    flex: 1 
  },
  username: { 
    color: '#ffffff', 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5
  },
  email: { 
    color: '#666', 
    fontSize: 11,
    marginTop: 2
  },
  score: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#32be5e',
    backgroundColor: 'rgba(50, 190, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden'
  },
});