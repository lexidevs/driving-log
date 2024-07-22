import * as React from "react";
import {
    createStackNavigator,
    StackScreenProps,
} from "@react-navigation/stack";

import { AddScreen, EditDriveScreen, HomeScreen } from "./index";

type DriveProps = {
    startDate: string;
    endDate: string;
    day: boolean;
    weather: string;
    notes?: string;
    // TODO: add uuid?
};

type HomeStackParamList = {
    Home: undefined;
    Add: undefined;
    EditDrive: { drive: DriveProps; index: number };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

type HomeScreenProps = StackScreenProps<HomeStackParamList, "Home">;

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Add" component={AddScreen} />
            <HomeStack.Screen name="EditDrive" component={EditDriveScreen} />
        </HomeStack.Navigator>
    );
};

export default HomeStackScreen;
export { HomeStackParamList, HomeScreenProps, DriveProps };
