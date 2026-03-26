import { createClient } from '@supabase/supabase-js';
import { processGeneration } from '../src/lib/research-engine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('--- IDAA AI Generator Started ---');
  
  while (true) {
    try {
      // 1. Find topics that need work (queued or failed)
      const { data: topics, error } = await supabase
        .from('topics')
        .select('id, title, status')
        .in('status', ['queued', 'failed'])
        .order('release_date', { ascending: true })
        .limit(1);

      if (error) throw error;

      if (!topics || topics.length === 0) {
        console.log('[AI Runner] No pending topics. Waiting 5 minutes...');
        await new Promise(r => setTimeout(r, 5 * 60 * 1000));
        continue;
      }

      const topic = topics[0];
      console.log(`[AI Runner] Processing: ${topic.title} (${topic.id})`);

      try {
        await processGeneration(topic.id);
        console.log(`[AI Runner] Successfully generated ${topic.title}`);
      } catch (genError: any) {
        // Special Handling for Token Rate Limits (Google 429)
        if (genError.message?.includes('429') || genError.message?.toLowerCase().includes('quota')) {
          console.warn('[AI Runner] QUOTA EXCEEDED! Token limit reached.');
          console.log('[AI Runner] Waiting 4 hours for token reset as per instruction...');
          await new Promise(r => setTimeout(r, 4 * 60 * 60 * 1000));
        } else {
          console.error(`[AI Runner] Generation failed for ${topic.id}:`, genError.message);
        }
      }

      // Small cooldown between topics to avoid transient errors
      await new Promise(r => setTimeout(r, 5000));

    } catch (err: any) {
      console.error('[AI Runner] Fatal loop error:', err.message);
      await new Promise(r => setTimeout(r, 30000)); // Wait 30s on binary DB errors
    }
  }
}

run();
