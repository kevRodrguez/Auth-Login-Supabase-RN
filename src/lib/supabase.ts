import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native';

import { makeRedirectUri } from 'expo-auth-session';

import * as AuthSession from 'expo-auth-session';

import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// console.log('Supabase URL:', supabaseUrl)
// console.log('Supabase Anon Key:', supabaseAnonKey)

// Generate a redirect URI based on the custom scheme defined in app.json

// Scheme para producción (standalone builds / web)
const nativeRedirect = makeRedirectUri({
    scheme: 'com.kevrodriguez.authlogin',
    preferLocalhost: false,
}as any);

// Proxy para Expo Go (túnel, emulador, Expo Go app)
const expoProxyRedirect = AuthSession.makeRedirectUri({
    useProxy: true,
} as any);

export const authRedirect = Platform.OS === 'web'
    ? nativeRedirect
    : expoProxyRedirect;
    


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.

AppState.addEventListener('change', (state) => {
    console.log('AppState changed detected:', state)
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
        console.log('AppState active, starting auto refresh')
        
    } else {
        supabase.auth.stopAutoRefresh()
        console.log('AppState inactive, stopping auto refresh')
    }
})