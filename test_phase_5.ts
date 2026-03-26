import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
async function test() {
  const { data: d1, error: e1 } = await supabase.from('practice_datasets').select('*').limit(1);
  const { data: d2, error: e2 } = await supabase.from('topic_exercises').select('*').limit(1);
  console.log('practice_datasets exists?', !e1);
  console.log('topic_exercises exists?', !e2);
}
test();
