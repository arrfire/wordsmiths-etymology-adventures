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

    // Check if challenges already exist for today (and ensure they aren't recent duplicates)
    const { data: existingToday } = await supabase
      .from('challenges')
      .select('id, title, question')
      .eq('date_assigned', today);

    if (existingToday && existingToday.length > 0) {
      // PRIORITY CHECK: Compare against yesterday first to prevent immediate repeats
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      
      const { data: yesterdayChallenges } = await supabase
        .from('challenges')
        .select('title, question')
        .eq('date_assigned', yesterday);

      // Check exact matches against yesterday
      const yesterdayTitles = new Set((yesterdayChallenges || []).map((c: any) => (c.title || '').trim()));
      const yesterdayQuestions = new Set((yesterdayChallenges || []).map((c: any) => (c.question || '').trim()));

      const matchesYesterday = existingToday.some((c: any) =>
        yesterdayTitles.has((c.title || '').trim()) ||
        yesterdayQuestions.has((c.question || '').trim())
      );

      if (matchesYesterday) {
        console.log('CRITICAL: Today matches yesterday exactly! Force regenerating...', { today, yesterday });
        await supabase.from('challenges').delete().eq('date_assigned', today);
      } else {
        // Look back further window to avoid other repeats
        const recentWindowDays = 14;
        const fromDate = new Date(Date.now() - recentWindowDays * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const { data: recent } = await supabase
          .from('challenges')
          .select('title, question, date_assigned')
          .gte('date_assigned', fromDate)
          .lt('date_assigned', today);

        const recentTitles = new Set((recent || []).map((c: any) => (c.title || '').trim()));
        const recentQuestions = new Set((recent || []).map((c: any) => (c.question || '').trim()));

        const hasRecentDup = existingToday.some((c: any) =>
          recentTitles.has((c.title || '').trim()) ||
          recentQuestions.has((c.question || '').trim())
        );

        if (!hasRecentDup) {
          console.log('Challenges already exist for today and pass duplication check:', today);
          return new Response(JSON.stringify({ message: 'Challenges already exist for today' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Detected recent duplicate titles/questions for today. Regenerating...', { today, recentWindowDays });
        await supabase.from('challenges').delete().eq('date_assigned', today);
      }
    }

    // Generate 3 new challenges using OpenAI or fallback
    const challenges = [];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    // Enhanced fallback system with more variety - now includes 6 rotating sets
    const allFallbackChallenges = [
      // Set 1
      [
        {
          title: "The Mystery of 'Bankrupt'",
          description: "From Italian markets to financial ruin",
          question: "The word 'bankrupt' literally means:",
          options: [
            "Broken bench or table",
            "Empty vault or treasury", 
            "Failed merchant or trader",
            "Lost money or fortune"
          ],
          correct_answer: 0,
          explanation: "Bankrupt comes from Italian 'banca rotta' meaning 'broken bench.' When medieval Italian moneylenders could no longer do business, their trading benches were physically broken.",
          hint: "Think about what Italian moneylenders sat behind in medieval markets.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Colorful 'Magenta'",
          description: "A color born from battlefield victory",
          question: "The color magenta was named after:",
          options: [
            "A French chemist who discovered it",
            "The Battle of Magenta in Italy (1859)",
            "A type of flower called magenta",
            "An ancient Greek word for purple"
          ],
          correct_answer: 1,
          explanation: "Magenta was named after the Battle of Magenta in 1859, where French and Italian forces defeated Austria. The color was discovered shortly after and named to commemorate the victory.",
          hint: "This color commemorates a 19th-century military victory.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Elusive 'Abracadabra'",
          description: "From ancient amulets to magic shows",
          question: "The magic word 'abracadabra' likely originated from:",
          options: [
            "Aramaic phrase meaning 'I will create as I speak'",
            "Latin 'abra cadaver' meaning 'open the corpse'",
            "Hebrew 'ab, ben, ruach acadosch' meaning sacred trinity",
            "Persian 'abraxas' meaning supreme being"
          ],
          correct_answer: 0,
          explanation: "Abracadabra likely comes from Aramaic 'avra kehdabra' meaning 'I will create as I speak.' It was used as a magical incantation and written on amulets for protection against disease.",
          hint: "This word is about the power of speech to create reality.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 2  
      [
        {
          title: "The Theatrical 'Thespian'",
          description: "From ancient Greek innovation to modern acting",
          question: "The word 'thespian' (meaning actor) comes from:",
          options: [
            "Thespis, the first actor in ancient Greece",
            "Greek 'thespian' meaning dramatic performance",
            "The city of Thespia where theater began",
            "Goddess Thespia who inspired performances"
          ],
          correct_answer: 0,
          explanation: "Thespian comes from Thespis, a 6th-century BC Greek who is traditionally regarded as the first actor. Before him, Greek drama only had choruses - he introduced individual speaking parts.",
          hint: "Named after the very first person to step out of the chorus.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Destructive 'Vandalism'",
          description: "From Germanic tribe to modern destruction",
          question: "The word 'vandalism' comes from:",
          options: [
            "Latin 'vandare' meaning to destroy",
            "The Vandals, a Germanic tribe",
            "Dutch 'vandaal' meaning troublemaker",
            "Viking 'vandal' meaning raider"
          ],
          correct_answer: 1,
          explanation: "Vandalism comes from the Vandals, a Germanic tribe that sacked Rome in 455 AD. The term was popularized during the French Revolution to describe the deliberate destruction of cultural artifacts.",
          hint: "Named after a tribe that famously sacked an ancient capital.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Precise 'Laconic'",
          description: "From Spartan brevity to modern speech",
          question: "The word 'laconic' (meaning brief in speech) refers to:",
          options: [
            "Laconia, the region of ancient Sparta",
            "Latin 'laconicus' meaning short and sweet",
            "Greek philosopher Lacon who spoke little",
            "Ancient Greek 'lakos' meaning few words"
          ],
          correct_answer: 0,
          explanation: "Laconic refers to Laconia, the region of ancient Sparta. Spartans were famous for their extremely brief, pointed speech. When Philip of Macedon threatened invasion with a long message, Sparta replied with just one word: 'If.'",
          hint: "Think of ancient Greek warriors known for speaking very few words.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 3
      [
        {
          title: "The Festive 'Carnival'",
          description: "From medieval fasting to modern celebration",
          question: "The word 'carnival' originally meant:",
          options: [
            "Farewell to meat",
            "Time of masks and costumes",
            "Festival of lights and music",
            "Season of dancing and joy"
          ],
          correct_answer: 0,
          explanation: "Carnival comes from Italian 'carnevale,' from 'carne vale' meaning 'farewell to meat.' It was the last celebration before Lent, when meat was forbidden for 40 days.",
          hint: "This celebration happened before a long period of dietary restriction.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Maritime 'Admiral'",
          description: "From Arabic seas to naval command",
          question: "The naval rank 'admiral' comes from:",
          options: [
            "Latin 'admiralis' meaning sea commander",
            "Arabic 'amir al-bahr' meaning commander of the sea",
            "Old French 'amiral' meaning ship captain",
            "Norman 'admiral' meaning fleet leader"
          ],
          correct_answer: 1,
          explanation: "Admiral comes from Arabic 'amir al-bahr' meaning 'commander of the sea.' The word entered European languages through contact with Arab naval forces in the Mediterranean.",
          hint: "This naval term has its origins in the language of desert peoples who became seafaring traders.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Scholarly 'Pedagogue'",
          description: "From Greek servants to modern educators",
          question: "In ancient Greece, a 'pedagogue' was originally:",
          options: [
            "A wise teacher or philosopher",
            "A slave who escorted children to school",
            "A school building or institution",
            "A method of teaching children"
          ],
          correct_answer: 1,
          explanation: "Pedagogue comes from Greek 'paidagogos' - 'paidos' (child) + 'agogos' (leader). Originally, it was a slave whose job was to escort children to school and supervise them, not teach them.",
          hint: "This person's original job was transportation and supervision, not education.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 4
      [
        {
          title: "The Shocking 'Disaster'",
          description: "From unfavorable stars to modern catastrophe",
          question: "The word 'disaster' literally means:",
          options: [
            "Bad or evil star",
            "Great destruction or ruin",
            "Unexpected terrible event",
            "Complete failure or collapse"
          ],
          correct_answer: 0,
          explanation: "Disaster comes from Italian 'disastro,' from 'dis-' (apart, away) + 'astro' (star). It originally meant an unfavorable astrological aspect, when the stars were misaligned.",
          hint: "Ancient people believed celestial bodies influenced earthly events.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Practical 'Candidate'",
          description: "From Roman togas to modern politics",
          question: "Roman 'candidates' got their name because they:",
          options: [
            "Carried candles during campaigns",
            "Wore bright white togas",
            "Stood on raised platforms",
            "Spoke in public forums"
          ],
          correct_answer: 1,
          explanation: "Candidate comes from Latin 'candidatus' meaning 'clothed in white.' Roman political candidates wore bright white togas to symbolize their purity and make them easily recognizable to voters.",
          hint: "Think about what color Roman politicians wore to stand out in crowds.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Ancient 'Sarcophagus'",
          description: "From flesh-eating stone to eternal rest",
          question: "The word 'sarcophagus' literally means:",
          options: [
            "Stone burial chamber",
            "Eternal resting place",
            "Flesh-eating stone",
            "Sacred burial vessel"
          ],
          correct_answer: 2,
          explanation: "Sarcophagus comes from Greek 'sarko' (flesh) + 'phagus' (eating). Greeks believed certain limestone would consume the flesh of corpses, leaving only bones - hence 'flesh-eating stone.'",
          hint: "The Greeks thought this stone would consume part of what was placed inside it.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 5
      [
        {
          title: "The Peaceful 'Pacific'",
          description: "From Magellan's calm seas to ocean names",
          question: "The Pacific Ocean got its name because:",
          options: [
            "It was peaceful when first explored",
            "It had fewer storms than other oceans",
            "Explorer Magellan found calm waters",
            "It connected peaceful nations"
          ],
          correct_answer: 2,
          explanation: "Portuguese explorer Ferdinand Magellan named it 'Mar Pacifico' (peaceful sea) in 1520 because he encountered calm waters after the rough passage through the strait at the southern tip of South America.",
          hint: "A famous explorer experienced unusually calm conditions compared to his previous journey.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Musical 'Symphony'",
          description: "From Greek harmony to orchestral masterpiece",
          question: "The word 'symphony' originally meant:",
          options: [
            "Large musical composition",
            "Sounding together in harmony",
            "Complex orchestral arrangement",
            "Multiple instruments playing"
          ],
          correct_answer: 1,
          explanation: "Symphony comes from Greek 'symphonia' - 'syn' (together) + 'phone' (sound). It originally meant any harmonious combination of sounds, not specifically the musical form we know today.",
          hint: "Break down this Greek word into its parts about sound.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Mysterious 'Buccaneer'",
          description: "From Caribbean meat-smoking to piracy",
          question: "Buccaneers originally got their name from:",
          options: [
            "Their ships called 'buccans'",
            "Smoking meat on wooden frames called 'boucans'",
            "A type of gun called a 'buccaneer'",
            "The island of Buccanea where they lived"
          ],
          correct_answer: 1,
          explanation: "Buccaneer comes from French 'boucanier,' referring to people who smoked meat on wooden frames called 'boucans.' These Caribbean hunters later turned to piracy against Spanish ships.",
          hint: "Before they became pirates, these people prepared food using a specific smoking method.",
          difficulty: 'Hard',
          points: 30
        }
      ],
      // Set 6
      [
        {
          title: "The Explosive 'Sabotage'",
          description: "From wooden shoes to industrial disruption",
          question: "The word 'sabotage' supposedly comes from:",
          options: [
            "French sabot (wooden shoes) thrown into machinery",
            "Italian sabotaggio meaning deliberate damage",
            "Spanish sabotear meaning to hinder",
            "German sabotage meaning workplace rebellion"
          ],
          correct_answer: 0,
          explanation: "Sabotage comes from French 'sabot' (wooden shoe). Legend says French workers threw their wooden shoes into machinery to stop production, though historians debate this origin. The word entered English around 1910 during industrial conflicts.",
          hint: "Think about what French workers might throw into machines to stop them.",
          difficulty: 'Easy',
          points: 10
        },
        {
          title: "The Scholarly 'Trivia'",
          description: "From Roman crossroads to modern knowledge games",
          question: "The word 'trivia' originally referred to:",
          options: [
            "Three-way road intersections in Rome",
            "Minor academic subjects",
            "Unimportant daily conversations",
            "Simple arithmetic with three numbers"
          ],
          correct_answer: 0,
          explanation: "Trivia comes from Latin 'trivium' meaning a place where three roads meet. In medieval education, the trivium was the foundation curriculum (grammar, logic, rhetoric), considered basic knowledge - hence 'trivial' meant commonplace.",
          hint: "Romans would meet and chat where three roads crossed.",
          difficulty: 'Medium',
          points: 20
        },
        {
          title: "The Noble 'Sinister'",
          description: "From left-handed omens to evil intentions",
          question: "The word 'sinister' originally meant:",
          options: [
            "Left-handed or on the left side",
            "Evil or wicked by nature",
            "Hidden or secretive",
            "Dark or shadowy"
          ],
          correct_answer: 0,
          explanation: "Sinister comes from Latin 'sinister' meaning 'left' or 'on the left side.' In Roman augury, omens appearing on the left were considered unlucky, while those on the right were favorable. This association gave 'sinister' its modern meaning of evil.",
          hint: "Romans considered one direction unlucky for bird omens.",
          difficulty: 'Hard',
          points: 30
        }
      ]
    ];
    
    // Compute recent titles to avoid repeats across the last 14 days
    const recentWindowDays = 14;
    const fromDate = new Date(Date.now() - recentWindowDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    const { data: recentForSelection } = await supabase
      .from('challenges')
      .select('title, question, date_assigned')
      .gte('date_assigned', fromDate)
      .lt('date_assigned', today);

    const recentTitlesSet = new Set((recentForSelection || []).map((c: any) => (c.title || '').trim()));
    const recentQuestionsSet = new Set((recentForSelection || []).map((c: any) => (c.question || '').trim()));

    // Choose a fallback set that avoids recent questions if possible
    const totalSets = allFallbackChallenges.length;
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const candidates = Array.from({ length: totalSets }, (_, i) => (dayOfYear + i * 5) % totalSets);

    const conflictsCount = (setIdx: number) => {
      const questions = allFallbackChallenges[setIdx].map((c: any) => (c.question || '').trim());
      return questions.reduce((acc: number, q: string) => acc + (recentQuestionsSet.has(q) ? 1 : 0), 0);
    };

    let chosenIndex = candidates.find((idx) => conflictsCount(idx) === 0);
    if (chosenIndex === undefined) {
      // If none are perfect, prefer least conflicts, then the one used longest ago
      const lastUse = new Map<number, string | null>();
      for (const idx of candidates) {
        const setQuestions = new Set(allFallbackChallenges[idx].map((c: any) => (c.question || '').trim()));
        const used = (recentForSelection || []).filter((c: any) => setQuestions.has((c.question || '').trim()));
        const oldest = used.length
          ? used.sort((a: any, b: any) => (a.date_assigned > b.date_assigned ? 1 : -1))[0].date_assigned
          : null;
        lastUse.set(idx, oldest);
      }
      candidates.sort((a, b) => {
        const ca = conflictsCount(a);
        const cb = conflictsCount(b);
        if (ca !== cb) return ca - cb;
        const la = lastUse.get(a);
        const lb = lastUse.get(b);
        if (la === lb) return 0;
        if (la === null) return -1; // prefer never used
        if (lb === null) return 1;
        return la! < lb! ? -1 : 1; // prefer older
      });
      chosenIndex = candidates[0];
    }

    const fallbackChallenges = allFallbackChallenges[chosenIndex!];
    
    for (let i = 0; i < 3; i++) {
      const difficulty = difficulties[i];
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      let challengeData;
      let usedFallback = false;
      
      // Try OpenAI first if API key is available
      if (openAIApiKey) {
        try {
          // Query existing challenges to avoid duplicates
          const { data: existingChallenges } = await supabase
            .from('challenges')
            .select('title, question')
            .order('date_assigned', { ascending: false })
            .limit(50);
          
          const usedTitles = existingChallenges?.map((c: any) => c.title) || [];
          const usedQuestions = existingChallenges?.map((c: any) => c.question) || [];
          
          const prompt = `Generate a COMPLETELY UNIQUE etymology challenge for ${difficulty} level on ${today}. 

CRITICAL: Avoid these already used titles and topics:
${usedTitles.join(', ')}

CRITICAL: Avoid these already used questions:
${usedQuestions.slice(0, 10).join(' | ')}

Create a JSON object with:
- title: A catchy title about the word's origin (must be completely different from the avoided list)
- description: Brief description of what the challenge covers  
- question: A multiple choice question about word etymology (must be unique)
- options: Array of 4 possible answers
- correct_answer: Index (0-3) of the correct answer
- explanation: Detailed explanation of the correct answer and etymology
- hint: A helpful hint without giving away the answer

Requirements for MAXIMUM uniqueness:
- Choose words from unexplored linguistic families (Celtic, Nordic, Slavic, Semitic, Austronesian, etc.)
- Explore unusual topics: weather, astronomy, architecture, textiles, weapons, navigation, agriculture, medicine
- Focus on words with surprising origins or cultural migrations
- Include words that changed meaning dramatically over time
- Use the date ${today} to inspire thematic connections (day of week, season, historical events)
- Pick words that most people use but don't know the etymology of
- Avoid any overlap with previously generated challenges`;

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
          usedFallback = true;
        }
      } else {
        console.log(`No OpenAI API key, using fallback for ${difficulty}`);
        challengeData = fallbackChallenges[i];
        usedFallback = true;
      }
      
      // If we used a fallback challenge, lightly shuffle the options to add variety
      let options = [...challengeData.options];
      let correctIndex = challengeData.correct_answer;
      if (usedFallback) {
        const mapped = options.map((opt: string, idx: number) => ({ opt, idx }));
        for (let k = mapped.length - 1; k > 0; k--) {
          const r = Math.floor(Math.random() * (k + 1));
          const tmp = mapped[k];
          mapped[k] = mapped[r];
          mapped[r] = tmp;
        }
        options = mapped.map(m => m.opt);
        correctIndex = mapped.findIndex(m => m.idx === correctIndex);
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