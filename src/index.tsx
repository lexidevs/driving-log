import * as React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { adaptNavigationTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationLightTheme } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomBarNavigation from "./components/Navigation";
// status bar
import { StatusBar } from "expo-status-bar";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationLightTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export default function App() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? DarkTheme : LightTheme;


    return (
        <>
            <StatusBar style="auto" />
            <BottomBarNavigation theme={theme} />
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
