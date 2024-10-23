import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
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
import { minutesToString, datesToMinutes } from "../../utils";
import { v4 as uuidv4 } from "uuid";

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
                    let parsedDrives = JSON.parse(drives);
                    parsedDrives.sort((a: DriveProps, b: DriveProps) => {
                        return (
                            new Date(b.startDate).getTime() -
                            new Date(a.startDate).getTime()
                        );
                    });

                    // TODO: maybe run this only once, instead of doing the computationally expensive sort every time

                    for (let drive of parsedDrives) {
                        if (!drive.uuid) {
                            drive.uuid = uuidv4();
                        }
                    }

                    if (parsedDrives !== drives) {
                        AsyncStorage.setItem(
                            "drives",
                            JSON.stringify(parsedDrives)
                        );
                    }

                    setDrives(parsedDrives);
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
        return (
            acc +
            datesToMinutes(new Date(drive.startDate), new Date(drive.endDate))
        );
    }, 0);

    const nightDriveTime = drives.reduce((acc, drive) => {
        if (!drive.day) {
            return (
                acc +
                datesToMinutes(
                    new Date(drive.startDate),
                    new Date(drive.endDate)
                )
            );
        }
        return acc;
    }, 0);

    const renderDrive = ({ item }: { item: DriveProps }): JSX.Element => {
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
                        keyExtractor={(item) => item.uuid}
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
                {/* TODO: add ability to log a drive now and start a stopwatch, then hit stop button. 
                Possibly include the ability to track when vehicle is stopped or not using location */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
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
