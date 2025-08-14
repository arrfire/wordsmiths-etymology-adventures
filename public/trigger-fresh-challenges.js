// Trigger challenge generation immediately
import { supabase } from '@/integrations/supabase/client';

(async () => {
  console.log('Triggering fresh challenge generation...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
      body: { forceRegenerate: true }
    });
    
    if (error) {
      console.error('Generation failed:', error);
    } else {
      console.log('Fresh challenges generated:', data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } catch (err) {
    console.error('Generation error:', err);
  }
})();