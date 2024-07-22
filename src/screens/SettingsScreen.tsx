import Color from "color";
import * as React from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Touchable,
    KeyboardAvoidingView,
    Animated,
    useWindowDimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
    Button,
    Checkbox,
    TextInput,
    Text,
    FAB,
    Appbar,
    List,
    TouchableRipple,
    Modal,
    Portal,
    useTheme,
} from "react-native-paper";
import TimeInput from "react-native-paper-dates/src/Time/TimeInput";
import TimeInputs from "react-native-paper-dates/src/Time/TimeInputs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { expo } from "../../app.json";

export default function SettingsScreen() {
    const theme = useTheme();

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
    const [totalHours, setTotalHours] = React.useState(0);
    const [totalMinutes, setTotalMinutes] = React.useState(0);
    const [savedTotalHours, setSavedTotalHours] = React.useState(0);
    const [savedTotalMinutes, setSavedTotalMinutes] = React.useState(0);
    const [focusedTotal, setFocusedTotal] = React.useState("hours");
    // for night time modal
    const [nightHours, setNightHours] = React.useState(0);
    const [nightMinutes, setNightMinutes] = React.useState(0);
    const [savedNightHours, setSavedNightHours] = React.useState(0);
    const [savedNightMinutes, setSavedNightMinutes] = React.useState(0);
    const [focusedNight, setFocusedNight] = React.useState("hours");

    // when total time modal is dismissed (without saving), set the time to the last saved value
    const onDismissTotal = () => {
        setTimeModalVisible(false);
        setTotalHours(savedTotalHours);
        setTotalMinutes(savedTotalMinutes);

        // reset the focused state
        setFocusedTotal("hours");
    };

    const onConfirmTotal = () => {
        setTimeModalVisible(false);
        setSavedTotalHours(totalHours);
        setSavedTotalMinutes(totalMinutes);

        // reset the focused state
        setFocusedTotal("hours");
    };

    const onDismissNight = () => {
        setNightTimeModalVisible(false);
        setNightHours(savedNightHours);
        setNightMinutes(savedNightMinutes);

        // reset the focused state
        setFocusedNight("hours");
    };

    const onConfirmNight = () => {
        setNightTimeModalVisible(false);
        setSavedNightHours(nightHours);
        setSavedNightMinutes(nightMinutes);

        // reset the focused state
        setFocusedNight("hours");
    };

    React.useEffect(() => {
        AsyncStorage.getItem("preferences").then((value) => {
            const preferences = JSON.parse(value ?? "{}");
            const totalDriveTime = preferences.requiredDriveTime;
            const nightDriveTime = preferences.requiredNightDriveTime;
            const totalDriveTimeHours = Math.trunc(totalDriveTime / 60);
            const totalDriveTimeMinutes = totalDriveTime % 60;
            const nightDriveTimeHours = Math.trunc(nightDriveTime / 60);
            const nightDriveTimeMinutes = nightDriveTime % 60;
            setTotalHours(totalDriveTimeHours);
            setTotalMinutes(totalDriveTimeMinutes);
            setSavedTotalHours(totalDriveTimeHours);
            setSavedTotalMinutes(totalDriveTimeMinutes);

            setNightHours(nightDriveTimeHours);
            setNightMinutes(nightDriveTimeMinutes);
            setSavedNightHours(nightDriveTimeHours);
            setSavedNightMinutes(nightDriveTimeMinutes);

            setShowDriveTime(preferences.showDriveTime);
            setShowDriveProgress(preferences.showDriveProgress);
            setShowNightDriveTime(preferences.showNightDriveTime);
            setShowNightDriveProgress(preferences.showNightDriveProgress);
        });
    }, []); // Run only once

    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

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
                                requiredDriveTime:
                                    totalHours * 60 + totalMinutes,
                                requiredNightDriveTime:
                                    nightHours * 60 + nightMinutes,
                                showDriveTime: showDriveTime,
                                showDriveProgress: showDriveProgress,
                                showNightDriveTime: showNightDriveTime,
                                showNightDriveProgress: showNightDriveProgress,
                            })
                        );
                    }}
                />
            </Appbar.Header>

            {/* Modal to pick drive time */}
            {/* TODO: abstract into component */}
            <Portal>
                <Modal visible={timeModalVisible} onDismiss={onDismissTotal}>
                    {/* copied (and modified) from react-native-paper-dates */}
                    <View
                        style={[StyleSheet.absoluteFill, styles.center]}
                        pointerEvents="box-none"
                    >
                        <KeyboardAvoidingView
                            style={styles.center}
                            behavior="padding"
                        >
                            <Animated.View
                                style={[
                                    styles.modalContent,
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    {
                                        backgroundColor:
                                            theme.colors.elevation.level3,
                                        borderRadius: 28,
                                    },
                                ]}
                            >
                                <View style={styles.labelContainer}>
                                    <Text
                                        maxFontSizeMultiplier={1.5}
                                        style={[
                                            styles.label,
                                            {
                                                ...theme.fonts.labelMedium,
                                                color:
                                                    theme.colors
                                                        .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        Required drive time
                                    </Text>
                                </View>
                                <View style={styles.timePickerContainer}>
                                    <View
                                        style={[
                                            styles.inputContainer,
                                            isLandscape && styles.root,
                                        ]}
                                    >
                                        <View style={styles.column}>
                                            <TimeInput
                                                // ref={startInput}
                                                // inputFontSize={inputFontSize}
                                                placeholder={"00"}
                                                maxLength={undefined}
                                                value={totalHours}
                                                clockType={"hours"}
                                                pressed={
                                                    focusedTotal === "hours"
                                                }
                                                onPress={() => {
                                                    setFocusedTotal("hours");
                                                }}
                                                inputType={"keyboard"}
                                                maxFontSizeMultiplier={1.2}
                                                selectionColor={
                                                    theme.dark
                                                        ? Color(
                                                              theme.colors
                                                                  .primary
                                                          )
                                                              .darken(0.2)
                                                              .hex()
                                                        : theme.colors.primary
                                                }
                                                returnKeyType={"next"}
                                                blurOnSubmit={false}
                                                onChanged={(
                                                    newHoursFromInput
                                                ) => {
                                                    setTotalHours(
                                                        newHoursFromInput
                                                    );
                                                }}
                                            />

                                            <Text
                                                maxFontSizeMultiplier={1.5}
                                                variant="bodySmall"
                                            >
                                                Hour
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.hoursAndMinutesSeparator,
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    marginBottom: 24,
                                                },
                                            ]}
                                        >
                                            <View style={styles.root} />
                                            <View
                                                style={[
                                                    styles.dot,
                                                    {
                                                        // backgroundColor: theme?.isV3
                                                        //     ? theme.colors
                                                        //           .onSurface
                                                        //     : ((theme as any) as MD2Theme)
                                                        //           .colors.text,
                                                        backgroundColor:
                                                            theme.colors
                                                                .onSurface,
                                                    },
                                                ]}
                                            />
                                            <View style={styles.betweenDot} />
                                            <View
                                                style={[
                                                    styles.dot,
                                                    {
                                                        // backgroundColor: theme?.isV3
                                                        //     ? theme.colors
                                                        //           .onSurface
                                                        //     : ((theme as any) as MD2Theme)
                                                        //           .colors.text,
                                                        backgroundColor:
                                                            theme.colors
                                                                .onSurface,
                                                    },
                                                ]}
                                            />
                                            <View style={styles.root} />
                                        </View>
                                        <View style={styles.column}>
                                            <TimeInput
                                                // ref={endInput}
                                                // inputFontSize={inputFontSize}
                                                placeholder={"00"}
                                                value={totalMinutes}
                                                clockType={"minutes"}
                                                pressed={
                                                    focusedTotal === "minutes"
                                                }
                                                onPress={() => {
                                                    setFocusedTotal("minutes");
                                                }}
                                                inputType={"keyboard"}
                                                maxFontSizeMultiplier={1.2}
                                                selectionColor={
                                                    theme.dark
                                                        ? Color(
                                                              theme.colors
                                                                  .primary
                                                          )
                                                              .darken(0.2)
                                                              .hex()
                                                        : theme.colors.primary
                                                }
                                                // onSubmitEditing={
                                                //     onSubmitEndInput
                                                // }
                                                onChanged={(
                                                    newMinutesFromInput
                                                ) => {
                                                    let newMinutes = newMinutesFromInput;
                                                    if (
                                                        newMinutesFromInput > 59
                                                    ) {
                                                        newMinutes = 59;
                                                    }
                                                    setTotalMinutes(newMinutes);

                                                    // onChange({
                                                    //     hours,
                                                    //     minutes: newMinutes,
                                                    // });
                                                }}
                                            />
                                            <Text
                                                maxFontSizeMultiplier={1.5}
                                                variant="bodySmall"
                                            >
                                                Minute
                                            </Text>
                                        </View>
                                    </View>

                                    {/* </TimeInputs> */}
                                </View>
                                <View style={styles.bottom}>
                                    <View style={styles.root} />
                                    <Button onPress={onDismissTotal}>
                                        <Text>Cancel</Text>
                                    </Button>
                                    <Button onPress={onConfirmTotal}>
                                        <Text>Confirm</Text>
                                    </Button>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Modal to pick night drive time */}
                <Modal
                    visible={nightTimeModalVisible}
                    onDismiss={onDismissNight}
                >
                    <View
                        style={[StyleSheet.absoluteFill, styles.center]}
                        pointerEvents="box-none"
                    >
                        <KeyboardAvoidingView
                            style={styles.center}
                            behavior="padding"
                        >
                            <Animated.View
                                style={[
                                    styles.modalContent,
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    {
                                        backgroundColor:
                                            theme.colors.elevation.level3,
                                        borderRadius: 28,
                                    },
                                ]}
                            >
                                <View style={styles.labelContainer}>
                                    <Text
                                        maxFontSizeMultiplier={1.5}
                                        style={[
                                            styles.label,
                                            {
                                                ...theme.fonts.labelMedium,
                                                color:
                                                    theme.colors
                                                        .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        Required night drive time
                                    </Text>
                                </View>
                                <View style={styles.timePickerContainer}>
                                    <View
                                        style={[
                                            styles.inputContainer,
                                            isLandscape && styles.root,
                                        ]}
                                    >
                                        <View style={styles.column}>
                                            <TimeInput
                                                // ref={startInput}
                                                // inputFontSize={inputFontSize}
                                                placeholder={"00"}
                                                maxLength={undefined}
                                                value={nightHours}
                                                clockType={"hours"}
                                                pressed={
                                                    focusedNight === "hours"
                                                }
                                                onPress={() => {
                                                    setFocusedNight("hours");
                                                }}
                                                inputType={"keyboard"}
                                                maxFontSizeMultiplier={1.2}
                                                selectionColor={
                                                    theme.dark
                                                        ? Color(
                                                              theme.colors
                                                                  .primary
                                                          )
                                                              .darken(0.2)
                                                              .hex()
                                                        : theme.colors.primary
                                                }
                                                returnKeyType={"next"}
                                                blurOnSubmit={false}
                                                onChanged={(
                                                    newHoursFromInput
                                                ) => {
                                                    setNightHours(
                                                        newHoursFromInput
                                                    );
                                                }}
                                            />

                                            <Text
                                                maxFontSizeMultiplier={1.5}
                                                variant="bodySmall"
                                            >
                                                Hour
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.hoursAndMinutesSeparator,
                                                // eslint-disable-next-line react-native/no-inline-styles
                                                {
                                                    marginBottom: 24,
                                                },
                                            ]}
                                        >
                                            <View style={styles.root} />
                                            <View
                                                style={[
                                                    styles.dot,
                                                    {
                                                        // backgroundColor: theme?.isV3
                                                        //     ? theme.colors
                                                        //           .onSurface
                                                        //     : ((theme as any) as MD2Theme)
                                                        //           .colors.text,
                                                        backgroundColor:
                                                            theme.colors
                                                                .onSurface,
                                                    },
                                                ]}
                                            />
                                            <View style={styles.betweenDot} />

                                            <View
                                                style={[
                                                    styles.dot,
                                                    {
                                                        // backgroundColor: theme?.isV3
                                                        //     ? theme.colors
                                                        //           .onSurface
                                                        //     : ((theme as any) as MD2Theme)
                                                        //           .colors.text,
                                                        backgroundColor:
                                                            theme.colors
                                                                .onSurface,
                                                    },
                                                ]}
                                            />
                                            <View style={styles.root} />
                                        </View>
                                        <View style={styles.column}>
                                            <TimeInput
                                                // ref={endInput}
                                                // inputFontSize={inputFontSize}
                                                placeholder={"00"}
                                                value={nightMinutes}
                                                clockType={"minutes"}
                                                pressed={
                                                    focusedNight === "minutes"
                                                }
                                                onPress={() => {
                                                    setFocusedNight("minutes");
                                                }}
                                                inputType={"keyboard"}
                                                maxFontSizeMultiplier={1.2}
                                                selectionColor={
                                                    theme.dark
                                                        ? Color(
                                                              theme.colors
                                                                  .primary
                                                          )
                                                              .darken(0.2)
                                                              .hex()
                                                        : theme.colors.primary
                                                }
                                                // onSubmitEditing={
                                                //     onSubmitEndInput
                                                // }
                                                onChanged={(
                                                    newMinutesFromInput
                                                ) => {
                                                    let newMinutes = newMinutesFromInput;
                                                    if (
                                                        newMinutesFromInput > 59
                                                    ) {
                                                        newMinutes = 59;
                                                    }
                                                    setNightMinutes(newMinutes);

                                                    // onChange({
                                                    //     hours,
                                                    //     minutes: newMinutes,
                                                    // });
                                                }}
                                            />
                                            <Text
                                                maxFontSizeMultiplier={1.5}
                                                variant="bodySmall"
                                            >
                                                Minute
                                            </Text>
                                        </View>
                                    </View>

                                    {/* </TimeInputs> */}
                                </View>
                                <View style={styles.bottom}>
                                    <View style={styles.root} />
                                    <Button onPress={onDismissNight}>
                                        <Text>Cancel</Text>
                                    </Button>
                                    <Button onPress={onConfirmNight}>
                                        <Text>Confirm</Text>
                                    </Button>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            </Portal>

            <ScrollView contentContainerStyle={styles.container}>
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
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    flexRow: {
        flexDirection: "row",
        width: "100%",
    },

    bottom: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    inputTypeToggle: {
        margin: 4,
    },
    labelContainer: {
        justifyContent: "flex-end",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
    },
    label: {
        letterSpacing: 1,
        fontSize: 13,
    },
    modalContent: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 3,
        minWidth: 287,
        paddingVertical: 8,
    },
    timePickerContainer: {
        paddingLeft: 24,
        paddingTop: 20,
        paddingBottom: 16,
        paddingRight: 24,
    },
    flexDirectionRow: {
        flexDirection: "row",
    },
    opacity0: {
        opacity: 0,
    },
    opacity1: {
        opacity: 1,
    },
    overflowHidden: {
        overflow: "hidden",
    },
    root: {
        flex: 1,
    },
    betweenDot: {
        height: 12,
    },
    column: {
        flexDirection: "column",
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 7 / 2,
    },
    hoursAndMinutesSeparator: {
        fontSize: 65,
        width: 24,
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    spaceBetweenInputsAndSwitcher: {
        width: 12,
    },
});
