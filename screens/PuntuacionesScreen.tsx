import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image} from 'react-native';
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
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a', 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    color: '#f8fafc', 
    fontWeight: '800', 
    textAlign: 'center', 
    marginTop: 50, 
    marginBottom: 30,
    letterSpacing: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rank: { 
    fontSize: 22, 
    color: '#6366f1', 
    fontWeight: '900', 
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  avatarSmall: {
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#6366f1'
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { 
    flex: 1 
  },
  username: { 
    color: '#f8fafc', 
    fontWeight: '700', 
    fontSize: 16,
    marginBottom: 4,
  },
  details: { 
    color: '#94a3b8', 
    fontSize: 12, 
  },
  score: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#6366f1',
    letterSpacing: 0.5,
  },
});