import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

    SUPABASE_URL: get('SUPABASE_URL').required().asString(),
    SUPABASE_ANON_KEY: get('SUPABASE_ANON_KEY').required().asString(),


}