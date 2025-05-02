import { supabase, authRedirect } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';



export default async function signInWithGoogle() {
    WebBrowser.maybeCompleteAuthSession();

    // 1. Inicia el flujo OAuth en Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: authRedirect },
        useProxy: true,
    }as any);
    if (error) {
        console.error('Error al iniciar sesión:', error.message);
        return;
    }
    if (!data?.url) {
        console.error('No se recibió URL de autenticación');
        return;
    }

    console.log('authRedirect', authRedirect);
    console.log('data', data);

    // 2. Abre la sesión de autenticación en el navegador
    const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirect);

    // 3. Cierra el navegador al completar la autenticación
    // if (result.type === 'success') {
    //     // Para flujos de AuthSession
    //     WebBrowser.dismissAuthSession();
    //     // Fallback por si no funcionara
    //     WebBrowser.dismissBrowser();
    // }

    // 4. Supabase detectará el nuevo session en onAuthStateChange

}