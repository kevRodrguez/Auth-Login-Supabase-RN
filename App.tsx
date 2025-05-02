import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/components/Auth'
import { View, Text, Pressable, AppState } from 'react-native'
import { Session } from '@supabase/supabase-js'
import signInWithGoogle from './src/components/AuthGoogle'
import { Button } from '@rneui/themed'
import * as AuthSession from 'expo-auth-session';

import * as WebBrowser from 'expo-web-browser';

import LogoutButton from './src/components/Logout'



export default function App() {
  WebBrowser.maybeCompleteAuthSession();

  

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
    // 1. Obtén la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escucha cambios de estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange( (_event, session) => {
        console.log('Auth state changed:',_event , 'session:', session);
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <View>
      {!session ? (
        <>
          <Auth />
          <Button onPress={async () => signInWithGoogle()}>
            <Text>
              Sign in with Google
            </Text>
          </Button>
        </>
      ) : (
        <>
          <Auth />
          <Text>Sesión iniciada con Google</Text>
          <LogoutButton />
        </>
      )}
    </View>
  )
}