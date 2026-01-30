import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { JuegoScreen } from '../screens/JuegoScreen';
import { PuntuacionesScreen } from '../screens/PuntuacionesScreen';
import { PerfilScreen } from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#38bdf8',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: styles.label,
            }}
        >
            <Tab.Screen
                name="Juego"
                component={JuegoScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🎮</Text>,
                    title: 'JUGAR'
                }}
            />
            <Tab.Screen
                name="Puntuaciones"
                component={PuntuacionesScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>🏆</Text>,
                    title: 'TOP'
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{
                    tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>👤</Text>,
                    title: 'PERFIL'
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: { 
        backgroundColor: '#0a0a0a', 
        borderTopWidth: 2, 
        borderTopColor: '#1a1a1a', 
        height: 75, 
        paddingBottom: 15, 
        paddingTop: 10 
    },
    label: { 
        fontSize: 11, 
        fontWeight: '900', 
        textTransform: 'uppercase', 
        letterSpacing: 1, 
        marginTop: 5 
    },
    icon: { 
        fontSize: 24 
    }
});