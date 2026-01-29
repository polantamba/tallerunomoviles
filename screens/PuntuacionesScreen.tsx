import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { supabase } from '../supabase/Config';

export const PuntuacionesScreen = ({ navigation }: any) => {
  const [listaUsuarios, setListaUsuarios] = useState<any>([]);

  useEffect(() => {
    const fetchScores = async () => {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('puntaje_maximo', { ascending: false });

        if (data) setListaUsuarios(data);
    };

    fetchScores();
    
    const subscription = supabase
        .channel('usuarios')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'usuarios' }, fetchScores)
        .subscribe();

    return () => { supabase.removeChannel(subscription); }
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
              
              {item.foto_perfil ? (
                  <Image source={{ uri: item.foto_perfil }} style={styles.avatarSmall} />
              ) : (
                  <View style={styles.avatarPlaceholder} />
              )}

              <View style={styles.info}>
                  <Text style={styles.username}>{item.nombre}</Text>
                  <Text style={styles.details}>{item.pais} | {item.puntaje_maximo} pts</Text>
              </View>
              
              <Text style={styles.score}>{item.puntaje_maximo}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', padding: 20 },
  title: { 
    fontSize: 26, 
    color: '#ffffff', 
    fontWeight: '900', 
    textAlign: 'center', 
    marginTop: 50, 
    marginBottom: 40,
    letterSpacing: 4,
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
  avatarSmall: {
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#32be5e'
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 10
  },
  info: { flex: 1 },
  username: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  details: { color: '#666', fontSize: 11, marginTop: 2 },
  score: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#32be5e',
  },
});