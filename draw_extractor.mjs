import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcfbhtbkuwcroabwwtwb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZmJodGJrdXdjcm9hYnd3dHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwNzUzMzMsImV4cCI6MjAyMDY1MTMzM30.LWaJ0sxCHuKx9XHcQ6JRaATWcx01DLcWHHod2UDTRqE';
const supabase = createClient(supabaseUrl, supabaseKey);

const generateUniqueNumbers = (min, max, count) => {
    const numbers = new Set();
    while (numbers.size < count) {
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.add(number);
    }
    return [...numbers];
};

const updateDraw = async () => {
    // I want you to get the closest draw by draw_datetime from now where results is null and drawn is false

    const now = new Date();
    const { data: draw, error } = await supabase
        .from('draws')
        .select('*')
        .eq('drawn', false)
        .gt('draw_datetime', now.toISOString())
        .order('draw_datetime', { ascending: true })
        .limit(1)
        .single();


    if (error) {
        console.error('Errore durante il recupero del draw:', error);
        return;
    }

    if (!draw) {
        console.log('Nessun draw trovato con results = NULL');
        return;
    }

    const drawDateTime = new Date(draw.draw_datetime);
    let now_date = new Date();
    console.log('Attendo il draw_datetime:', drawDateTime);
    while (drawDateTime > now_date) {
        console.log('Draw_datetime non ancora raggiunto, attendo...' + now_date);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendi 1 secondo
        now_date = new Date();
    }

    const numbers = generateUniqueNumbers(1, 50, 4);
    const { error: updateError } = await supabase
        .from('draws')
        .update({ results: JSON.stringify(numbers), drawn: true })
        .eq('id', draw.id);

    if (updateError) {
        console.error('Errore durante l\'aggiornamento del draw:', updateError);
        return;
    }

    console.log('Draw aggiornato con successo');
};

updateDraw();