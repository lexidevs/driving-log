import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Checkbox,
    Appbar,
    List,
    TouchableRipple,
    useTheme,
    ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { expo } from "../../app.json";
import { LengthPickerModal } from "../components/time/LengthPickerModal";

export default function SettingsScreen() {
    console.log("rendering!");

    const [isLoading, setIsLoading] = React.useState(true);

    const [timeModalVisible, setTimeModalVisible] = React.useState(false);
    const [nightTimeModalVisible, setNightTimeModalVisible] = React.useState(
        false
    );

    // checkboxes ()
    const [showDriveTime, setShowDriveTime] = React.useState(true);
    const [showDriveProgress, setShowDriveProgress] = React.useState(true);
    const [showNightDriveTime, setShowNightDriveTime] = React.useState(true);
    const [showNightDriveProgress, setShowNightDriveProgress] = React.useState(
        true
    );

    // time inputs for total time modal
    const [requiredDriveTime, setRequiredDriveTime] = React.useState(3000);
    const [requiredNightDriveTime, setRequiredNightDriveTime] = React.useState(
        600
    );

    // load preferences from storage
    React.useEffect(() => {
        AsyncStorage.getItem("preferences").then((preferences) => {
            if (preferences) {
                const parsedPreferences = JSON.parse(preferences);
                setShowDriveTime(parsedPreferences.showDriveTime);
                setShowDriveProgress(parsedPreferences.showDriveProgress);
                setShowNightDriveTime(parsedPreferences.showNightDriveTime);
                setShowNightDriveProgress(
                    parsedPreferences.showNightDriveProgress
                );
                setRequiredDriveTime(parsedPreferences.requiredDriveTime);
                setRequiredNightDriveTime(
                    parsedPreferences.requiredNightDriveTime
                );
            }
            setIsLoading(false);
        });
    }, []);

    // Force the app to wait until the preferences are loaded before rendering
    // This fixes bug where prefs are not loaded and causes issues
    if (isLoading) {
        return <ActivityIndicator />;
    }

    // when total time modal is dismissed (without saving), set the time to the last saved value
    const onDismissTotal = () => {
        setTimeModalVisible(false);
    };

    const onConfirmTotal = ({
        hours,
        minutes,
    }: {
        hours: number;
        minutes: number;
    }) => {
        setTimeModalVisible(false);
        setRequiredDriveTime(hours * 60 + minutes);
    };

    const onDismissNight = () => {
        setNightTimeModalVisible(false);
    };

    const onConfirmNight = ({
        hours,
        minutes,
    }: {
        hours: number;
        minutes: number;
    }) => {
        setNightTimeModalVisible(false);
        setRequiredNightDriveTime(hours * 60 + minutes);
    };

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Settings" />
                <Appbar.Action
                    icon="content-save"
                    onPress={() => {
                        AsyncStorage.setItem(
                            "preferences",
                            JSON.stringify({
                                requiredDriveTime: requiredDriveTime,
                                requiredNightDriveTime: requiredNightDriveTime,
                                showDriveTime: showDriveTime,
                                showDriveProgress: showDriveProgress,
                                showNightDriveTime: showNightDriveTime,
                                showNightDriveProgress: showNightDriveProgress,
                            })
                        );
                    }}
                />
            </Appbar.Header>

            <LengthPickerModal
                visible={timeModalVisible}
                onDismiss={onDismissTotal}
                hours={Math.trunc(requiredDriveTime / 60)}
                minutes={Math.trunc(requiredDriveTime % 60)}
                onConfirm={onConfirmTotal}
            />
            <LengthPickerModal
                visible={nightTimeModalVisible}
                onDismiss={onDismissNight}
                hours={Math.trunc(requiredNightDriveTime / 60)}
                minutes={Math.trunc(requiredNightDriveTime % 60)}
                onConfirm={onConfirmNight}
            />

            <ScrollView>
                <View style={styles.flexRow}>
                    <View style={{ flex: 1 }}>
                        <List.Section title="Drive Time Preferences">
                            <Checkbox.Item
                                label="Show drive time"
                                status={showDriveTime ? "checked" : "unchecked"}
                                onPress={() => setShowDriveTime(!showDriveTime)}
                            />
                            <Checkbox.Item
                                label="Show drive time progress bar"
                                status={
                                    showDriveProgress ? "checked" : "unchecked"
                                }
                                onPress={() =>
                                    setShowDriveProgress(!showDriveProgress)
                                }
                            />
                            <TouchableRipple
                                onPress={() => {
                                    setTimeModalVisible(true);
                                }}
                            >
                                <List.Item
                                    title="Required drive time"
                                    description="The minimum amount of total drive time required."
                                    right={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="chevron-right"
                                        />
                                    )}
                                />
                            </TouchableRipple>
                        </List.Section>

                        <List.Section title="Night Drive Time Preferences">
                            <Checkbox.Item
                                label="Show night drive time"
                                status={
                                    showNightDriveTime ? "checked" : "unchecked"
                                }
                                onPress={() =>
                                    setShowNightDriveTime(!showNightDriveTime)
                                }
                            />
                            <Checkbox.Item
                                label="Show night drive time progress bar"
                                status={
                                    showNightDriveProgress
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() =>
                                    setShowNightDriveProgress(
                                        !showNightDriveProgress
                                    )
                                }
                            />
                            <TouchableRipple
                                onPress={() => {
                                    setNightTimeModalVisible(true);
                                }}
                            >
                                <List.Item
                                    title="Required night drive time"
                                    description="The minimum amount of night driving time required."
                                    right={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="chevron-right"
                                        />
                                    )}
                                />
                            </TouchableRipple>
                        </List.Section>
                        <List.Section title="About">
                            <TouchableRipple
                                onPress={() => {
                                    // link to the GitHub repo
                                    Linking.openURL(
                                        "https://github.com/lexidevs/driving-log"
                                    );
                                }}
                            >
                                <List.Item
                                    title="Version"
                                    description={expo.version}
                                    right={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="chevron-right"
                                        />
                                    )}
                                    left={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="information"
                                        />
                                    )}
                                />
                            </TouchableRipple>
                            <TouchableRipple
                                onPress={() => {
                                    Linking.openURL(
                                        "https://github.com/lexidevs/driving-log/blob/main/third-party-licenses.txt"
                                    );
                                }}
                            >
                                <List.Item
                                    title="Open source licenses"
                                    right={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon="chevron-right"
                                        />
                                    )}
                                    left={(props) => (
                                        <List.Icon {...props} icon="license" />
                                    )}
                                />
                            </TouchableRipple>
                        </List.Section>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: "row",
        width: "100%",
    },
});
