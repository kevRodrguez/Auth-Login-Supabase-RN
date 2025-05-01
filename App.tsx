import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/lib/supabase'
import Auth from './src/components/Auth'
import { View, Text, Pressable, AppState } from 'react-native'
import { Session } from '@supabase/supabase-js'
import signInWithGoogle from './src/components/AuthGoogle'
import { Button } from '@rneui/themed'
import * as AuthSession from 'expo-auth-session';
import LogoutButton from './src/components/Logout'

export default function App() {

  const [session, setSession] = useState<Session | null>(null)

  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      console.log('Session:', session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      console.log('Session changed:', session)
    })
  }, [])

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