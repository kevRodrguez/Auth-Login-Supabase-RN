export interface SessionInterface {
    access_token:   string;
    expires_at:     number;
    expires_in:     number;
    provider_token: string;
    refresh_token:  string;
    token_type:     string;
    aal:            string;
    amr:            AMR[];
    session_id:     string;
    is_anonymous:   boolean;
    user:           User;
}

export interface AMR {
    method:    string;
    timestamp: number;
}

export interface User {
    aud:                string;
    role:               string;
    id:                 string;
    email:              string;
    phone:              string;
    confirmed_at:       Date;
    email_confirmed_at: Date;
    created_at:         Date;
    last_sign_in_at:    Date;
    updated_at:         Date;
    is_anonymous:       boolean;
    app_metadata:       AppMetadata;
    user_metadata:      UserMetadata;
    identities:         Identity[];
}

export interface AppMetadata {
    provider:  string;
    providers: string[];
}

export interface Identity {
    provider:    string;
    provider_id: string;
    identity_id: string;
    email:       string;
    created_at:  Date;
}

export interface UserMetadata {
    avatar_url:     string;
    email:          string;
    email_verified: boolean;
    full_name:      string;
    iss:            string;
    name:           string;
    phone_verified: boolean;
    picture:        string;
    provider_id:    string;
    sub:            string;
}
