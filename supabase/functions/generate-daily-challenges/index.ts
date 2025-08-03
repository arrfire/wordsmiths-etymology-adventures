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
    
    // Diverse fallback challenges if OpenAI fails - rotated based on day of year
    const allFallbackChallenges = [
      // Set 1
      [
        {
          title: "The Origin of 'Quarantine'",
          description: "A word born from medieval plague prevention",
          question: "What is the etymological origin of 'quarantine'?",
          options: [
            "From Italian 'quaranta giorni' meaning forty days",
            "From Latin 'quartus' meaning fourth part",
            "From French 'quarante' meaning fortress",
            "From Arabic 'qaran' meaning isolation"
          ],
          correct_answer: 0,
          explanation: "Quarantine comes from Italian 'quaranta giorni' (forty days), the period ships from plague-infected ports had to wait before entering Venice during the 14th century.",
          hint: "Think about how long ships had to wait during medieval times.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Evolution of 'Robot'",
          description: "From Czech theater to modern technology",
          question: "The word 'robot' was first coined by:",
          options: [
            "A German engineer in 1920",
            "Czech writer Karel Čapek in his 1920 play",
            "An American inventor in 1921",
            "A Russian scientist in 1919"
          ],
          correct_answer: 1,
          explanation: "Karel Čapek coined 'robot' from Czech 'robota' (forced labor) in his 1920 play 'R.U.R.' about artificial beings created to serve humans.",
          hint: "It comes from a Slavic word meaning forced work.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Mystical 'Algorithm'",
          description: "From a Persian mathematician to computer science",
          question: "The word 'algorithm' derives from:",
          options: [
            "Greek 'arithmos' meaning number",
            "The name of Persian mathematician Al-Khwarizmi",
            "Latin 'algere' meaning to calculate",
            "Arabic 'al-jabr' meaning restoration"
          ],
          correct_answer: 1,
          explanation: "Algorithm comes from 'Algoritmi', the Latinized name of 9th-century Persian mathematician Muhammad ibn Musa al-Khwarizmi, whose mathematical works introduced decimal notation to Europe.",
          hint: "Named after a Persian scholar whose name was Latinized.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 2  
      [
        {
          title: "The Story of 'Orange'",
          description: "A color named after a fruit, not the other way around",
          question: "The color orange got its name from:",
          options: [
            "The fruit orange, which came first",
            "Old English 'or' meaning gold",
            "Latin 'aurum' meaning bright",
            "Sanskrit 'aruna' meaning dawn"
          ],
          correct_answer: 0,
          explanation: "The color orange was named after the fruit. Before oranges came to Europe, the color was called 'red-yellow' or 'yellow-red'.",
          hint: "The fruit existed before the color had a name.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Journey of 'Vanilla'",
          description: "From tiny pods to common flavor",
          question: "The word 'vanilla' comes from:",
          options: [
            "Latin 'vanitas' meaning emptiness",
            "Spanish 'vainilla' meaning little pod",
            "Arabic 'wan' meaning pale",
            "French 'vanille' meaning sweet"
          ],
          correct_answer: 1,
          explanation: "Vanilla comes from Spanish 'vainilla', meaning 'little pod', which is the diminutive of 'vaina' (pod or sheath), describing the shape of the vanilla fruit.",
          hint: "It's about the shape of the spice container.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Ancient 'Pharmacy'",
          description: "From Greek magic to modern medicine",
          question: "The word 'pharmacy' originally referred to:",
          options: [
            "A place of healing",
            "The use of drugs or medicine, including poison and magic",
            "A storehouse for herbs",
            "A physician's dwelling"
          ],
          correct_answer: 1,
          explanation: "Pharmacy comes from Greek 'pharmakeia', which originally meant the use of drugs, whether for healing, harm, or magic. A 'pharmakon' could be medicine, poison, or magical charm.",
          hint: "The original meaning included both healing and harmful substances.",
          difficulty: 'Hard',
          points: 30
        }
      ]
    ];
    
    // Select fallback set based on day of year to ensure variety
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const fallbackChallenges = allFallbackChallenges[dayOfYear % allFallbackChallenges.length];
    
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      let challengeData;
      
      // Try OpenAI first if API key is available
      if (openAIApiKey) {
        try {
          const prompt = `Generate a UNIQUE etymology challenge for ${difficulty} level on ${today}. Use the current date for thematic inspiration and ensure maximum variety. Create a JSON object with:
          - title: A catchy title about the word's origin
          - description: Brief description of what the challenge covers  
          - question: A multiple choice question about word etymology
          - options: Array of 4 possible answers
          - correct_answer: Index (0-3) of the correct answer
          - explanation: Detailed explanation of the correct answer and etymology
          - hint: A helpful hint without giving away the answer
          
          Requirements for uniqueness:
          - Use words from diverse linguistic families (Germanic, Romance, Greek, Latin, Arabic, Sanskrit, Celtic, etc.)
          - Vary topics: technology, nature, emotions, food, colors, professions, mythology, science
          - Include different time periods and geographical origins
          - Make each challenge completely different from common words like 'salary', 'sandwich', 'serendipity'
          - Use the date ${today} to inspire seasonal, historical, or cultural themes`;

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