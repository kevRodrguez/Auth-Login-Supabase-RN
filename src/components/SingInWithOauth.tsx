import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

import { supabase } from '../lib/supabase';

/**
 * Dispara el flujo de inicio de sesión con Google usando PKCE.
 * Utiliza `WebBrowser.openAuthSessionAsync`, por lo que evitamos el problema
 * de typings con `AuthSession.startAsync` en SDK ≥ 50.
 *
 * 1. Construye la URL de autenticación con Supabase.
 * 2. Abre el navegador Seguro/CustomTab.
 * 3. Recibe la redirección a nuestro deep‑link.
 * 4. Si llega un `code`, lo intercambia con `exchangeCodeForSession`.
 * 5. Si llegan tokens (flujo implícito), llama a `setSession`.
 */
export const signInWithOAuth = async () => {
    // Redirección (proxy para Expo Go / desarrollo)
    const redirectUri = makeRedirectUri({
        path: 'auth/callback',
        useProxy: true,
        queryParams: { prompt: 'select_account' }
    } as any);

    console.log('[OAuth] redirectUri:', redirectUri);

    // 1) Obtén la URL hacia Google
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri },
    });

    if (error) {
        console.error('[OAuth] signInWithOAuth error:', error);
        return;
    }

    if (!data?.url) {
        console.error('[OAuth] No se recibió la URL de autenticación');
        return;
    }

    console.log('[OAuth] authUrl:', data.url);

    // Asegura cerrar la ventana/popup cuando sea posible
    WebBrowser.maybeCompleteAuthSession();

    // 2) Abre el navegador y espera la redirección
    const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUri
    );

    console.log('[OAuth] WebBrowser result:', result);

    if (result.type !== 'success' || !result.url) {
        console.log('[OAuth] Usuario canceló o algo salió mal');
        return;
    }

    // 3) Analiza la URL devuelta
    const { queryParams } = Linking.parse(result.url);

    if (Array.isArray(queryParams?.code)) {
        console.error('[OAuth] Query param "code" es un array inesperado:', queryParams.code);
        return;
    }

    const code = queryParams?.code as string | undefined;
    const accessToken = queryParams?.access_token as string | undefined;

    // 4) Intercambia el code (PKCE) o establece la sesión (implícito)
    if (code) {
        const { data: exchange, error: exError } = await supabase.auth.exchangeCodeForSession(code);

        if (exError) {
            console.error('[OAuth] exchangeCodeForSession error:', exError);
        } else {
            console.log('[OAuth] Session creada vía exchangeCodeForSession:', exchange.session);
        }
    } else if (accessToken) {
        const refreshToken = queryParams?.refresh_token as string | undefined;

        if (!refreshToken) {
            console.error('[OAuth] Missing refresh_token in response');
            return;
        }

        const { error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        if (setError) {
            console.error('[OAuth] setSession error:', setError);
        } else {
            console.log('[OAuth] Session creada vía setSession');
        }
    } else {
        console.error('[OAuth] No se encontró "code" ni tokens en la respuesta');
    }
};