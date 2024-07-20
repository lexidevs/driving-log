import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Checkbox, TextInput, Text, FAB } from 'react-native-paper';

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => alert('Pressed')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
