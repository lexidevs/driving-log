import { StatusBar } from "expo-status-bar";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import * as React from "react";
import App from "./src";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    return (
        <SafeAreaProvider>
            <PaperProvider theme={MD3DarkTheme}>
                <App />
            </PaperProvider>
        </SafeAreaProvider>
    );
}
