'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function updateProgress(userId: string, topicId: string, status: 'reading' | 'practice' | 'completed') {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Update Progress
  const { error } = await supabase
    .from('user_progress')
    .upsert({ 
      user_id: userId, 
      topic_id: topicId, 
      status,
      last_accessed: new Date().toISOString()
    }, { onConflict: 'user_id, topic_id' });

  if (error) return { success: false, error: error.message };

  // 2. Update Streak if this is the first activity of the day
  const today = new Date().toISOString().split('T')[0];
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('last_activity_date, current_streak, longest_streak')
    .eq('id', userId)
    .single();

  if (profile && profile.last_activity_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (profile.last_activity_date === yesterdayStr) {
      newStreak = (profile.current_streak || 0) + 1;
    }

    await supabase
      .from('user_profiles')
      .update({ 
        current_streak: newStreak, 
        last_activity_date: today,
        longest_streak: Math.max(newStreak, profile.longest_streak || 0)
      })
      .eq('id', userId);
  }

  revalidatePath('/');
  return { success: true };
}

export async function toggleBookmark(userId: string, topicId: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: existing } = await supabase
    .from('user_annotations')
    .select('id')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .eq('type', 'bookmark')
    .single();

  if (existing) {
    await supabase.from('user_annotations').delete().eq('id', existing.id);
  } else {
    await supabase.from('user_annotations').insert({
      user_id: userId,
      topic_id: topicId,
      type: 'bookmark'
    });
  }

  revalidatePath('/');
}
