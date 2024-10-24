import * as React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper'


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
    textColor?: string;
}

const AttributeChip: React.FC<AttributeChipProps> = ({ label, value, icon, containerStyle, attributeStyle, valueStyle, textColor }) => {
    return (
        <View style={containerStyle}>
            {/* Small label that describes the type of the value */}
            <Text variant="labelMedium" style={{
                color: textColor,
            }}>{label}</Text>
            <View style={attributeStyle}>
                {/* Icon to depict value */}
                <Icon source={icon} size={16} color={textColor} />
                {/* Actual value text */}
                <Text variant="titleMedium" style={[valueStyle,{
                    color: textColor,
                }]}>
                    {value}
                </Text>
            </View>
        </View>
    );
};

export default AttributeChip;