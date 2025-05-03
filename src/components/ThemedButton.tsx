import { View, Text, PressableProps, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { Image } from 'expo-image';

interface Props extends PressableProps {
    icon?: keyof typeof Ionicons.glyphMap;
    logoImage?: string;
    children?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}



const ThemedButton = ({ children, icon, style, textStyle, logoImage, ...rest }: Props) => {
    const primaryColor = useThemeColor({}, 'primary')

    return (
        <Pressable
            style={[styles.button, style]}

            className='active:opacity-80 dark:bg-[#3D64F4] bg-[#23b1fe]'

            {...rest}
        //style={({ pressed }) => pressed && { opacity: 0.7 }
        >
            {/* expo image */}
            {
                logoImage && (
                    <Image
                        source={logoImage}
                        style={{
                            width: 25,
                            height: 25,
                        }}
                    />
                )
            }

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
            <ThemedText
                style={
                    [
                        {
                            color: 'white',
                        },
                        textStyle

                    ]
                }
            >{children}</ThemedText>

        </Pressable>
    )
}

export default ThemedButton

const styles = StyleSheet.create({

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,

    }

})