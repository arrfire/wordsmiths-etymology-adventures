import { supabase } from '@/integrations/supabase/client';

export const triggerChallengeGeneration = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
      body: {}
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

// Auto-trigger if we're in the browser
if (typeof window !== 'undefined') {
  triggerChallengeGeneration().then(result => {
    if (result.success) {
      console.log('Fresh challenges generated for today!');
      // Auto-refresh to show new challenges
      setTimeout(() => window.location.reload(), 2000);
    }
  });
}