import { View, Text, PressableProps, Pressable, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface Props extends PressableProps {
    icon?: keyof typeof Ionicons.glyphMap;
    children?: string;
    style?: StyleProp<ViewStyle>;
}


const ThemedButton = ({ children, icon, style, ...rest }: Props) => {
    const primaryColor = useThemeColor({}, 'primary')

    return (
        <Pressable
            style={[styles.button, style]}

            className='active:opacity-80 dark:bg-[#3D64F4] bg-[#23b1fe]'

            {...rest}
        //style={({ pressed }) => pressed && { opacity: 0.7 }
        >
            <ThemedText
                style={{ color: 'white' }}
            >{children}</ThemedText>


            {
                icon && (
                    <Ionicons
                        name={icon}
                        size={24}
                        color='white'
                        style={{ marginHorizontal: 10 }}
                    />
                )
            }
        </Pressable>
    )
}

export default ThemedButton

const styles = StyleSheet.create({

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,

    }

})