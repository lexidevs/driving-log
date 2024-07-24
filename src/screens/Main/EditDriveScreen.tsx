import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    TextInput,
    Text,
    Appbar,
    Divider,
    TouchableRipple,
    useTheme,
} from "react-native-paper";
import {
    DatePickerModal,
    en,
    registerTranslation,
    TimePickerModal,
} from "react-native-paper-dates";
import type { StackScreenProps } from "@react-navigation/stack";
import type { DriveProps, HomeStackParamList } from "./HomeStack";

import AttributeChip from "../../components/AttributeChip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { datesToMinutes, minutesToString } from "../../utils";

type EditDriveScreenProps = StackScreenProps<HomeStackParamList, "EditDrive">;

registerTranslation("en", en);

export default function EditDriveScreen({
    navigation,
    route,
}: EditDriveScreenProps) {
    const theme = useTheme();

    const [startDate, setStartDate] = React.useState(
        new Date(route.params.drive.startDate)
    );
    const [endDate, setEndDate] = React.useState(
        new Date(route.params.drive.endDate)
    );
    const [day, setDay] = React.useState(route.params.drive.day);
    const [weather, setWeather] = React.useState(route.params.drive.weather);
    const [notes, setNotes] = React.useState(route.params.drive.notes);

    const [startTimePickerVisible, setStartTimePickerVisible] = React.useState(
        false
    );
    const [endTimePickerVisible, setEndTimePickerVisible] = React.useState(
        false
    );

    const [datePickerVisible, setDatePickerVisible] = React.useState(false);

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Edit drive" />
                <Appbar.Action
                    icon="delete"
                    onPress={() => {
                        AsyncStorage.getItem("drives").then((value) => {
                            // TODO: make sure this can only be called once
                            let drives = JSON.parse(value ? value : "[]");
                            // delete drive with uuid
                            drives = drives.filter(
                                (drive: DriveProps) =>
                                    drive.uuid !== route.params.drive.uuid
                            );
                            AsyncStorage.setItem(
                                "drives",
                                JSON.stringify(drives)
                            );
                            navigation.goBack();
                        });
                    }}
                />
                <Appbar.Action
                    icon="content-save"
                    onPress={() => {
                        AsyncStorage.getItem("drives").then((value) => {
                            let drives = JSON.parse(value ? value : "[]");
                            // find drive with uuid and replace it with this drive
                            drives = drives.map((drive: DriveProps) => {
                                if (drive.uuid === route.params.drive.uuid) {
                                    return {
                                        startDate: startDate.toISOString(),
                                        endDate: endDate.toISOString(),
                                        day: day,
                                        weather: weather,
                                        notes: notes,
                                        uuid: drive.uuid,
                                    };
                                }
                                return drive;
                            });
                            AsyncStorage.setItem(
                                "drives",
                                JSON.stringify(drives)
                            );
                            navigation.goBack();
                        });
                    }}
                />
            </Appbar.Header>

            {/* start time picker */}
            <TimePickerModal
                visible={startTimePickerVisible}
                onDismiss={() => setStartTimePickerVisible(false)}
                onConfirm={({ hours, minutes }) => {
                    setStartDate(new Date(startDate.setHours(hours, minutes)));
                    setStartTimePickerVisible(false);
                }}
                hours={startDate.getHours()}
                minutes={startDate.getMinutes()}
            />

            {/* end time picker */}
            <TimePickerModal
                visible={endTimePickerVisible}
                onDismiss={() => setEndTimePickerVisible(false)}
                onConfirm={({ hours, minutes }) => {
                    setEndDate(new Date(endDate.setHours(hours, minutes)));
                    setEndTimePickerVisible(false);
                }}
                hours={endDate.getHours()}
                minutes={endDate.getMinutes()}
            />

            {/* date picker */}
            <DatePickerModal
                locale="en"
                mode="single"
                visible={datePickerVisible}
                onDismiss={() => setDatePickerVisible(false)}
                onConfirm={({ date }) => {
                    if (date) {
                        let newStartDate = new Date(startDate);
                        let newEndDate = new Date(endDate);
                        newStartDate.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                        );
                        newEndDate.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                        );
                        setStartDate(newStartDate);
                        setEndDate(newEndDate);
                    }
                    setDatePickerVisible(false);
                }}
                date={startDate}
                presentationStyle="pageSheet"
            />
            <ScrollView contentContainerStyle={styles.container}>
                {/* TODO: make look like AddScreen? */}
                {/* Heading for drive length */}
                <Text variant="headlineLarge" style={{ marginVertical: 12 }}>
                    {minutesToString(datesToMinutes(startDate, endDate))} drive
                </Text>

                <Divider style={styles.divider} />

                <View style={styles.attrBoxContainer}>
                    {/* Date attribute */}
                    <TouchableRipple
                        style={styles.pressableStyle}
                        onPress={() => setDatePickerVisible(true)}
                    >
                        <AttributeChip
                            label="Date"
                            value={startDate.toLocaleDateString()}
                            icon="calendar"
                            containerStyle={[
                                styles.attrContainer,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            attributeStyle={styles.attr}
                            valueStyle={styles.attrText}
                            textColor={theme.dark ? "#000000" : "#ffffff"}
                        />
                    </TouchableRipple>

                    {/* Time of day attribute */}
                    <TouchableRipple
                        style={styles.pressableStyle}
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

                    {/* Weather attribute */}
                    <TouchableRipple
                        style={styles.pressableStyle}
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

                    {/* Start time attribute */}
                    <TouchableRipple
                        style={styles.pressableStyle}
                        onPress={() => setStartTimePickerVisible(true)}
                    >
                        <AttributeChip
                            label="Start time"
                            value={startDate.toLocaleTimeString(
                                // getLocales()[0].languageCode
                                //     ? getLocales()[0].languageCode
                                //     : "en-US",
                                "en-US",
                                {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    // hour12: !uses24HourClock(),
                                    hour12: true,
                                }
                            )}
                            icon="clock"
                            containerStyle={[
                                styles.attrContainer,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            attributeStyle={styles.attr}
                            valueStyle={styles.attrText}
                            textColor={theme.dark ? "#000000" : "#ffffff"}
                        />
                    </TouchableRipple>

                    {/* End time attribute */}
                    <TouchableRipple
                        style={styles.pressableStyle}
                        onPress={() => setEndTimePickerVisible(true)}
                    >
                        <AttributeChip
                            label="End time"
                            value={endDate.toLocaleTimeString(
                                // getLocales()[0].languageCode
                                //     ? getLocales()[0].languageCode
                                //     : "en-US",
                                "en-US",
                                {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    // hour12: !uses24HourClock(),
                                    hour12: true,
                                }
                            )}
                            icon="clock"
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

                {/* Divider */}
                <Divider style={styles.divider} />

                {/* Notes */}
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
    attrBoxContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap", // overflow to new line if too long
        margin: 6,
    },
    notesContainer: {
        flex: 1, // Take up all available space on main axis (vertical)
        width: "100%", // Take up all available space on cross axis (horizontal)
        minHeight: 150, // Minimum height of 150, applicable on small screens
    },
    notes: {
        // This will be inside the notesContainer, but it has the same effect
        margin: 12,
        // Take up all available space on main axis (vertical)
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
    },
    pressableStyle: {
        margin: 6,
        borderRadius: 8,
    },
    attrContainer: {
        padding: 8,
        borderRadius: 8,
        minWidth: 120,
    },
    attrText: {
        marginLeft: 6,
    },
    attr: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
});
