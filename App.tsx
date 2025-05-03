import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';

import { supabase } from './src/lib/supabase';
import { signInWithOAuth } from './src/components/SingInWithOauth';
import Auth from './src/components/Auth';
import LogoutButton from './src/components/Logout';

import { Image } from 'expo-image';
import ThemedButton from './src/components/ThemedButton';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 1) Carga la sesión si ya existe
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error('[App] getSession error:', error);
      console.log('[App] Initial session:', data.session);
      setSession(data.session);
    });

    // 2) Suscripción a cambios de sesión (SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT…)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[App] onAuthStateChange:', event);
        console.log('[App] New session object:', session);
        setSession(session);
        // console.log('[App] Session:', session)
      }
    );

    // 3) Limpieza
    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      {!session ? (
        <>

          <Image
            style={{
              width: 150,
              height: 200,
            }}
            source={require('./assets/logo+text.png')}
            contentFit="cover"
          />
          <View style={styles.card}>

            <Auth />
            {/* <Button
              title="Continuar con Google"
              onPress={signInWithOAuth}
              buttonStyle={styles.googleButton}
              titleStyle={styles.googleTitle}
              icon={
                <Image
                  source="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                  style={styles.googleLogo}
                  contentFit="contain"
                />
              }
              iconContainerStyle={styles.googleIconContainer}
            /> */}
            <ThemedButton
              style={styles.googleButton}
              onPress={signInWithOAuth}
              textStyle={styles.googleTitle}
              logoImage="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
            >
              Continuar con Google
            </ThemedButton>
          </View>
        </>
      ) : (
        <>
          <Image
            style={{
              width: 100,
              backgroundColor: '#0553',
              height: 100,
              borderRadius: 100,
              marginBottom: 20,
            }}
            source={session.user?.user_metadata.avatar_url || 'https://images.pexels.com/photos/31871194/pexels-photo-31871194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            contentFit="cover"
            transition={1000}
          />
          <Text>{`Sesión iniciada: ${session.user?.email}`}</Text>
          <Text>{`user id: ${session.user.id}`}</Text>
          <LogoutButton />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    padding: 24,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    gap: 16,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2, // iOS shadow
    // shadowRadius: 4,
    // elevation: 3, // Android shadow
  },
  googleButton: {
    backgroundColor: '#ffff',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  googleTitle: {
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
  googleLogo: {
    width: 25,
    height: 25,
  },
  googleIconContainer: {
    marginRight: 8,
  },
});