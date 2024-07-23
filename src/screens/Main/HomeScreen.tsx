import * as React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import {
    Text,
    FAB,
    Appbar,
    List,
    TouchableRipple,
    Divider,
    ProgressBar,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeScreenProps, DriveProps } from "./HomeStack";
import { useFocusEffect } from "@react-navigation/native";

function minutesToString(minutes: number): string {
    // TODO: move to a utils file
    /*
    Equivalent to: (assuming number is an integer) 
    if (minutes % 60 == 0) {
        return `${Math.trunc(minutes / 60)}h`; // Return just `${hours}h`
    }
    else {
        return `${Math.trunc(minutes / 60)}h ${Math.trunc(minutes % 60)}m`; // Return `${hours}h ${minutes}m`
    }
    */

    return `${Math.trunc(minutes / 60)}h${
        Math.trunc(minutes % 60) == 0 ? "" : ` ${Math.trunc(minutes % 60)}m`
    }`;
}

function HomeScreen({ navigation }: HomeScreenProps) {
    const [drives, setDrives] = React.useState<DriveProps[]>([]);
    const [preferences, setPreferences] = React.useState({
        showDriveTime: true,
        showDriveProgress: true,
        showNightDriveTime: true,
        showNightDriveProgress: true,
        requiredDriveTime: 3000,
        requiredNightDriveTime: 600,
    });

    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem("drives").then((drives) => {
                if (drives !== null) {
                    setDrives(JSON.parse(drives));
                }
            });

            AsyncStorage.getItem("preferences").then((preferences) => {
                if (preferences !== null) {
                    setPreferences(JSON.parse(preferences));
                }
            });
        }, [])
    );

    const driveTime = drives.reduce((acc, drive) => {
        const startDate = new Date(drive.startDate);
        const endDate = new Date(drive.endDate);
        return acc + (endDate.getTime() - startDate.getTime()) / 60000;
    }, 0);

    const nightDriveTime = drives.reduce((acc, drive) => {
        if (!drive.day) {
            const startDate = new Date(drive.startDate);
            const endDate = new Date(drive.endDate);
            return acc + (endDate.getTime() - startDate.getTime()) / 60000;
        }
        return acc;
    }, 0);

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
        const lengthString = minutesToString(length / 60000);

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
                {/* drive progress */}
                {preferences.showDriveTime && (
                    <Text>
                        Total drive time: {minutesToString(driveTime)} /{" "}
                        {minutesToString(preferences.requiredDriveTime)}
                    </Text>
                )}

                {preferences.showDriveProgress && (
                    <>
                        {
                            // If showDriveTime is false, show a title
                            !preferences.showDriveTime && (
                                <Text>Total drive time</Text>
                            )
                        }
                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={
                                    driveTime / preferences.requiredDriveTime
                                }
                                style={styles.progressBar}
                            />
                        </View>
                    </>
                )}

                {/* night drive time */}
                {preferences.showNightDriveTime && (
                    <Text>
                        Total night drive time:{" "}
                        {minutesToString(nightDriveTime)} /{" "}
                        {minutesToString(preferences.requiredNightDriveTime)}
                    </Text>
                )}

                {/* night drive progress */}
                {preferences.showNightDriveProgress && (
                    <>
                        {
                            // If showNightDriveTime is false, show a title
                            !preferences.showNightDriveTime && (
                                <Text>Total night drive time</Text>
                            )
                        }
                        <View style={styles.progressBarContainer}>
                            <ProgressBar
                                progress={
                                    nightDriveTime /
                                    preferences.requiredNightDriveTime
                                }
                                style={styles.progressBar}
                            />
                        </View>
                    </>
                )}

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
    progressBarContainer: {
        width: "100%",
        marginVertical: 6,
    },
    progressBar: {
        marginHorizontal: 12,
    },
});

export default HomeScreen;
