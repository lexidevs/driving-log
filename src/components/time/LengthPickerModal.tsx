// Based on react-native-paper-dates/src/Time/TimePickerModal.tsx

import {
    Modal,
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from "react-native";

import { Button, MD2Theme, overlay, useTheme } from "react-native-paper";

import LengthPicker from "./LengthPicker";
import {
    clockTypes,
    PossibleClockTypes,
} from "react-native-paper-dates/src/Time/timeUtils";
import React, { memo, useCallback, useState } from "react";
import { sharedStyles } from "react-native-paper-dates/src/shared/styles";
import { supportedOrientations } from "react-native-paper-dates/src/shared/utils";

export function LengthPickerModal({
    visible,
    onDismiss,
    onConfirm,
    hours,
    minutes,
    label = "Select time",
    uppercase: _uppercase,
    cancelLabel = "Cancel",
    confirmLabel = "Ok",
    animationType = "none",
    inputFontSize,
}: {
    label?: string;
    uppercase?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    hours: number;
    minutes: number;
    visible: boolean | undefined;
    onDismiss: () => any;
    onConfirm: (hoursAndMinutes: { hours: number; minutes: number }) => any;
    animationType?: "slide" | "fade" | "none";
    inputFontSize?: number;
}) {
    const theme = useTheme();

    const [focused, setFocused] = useState<PossibleClockTypes>(
        clockTypes.hours
    );
    const [localHours, setLocalHours] = useState(hours);
    const [localMinutes, setLocalMinutes] = useState(minutes);

    const onFocusInput = useCallback(
        (type: PossibleClockTypes) => setFocused(type),
        []
    );
    const onChange = useCallback(
        (params: {
            focused?: PossibleClockTypes | undefined;
            hours: number;
            minutes: number;
        }) => {
            if (params.focused) {
                setFocused(params.focused);
            }

            setLocalHours(params.hours);
            setLocalMinutes(params.minutes);
        },
        [setFocused, setLocalHours, setLocalMinutes]
    );

    const defaultUppercase = !theme.isV3;
    const uppercase = _uppercase ?? defaultUppercase;
    let textFont;
    let labelText = label;

    if (theme.isV3) {
        textFont = theme.fonts.labelMedium;
    } else {
        textFont = ((theme as any) as MD2Theme)?.fonts.medium;
    }

    if (!label) {
        labelText = "Enter time";
    }

    let color;
    if (theme.isV3) {
        color = theme.dark
            ? theme.colors.elevation.level3
            : theme.colors.surface;
    } else {
        color = theme.dark
            ? overlay(10, theme.colors.surface)
            : theme.colors.surface;
    }

    return (
        <Modal
            animationType={animationType}
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
            presentationStyle="overFullScreen"
            supportedOrientations={supportedOrientations}
            statusBarTranslucent={true}
        >
            <>
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            sharedStyles.root,
                            { backgroundColor: theme.colors?.backdrop },
                        ]}
                    />
                </TouchableWithoutFeedback>
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
                                    backgroundColor: color,
                                    borderRadius: theme.isV3 ? 28 : undefined,
                                },
                            ]}
                        >
                            <View style={styles.labelContainer}>
                                <Text
                                    maxFontSizeMultiplier={1.5}
                                    style={[
                                        styles.label,
                                        {
                                            ...textFont,
                                            color: theme?.isV3
                                                ? theme.colors.onSurfaceVariant
                                                : ((theme as any) as MD2Theme)
                                                      .colors.text,
                                        },
                                    ]}
                                >
                                    {uppercase
                                        ? labelText.toUpperCase()
                                        : labelText}
                                </Text>
                            </View>
                            <View style={styles.timePickerContainer}>
                                <LengthPicker
                                    inputFontSize={inputFontSize}
                                    focused={focused}
                                    hours={localHours}
                                    minutes={localMinutes}
                                    onChange={onChange}
                                    onFocusInput={onFocusInput}
                                />
                            </View>
                            <View style={styles.bottom}>
                                <View style={sharedStyles.root} />
                                <Button
                                    onPress={onDismiss}
                                    uppercase={uppercase}
                                >
                                    {cancelLabel}
                                </Button>
                                <Button
                                    onPress={() =>
                                        onConfirm({
                                            hours: localHours,
                                            minutes: localMinutes,
                                        })
                                    }
                                    uppercase={uppercase}
                                >
                                    {confirmLabel}
                                </Button>
                            </View>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </>
        </Modal>
    );
}
const styles = StyleSheet.create({
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
});

export default memo(LengthPickerModal);
