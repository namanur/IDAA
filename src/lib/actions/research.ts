import { processGeneration } from '@/lib/research-engine';
import { revalidatePath } from 'next/cache';

export async function triggerResearch(topicId: string) {
  try {
    const result = await processGeneration(topicId);
    revalidatePath('/admin');
    return result;
  } catch (error: any) {
    revalidatePath('/admin');
    return { success: false, error: error.message };
  }
}
