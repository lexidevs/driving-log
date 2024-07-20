import { StatusBar } from 'expo-status-bar';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import * as React from 'react';
import App from './src';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Main() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={MD3DarkTheme}>
                <App />
            </PaperProvider>
        </SafeAreaProvider>
    );
}
