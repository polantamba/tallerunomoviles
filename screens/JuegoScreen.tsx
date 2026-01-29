import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
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
  container: { flex: 1, backgroundColor: '#0a0f0d' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: 'rgba(50, 190, 94, 0.2)',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#161b22',
    padding: 10,
    borderRadius: 12,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#30363d'
  },
  label: {
    fontSize: 10,
    color: '#8b949e',
    fontWeight: '700',
    marginBottom: 2,
  },
  value: { fontSize: 22, color: '#32be5e', fontWeight: 'bold' },
  gameArea: { flex: 1 },
  target: { 
    position: 'absolute', 
    width: 90, 
    height: 90, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#32be5e',
  },
  innerTarget: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
  },
  stopBtn: {
    backgroundColor: '#1a1d23',
    marginHorizontal: 50,
    marginBottom: 50,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#32be5e',
  },
  stopText: {
    color: '#32be5e',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 5,
  },
});