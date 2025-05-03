import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { Ionicons } from '@expo/vector-icons';
import ThemedButton from './ThemedButton';


export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View>

                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input
                        label="Email"
                        keyboardType='email-address'
                        leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Password"
                        leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                </View>
                <View>
                    <ThemedButton
                        style={[styles.button, { backgroundColor: '#0161fd' }]}
                        textStyle={styles.buttonTitle}
                        onPress={() => signInWithEmail()}
                    >
                        Iniciar Sesión
                    </ThemedButton>

                    <ThemedButton
                        style={[styles.button, { backgroundColor: '#b4deff' }]}
                        textStyle={styles.buttonTitle}
                        onPress={() => signUpWithEmail()}
                    >
                        Crear Cuenta
                    </ThemedButton>


                </View>
                <View style={styles.verticallySpaced}>
                </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    buttonTitle: {
        color: '#ffff',
        fontWeight: '600',
        marginLeft: 8,
    },
})