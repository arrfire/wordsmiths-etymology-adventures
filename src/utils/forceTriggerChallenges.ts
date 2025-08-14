import { supabase } from '@/integrations/supabase/client';

export const forceTriggerChallenges = async () => {
  try {
    console.log('Force triggering challenge generation...');
    
    const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
      body: { force: true }
    });
    
    if (error) {
      console.error('Error generating challenges:', error);
      return { success: false, error: error.message };
    } else {
      console.log('Challenges generated successfully:', data);
      return { success: true, data };
    }
  } catch (err) {
    console.error('Error invoking function:', err);
    return { success: false, error: 'Failed to generate challenges' };
  }
};

// Trigger immediately
if (typeof window !== 'undefined') {
  forceTriggerChallenges().then(result => {
    console.log('Force trigger result:', result);
    if (result.success) {
      setTimeout(() => window.location.reload(), 1500);
    }
  });
}