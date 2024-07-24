import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    TextInput,
    Appbar,
    TouchableRipple,
    Divider,
    useTheme,
} from "react-native-paper";
import type { StackScreenProps } from "@react-navigation/stack";
import type { HomeStackParamList } from "./HomeStack";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import AttributeChip from "../../components/AttributeChip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

type AddScreenProps = StackScreenProps<HomeStackParamList, "Add">;

export default function AddScreen({ navigation }: AddScreenProps) {
    const theme = useTheme();

    const [startDate, setStartDate] = React.useState(new Date(Date.now()));
    const [endDate, setEndDate] = React.useState(new Date(Date.now()));

    const [day, setDay] = React.useState(true);
    const [weather, setWeather] = React.useState("Sunny");
    const [notes, setNotes] = React.useState("");

    const [startTimePickerVisible, setStartTimePickerVisible] = React.useState(
        false
    );
    const [endTimePickerVisible, setEndTimePickerVisible] = React.useState(
        false
    );
    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction
                    onPress={() => navigation.navigate("Home")}
                />
                <Appbar.Content title="Add a previous drive" />
                <Appbar.Action
                    icon="check"
                    onPress={() => {
                        // Save the drive
                        AsyncStorage.getItem("drives").then((value) => {
                            // TODO: potential race condition?? unsure
                            // TODO: add validation
                            let exportedStartDate = new Date(startDate);
                            let exportedEndDate = new Date(endDate);

                            exportedStartDate.setSeconds(0);
                            exportedStartDate.setMilliseconds(0);
                            exportedEndDate.setSeconds(0);
                            exportedEndDate.setMilliseconds(0);

                            let drives = [];
                            if (value) {
                                drives = JSON.parse(value);
                            }
                            drives.push({
                                startDate: exportedStartDate.toISOString(),
                                endDate: exportedEndDate.toISOString(),
                                day,
                                weather,
                                notes,
                                uuid: uuidv4(),
                            });
                            AsyncStorage.setItem(
                                "drives",
                                JSON.stringify(drives)
                            );
                        });
                        navigation.navigate("Home");
                    }}
                />
            </Appbar.Header>

            {/* Time picker */}
            {/* TODO: add ability to start drive on one day and end on another (going past midnight) */}
            <TimePickerModal
                visible={startTimePickerVisible}
                onDismiss={() => setStartTimePickerVisible(false)}
                onConfirm={(time) => {
                    setStartTimePickerVisible(false);
                    if (!time) return;
                    let newStartDate = new Date(startDate);
                    newStartDate.setHours(time.hours, time.minutes);
                    setStartDate(newStartDate);
                }}
                hours={startDate.getHours()}
                minutes={startDate.getMinutes()}
                locale="en"
            />

            <TimePickerModal
                visible={endTimePickerVisible}
                onDismiss={() => setEndTimePickerVisible(false)}
                onConfirm={(time) => {
                    setEndTimePickerVisible(false);
                    if (!time) return;
                    let newEndDate = new Date(endDate);
                    newEndDate.setHours(time.hours, time.minutes);
                    setEndDate(newEndDate);
                }}
                hours={endDate.getHours()}
                minutes={endDate.getMinutes()}
                locale="en"
            />

            <ScrollView contentContainerStyle={styles.formContainer}>
                <View style={styles.inputRow}>
                    <DatePickerInput
                        style={styles.inputMargins}
                        locale="en"
                        label="Date"
                        value={startDate}
                        onChange={(d) => {
                            if (!d) return;

                            let newStartDate = new Date(startDate);
                            let newEndDate = new Date(endDate);
                            newStartDate.setFullYear(
                                d.getFullYear(),
                                d.getMonth(),
                                d.getDate()
                            );
                            newEndDate.setFullYear(
                                d.getFullYear(),
                                d.getMonth(),
                                d.getDate()
                            );
                            setStartDate(newStartDate);
                            setEndDate(newEndDate);
                        }}
                        inputMode="start"
                    />
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.root}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.inputMargins]}
                                label="Start time"
                                right={
                                    <TextInput.Icon
                                        icon="clock"
                                        onPress={() => {
                                            setStartTimePickerVisible(true);
                                        }}
                                    />
                                }
                                value={startDate.toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.root}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.inputMargins]}
                                label="End time"
                                right={
                                    <TextInput.Icon
                                        icon="clock"
                                        onPress={() => {
                                            setEndTimePickerVisible(true);
                                        }}
                                    />
                                }
                                value={endDate.toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                })}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.inputMargins}>
                        <TouchableRipple
                            style={styles.pressableStyle}
                            borderless
                            onPress={() => setDay(!day)}
                        >
                            <AttributeChip
                                label="Time of day"
                                value={day ? "Day" : "Night"}
                                icon={day ? "weather-sunny" : "weather-night"}
                                containerStyle={[
                                    styles.attrContainer,
                                    { backgroundColor: theme.colors.primary },
                                ]}
                                attributeStyle={styles.attr}
                                valueStyle={styles.attrText}
                                textColor={theme.dark ? "#000000" : "#ffffff"}
                            />
                        </TouchableRipple>
                    </View>
                </View>
                <View style={styles.inputRow}>
                    <View style={styles.inputMargins}>
                        <TouchableRipple
                            style={styles.pressableStyle}
                            borderless
                            onPress={() => {
                                switch (weather) {
                                    case "Sunny":
                                        setWeather("Raining");
                                        break;
                                    case "Raining":
                                        setWeather("Snowing");
                                        break;
                                    case "Snowing":
                                        setWeather("Foggy");
                                        break;
                                    case "Foggy":
                                        setWeather("Sunny");
                                        break;
                                }
                            }}
                        >
                            <AttributeChip
                                label="Weather"
                                value={weather}
                                icon={
                                    weather === "Sunny"
                                        ? "weather-sunny"
                                        : weather === "Raining"
                                        ? "weather-pouring"
                                        : weather === "Snowing"
                                        ? "weather-snowy"
                                        : weather === "Foggy"
                                        ? "weather-fog"
                                        : "weather-sunny"
                                }
                                containerStyle={[
                                    styles.attrContainer,
                                    { backgroundColor: theme.colors.primary },
                                ]}
                                attributeStyle={styles.attr}
                                valueStyle={styles.attrText}
                                textColor={theme.dark ? "#000000" : "#ffffff"}
                            />
                        </TouchableRipple>
                    </View>
                </View>
                <Divider
                    style={[
                        styles.divider,
                        {
                            marginVertical: 6,
                        },
                    ]}
                />
                <View style={styles.notesContainer}>
                    <TextInput
                        multiline
                        value={notes}
                        label="Notes"
                        style={styles.notes}
                        onChangeText={(text) => {
                            setNotes(text);
                        }}
                    />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    divider: {
        width: "100%",
    },
    notesContainer: {
        flex: 1, // Take up all available space on main axis (vertical)
        width: "100%", // Take up all available space on cross axis (horizontal)
        minHeight: 150,
    },
    notes: {
        marginTop: 6,
        marginBottom: 12,
        marginHorizontal: 12,
        // Take up all available space on main axis (vertical)
        flex: 1,
    },
    smallTextInput: {
        flexGrow: 1,
    },
    inputMargins: {
        // grow horizontally to take up all available space
        flex: 1,
        marginVertical: 6,
        marginHorizontal: 12,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    pressableStyle: {
        borderRadius: 8,
        width: "100%",
    },
    formContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    attrContainer: {
        padding: 8,
        borderRadius: 8,
        width: "100%",
    },
    attrText: {
        marginLeft: 6,
    },
    attr: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    col: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },

    root: {
        flex: 1,
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
    },
    inputContainer: {
        flexGrow: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },
    input: {
        flexGrow: 1,
        width: "100%",
    },
});
