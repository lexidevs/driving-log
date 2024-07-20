import * as React from "react";
import { View, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Animated } from "react-native";
import {
    Button,
    Checkbox,
    TextInput,
    Text,
    FAB,
    Appbar,
    Portal,
    Modal,
    MD3DarkTheme,
} from "react-native-paper";

interface ThemedModalProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    label: string;
    children: React.ReactNode;
}


const ThemedModal: React.FC<ThemedModalProps> = ({children, visible, onDismiss, onConfirm, label}) => {
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
            >
                <>
                    <TouchableWithoutFeedback
                        onPress={onDismiss}
                    >
                        <View
                            style={[
                                StyleSheet.absoluteFill,
                                styles.root,
                                {
                                    backgroundColor:
                                        MD3DarkTheme.colors.backdrop,
                                },
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
                                        backgroundColor:
                                            MD3DarkTheme.colors.elevation
                                                .level3,
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
                                                ...MD3DarkTheme.fonts
                                                    .labelMedium,
                                                color:
                                                    MD3DarkTheme.colors
                                                        .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        {label}
                                    </Text>
                                </View>
                                <View style={styles.timePickerContainer}>
                                    {children}
                                </View>
                                <View style={styles.bottom}>
                                    {/* <IconButton
                                    icon={getTimeInputTypeIcon(
                                        inputType,
                                        {
                                            keyboard: keyboardIcon,
                                            picker: clockIcon,
                                        }
                                    )}
                                    onPress={() =>
                                        setInputType(
                                            reverseInputTypes[inputType]
                                        )
                                    }
                                    size={24}
                                    style={styles.inputTypeToggle}
                                    accessibilityLabel="toggle keyboard"
                                /> */}
                                    <View style={styles.root} />
                                    <Button
                                        onPress={onDismiss}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onPress={onConfirm}
                                    >
                                        Confirm
                                    </Button>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </View>
                </>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
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
    timePickerContainer: {
        paddingLeft: 24,
        paddingTop: 20,
        paddingBottom: 16,
        paddingRight: 24,
    },
});

export default ThemedModal;