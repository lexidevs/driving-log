import { StatusBar } from "expo-status-bar";
import { AppRegistry, StyleSheet, Text, View, useColorScheme } from "react-native";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import * as React from "react";
import App from "./src";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { polyfillWebCrypto } from 'expo-standard-web-crypto';

polyfillWebCrypto();

export default function Main() {
    // Set default values for preferences
    React.useEffect(() => {
        AsyncStorage.getItem("preferences").then((preferences) => {
            if (preferences === null) {
                AsyncStorage.setItem(
                    "preferences",
                    JSON.stringify({
                        showDriveTime: true,
                        showDriveProgress: true,
                        showNightDriveTime: true,
                        showNightDriveProgress: true,

                        requiredDriveTime: 3000,
                        requiredNightDriveTime: 600,
                    })
                );
            }
        });
    }, []);

    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

    

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <App />
            </PaperProvider>
        </SafeAreaProvider>
    );
}
