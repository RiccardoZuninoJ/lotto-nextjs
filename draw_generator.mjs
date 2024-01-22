import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcfbhtbkuwcroabwwtwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZmJodGJrdXdjcm9hYnd3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwNzUzMzMsImV4cCI6MjAyMDY1MTMzM30.LWaJ0sxCHuKx9XHcQ6JRaATWcx01DLcWHHod2UDTRqE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a code which inserts 100 draws into the database: drawn: false, draw_datetime: every 6 hours

const generateDraws = async () => {
    let draw_datetime = new Date("2024-01-14T00:00:00.000Z");
    for (let i = 0; i < 100; i++) {
        draw_datetime.setHours(draw_datetime.getHours() + 6);
        const draw = {
            drawn: false,
            draw_datetime: draw_datetime
        }
        const { error } = await supabase
            .from('draws')
            .insert([{ drawn: false, draw_datetime: draw_datetime }]);
        if (error) {
            console.error('Errore durante l\'inserimento del draw:', error);
            return;
        }
    }
    console.log('Draws inseriti con successo');
}

generateDraws();