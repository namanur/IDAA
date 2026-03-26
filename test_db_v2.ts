import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
async function test() {
  const { data, error, count } = await supabase.from('topics').select('*', { count: 'exact' });
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Count:', count);
    console.log('Data:', data?.length);
    if (data && data.length > 0) {
      console.log('First row category:', data[0].category);
    }
  }
}
test();
