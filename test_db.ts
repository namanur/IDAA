import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
async function test() {
  const { data, error } = await supabase.from('topics').select('category');
  if (error) console.error(error);
  else {
    const categories = Array.from(new Set(data.map(t => t.category)));
    console.log(categories);
  }
}
test();
