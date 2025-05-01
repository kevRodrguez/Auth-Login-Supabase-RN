
import { supabase, redirectUri } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Auth from './Auth';


export default async function signInWithGoogle() {
    // 1. Inicia el flujo OAuth en Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUri,
        },

    });
    console.log('data', data);
    if (error) {
        console.error('Error al iniciar sesión:', error.message);
        return;
    }
    if (!data?.url) {
        console.error('No se recibió URL de autenticación');
        return;
    }

    // 2. Abre la sesión de autenticación en el navegador
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    // 3. Cierra el navegador al completar la autenticación
    if (result.type === 'success') {
        // Para flujos de AuthSession
        WebBrowser.dismissAuthSession();
        // Fallback por si no funcionara
        WebBrowser.dismissBrowser();
    }

    // 4. Supabase detectará el nuevo session en onAuthStateChange

}