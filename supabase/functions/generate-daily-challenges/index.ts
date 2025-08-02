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

    // Generate 3 new challenges using OpenAI or fallback
    const challenges = [];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    // Fallback challenges if OpenAI fails
    const fallbackChallenges = [
      {
        title: "The Origin of 'Salary'",
        description: "Discover the ancient roots of this common word",
        question: "What is the etymological origin of the word 'salary'?",
        options: [
          "From Latin 'salarium', meaning payment for salt",
          "From Greek 'salos', meaning wages",
          "From Old French 'salaire', meaning reward",
          "From Germanic 'sal', meaning payment"
        ],
        correct_answer: 0,
        explanation: "The word 'salary' comes from Latin 'salarium', which was the money given to Roman soldiers to buy salt. Salt was so valuable in ancient times that it was sometimes used as currency.",
        hint: "Think about a valuable white substance that was once used as currency.",
        difficulty: 'Easy',
        points: 10
      },
      {
        title: "The Journey of 'Sandwich'",
        description: "How a British nobleman gave his name to our favorite food",
        question: "The word 'sandwich' is named after:",
        options: [
          "A town in England where it was invented",
          "The Earl of Sandwich who ate meat between bread while gambling",
          "A chef named William Sandwich",
          "The sandwich-shaped bay where it originated"
        ],
        correct_answer: 1,
        explanation: "The sandwich is named after John Montagu, 4th Earl of Sandwich, who in 1762 asked for meat between two pieces of bread so he could eat while continuing to play cards without getting his hands greasy.",
        hint: "This food is named after a British aristocrat who loved gambling.",
        difficulty: 'Medium',
        points: 20
      },
      {
        title: "The Complex Path of 'Serendipity'",
        description: "A word born from Persian fairy tales",
        question: "The word 'serendipity' was coined by Horace Walpole in 1754, inspired by:",
        options: [
          "A personal experience of fortunate discovery",
          "The Persian fairy tale 'The Three Princes of Serendip'",
          "An Arabic word meaning 'happy accident'",
          "A Latin phrase meaning 'pleasant surprise'"
        ],
        correct_answer: 1,
        explanation: "Horace Walpole coined 'serendipity' from the Persian fairy tale 'The Three Princes of Serendip' (now Sri Lanka), whose heroes were always making discoveries by accident and sagacity of things they were not looking for.",
        hint: "It comes from an old name for Sri Lanka and involves three royal brothers.",
        difficulty: 'Hard',
        points: 30
      }
    ];
    
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      let challengeData;
      
      // Try OpenAI first if API key is available
      if (openAIApiKey) {
        try {
          const prompt = `Generate an etymology challenge for ${difficulty} level. Create a JSON object with:
          - title: A catchy title about the word's origin
          - description: Brief description of what the challenge covers
          - question: A multiple choice question about word etymology
          - options: Array of 4 possible answers
          - correct_answer: Index (0-3) of the correct answer
          - explanation: Detailed explanation of the correct answer and etymology
          - hint: A helpful hint without giving away the answer
          
          Focus on interesting word origins, root meanings, language evolution, or historical context. Make it educational and engaging.`;

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

          if (response.ok) {
            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
              // Clean up the content and parse JSON
              const content = data.choices[0].message.content.trim();
              const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
              challengeData = JSON.parse(cleanContent);
              console.log(`Generated OpenAI challenge for ${difficulty}`);
            } else {
              throw new Error('Invalid OpenAI response structure');
            }
          } else {
            const errorText = await response.text();
            console.error(`OpenAI API error: ${response.status} - ${errorText}`);
            throw new Error(`OpenAI API error: ${response.status}`);
          }
        } catch (error) {
          console.log(`OpenAI failed for ${difficulty}, using fallback: ${error.message}`);
          challengeData = fallbackChallenges[i];
        }
      } else {
        console.log(`No OpenAI API key, using fallback for ${difficulty}`);
        challengeData = fallbackChallenges[i];
      }
      
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