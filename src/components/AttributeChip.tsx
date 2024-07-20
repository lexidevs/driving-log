import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, MD3Colors, Text } from 'react-native-paper'


/**
 * Represents the props for the AttributeChip component.
    * @param label - The label for the attribute.
    * @param value - The value of the attribute.
    * @param icon - The icon to depict the value.
    * @returns An AttributeChip component that displays an attribute with a label and value.
 */
interface AttributeChipProps {
    label: string;
    value: string;
    icon: string;
    containerStyle?: object;
    attributeStyle?: object;
    valueStyle?: object;
}

const AttributeChip: React.FC<AttributeChipProps> = ({ label, value, icon, containerStyle, attributeStyle, valueStyle }) => {
    return (
        <View style={containerStyle}>
            {/* Small label that describes the type of the value */}
            <Text variant="labelMedium">{label}</Text>
            <View style={attributeStyle}>
                {/* Icon to depict value */}
                <Icon source={icon} size={16} />
                {/* Actual value text */}
                <Text variant="titleMedium" style={valueStyle}>
                    {value}
                </Text>
            </View>
        </View>
    );
};

export default AttributeChip;