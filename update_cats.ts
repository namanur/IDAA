import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
async function test() {
  const mappings = {
    'Financial Reporting': 'Accounting',
    'Audit & Assurance': 'Accounting',
    'Taxation': 'GST',
    'Corporate Law': 'Accounting',
    'FM & Analysis': 'Excel',
    'Soft Skills': 'Interview'
  };
  for (const [oldCat, newCat] of Object.entries(mappings)) {
    const { error } = await supabase.from('topics').update({ category: newCat }).eq('category', oldCat);
    if (error) console.error(`Error updating ${oldCat}:`, error);
    else console.log(`Updated ${oldCat} to ${newCat}`);
  }
}
test();
