import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
    Checkbox,
    Appbar,
    RadioButton,
    List,
} from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function ExportScreen() {
    const [type, setType] = React.useState("csv");
    const [columns, setColumns] = React.useState([
        "Date",
        "Start Time",
        "End Time",
        "Length",
        "Day",
        "Weather",
        "Notes",
    ]);

    return (
        <>
            <Appbar.Header>
                <Appbar.Content title="Export" />
                <Appbar.Action
                    icon="export-variant"
                    onPress={() => {
                        switch (type) {
                            case "json":
                                // we need to create a json file and share it
                                AsyncStorage.getItem("drives").then((value) => {
                                    if (!value) return;
                                    // create a file (save to cache directory)
                                    FileSystem.writeAsStringAsync(
                                        `${FileSystem.cacheDirectory}drives.json`,
                                        value
                                    ).then(() => {
                                        // share the file
                                        Sharing.shareAsync(
                                            `${FileSystem.cacheDirectory}drives.json`
                                        );
                                    });
                                });

                                break;
                            case "csv":
                                AsyncStorage.getItem("drives").then((value) => {
                                    if (!value) return;
                                    const drives = JSON.parse(value);
                                    // create a csv string
                                    let csv = columns.join(",") + "\n";
                                    drives.forEach(
                                        (drive: {
                                            startDate: string;
                                            endDate: string;
                                            day: boolean;
                                            weather: string;
                                            notes?: string;
                                        }) => {
                                            // TODO: use DriveProps
                                            csv +=
                                                columns
                                                    .map((col) => {
                                                        switch (col) {
                                                            case "Date":
                                                                return new Date(
                                                                    drive.startDate
                                                                ).toLocaleDateString();
                                                            case "Start Time":
                                                                return new Date(
                                                                    drive.startDate
                                                                ).toLocaleTimeString();
                                                            case "End Time":
                                                                return new Date(
                                                                    drive.endDate
                                                                ).toLocaleTimeString();
                                                            case "Length": // minutes
                                                                return Math.floor(
                                                                    new Date(
                                                                        drive.endDate
                                                                    ).getTime() -
                                                                        new Date(
                                                                            drive.startDate
                                                                        ).getTime() /
                                                                            60000
                                                                );
                                                            case "Day":
                                                                return drive.day;
                                                            case "Weather":
                                                                return drive.weather;
                                                            case "Notes":
                                                                return drive.notes;
                                                        }
                                                    })
                                                    .join(",") + "\n";
                                        }
                                    );

                                    // create a file (save to cache directory)
                                    FileSystem.writeAsStringAsync(
                                        `${FileSystem.cacheDirectory}drives.csv`,
                                        csv
                                    ).then(() => {
                                        // share the file
                                        Sharing.shareAsync(
                                            `${FileSystem.cacheDirectory}drives.csv`
                                        );
                                    });
                                });

                                break;
                            case "pdf":
                                // TODO: implement pdf export
                                alert(
                                    "Sorry! PDF export has not been implemented yet."
                                );
                                break;
                        }
                    }}
                />
            </Appbar.Header>
            <ScrollView>
                <View style={styles.container}>
                    {/* ability to export as different types (csv, pdf) */}
                    {/* radio to choose type */}
                    <View style={styles.flexRow}>
                        <View style={{ flex: 1 }}>
                            <List.Section title="Export Type">
                                <RadioButton.Group
                                    onValueChange={(value) => setType(value)}
                                    value={type}
                                >
                                    <RadioButton.Item label="CSV" value="csv" />
                                    <RadioButton.Item label="PDF" value="pdf" />
                                    <RadioButton.Item
                                        label="JSON"
                                        value="json"
                                    />
                                </RadioButton.Group>
                            </List.Section>
                        </View>
                    </View>

                    {/* ability to choose columns to export */}
                    <View style={styles.flexRow}>
                        <View style={{ flex: 1 }}>
                            <List.Section title="Columns">
                                <Checkbox.Item
                                    label="Date"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Date")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        // TODO: abstract this into a function
                                        if (columns.includes("Date")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "Date"
                                                )
                                            );
                                        } else {
                                            setColumns([...columns, "Date"]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="Start Time"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Start Time")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("Start Time")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) =>
                                                        col !== "Start Time"
                                                )
                                            );
                                        } else {
                                            setColumns([
                                                ...columns,
                                                "Start Time",
                                            ]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="End Time"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("End Time")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("End Time")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "End Time"
                                                )
                                            );
                                        } else {
                                            setColumns([
                                                ...columns,
                                                "End Time",
                                            ]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="Length"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Length")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("Length")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "Length"
                                                )
                                            );
                                        } else {
                                            setColumns([...columns, "Length"]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="Day"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Day")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("Day")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "Day"
                                                )
                                            );
                                        } else {
                                            setColumns([...columns, "Day"]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="Weather"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Weather")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("Weather")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "Weather"
                                                )
                                            );
                                        } else {
                                            setColumns([...columns, "Weather"]);
                                        }
                                    }}
                                />
                                <Checkbox.Item
                                    label="Notes"
                                    disabled={type === "json"}
                                    status={
                                        columns.includes("Notes")
                                            ? "checked"
                                            : "unchecked"
                                    }
                                    onPress={() => {
                                        if (columns.includes("Notes")) {
                                            setColumns(
                                                columns.filter(
                                                    (col) => col !== "Notes"
                                                )
                                            );
                                        } else {
                                            setColumns([...columns, "Notes"]);
                                        }
                                    }}
                                />
                            </List.Section>
                        </View>
                    </View>

                    {/* TODO: add ability to choose date range */}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    flexRow: {
        flexDirection: "row",
        width: "100%",
    },
});
