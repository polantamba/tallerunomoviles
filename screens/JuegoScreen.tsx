import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { supabase, usuarioActual } from '../supabase/Config'; 

const { width, height } = Dimensions.get('window');

export const JuegoScreen = ({ navigation }: any) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [position, setPosition] = useState({ top: 150, left: 100 });
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (playing && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [timeLeft, playing]);

  const moveTarget = () => {
    const maxTop = height - 200; 
    const maxLeft = width - 80; 
    setPosition({ 
        top: Math.floor(Math.random() * (maxTop - 150) + 150), 
        left: Math.floor(Math.random() * maxLeft) 
    });
  };

  useEffect(() => {
    if (playing) {
      const moveInterval = setInterval(() => moveTarget(), 800);
      return () => clearInterval(moveInterval);
    }
  }, [playing]);

  const increaseScore = () => {
    setScore(score + 10);
    moveTarget();
  };

  const handleGameOver = async () => {
    setPlaying(false);

    if (usuarioActual && usuarioActual.id) {
        const currentScore = usuarioActual.puntaje_maximo || 0;
        const newScore = score > currentScore ? score : currentScore;
        const totalInsectos = (usuarioActual.insectos_atrapados || 0) + (score / 10);

        if (score > currentScore) {
            await supabase
                .from('usuarios')
                .update({
                    insectos_atrapados: totalInsectos,
                    puntaje_maximo: newScore
                })
                .eq('id', usuarioActual.id);
        } else {
             await supabase
                .from('usuarios')
                .update({
                    insectos_atrapados: totalInsectos
                })
                .eq('id', usuarioActual.id);
        }

        usuarioActual.insectos_atrapados = totalInsectos;
        usuarioActual.puntaje_maximo = newScore;
    }

    Alert.alert("FIN DEL JUEGO", "Puntos: " + score, [
      { text: "Ver Ranking", onPress: () => { 
          setScore(0); 
          setTimeLeft(60); 
          setPlaying(true); 
          navigation.navigate('Puntuaciones'); 
        }
      },
      { text: "Reiniciar", onPress: () => { 
          setScore(0); 
          setTimeLeft(60); 
          setPlaying(true); 
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.label}>TIEMPO</Text>
          <Text style={styles.value}>{timeLeft}s</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.label}>PUNTOS</Text>
          <Text style={styles.value}>{score}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        {playing && (
          <TouchableOpacity 
              style={[styles.target, { top: position.top, left: position.left }]} 
              onPress={increaseScore}
          >
            <View style={styles.innerTarget} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.stopBtn} onPress={handleGameOver}>
        <Text style={styles.stopText}>DETENER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 110,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: { 
    fontSize: 24, 
    color: '#f8fafc', 
    fontWeight: '800',
  },
  gameArea: { 
    flex: 1 
  },
  target: { 
    position: 'absolute', 
    width: 90, 
    height: 90, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  innerTarget: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    transform: [{ rotate: '45deg' }],
  },
  stopBtn: {
    backgroundColor: '#6366f1',
    marginHorizontal: 40,
    marginBottom: 50,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stopText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});