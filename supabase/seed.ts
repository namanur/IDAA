import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Fallback to anon key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const modules = [
  { name: 'Financial Reporting', topics: ['Ind AS 115: Revenue Recognition', 'Ind AS 116: Leases', 'Ind AS 109: Financial Instruments', 'Business Combinations', 'Ind AS 37: Provisions & Contingencies'] },
  { name: 'Audit & Assurance', topics: ['SA 315 & 330: Risk Assessment', 'Internal Financial Controls (IFC)', 'CARO 2020 Reporting', 'Professional Ethics & Code of Conduct'] },
  { name: 'Taxation', topics: ['Corporate Taxation & MAT', 'Transfer Pricing Basics', 'GST: Input Tax Credit', 'GST: Place of Supply & RCM'] },
  { name: 'Corporate Law', topics: ['Companies Act: Dividends & Accounts', 'SEBI Corporate Governance'] },
  { name: 'FM & Analysis', topics: ['Ratio Analysis & Interpretation', 'Cash Flow Analysis', 'DCF Valuation Model', 'Relative Valuation Multiples'] },
  { name: 'Soft Skills', topics: ['The 90-second Elevator Pitch', 'STAR Method for Behavioral Qs', 'Articleship Experience Narrative'] }
];

async function seed() {
  console.log('🌱 Seeding CA Interview Prep Curriculum...');
  
  let topicCount = 0;
  const today = new Date();

  for (const module of modules) {
    for (const topicName of module.topics) {
      const slug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Calculate release date (2 topics per day)
      const dayOffset = Math.floor(topicCount / 2);
      const slot = (topicCount % 2) + 1; // 1 or 2
      
      const releaseDate = new Date(today);
      releaseDate.setDate(today.getDate() + dayOffset);

      const { error } = await supabase.from('topics').insert({
        slug,
        title: topicName,
        category: module.name,
        release_date: releaseDate.toISOString().split('T')[0],
        daily_slot: slot,
        status: topicCount === 0 ? 'published' : 'queued'
      });

      if (error) {
        console.error(`❌ Error seeding ${topicName}:`, error.message);
      } else {
        console.log(`✅ Slot ${slot} | ${releaseDate.toISOString().split('T')[0]}: ${topicName} [${module.name}]`);
      }
      topicCount++;
    }
  }
}

seed();
