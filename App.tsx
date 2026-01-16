import 'react-native-gesture-handler'; // SIEMPRE PRIMERA LINEA
import React from 'react';
// Asegúrate de que la ruta sea correcta. 
// Si 'navigations' está en la raíz, borra el '/src'
import MainNavigator from './navigations/MainNavigator'; 

export default function App() {
  return (
      <MainNavigator />
  );
}