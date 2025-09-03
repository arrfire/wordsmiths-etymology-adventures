import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Starting challenge generation for: ${today}`);

    // Check if challenges already exist for today
    const { data: existingToday } = await supabase
      .from('challenges')
      .select('id, title, question, difficulty')
      .eq('date_assigned', today);

    if (existingToday && existingToday.length > 0) {
      console.log(`Found ${existingToday.length} existing challenges for today`);
      
      // Check for exact duplicates with yesterday
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: yesterdayData } = await supabase
        .from('challenges')
        .select('title, question, difficulty')
        .eq('date_assigned', yesterday);

      if (yesterdayData && yesterdayData.length > 0) {
        const todayTitles = existingToday.map(c => c.title?.trim()).sort();
        const yesterdayTitles = yesterdayData.map(c => c.title?.trim()).sort();
        
        if (JSON.stringify(todayTitles) === JSON.stringify(yesterdayTitles)) {
          console.log(`CRITICAL: Today matches yesterday exactly! Force regenerating...`, { today, yesterday });
          
          // Delete today's challenges and regenerate
          await supabase
            .from('challenges')
            .delete()
            .eq('date_assigned', today);
        } else {
          // Check for any duplicates in recent history (last 21 days)
          const recentDate = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          const { data: recentChallenges } = await supabase
            .from('challenges')
            .select('title, question, date_assigned')
            .gte('date_assigned', recentDate)
            .lt('date_assigned', today);

          const recentTitlesSet = new Set(recentChallenges?.map(c => c.title?.trim()) || []);
          const todayHasDuplicates = existingToday.some(c => recentTitlesSet.has(c.title?.trim()));

          if (todayHasDuplicates) {
            console.log(`Found duplicates in recent history! Regenerating...`);
            await supabase
              .from('challenges')
              .delete()
              .eq('date_assigned', today);
          } else {
            console.log(`Challenges for ${today} are unique, no regeneration needed`);
            return new Response(JSON.stringify({ 
              message: 'Challenges already exist and are unique',
              challenges: existingToday.length,
              date: today 
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    }

    // Extended fallback challenges with more variety
    const extendedFallbackChallenges = [
      // Set 1: Ancient civilizations
      [
        {
          title: "Ancient Greek Wisdom",
          description: "Explore words from ancient Greek philosophy",
          question: "The word 'philosophy' comes from Greek. What does it literally mean?",
          options: ["Love of wisdom", "Study of nature", "Deep thinking", "Ancient knowledge"],
          correct_answer: 0,
          explanation: "Philosophy comes from Greek 'philosophia': 'philos' (loving) + 'sophia' (wisdom), literally meaning 'love of wisdom'.",
          hint: "Think about what philosophers are passionate about."
        },
        {
          title: "Roman Heritage",
          description: "Words inherited from the Roman Empire",
          question: "The word 'salary' has an unusual origin. What was it originally related to?",
          options: ["Gold coins", "Salt", "Work hours", "Military rank"],
          correct_answer: 1,
          explanation: "Salary comes from Latin 'salarium', related to 'sal' (salt). Roman soldiers were sometimes paid in salt or given money to buy salt.",
          hint: "Think of a common seasoning that was once very valuable."
        },
        {
          title: "Egyptian Mysteries",
          description: "Words with ancient Egyptian roots",
          question: "The word 'paper' traces back to which Egyptian plant?",
          options: ["Reed grass", "Papyrus", "Palm leaves", "Cotton"],
          correct_answer: 1,
          explanation: "Paper comes from Latin 'papyrus', named after the papyrus plant that ancient Egyptians used to make writing material.",
          hint: "The word itself contains the name of the plant."
        }
      ],
      // Set 2: Medieval times
      [
        {
          title: "Medieval Markets",
          description: "Commerce words from the Middle Ages",
          question: "The word 'bankrupt' has a physical origin. What does it literally mean?",
          options: ["Empty vault", "Broken bench", "Failed merchant", "Lost money"],
          correct_answer: 1,
          explanation: "Bankrupt comes from Italian 'banca rotta' meaning 'broken bench'. Medieval money changers used benches, which were broken when they failed.",
          hint: "Think about furniture used by medieval merchants."
        },
        {
          title: "Knight's Code",
          description: "Chivalric terms and their origins",
          question: "The word 'courtesy' is connected to which medieval location?",
          options: ["Castle", "Court", "Courtyard", "Countryside"],
          correct_answer: 1,
          explanation: "Courtesy comes from Old French 'courtoisie', referring to the polite behavior expected at royal courts.",
          hint: "Where would nobles gather to meet the king?"
        },
        {
          title: "Plague Times",
          description: "Words from medieval medical practices",
          question: "The word 'quarantine' originally referred to how many days?",
          options: ["Thirty", "Forty", "Twenty", "Ten"],
          correct_answer: 1,
          explanation: "Quarantine comes from Italian 'quaranta giorni' meaning 'forty days' - the period ships were isolated during plague times.",
          hint: "The word itself contains a number in Italian."
        }
      ],
      // Set 3: Exploration age
      [
        {
          title: "Nautical Knowledge",
          description: "Seafaring terms and their maritime origins",
          question: "The word 'companion' has a food-related origin. What does it mean?",
          options: ["Bread sharer", "Meal partner", "Food provider", "Kitchen helper"],
          correct_answer: 0,
          explanation: "Companion comes from Latin 'com' (with) + 'panis' (bread), literally meaning 'one who shares bread'.",
          hint: "Think about what sailors would share during long voyages."
        },
        {
          title: "Spice Routes",
          description: "Words from the global spice trade",
          question: "The word 'orange' comes from which language family?",
          options: ["Latin", "Germanic", "Sanskrit", "Celtic"],
          correct_answer: 2,
          explanation: "Orange traces back to Sanskrit 'naranga', traveling through Persian and Arabic before reaching European languages.",
          hint: "This fruit traveled the same route as many spices from the East."
        },
        {
          title: "New World Discoveries",
          description: "Words from the Age of Exploration",
          question: "The word 'chocolate' comes from which indigenous language?",
          options: ["Mayan", "Aztec", "Incan", "Olmec"],
          correct_answer: 1,
          explanation: "Chocolate comes from Nahuatl (Aztec) 'chocolatl', referring to a bitter drink made from cacao beans.",
          hint: "Think of the civilization that first cultivated cacao in Mexico."
        }
      ],
      // Set 4: Industrial revolution
      [
        {
          title: "Steam Age",
          description: "Words from the industrial revolution",
          question: "The word 'sabotage' originated from which object?",
          options: ["Wooden shoes", "Factory tools", "Steam pipes", "Coal shovels"],
          correct_answer: 0,
          explanation: "Sabotage comes from French 'sabot' (wooden shoe). Workers allegedly threw their shoes into machinery to protest.",
          hint: "Think about footwear that might damage delicate machinery."
        },
        {
          title: "Railroad Revolution",
          description: "Transportation terms from the railway boom",
          question: "The phrase 'off the rails' originally described what?",
          options: ["Trains derailing", "Crazy behavior", "Lost cargo", "Broken schedules"],
          correct_answer: 0,
          explanation: "Originally literal - trains going 'off the rails' meant derailment. Later it became metaphorical for erratic behavior.",
          hint: "Think literally about what happens when trains leave their tracks."
        },
        {
          title: "Factory Life",
          description: "Words from early industrial workplaces",
          question: "The word 'deadline' has a grim historical origin. What was it originally?",
          options: ["Work schedule", "Prison boundary", "Factory rule", "Death sentence"],
          correct_answer: 1,
          explanation: "Deadline originally referred to a line around Civil War prisons - crossing it meant death by shooting.",
          hint: "Think about a literal line that meant life or death."
        }
      ],
      // Set 5: Scientific revolution
      [
        {
          title: "Scientific Method",
          description: "Words from the birth of modern science",
          question: "The word 'vaccine' comes from which animal?",
          options: ["Sheep", "Cow", "Horse", "Pig"],
          correct_answer: 1,
          explanation: "Vaccine comes from Latin 'vacca' (cow). Edward Jenner used cowpox to immunize against smallpox.",
          hint: "Think about the animal that provided the first immunity breakthrough."
        },
        {
          title: "Astronomical Terms",
          description: "Words from studying the heavens",
          question: "The word 'satellite' originally meant what?",
          options: ["Star follower", "Orbiting body", "Attendant", "Space object"],
          correct_answer: 2,
          explanation: "Satellite comes from Latin 'satelles' meaning attendant or bodyguard - one who follows and serves.",
          hint: "Think about someone who follows and serves a master."
        },
        {
          title: "Medical Breakthroughs",
          description: "Terms from advancing medical knowledge",
          question: "The word 'influenza' originally blamed what for causing illness?",
          options: ["Bad air", "Evil spirits", "Star influence", "Cold weather"],
          correct_answer: 2,
          explanation: "Influenza comes from Italian, meaning 'influence of the stars' - people thought celestial bodies caused epidemics.",
          hint: "Ancient people looked to the sky to explain diseases."
        }
      ],
      // Set 6: Modern technology
      [
        {
          title: "Digital Age",
          description: "Words from the computer revolution",
          question: "The word 'bug' in computing came from what literal discovery?",
          options: ["Ant in circuitry", "Moth in relay", "Spider web", "Beetle damage"],
          correct_answer: 1,
          explanation: "Grace Hopper found an actual moth stuck in a computer relay in 1947, coining the term 'bug' for computer problems.",
          hint: "Think about a specific insect found in early computer hardware."
        },
        {
          title: "Internet Era",
          description: "Terms from the world wide web",
          question: "The word 'spam' (unwanted email) comes from which source?",
          options: ["Computer acronym", "Monty Python sketch", "Early hacker name", "Technical term"],
          correct_answer: 1,
          explanation: "Spam comes from a Monty Python sketch where 'SPAM' (the meat) is repeated annoyingly - like unwanted emails.",
          hint: "Think about a famous British comedy group."
        },
        {
          title: "Mobile Revolution",
          description: "Words from portable technology",
          question: "The word 'bluetooth' is named after whom?",
          options: ["Tech company founder", "Viking king", "Blue-toothed scientist", "Software engineer"],
          correct_answer: 1,
          explanation: "Bluetooth is named after King Harald 'Bluetooth' Gormsson, who united Danish tribes like the technology unites devices.",
          hint: "Think about a historical ruler known for unifying people."
        }
      ]
    ];

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const challenges = [];

    // Get all recent challenges to avoid duplicates (last 30 days)
    const recentDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: allRecentChallenges } = await supabase
      .from('challenges')
      .select('title, question, date_assigned')
      .gte('date_assigned', recentDate);

    const recentTitlesSet = new Set(allRecentChallenges?.map(c => c.title?.trim()) || []);
    const recentQuestionsSet = new Set(allRecentChallenges?.map(c => c.question?.trim()) || []);

    // Find a fallback set with no recent conflicts using proper rotation
    let chosenSetIndex = -1;
    const todayNumber = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24));
    
    // Try sets in deterministic but rotating order
    for (let attempt = 0; attempt < extendedFallbackChallenges.length; attempt++) {
      const testIndex = (todayNumber + attempt) % extendedFallbackChallenges.length;
      const testSet = extendedFallbackChallenges[testIndex];
      
      const hasConflict = testSet.some(challenge => 
        recentTitlesSet.has(challenge.title?.trim()) || 
        recentQuestionsSet.has(challenge.question?.trim())
      );
      
      if (!hasConflict) {
        chosenSetIndex = testIndex;
        console.log(`Selected fallback set ${testIndex} with no conflicts (rotation attempt ${attempt})`);
        break;
      }
    }

    // If all sets have conflicts, find the one used longest ago
    if (chosenSetIndex === -1) {
      console.log(`All sets have conflicts, finding least recently used`);
      const setLastUsed = new Map();
      
      for (let i = 0; i < extendedFallbackChallenges.length; i++) {
        const setTitles = new Set(extendedFallbackChallenges[i].map(c => c.title?.trim()));
        const recentUsage = allRecentChallenges?.filter(c => setTitles.has(c.title?.trim())) || [];
        
        if (recentUsage.length === 0) {
          setLastUsed.set(i, new Date('1970-01-01').getTime()); // Never used
        } else {
          const mostRecentUse = Math.max(...recentUsage.map(c => new Date(c.date_assigned).getTime()));
          setLastUsed.set(i, mostRecentUse);
        }
      }
      
      // Choose the set that was used longest ago
      chosenSetIndex = Array.from(setLastUsed.entries())
        .sort(([,a], [,b]) => a - b)[0][0];
      
      console.log(`Selected set ${chosenSetIndex} as least recently used`);
    }

    const selectedSet = extendedFallbackChallenges[chosenSetIndex];
    console.log(`Using fallback set ${chosenSetIndex}`);

    // Generate challenges
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      let challengeData;
      let usedFallback = false;

      // Try OpenAI first if available
      if (openAIApiKey) {
        try {
          const prompt = `Generate a COMPLETELY UNIQUE etymology challenge for ${difficulty} level.

CRITICAL: Create something totally different from recent challenges.
Recent titles to AVOID: ${Array.from(recentTitlesSet).slice(0, 10).join(', ')}

Generate JSON with:
- title: Catchy title about word origin (must be unique)
- description: Brief description 
- question: Multiple choice question about etymology
- options: Array of 4 possible answers
- correct_answer: Index (0-3) of correct answer
- explanation: Detailed explanation
- hint: Helpful hint

Focus on: unusual word origins, surprising etymology, cultural word migrations, words that changed meaning dramatically.`;

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: 'You are an expert etymologist. Generate educational etymology challenges. Respond only with valid JSON.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.9,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              const content = data.choices[0].message.content.trim().replace(/```json\n?|\n?```/g, '').trim();
              challengeData = JSON.parse(content);
              console.log(`Generated OpenAI challenge for ${difficulty}`);
            } else {
              throw new Error('Invalid OpenAI response structure');
            }
          } else {
            throw new Error(`OpenAI API error: ${response.status}`);
          }
        } catch (error) {
          console.log(`OpenAI failed for ${difficulty}, using fallback: ${error.message}`);
          challengeData = selectedSet[i];
          usedFallback = true;
        }
      } else {
        console.log(`No OpenAI API key, using fallback for ${difficulty}`);
        challengeData = selectedSet[i];
        usedFallback = true;
      }

      // Shuffle options if using fallback
      let options = [...challengeData.options];
      let correctIndex = challengeData.correct_answer;
      
      if (usedFallback) {
        const shuffleMap = options.map((opt, idx) => ({ opt, idx }));
        for (let k = shuffleMap.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [shuffleMap[k], shuffleMap[j]] = [shuffleMap[j], shuffleMap[k]];
        }
        options = shuffleMap.map(m => m.opt);
        correctIndex = shuffleMap.findIndex(m => m.idx === correctIndex);
      }

      challenges.push({
        title: challengeData.title,
        description: challengeData.description,
        question: challengeData.question,
        options,
        correct_answer: correctIndex,
        explanation: challengeData.explanation,
        hint: challengeData.hint,
        difficulty: difficulty,
        points: points,
        challenge_type: 'multiple_choice',
        date_assigned: today,
      });
    }

    // Insert challenges
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
      date: today,
      set_used: chosenSetIndex
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