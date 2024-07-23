import {
    View,
    StyleSheet,
    useWindowDimensions,
    TextInput as TextInputNative,
} from "react-native";
import { MD2Theme, Text, useTheme } from "react-native-paper";

import {
    clockTypes,
    PossibleClockTypes,
} from "react-native-paper-dates/src/Time/timeUtils";
import LengthInput from "./LengthInput";
import Color from "color";
import { memo, useCallback, useRef } from "react";
import React from "react";
import { sharedStyles } from "react-native-paper-dates/src/shared/styles";

function LengthInputs({
    hours,
    minutes,
    onFocusInput,
    focused,
    onChange,
    inputFontSize,
}: {
    focused: PossibleClockTypes;
    hours: number;
    minutes: number;
    onFocusInput: (type: PossibleClockTypes) => any;
    onChange: (hoursMinutesAndFocused: {
        hours: number;
        minutes: number;
        focused?: undefined | PossibleClockTypes;
    }) => any;
    inputFontSize?: number;
}) {
    const theme = useTheme();

    const startInput = useRef<TextInputNative | null>(null);
    const endInput = useRef<TextInputNative | null>(null);
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

    const onSubmitStartInput = useCallback(() => {
        if (endInput.current) {
            endInput.current.focus();
        }
    }, [endInput]);

    const onSubmitEndInput = useCallback(() => {
        // TODO: close modal and persist time
    }, []);

    return (
        <View style={[styles.inputContainer, isLandscape && sharedStyles.root]}>
            <View style={styles.column}>
                <LengthInput
                    ref={startInput}
                    inputFontSize={inputFontSize}
                    placeholder={"00"}
                    value={hours}
                    clockType={clockTypes.hours}
                    pressed={focused === clockTypes.hours}
                    onPress={onFocusInput}
                    maxFontSizeMultiplier={1.2}
                    selectionColor={
                        theme.dark
                            ? Color(theme.colors.primary).darken(0.2).hex()
                            : theme.colors.primary
                    }
                    returnKeyType={"next"}
                    onSubmitEditing={onSubmitStartInput}
                    blurOnSubmit={false}
                    onChanged={(newHours) => {
                        onChange({
                            hours: newHours,
                            minutes,
                        });
                    }}
                />
                <Text maxFontSizeMultiplier={1.5} variant="bodySmall">
                    Hours
                </Text>
            </View>
            <View
                style={[
                    styles.hoursAndMinutesSeparator,
                    // eslint-disable-next-line react-native/no-inline-styles
                    { marginBottom: 24 },
                ]}
            >
                <View style={sharedStyles.root} />
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: theme?.isV3
                                ? theme.colors.onSurface
                                : ((theme as any) as MD2Theme).colors.text,
                        },
                    ]}
                />
                <View style={styles.betweenDot} />
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor: theme?.isV3
                                ? theme.colors.onSurface
                                : ((theme as any) as MD2Theme).colors.text,
                        },
                    ]}
                />
                <View style={sharedStyles.root} />
            </View>
            <View style={styles.column}>
                <LengthInput
                    ref={endInput}
                    inputFontSize={inputFontSize}
                    placeholder={"00"}
                    value={minutes}
                    clockType={clockTypes.minutes}
                    pressed={focused === clockTypes.minutes}
                    onPress={onFocusInput}
                    maxFontSizeMultiplier={1.2}
                    selectionColor={
                        theme.dark
                            ? Color(theme.colors.primary).darken(0.2).hex()
                            : theme.colors.primary
                    }
                    onSubmitEditing={onSubmitEndInput}
                    onChanged={(newMinutesFromInput) => {
                        let newMinutes = newMinutesFromInput;
                        if (newMinutesFromInput > 59) {
                            newMinutes = 59;
                        }
                        onChange({
                            hours,
                            minutes: newMinutes,
                        });
                    }}
                />
                <Text maxFontSizeMultiplier={1.5} variant="bodySmall">
                    Minutes
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});

export default memo(LengthInputs);
