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
    backgroundColor: '#000000', 
    padding: 20 
  },
  title: { 
    fontSize: 22, 
    color: '#fff', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginTop: 40, 
    marginBottom: 20 
  },
  card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#094e22',
      marginBottom: 10,
      padding: 15,
      borderRadius: 8,
  },
  rank: { 
    fontSize: 18, 
    color: '#94a3b8', 
    fontWeight: 'bold', 
    marginRight: 15 
  },
  info: { 
    flex: 1 
  },
  username: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16 
  },
  email: { 
    color: '#cbd5e1', 
    fontSize: 12 
  },
  score: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#7b00ff' 
  },
});
