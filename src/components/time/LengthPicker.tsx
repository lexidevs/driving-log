import { View, StyleSheet, useWindowDimensions } from "react-native";
import React, { memo } from "react";
import { PossibleClockTypes } from "react-native-paper-dates/src/Time/timeUtils";

import { circleSize } from "react-native-paper-dates/src/Time/timeUtils";
import LengthInputs from "./LengthInputs";

type onChangeFunc = ({
    hours,
    minutes,
    focused,
}: {
    hours: number;
    minutes: number;
    focused?: undefined | PossibleClockTypes;
}) => any;

function LengthPicker({
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
    onChange: onChangeFunc;
    inputFontSize?: number;
}) {
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

    return (
        <View
            style={
                isLandscape
                    ? [
                          styles.rootLandscape,
                          {
                              width: 24 * 3 + 96 * 2 + 52 - circleSize,
                          },
                      ]
                    : styles.rootPortrait
            }
        >
            <LengthInputs
                inputFontSize={inputFontSize}
                hours={hours}
                minutes={minutes}
                onChange={onChange}
                onFocusInput={onFocusInput}
                focused={focused}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    rootLandscape: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    rootPortrait: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default memo(LengthPicker);
