import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';



import BottomNavigator from './BottomNavigator';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      <Stack.Screen 
        name="HomeTabs" 
        component={BottomNavigator} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}