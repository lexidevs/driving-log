import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
    Button,
    Checkbox,
    TextInput,
    Text,
    MD3DarkTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { HomeScreen, ExportScreen, SettingsScreen } from "./screens";
import BottomBarNavigation from "./components/Navigation";
// status bar
import { StatusBar } from "expo-status-bar";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    return (
        <>
            <StatusBar style="light" />
            <BottomBarNavigation theme={MD3DarkTheme} />
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
