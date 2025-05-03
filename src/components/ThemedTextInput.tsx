import { View, TextInputProps, TextInput, TouchableOpacity, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import React, { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends TextInputProps{
    icon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    
}

interface StyleProps extends ViewStyle {
    style?: ViewStyle; // extiende de ViewProps porque es un estilo de un View y no de un TextInput
}

const ThemedTextInput = ({ icon, rightIcon, onRightIconPress, style, ...rest }: Props & { style?: StyleProps }) => {
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');

    const [isActive, setIsActive] = useState(false);
    const inputRef = useRef<TextInput>(null);

    return (
        <View
            style={[
                {
                    ...styles.border,
                    borderColor: isActive ? primaryColor : '#ccc',
                },
                style,
            ]}
            onTouchStart={() => inputRef.current?.focus()} // Foco al tocar el contenedor
        >
            {/* Left Icon */}
            {icon && (
                <Ionicons
                    name={icon}
                    size={24}
                    color={isActive ? primaryColor : '#ccc'}
                    style={{ marginRight: 10 }}
                />
            )}

            {/* Input Field */}
            <TextInput
                ref={inputRef}
                placeholderTextColor={isActive ? primaryColor : 'grey'}
                onFocus={() => setIsActive(true)} // Al enfocar
                onBlur={() => setIsActive(false)} // Al perder el foco
                {...rest}
                style={{
                    flex: 1,
                    color: textColor,
                    marginRight: rightIcon ? 10 : 0, // Espacio si hay icono derecho
                }}
            />

            {/* Right Icon */}
            {rightIcon && (
                <TouchableOpacity onPress={onRightIconPress}>
                    <Ionicons
                        name={rightIcon}
                        size={24}
                        color={isActive ? primaryColor : '#ccc'}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
    border: {
        borderWidth: 1,
        borderRadius: 5,
        padding:10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',

    },
});