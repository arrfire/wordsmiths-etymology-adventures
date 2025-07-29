import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TriggerChallenges = () => {
  const [loading, setLoading] = useState(false);

  const triggerChallengeGeneration = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
        body: {}
      });
      
      if (error) {
        console.error('Error:', error);
        toast.error('Failed to generate challenges: ' + error.message);
      } else {
        console.log('Success:', data);
        toast.success('Daily challenges generated successfully!');
        // Refresh the page to show new challenges
        window.location.reload();
      }
    } catch (err) {
      console.error('Error invoking function:', err);
      toast.error('Failed to generate challenges');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Generate Daily Challenges</h2>
        <p className="text-slate-600 mb-6">No challenges available for today. Click below to generate them.</p>
        <Button 
          onClick={triggerChallengeGeneration}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? 'Generating...' : 'Generate Today\'s Challenges'}
        </Button>
      </Card>
    </div>
  );
};

export default TriggerChallenges;