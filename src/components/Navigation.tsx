import * as React from 'react';
import { HomeScreen, ExportScreen, SettingsScreen, AddScreen } from '../screens';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default function BottomBarNavigation(props) {
    return (
        <NavigationContainer {...props}>
            <Tab.Navigator>
                <Tab.Screen name="Dashboard" component={HomeScreen} options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }} />
                <Tab.Screen name="Export Driving Log" component={ExportScreen} options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="export" color={color} size={26} />
                    ),
                }} />
                <Tab.Screen name="Settings" component={SettingsScreen} options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={26} />
                    ),
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
