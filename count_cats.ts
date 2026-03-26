import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
async function test() {
  const { data, error } = await supabase.from('topics').select('category');
  if (error) {
    console.error(error);
  } else {
    const counts: Record<string, number> = {};
    data.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);
    console.log(counts);
  }
}
test();
