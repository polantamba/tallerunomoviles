import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ref, update } from 'firebase/database';
import { db, usuarioActual } from '../firebase/Config'; 

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

  const handleGameOver = () => {
    setPlaying(false);

    if (usuarioActual && usuarioActual.uid) {
        const currentScore = usuarioActual.maxScore || 0;
        const newScore = score > currentScore ? score : currentScore;
        const totalInsects = (usuarioActual.insectsCaught || 0) + (score / 10);

        update(ref(db, 'usuarios/' + usuarioActual.uid), {
            insectsCaught: totalInsects,
            maxScore: newScore
        });

        usuarioActual.insectsCaught = totalInsects;
        usuarioActual.maxScore = newScore;
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
    backgroundColor: '#b0fbd0' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  statBox: {
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    color: '#79adf6',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 24,
    color: '#66e768',
    fontWeight: 'bold',
  },
  gameArea: { 
    flex: 1 
  },
  target: { 
    position: 'absolute', 
    width: 70, 
    height: 70, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(109, 18, 255, 0.2)',
    borderRadius: 35,
  },
  innerTarget: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7104ff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  stopBtn: {
    backgroundColor: '#000000',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  stopText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});