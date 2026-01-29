import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://scyhqpoipdzvusvcdauc.supabase.co';
const SUPABASE_KEY = 'sb_publishable__X93RLUcT4ZGf2iJSbRwMw_vHhyDDA-';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export let usuarioActual: any = null;

export const setUsuarioActual = (user: any) => {
    usuarioActual = user;
};