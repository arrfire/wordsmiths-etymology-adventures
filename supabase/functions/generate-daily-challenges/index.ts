import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if challenges already exist for today
    const { data: existingChallenges } = await supabase
      .from('challenges')
      .select('id')
      .eq('date_assigned', today);

    if (existingChallenges && existingChallenges.length > 0) {
      console.log('Challenges already exist for today:', today);
      return new Response(JSON.stringify({ message: 'Challenges already exist for today' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate 3 new challenges using OpenAI
    const challenges = [];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      
      const prompt = `Generate an etymology challenge for ${difficulty} level. Create a JSON object with:
      - title: A catchy title about the word's origin
      - description: Brief description of what the challenge covers
      - question: A multiple choice question about word etymology
      - options: Array of 4 possible answers
      - correct_answer: Index (0-3) of the correct answer
      - explanation: Detailed explanation of the correct answer and etymology
      - hint: A helpful hint without giving away the answer
      
      Focus on interesting word origins, root meanings, language evolution, or historical context. Make it educational and engaging.`;

      // Check if OpenAI API key is available
      if (!openAIApiKey) {
        throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY secret.');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert etymologist and educator. Generate educational etymology challenges. Respond only with valid JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI Response:', JSON.stringify(data, null, 2));
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenAI API: ' + JSON.stringify(data));
      }

      const challengeData = JSON.parse(data.choices[0].message.content);
      
      challenges.push({
        title: challengeData.title,
        description: challengeData.description,
        question: challengeData.question,
        options: challengeData.options,
        correct_answer: challengeData.correct_answer,
        explanation: challengeData.explanation,
        hint: challengeData.hint,
        difficulty: difficulty,
        points: points,
        challenge_type: 'multiple_choice',
        date_assigned: today,
      });
    }

    // Insert challenges into database
    const { data, error } = await supabase
      .from('challenges')
      .insert(challenges);

    if (error) {
      console.error('Error inserting challenges:', error);
      throw error;
    }

    console.log('Successfully generated challenges for:', today);
    
    return new Response(JSON.stringify({ 
      message: 'Successfully generated daily challenges',
      challenges: challenges.length,
      date: today 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-daily-challenges function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});