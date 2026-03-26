import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for seeding

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const modules = [
  { name: 'Excel', topics: ['VLOOKUP & HLOOKUP', 'IF & Nested IFS', 'SUMIF & COUNTIF', 'Pivot Tables', 'Index Match', 'Text Functions', 'Data Validation', 'Conditional Formatting', 'Macros Basics', 'Charts & Dashboards'] },
  { name: 'GST', topics: ['Basics of GST', 'Input Tax Credit', 'Blocked Credits', 'GSTR-1 & 3B', 'Reverse Charge Mechanism', 'Composition Scheme', 'E-way Bill', 'HSN/SAC Codes', 'Registration Rules', 'Refunds under GST'] },
  { name: 'TDS', topics: ['Section 192 (Salary)', 'Section 194C (Contractors)', 'Section 194J (Professionals)', 'TDS Rates Chart', 'Form 16/16A', '26AS & AIS', 'TDS Returns', 'Interest & Penalties', 'Lower Deduction Certificate', 'TCS Basics'] },
  { name: 'Accounting', topics: ['Golden Rules of Accounting', 'Journal Entries', 'Ledger Posting', 'Trial Balance', 'BRS - Bank Reconciliation', 'Depreciation AS-10', 'P&L Preparation', 'Balance Sheet Items', 'Ratio Analysis', 'Cash Flow Statement'] },
  { name: 'Tally', topics: ['Company Creation', 'Ledger Groups', 'Voucher Types', 'GST in Tally', 'Cost Centers', 'Bank Reconciliation', 'Exporting Reports', 'Tally Shortcuts', 'Inventory Management', 'Tally Audit Feature'] },
  { name: 'Interview', topics: ['Common HR Questions', 'Techncial GST Q&A', 'Excel Practical Test', 'Accounting Standards Review', 'TDS Practical Cases', 'Mock Interview Mode', 'Audit Procedures', 'Company Law Basics', 'Income Tax Filing', 'Ethics & Professionalism'] }
];

async function seed() {
  console.log('🌱 Seeding 60 topics...');
  
  let day = 1;
  const today = new Date();

  for (const module of modules) {
    for (const topicName of module.topics) {
      const slug = topicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const releaseDate = new Date(today);
      releaseDate.setDate(today.getDate() + (day - 1));

      const { error } = await supabase.from('topics').insert({
        slug,
        title: topicName,
        category: module.name,
        release_date: releaseDate.toISOString().split('T')[0],
        status: day === 1 ? 'published' : 'queued' // First one is live for testing
      });

      if (error) {
        console.error(`❌ Error seeding ${topicName}:`, error.message);
      } else {
        console.log(`✅ Day ${day}: ${topicName} [${module.name}]`);
      }
      day++;
    }
  }
}

seed();
