import {
    createStackNavigator,
    StackScreenProps,
} from "@react-navigation/stack";
import * as React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import {
    Button,
    Checkbox,
    TextInput,
    Text,
    FAB,
    Appbar,
    List,
    useTheme,
    MD3Colors,
    TouchableRipple,
    Divider,
} from "react-native-paper";

import AddScreen from "./AddScreen";
import EditDriveScreen from "./EditDriveScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
    InspectDrive: {
        date: string;
        length: number;
        startTime: string;
        endTime: string;
        day: boolean;
        weather: string;
        notes?: string;
        lengthString: string;
    };
    EditDrive: { drive: DriveProps; index: number };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

type HomeScreenProps = StackScreenProps<HomeStackParamList, "Home">;

function HomeScreen({ navigation }: HomeScreenProps) {
    const [drives, setDrives] = React.useState<DriveProps[]>([]);
    AsyncStorage.getItem("drives").then((value) => {
        setDrives(JSON.parse(value ?? "[]"));
    });

    const renderDrive = ({
        item,
        index,
    }: {
        item: DriveProps;
        index: number;
    }): JSX.Element => {
        const icon = item.day ? "weather-sunny" : "weather-night";
        // Use modulo to get minutes, then subtract that from length to get a multiple of 60
        // Then divide by 60 to get hours
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const length = endDate.getTime() - startDate.getTime();
        const lengthString = `${Math.floor(length / 3600000)}h ${Math.floor(
            (length % 3600000) / 60000
        )}m`;

        const title = `${lengthString} drive on ${startDate.toLocaleDateString(
            "en-US"
        )}`;
        const notes = item.notes ? item.notes : "No notes";
        return (
            <TouchableRipple
                onPress={() =>
                    navigation.navigate("EditDrive", {
                        drive: item,
                        index: index,
                    })
                }
            >
                <List.Item
                    title={title}
                    description={notes}
                    left={(props) => <List.Icon {...props} icon={icon} />}
                    right={(props) => (
                        <List.Icon {...props} icon="chevron-right" />
                    )}
                />
            </TouchableRipple>
        );
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Driving Log" />
            </Appbar.Header>
            <View style={styles.container}>
                {/* List previous drives, each is pressable */}
                <List.Section style={{ width: "100%", flex: 1 }}>
                    <FlatList
                        data={drives}
                        renderItem={renderDrive}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={Divider}
                    />
                </List.Section>

                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => {
                        navigation.navigate("Add");
                    }}
                />
            </View>
        </>
    );
}

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Add" component={AddScreen} />
            <HomeStack.Screen name="EditDrive" component={EditDriveScreen} />
        </HomeStack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        // justifyContent: 'center',
        alignItems: "center",
        height: "100%",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    drive: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default HomeStackScreen;

export { HomeStackScreen, HomeStackParamList };
