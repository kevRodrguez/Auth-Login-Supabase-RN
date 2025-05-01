
import { supabase, authRedirect } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Auth from './Auth';


export default async function signInWithGoogle() {
    // 1. Inicia el flujo OAuth en Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        useProxy: true,
        preferLocalhost: false,
        options: {
            redirectTo: authRedirect,
        },

    } as any);
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
    console.log('data url', data.url);

    // 3. Cierra el navegador al completar la autenticación
    if (result.type === 'success') {
        // Para flujos de AuthSession
        WebBrowser.dismissAuthSession();
        // Fallback por si no funcionara
        WebBrowser.dismissBrowser();
    }

    // 4. Supabase detectará el nuevo session en onAuthStateChange

}