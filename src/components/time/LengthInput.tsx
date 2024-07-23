import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme, MD2Theme } from "react-native-paper";

import {
    PossibleClockTypes,
    useInputColors,
} from "react-native-paper-dates/src/Time/timeUtils";
import { forwardRef, useEffect, useState } from "react";
import React from "react";

interface TimeInputProps
    extends Omit<Omit<Omit<TextInputProps, "value">, "onFocus">, "onPress"> {
    value: number;
    clockType: PossibleClockTypes;
    onPress?: (type: PossibleClockTypes) => any;
    pressed: boolean;
    onChanged: (n: number) => any;
    inputFontSize?: number;
}

function LengthInput(
    {
        value,
        clockType,
        pressed,
        onPress,
        onChanged,
        inputFontSize = 57,
        ...rest
    }: TimeInputProps,
    ref: any
) {
    const theme = useTheme();
    const [inputFocused, setInputFocused] = useState<boolean>(false);

    const [controlledValue, setControlledValue] = useState(`${value}`);

    const highlighted = inputFocused;

    const { color, backgroundColor } = useInputColors(highlighted);

    useEffect(() => {
        setControlledValue(`${value}`);
    }, [value]);

    const onInnerChange = (text: string) => {
        setControlledValue(text);
        if (text !== "") {
            onChanged(Number(text));
        }
    };

    let formattedValue = controlledValue;
    if (clockType === "minutes" && !inputFocused) {
        formattedValue = `${value}`.padStart(2, "0");
    }

    if (!inputFocused && (controlledValue === "" || controlledValue === "0")) {
        formattedValue = clockType === "minutes" ? "00" : "0";
    }

    return (
        <View style={styles.root}>
            <TextInput
                ref={ref}
                style={[
                    styles.input,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                        color,
                        fontFamily: theme?.isV3
                            ? theme.fonts.titleMedium.fontFamily
                            : ((theme as any) as MD2Theme).fonts.medium
                                  .fontFamily,
                        fontSize: inputFontSize,
                        backgroundColor,
                        borderRadius: theme.roundness * 2,
                        borderColor:
                            theme.isV3 && highlighted
                                ? theme.colors.onPrimaryContainer
                                : undefined,
                        borderWidth: theme.isV3 && highlighted ? 2 : 0,
                        height: 72,
                    },
                ]}
                maxFontSizeMultiplier={1.5}
                value={formattedValue}
                maxLength={2}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                keyboardAppearance={theme.dark ? "dark" : "default"}
                keyboardType="number-pad"
                onChangeText={onInnerChange}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        textAlign: "center",
        textAlignVertical: "center",
        width: 96,
    },
    root: {
        height: 80,
        position: "relative",
        width: 96,
    },
});

export default forwardRef(LengthInput);
