import React from 'react';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';

export default function LogoutButton() {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <Button onPress={handleLogout} style={{ marginTop: 20 }}>
            Cerrar sesión
        </Button>
    );
}