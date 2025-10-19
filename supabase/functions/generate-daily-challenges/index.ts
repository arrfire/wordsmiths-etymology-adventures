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
      ],
      // Set 7: Food and Cuisine
      [
        {
          title: "Coffee Culture",
          description: "The journey of coffee from bean to global beverage",
          question: "The word 'mocha' originally referred to what?",
          options: ["A coffee flavor", "A Yemeni port city", "A brewing method", "A type of bean"],
          correct_answer: 1,
          explanation: "Mocha comes from Al-Mukha, a port city in Yemen that was a major coffee trading center in the 15th-17th centuries.",
          hint: "Think about a place where coffee was traded, not how it's prepared."
        },
        {
          title: "Pasta Linguistics",
          description: "Italian culinary terms and their meanings",
          question: "What does 'spaghetti' literally mean in Italian?",
          options: ["Long strings", "Little worms", "Thin ropes", "Small strings"],
          correct_answer: 3,
          explanation: "Spaghetti is the plural of 'spaghetto', which means 'thin string' or 'twine' in Italian, from 'spago' (string).",
          hint: "Think about the shape and how Italians might describe something thin."
        },
        {
          title: "Sandwich Story",
          description: "Food named after people and places",
          question: "The 'sandwich' is named after whom?",
          options: ["A chef", "An earl", "A town", "An inventor"],
          correct_answer: 1,
          explanation: "Named after John Montagu, 4th Earl of Sandwich, who supposedly ordered meat between bread so he could eat while gambling.",
          hint: "Think about British nobility with a title."
        }
      ],
      // Set 8: Fashion and Clothing
      [
        {
          title: "Denim Origins",
          description: "The surprising history of everyday fabrics",
          question: "The word 'denim' comes from which French city?",
          options: ["Paris", "Lyon", "Nîmes", "Marseille"],
          correct_answer: 2,
          explanation: "Denim comes from 'serge de Nîmes' (fabric from Nîmes). The French city was famous for this sturdy fabric.",
          hint: "The word itself contains a modified version of the city name."
        },
        {
          title: "Silk Road Stories",
          description: "Luxury fabrics and their exotic origins",
          question: "What does 'pajamas' literally mean in its original language?",
          options: ["Night clothes", "Leg garment", "Soft fabric", "Sleeping outfit"],
          correct_answer: 1,
          explanation: "Pajamas comes from Persian and Urdu 'pāy-jāma', meaning 'leg garment' (pāy=leg, jāma=garment).",
          hint: "Think about what body part this loose clothing covers."
        },
        {
          title: "Hat History",
          description: "Headwear terms from around the world",
          question: "The word 'beret' comes from which regional language?",
          options: ["French", "Spanish", "Basque", "Italian"],
          correct_answer: 2,
          explanation: "Beret comes from Gascon Béarnais 'berret', a language of the Basque region, referring to the flat cap style.",
          hint: "Think about the mountainous region between France and Spain."
        }
      ],
      // Set 9: Sports and Games
      [
        {
          title: "Tennis Terms",
          description: "The peculiar language of racquet sports",
          question: "Why do we say 'love' for zero in tennis?",
          options: ["Playing for love", "French l'oeuf (egg)", "Lover's game", "Love of sport"],
          correct_answer: 1,
          explanation: "Love likely comes from French 'l'oeuf' (the egg) because a zero looks like an egg. The phrase was corrupted to 'love'.",
          hint: "Think about what shape zero resembles and a French word for it."
        },
        {
          title: "Marathon Legacy",
          description: "Athletic events with ancient origins",
          question: "The word 'gymnasium' comes from Greek meaning what?",
          options: ["Place to train", "Exercise building", "Naked", "Athletic field"],
          correct_answer: 2,
          explanation: "Gymnasium comes from Greek 'gymnazein' meaning 'to exercise naked' - ancient Greeks trained nude.",
          hint: "Think about ancient Greek athletic practices that might seem unusual today."
        },
        {
          title: "Chess Chronicles",
          description: "Strategy games across cultures",
          question: "The word 'checkmate' comes from which phrase?",
          options: ["Check the mate", "Persian 'shah mat'", "Chess master", "Final check"],
          correct_answer: 1,
          explanation: "Checkmate comes from Persian 'shah mat' meaning 'the king is dead' or 'the king is helpless'.",
          hint: "The word has royal connotations from ancient Persia."
        }
      ],
      // Set 10: Music and Arts
      [
        {
          title: "Orchestra Origins",
          description: "Musical terms from ancient theaters",
          question: "The word 'orchestra' originally referred to what part of a theater?",
          options: ["Stage area", "Dancing space", "Seating section", "Back room"],
          correct_answer: 1,
          explanation: "Orchestra comes from Greek 'orcheisthai' (to dance). It was the circular space where Greek chorus danced.",
          hint: "Think about movement and performance, not just music."
        },
        {
          title: "Canvas Creations",
          description: "Art terms and their material origins",
          question: "The word 'canvas' comes from which plant?",
          options: ["Cotton", "Linen", "Hemp", "Jute"],
          correct_answer: 2,
          explanation: "Canvas comes from Latin 'cannabis' (hemp). The fabric was originally made from hemp before cotton became common.",
          hint: "Think about a controversial plant that has many industrial uses."
        },
        {
          title: "Symphony Secrets",
          description: "Classical music terminology",
          question: "What does 'piano' literally mean in Italian?",
          options: ["Soft", "Keyboard", "Musical", "Harmony"],
          correct_answer: 0,
          explanation: "Piano is short for 'pianoforte', meaning 'soft-loud' in Italian, describing the instrument's dynamic range.",
          hint: "Think about volume and how the instrument can vary its sound."
        }
      ],
      // Set 11: Weather and Nature
      [
        {
          title: "Hurricane Names",
          description: "Storm terminology from indigenous languages",
          question: "The word 'hurricane' comes from which god?",
          options: ["Greek Zeus", "Taíno Juracán", "Norse Thor", "Roman Jupiter"],
          correct_answer: 1,
          explanation: "Hurricane comes from Taíno 'hurakán', the name of the Caribbean storm god in indigenous mythology.",
          hint: "Think about the original inhabitants of Caribbean islands."
        },
        {
          title: "Cloud Classifications",
          description: "Meteorological terms from Latin roots",
          question: "What does 'cirrus' cloud mean in Latin?",
          options: ["White", "High", "Curl of hair", "Wispy"],
          correct_answer: 2,
          explanation: "Cirrus comes from Latin meaning 'curl of hair' or 'fringe', describing the wispy, hair-like appearance of high clouds.",
          hint: "Think about something on your body that can be curly and wispy."
        },
        {
          title: "Avalanche Alert",
          description: "Natural disaster terminology",
          question: "The word 'tsunami' means what in Japanese?",
          options: ["Big wave", "Harbor wave", "Ocean earthquake", "Tidal wave"],
          correct_answer: 1,
          explanation: "Tsunami means 'harbor wave' in Japanese (tsu=harbor, nami=wave), describing waves that devastate harbors.",
          hint: "Think about where these waves cause the most visible destruction."
        }
      ],
      // Set 12: Architecture and Building
      [
        {
          title: "Palace Etymology",
          description: "Grand building terms from ancient Rome",
          question: "The word 'palace' comes from which Roman hill?",
          options: ["Capitoline", "Aventine", "Palatine", "Quirinal"],
          correct_answer: 2,
          explanation: "Palace comes from Palatine Hill in Rome, where emperors built their grand residences. 'Palatium' became 'palace'.",
          hint: "The word itself sounds similar to one of Rome's seven hills."
        },
        {
          title: "Window Wisdom",
          description: "Everyday architectural terms with surprising origins",
          question: "The Old Norse origin of 'window' literally meant what?",
          options: ["Glass opening", "Wind eye", "Light hole", "Wall gap"],
          correct_answer: 1,
          explanation: "Window comes from Old Norse 'vindauga': 'vindr' (wind) + 'auga' (eye), literally 'wind eye'.",
          hint: "Think about two natural elements - one moving, one seeing."
        },
        {
          title: "Castle Construction",
          description: "Medieval fortress terminology",
          question: "What does 'dungeon' originally mean?",
          options: ["Prison cell", "Underground room", "Tower keep", "Castle basement"],
          correct_answer: 2,
          explanation: "Dungeon originally meant the great tower or keep of a castle (from Latin 'dominus'=lord), not a prison.",
          hint: "Think up, not down - it was the lord's residence."
        }
      ],
      // Set 13: Literature and Books
      [
        {
          title: "Novel Nomenclature",
          description: "Literary terms and their origins",
          question: "What does 'book' originally refer to in Old English?",
          options: ["Written pages", "Beech tree", "Leather binding", "Story collection"],
          correct_answer: 1,
          explanation: "Book comes from Old English 'boc' meaning beech tree. Early Germanic people carved runes on beech wood tablets.",
          hint: "Think about what material was used for writing before paper."
        },
        {
          title: "Poetry Roots",
          description: "Verse terminology across languages",
          question: "The word 'lyric' is connected to which musical instrument?",
          options: ["Flute", "Lyre", "Harp", "Drum"],
          correct_answer: 1,
          explanation: "Lyric comes from Greek 'lyrikos', relating to the lyre. Ancient Greeks sang lyric poetry while playing the lyre.",
          hint: "Think about an ancient stringed instrument from Greece."
        },
        {
          title: "Author Etymology",
          description: "Words for writers and creators",
          question: "What does 'plagiarism' literally mean in Latin?",
          options: ["Theft", "Copying", "Kidnapping", "Lying"],
          correct_answer: 2,
          explanation: "Plagiarism comes from Latin 'plagiarius' meaning kidnapper - stealing someone else's intellectual 'child'.",
          hint: "Think about taking something that belongs to someone else."
        }
      ],
      // Set 14: Space Exploration
      [
        {
          title: "Astronaut Origins",
          description: "Space travel terminology",
          question: "What does 'astronaut' literally mean in Greek?",
          options: ["Space traveler", "Star sailor", "Sky explorer", "Cosmic voyager"],
          correct_answer: 1,
          explanation: "Astronaut comes from Greek 'astron' (star) + 'nautes' (sailor), literally meaning 'star sailor'.",
          hint: "Think about someone who sails or navigates."
        },
        {
          title: "Rocket Science",
          description: "Space technology terms",
          question: "The word 'comet' comes from Greek meaning what?",
          options: ["Flying rock", "Long-haired star", "Night wanderer", "Bright tail"],
          correct_answer: 1,
          explanation: "Comet comes from Greek 'kometes' meaning 'long-haired star', describing the tail that looks like flowing hair.",
          hint: "Think about what part of a comet looks like it could be on your head."
        },
        {
          title: "Lunar Language",
          description: "Moon-related terminology",
          question: "Why is Monday called Monday?",
          options: ["Start of week", "Moon's day", "Morning day", "Market day"],
          correct_answer: 1,
          explanation: "Monday comes from Old English 'Monandæg' meaning 'Moon's day', following the ancient practice of naming days after celestial bodies.",
          hint: "Think about celestial bodies and how they named weekdays."
        }
      ],
      // Set 15: Transportation History
      [
        {
          title: "Automobile Age",
          description: "Car terminology and origins",
          question: "What does 'dashboard' originally refer to?",
          options: ["Speed gauge", "Mud splash guard", "Control panel", "Instrument board"],
          correct_answer: 1,
          explanation: "Dashboard originally was a board on horse carriages to block mud and water 'dashed' up by horses' hooves.",
          hint: "Think about protecting passengers from something horses kicked up."
        },
        {
          title: "Aviation Terms",
          description: "Flight and aircraft language",
          question: "The word 'helicopter' combines Greek words meaning what?",
          options: ["Sky vehicle", "Spiral wing", "Rotating flight", "Vertical lift"],
          correct_answer: 1,
          explanation: "Helicopter comes from Greek 'helix' (spiral) + 'pteron' (wing), describing the rotating blades.",
          hint: "Think about the shape and movement of the rotor blades."
        },
        {
          title: "Bicycle Basics",
          description: "Two-wheeled transportation",
          question: "What does 'tandem' originally mean in Latin?",
          options: ["Two together", "At length", "Side by side", "Double power"],
          correct_answer: 1,
          explanation: "Tandem means 'at length' or 'lengthwise' in Latin, describing the front-to-back seating arrangement.",
          hint: "Think about the arrangement of seats, not side-by-side."
        }
      ],
      // Set 16: Photography and Film
      [
        {
          title: "Camera Origins",
          description: "Photography equipment terms",
          question: "What does 'camera' literally mean in Latin?",
          options: ["Light box", "Dark room", "Image maker", "Picture device"],
          correct_answer: 1,
          explanation: "Camera comes from Latin 'camera obscura' meaning 'dark chamber', the principle early cameras were based on.",
          hint: "Think about the chamber where images are formed."
        },
        {
          title: "Cinema History",
          description: "Movie terminology",
          question: "What does 'cinema' derive from in Greek?",
          options: ["Pictures", "Movement", "Drama", "Light"],
          correct_answer: 1,
          explanation: "Cinema comes from Greek 'kinema' meaning movement, related to 'kinesis' (motion) - movies are moving pictures.",
          hint: "Think about what makes movies different from still photographs."
        },
        {
          title: "Film Development",
          description: "Movie production terms",
          question: "Why are movies called 'films'?",
          options: ["Film directors", "Film coating", "Film studios", "Film editing"],
          correct_answer: 1,
          explanation: "Movies are recorded on a thin flexible strip or 'film' coated with light-sensitive emulsion.",
          hint: "Think about the physical material movies were originally recorded on."
        }
      ],
      // Set 17: Language and Writing
      [
        {
          title: "Alphabet Origins",
          description: "Writing system terminology",
          question: "What do the first two letters of the Greek alphabet spell?",
          options: ["Alpha Beta", "Alpha Gamma", "Beta Gamma", "Alpha Delta"],
          correct_answer: 0,
          explanation: "Alphabet comes from the first two Greek letters: alpha and beta, giving us the word for the entire letter system.",
          hint: "The word itself contains these two letter names."
        },
        {
          title: "Grammar Guide",
          description: "Language structure terms",
          question: "What does 'punctuation' literally mean?",
          options: ["Marking points", "Stopping places", "Dot making", "Sentence breaks"],
          correct_answer: 0,
          explanation: "Punctuation comes from Latin 'punctus' (point). Romans marked texts with points to aid reading.",
          hint: "Think about making points or dots on a page."
        },
        {
          title: "Dictionary Development",
          description: "Reference book terminology",
          question: "What does 'vocabulary' come from in Latin?",
          options: ["Speaking", "Words", "Voice", "Language"],
          correct_answer: 0,
          explanation: "Vocabulary comes from Latin 'vocabulum' from 'vocare' meaning 'to call' or 'to speak'.",
          hint: "Think about using your voice to communicate."
        }
      ],
      // Set 18: Economics and Currency
      [
        {
          title: "Money Matters",
          description: "Currency terminology",
          question: "Why is British currency called 'pound sterling'?",
          options: ["Weight in gold", "Silver pennies", "Royal decree", "Trading standard"],
          correct_answer: 1,
          explanation: "Sterling comes from 'Easterling silver', referring to the high-quality silver used. A pound was literally a pound of sterling silver.",
          hint: "Think about the metal quality and weight."
        },
        {
          title: "Banking Terms",
          description: "Financial institution language",
          question: "What does 'mortgage' literally mean in French?",
          options: ["Long loan", "Death pledge", "House debt", "Property bond"],
          correct_answer: 1,
          explanation: "Mortgage comes from Old French 'mort' (death) + 'gage' (pledge) - the deal 'dies' when paid off or defaults.",
          hint: "Think about something ending or dying."
        },
        {
          title: "Market Origins",
          description: "Commerce and trade terms",
          question: "The word 'capital' (as in money) relates to what?",
          options: ["City center", "Head/chief", "Main asset", "King's wealth"],
          correct_answer: 1,
          explanation: "Capital comes from Latin 'caput' (head). Like the head leads the body, capital is the principal or 'head' sum.",
          hint: "Think about what leads or is most important in the body."
        }
      ],
      // Set 19: Mathematics
      [
        {
          title: "Number Names",
          description: "Mathematical terminology",
          question: "What does 'calculate' originally relate to?",
          options: ["Counting", "Small stones", "Mathematics", "Roman numerals"],
          correct_answer: 1,
          explanation: "Calculate comes from Latin 'calculus' meaning pebble or small stone. Romans used pebbles on counting boards.",
          hint: "Think about small objects used for counting in ancient times."
        },
        {
          title: "Geometry Origins",
          description: "Shape and space mathematics",
          question: "What does 'geometry' literally mean in Greek?",
          options: ["Shape study", "Earth measurement", "Space calculation", "Angle science"],
          correct_answer: 1,
          explanation: "Geometry comes from Greek 'geo' (earth) + 'metron' (measure). It originated from surveying land in ancient Egypt.",
          hint: "Think about measuring land and property."
        },
        {
          title: "Zero History",
          description: "Number system development",
          question: "The word 'zero' traces back to which language?",
          options: ["Latin", "Greek", "Arabic", "Sanskrit"],
          correct_answer: 2,
          explanation: "Zero comes from Arabic 'sifr' (empty/cipher), which came from Sanskrit 'shunya' (void). Arabs brought it to Europe.",
          hint: "Think about the Middle Eastern language that spread mathematics to Europe."
        }
      ],
      // Set 20: Chemistry
      [
        {
          title: "Elemental Names",
          description: "Chemical terminology",
          question: "What does 'oxygen' literally mean in Greek?",
          options: ["Air maker", "Acid former", "Life gas", "Breath giver"],
          correct_answer: 1,
          explanation: "Oxygen comes from Greek 'oxys' (acid/sharp) + 'genes' (forming). Scientists thought all acids contained oxygen.",
          hint: "Think about another substance related to sourness."
        },
        {
          title: "Laboratory Language",
          description: "Science workspace terms",
          question: "The word 'alchemy' comes from which civilization?",
          options: ["Greek", "Egyptian", "Babylonian", "Chinese"],
          correct_answer: 1,
          explanation: "Alchemy comes from Arabic 'al-kimiya', from Egyptian 'khem' (black earth), referring to the black soil of the Nile.",
          hint: "Think about the civilization known for ancient mysteries and black river soil."
        },
        {
          title: "Atomic Age",
          description: "Particle physics terms",
          question: "What does 'atom' mean in Greek?",
          options: ["Tiny particle", "Indivisible", "Basic unit", "Matter piece"],
          correct_answer: 1,
          explanation: "Atom comes from Greek 'atomos' meaning 'uncuttable' or 'indivisible' - what Greeks thought was the smallest unit.",
          hint: "Think about something that cannot be cut or divided."
        }
      ],
      // Set 21: Biology and Nature
      [
        {
          title: "Animal Kingdom",
          description: "Zoological terminology",
          question: "What does 'hippopotamus' mean in Greek?",
          options: ["Water beast", "River horse", "Mud dweller", "Large animal"],
          correct_answer: 1,
          explanation: "Hippopotamus comes from Greek 'hippos' (horse) + 'potamos' (river), literally 'river horse'.",
          hint: "Think about combining a common farm animal with water."
        },
        {
          title: "Plant Science",
          description: "Botanical terms",
          question: "The word 'dandelion' comes from French meaning what?",
          options: ["Yellow flower", "Lion's tooth", "Spring bloom", "Weed seed"],
          correct_answer: 1,
          explanation: "Dandelion comes from French 'dent-de-lion' (lion's tooth), describing the jagged, tooth-like leaves.",
          hint: "Look at the shape of the leaves and think of a fierce animal."
        },
        {
          title: "Cellular Discovery",
          description: "Microscopic biology",
          question: "Why did Robert Hooke name tiny structures 'cells'?",
          options: ["Living chambers", "Monk's rooms", "Small boxes", "Prison cells"],
          correct_answer: 1,
          explanation: "Hooke called them cells because they reminded him of monastery cells (small rooms) where monks lived.",
          hint: "Think about small rooms in religious buildings."
        }
      ],
      // Set 22: Geography
      [
        {
          title: "Continent Names",
          description: "Landmass terminology",
          question: "What does 'America' come from?",
          options: ["Native word", "Explorer Amerigo", "Latin phrase", "Spanish term"],
          correct_answer: 1,
          explanation: "America is named after Italian explorer Amerigo Vespucci, whose name was latinized on early maps.",
          hint: "Think about an Italian explorer whose first name sounds similar."
        },
        {
          title: "Ocean Origins",
          description: "Water body naming",
          question: "The Pacific Ocean was named for being what?",
          options: ["Largest", "Deepest", "Peaceful", "Western"],
          correct_answer: 2,
          explanation: "Pacific comes from Latin 'pacificus' (peaceful). Magellan named it this after encountering calm waters.",
          hint: "Think about the water conditions when it was named."
        },
        {
          title: "Mountain Terms",
          description: "Geological feature names",
          question: "What does 'volcano' come from?",
          options: ["Fire mountain", "Roman god", "Smoking peak", "Lava flow"],
          correct_answer: 1,
          explanation: "Volcano comes from Vulcan, the Roman god of fire. Romans believed he had his forge beneath Mount Etna.",
          hint: "Think about Roman mythology and fire."
        }
      ],
      // Set 23: Communication Technology
      [
        {
          title: "Telegraph Tales",
          description: "Early electric communication",
          question: "What does 'telegraph' mean in Greek?",
          options: ["Electric message", "Distance writing", "Wire communication", "Signal sending"],
          correct_answer: 1,
          explanation: "Telegraph comes from Greek 'tele' (far) + 'graphein' (to write), meaning 'writing at a distance'.",
          hint: "Think about writing messages that travel far."
        },
        {
          title: "Telephone History",
          description: "Voice transmission devices",
          question: "The word 'microphone' combines Greek words meaning what?",
          options: ["Small voice", "Tiny sound", "Quiet speaker", "Low volume"],
          correct_answer: 0,
          explanation: "Microphone comes from Greek 'mikros' (small) + 'phone' (voice/sound), though it actually makes sound louder.",
          hint: "Think about the size reference in the Greek prefix."
        },
        {
          title: "Radio Revolution",
          description: "Wireless communication",
          question: "What does 'broadcast' originally refer to?",
          options: ["Wide signal", "Scattering seed", "Mass message", "Radio waves"],
          correct_answer: 1,
          explanation: "Broadcast comes from agriculture - casting seed broadly by hand. Radio adopted it for 'widely scattered' signals.",
          hint: "Think about farming practices before radio existed."
        }
      ],
      // Set 24: Agriculture and Farming
      [
        {
          title: "Farm Etymology",
          description: "Agricultural terminology",
          question: "What does 'harvest' originally mean in Old English?",
          options: ["Crop gathering", "Autumn season", "Food storage", "Field work"],
          correct_answer: 1,
          explanation: "Harvest comes from Old English 'hærfest' meaning autumn - the season itself, not just the activity.",
          hint: "Think about when crops are gathered, not the action itself."
        },
        {
          title: "Livestock Language",
          description: "Animal husbandry terms",
          question: "Why is cattle related to 'capital'?",
          options: ["Farm wealth", "Counting units", "Trade value", "Head count"],
          correct_answer: 3,
          explanation: "Both come from Latin 'caput' (head). Wealth was counted in 'heads of cattle', and 'per capita' means per head.",
          hint: "Think about how you count animals and what body part you count."
        },
        {
          title: "Crop Culture",
          description: "Plant cultivation terms",
          question: "What does 'cereal' come from?",
          options: ["Grain type", "Roman goddess", "Breakfast food", "Field crop"],
          correct_answer: 1,
          explanation: "Cereal comes from Ceres, the Roman goddess of agriculture and grain crops.",
          hint: "Think about Roman mythology and agriculture."
        }
      ],
      // Set 25: Energy Sources
      [
        {
          title: "Electric Etymology",
          description: "Electrical power terminology",
          question: "What does 'electricity' come from in Greek?",
          options: ["Lightning", "Amber", "Power", "Spark"],
          correct_answer: 1,
          explanation: "Electricity comes from Greek 'elektron' (amber). Ancient Greeks noticed amber attracted objects when rubbed.",
          hint: "Think about an ancient material that creates static when rubbed."
        },
        {
          title: "Coal Age",
          description: "Fossil fuel terminology",
          question: "What does 'petroleum' literally mean in Latin?",
          options: ["Black liquid", "Rock oil", "Earth energy", "Fossil fuel"],
          correct_answer: 1,
          explanation: "Petroleum comes from Latin 'petra' (rock) + 'oleum' (oil), meaning 'rock oil' or oil from rocks.",
          hint: "Think about where oil is found and what it's made of."
        },
        {
          title: "Solar Power",
          description: "Renewable energy terms",
          question: "The word 'solar' honors which Roman deity?",
          options: ["Apollo", "Sol", "Jupiter", "Mars"],
          correct_answer: 1,
          explanation: "Solar comes from 'Sol', the Roman sun god. Sol Invictus was the 'unconquered sun'.",
          hint: "Think about the Roman god specifically associated with the sun."
        }
      ],
      // Set 26: Materials and Inventions
      [
        {
          title: "Plastic Origins",
          description: "Synthetic material terminology",
          question: "What does 'plastic' originally mean in Greek?",
          options: ["Flexible", "Man-made", "Moldable", "Artificial"],
          correct_answer: 2,
          explanation: "Plastic comes from Greek 'plastikos' meaning capable of being shaped or molded, from 'plassein' (to mold).",
          hint: "Think about what you can do with the material when it's warm."
        },
        {
          title: "Rubber Revolution",
          description: "Elastic material history",
          question: "Why is rubber called rubber?",
          options: ["Erasing pencil", "Rubbing texture", "Tree resin", "Bouncing property"],
          correct_answer: 0,
          explanation: "Rubber got its name because it could 'rub out' pencil marks - its original commercial use as an eraser.",
          hint: "Think about what students use to remove pencil mistakes."
        },
        {
          title: "Glass Through Time",
          description: "Transparent material origins",
          question: "The word 'crystal' comes from Greek meaning what?",
          options: ["Clear stone", "Ice", "Transparent", "Hard mineral"],
          correct_answer: 1,
          explanation: "Crystal comes from Greek 'krystallos' meaning ice. Greeks thought quartz crystals were permanently frozen ice.",
          hint: "Think about something cold and clear that forms in nature."
        }
      ],
      // Set 27: Psychology and Mind
      [
        {
          title: "Mind Matters",
          description: "Psychological terminology",
          question: "What do the Greek roots of 'psychology' literally mean?",
          options: ["Mind study", "Soul discourse", "Behavior science", "Mental health"],
          correct_answer: 1,
          explanation: "Psychology comes from Greek 'psyche' (soul/breath of life) + 'logos' (study), meaning 'study of the soul'.",
          hint: "Think about the ancient concept of the soul, not just the mind."
        },
        {
          title: "Memory Terms",
          description: "Cognitive function language",
          question: "The word 'amnesia' means what in Greek?",
          options: ["Memory loss", "Forgetfulness", "Without memory", "Brain damage"],
          correct_answer: 2,
          explanation: "Amnesia comes from Greek 'a' (without) + 'mnesis' (memory), literally meaning 'without memory'.",
          hint: "Think about the prefix that means 'without' or 'lacking'."
        },
        {
          title: "Emotion Etymology",
          description: "Feeling and mood terminology",
          question: "What does 'phobia' literally mean?",
          options: ["Hatred", "Fear", "Anxiety", "Avoidance"],
          correct_answer: 1,
          explanation: "Phobia comes from Greek 'phobos' meaning fear or dread, named after Phobos, god of fear.",
          hint: "Think about the basic emotion that all phobias involve."
        }
      ],
      // Set 28: Law and Justice
      [
        {
          title: "Legal Language",
          description: "Court and law terminology",
          question: "What does 'verdict' mean in Latin?",
          options: ["Final judgment", "True speech", "Legal decision", "Court ruling"],
          correct_answer: 1,
          explanation: "Verdict comes from Latin 'vere' (truly) + 'dictum' (said/spoken), literally meaning 'true speech'.",
          hint: "Think about speaking the truth in court."
        },
        {
          title: "Justice Terms",
          description: "Legal system vocabulary",
          question: "The word 'testimony' relates to which body part?",
          options: ["Hand", "Heart", "Testicles", "Tongue"],
          correct_answer: 2,
          explanation: "Testimony comes from Latin 'testis' (witness), related to 'testiculus'. Romans swore oaths by touching their testicles.",
          hint: "Think about ancient Roman oath-taking practices (anatomical)."
        },
        {
          title: "Crime and Punishment",
          description: "Criminal justice terms",
          question: "What does 'jury' originally mean in French?",
          options: ["Judgment group", "Sworn oath", "Twelve people", "Court panel"],
          correct_answer: 1,
          explanation: "Jury comes from Old French 'juree' meaning sworn oath, from Latin 'jurare' (to swear).",
          hint: "Think about what jurors do before serving."
        }
      ],
      // Set 29: Time and Calendars
      [
        {
          title: "Month Names",
          description: "Calendar terminology",
          question: "Which month is named after the Roman god of war?",
          options: ["January", "March", "May", "June"],
          correct_answer: 1,
          explanation: "March is named after Mars, the Roman god of war. It was the first month of the early Roman calendar.",
          hint: "Think about a month when military campaigns traditionally began."
        },
        {
          title: "Time Keeping",
          description: "Measurement of time",
          question: "What does 'minute' originally mean in Latin?",
          options: ["Tiny", "Sixtieth", "Small portion", "Short time"],
          correct_answer: 2,
          explanation: "Minute comes from Latin 'minuta' meaning small or minute part. A minute is a small part of an hour.",
          hint: "Think about size, not the time unit itself."
        },
        {
          title: "Season Names",
          description: "Yearly cycle terminology",
          question: "What does 'autumn' (or fall) originally mean?",
          options: ["Harvest time", "Leaf falling", "Cool season", "Year end"],
          correct_answer: 0,
          explanation: "Autumn comes from Latin 'autumnus', possibly from 'augere' (to increase), referring to harvest abundance.",
          hint: "Think about what farmers do in this season."
        }
      ],
      // Set 30: Colors and Dyes
      [
        {
          title: "Color Origins",
          description: "Pigment and dye terminology",
          question: "The color 'purple' was named after what?",
          options: ["Royal robes", "Sea snail", "Flower petals", "Precious stone"],
          correct_answer: 1,
          explanation: "Purple comes from Latin 'purpura', a mollusk that produced the expensive Tyrian purple dye.",
          hint: "Think about the expensive ancient source of this royal color."
        },
        {
          title: "Indigo Journey",
          description: "Blue dye history",
          question: "Where does the word 'indigo' come from?",
          options: ["Indian plant", "Deep blue", "Dye process", "Spanish word"],
          correct_answer: 0,
          explanation: "Indigo comes from Spanish 'indico' and Latin 'indicum', meaning 'from India', where the dye originated.",
          hint: "Think about the geographical origin of this blue dye."
        },
        {
          title: "Paint and Pigment",
          description: "Artistic color terms",
          question: "What does 'vermilion' (red pigment) originally refer to?",
          options: ["Red clay", "Little worm", "Fire color", "Ruby stone"],
          correct_answer: 1,
          explanation: "Vermilion comes from Latin 'vermiculus' (little worm), referring to the kermes insect used to make red dye.",
          hint: "Think about a small creature used to make red dye."
        }
      ],
      // Set 31: Marine Biology
      [
        {
          title: "Ocean Etymology",
          description: "Sea creature terminology",
          question: "What does 'dolphin' mean in Greek?",
          options: ["Sea friend", "Womb fish", "Smart swimmer", "Wave rider"],
          correct_answer: 1,
          explanation: "Dolphin comes from Greek 'delphys' meaning womb, possibly referring to the dolphin's womb-like shape or live birth.",
          hint: "Think about how dolphins give birth unlike most sea creatures."
        },
        {
          title: "Coral Reefs",
          description: "Marine ecosystem terms",
          question: "The word 'coral' comes from which language?",
          options: ["Latin", "Greek", "Arabic", "Sanskrit"],
          correct_answer: 1,
          explanation: "Coral comes from Greek 'korallion', possibly from Hebrew 'goral' (small pebble).",
          hint: "Think about ancient Mediterranean civilizations."
        },
        {
          title: "Deep Sea",
          description: "Ocean depth terminology",
          question: "What does 'abyss' mean in Greek?",
          options: ["Deep water", "Bottomless", "Dark place", "Far away"],
          correct_answer: 1,
          explanation: "Abyss comes from Greek 'abyssos' meaning bottomless, from 'a' (without) + 'byssos' (bottom).",
          hint: "Think about a place with no bottom."
        }
      ],
      // Set 32: Gems and Minerals
      [
        {
          title: "Diamond Origins",
          description: "Precious stone terminology",
          question: "What does 'diamond' mean in Greek?",
          options: ["Precious stone", "Unbreakable", "Clear crystal", "Hardest material"],
          correct_answer: 1,
          explanation: "Diamond comes from Greek 'adamas' meaning unbreakable or invincible, from 'a' (not) + 'daman' (to tame).",
          hint: "Think about diamond's most famous property."
        },
        {
          title: "Ruby Red",
          description: "Colored gemstone names",
          question: "The word 'ruby' comes from Latin meaning what?",
          options: ["Red stone", "Fire gem", "Blood color", "Red"],
          correct_answer: 3,
          explanation: "Ruby comes from Latin 'rubeus' meaning red, from 'ruber' (red).",
          hint: "Simply think about the ruby's most obvious characteristic."
        },
        {
          title: "Pearl Formation",
          description: "Organic gemstone terms",
          question: "What does 'pearl' originally refer to?",
          options: ["Sea jewel", "Oyster ball", "Leg of mutton", "Round stone"],
          correct_answer: 2,
          explanation: "Pearl comes from Latin 'perna' meaning leg (as in leg of mutton), referring to the shape of the pearl mussel.",
          hint: "Think about a meat cut that resembles the shape of a mussel."
        }
      ],
      // Set 33: Beverages and Drinks
      [
        {
          title: "Tea Time",
          description: "Hot beverage history",
          question: "The word 'tea' in English comes from which Chinese dialect?",
          options: ["Mandarin 'cha'", "Cantonese 'cha'", "Min Nan 'te'", "Wu 'tsaa'"],
          correct_answer: 2,
          explanation: "Tea comes from Min Nan dialect 'te'. Languages using 'cha' got it via land routes, 'tea' via sea trade.",
          hint: "Think about coastal Chinese traders and maritime routes."
        },
        {
          title: "Wine Words",
          description: "Alcoholic beverage terms",
          question: "What does 'champagne' originally refer to?",
          options: ["Sparkling wine", "Noble drink", "Open country", "French region"],
          correct_answer: 2,
          explanation: "Champagne comes from Latin 'campania' meaning open country or plain, the Champagne region of France.",
          hint: "Think about landscape, not the drink itself."
        },
        {
          title: "Cocktail Creation",
          description: "Mixed drink terminology",
          question: "One theory says 'cocktail' comes from what practice?",
          options: ["Rooster tail garnish", "Mixed drinks in inns", "Horse tail docking", "French recipe"],
          correct_answer: 2,
          explanation: "One theory: 'cocktail' referred to mixed-breed horses with docked tails (cocked tails), later meaning 'mixed' drinks.",
          hint: "Think about horses and their tails."
        }
      ],
      // Set 34: Tools and Equipment
      [
        {
          title: "Hammer History",
          description: "Hand tool etymology",
          question: "What does 'hammer' originally mean in Old English?",
          options: ["Stone tool", "Striking tool", "Rock breaker", "Same as now"],
          correct_answer: 3,
          explanation: "Hammer comes from Old English 'hamor', from Proto-Germanic 'hamaraz', meaning exactly what it means now.",
          hint: "Sometimes words don't change much at all."
        },
        {
          title: "Screwdriver Story",
          description: "Modern tool terms",
          question: "The tool 'screwdriver' got its name from what action?",
          options: ["Turning screws", "Driving screws in", "Both meanings", "Screw threading"],
          correct_answer: 1,
          explanation: "Screwdriver means a tool that drives (pushes in) screws, combining 'screw' + 'driver' (one who drives).",
          hint: "Think about what you're doing to the screw - not just turning."
        },
        {
          title: "Wrench Etymology",
          description: "Mechanical tool language",
          question: "What does 'wrench' originally mean?",
          options: ["Grip", "Turn", "Twist", "Pull"],
          correct_answer: 2,
          explanation: "Wrench comes from Old English 'wrencan' meaning to twist, related to 'wrinkle' (something twisted).",
          hint: "Think about the twisting motion you make with a wrench."
        }
      ],
      // Set 35: Emotions and Feelings
      [
        {
          title: "Anxiety Origins",
          description: "Negative emotion terms",
          question: "What does 'anxiety' mean in Latin?",
          options: ["Worry", "Choke", "Fear", "Stress"],
          correct_answer: 1,
          explanation: "Anxiety comes from Latin 'anxietas' from 'angere' meaning to choke or cause distress - that tight feeling.",
          hint: "Think about the physical sensation in your throat when anxious."
        },
        {
          title: "Joy and Happiness",
          description: "Positive emotion words",
          question: "The word 'enthusiasm' originally meant what?",
          options: ["Great joy", "Possessed by a god", "Excited energy", "Passionate feeling"],
          correct_answer: 1,
          explanation: "Enthusiasm comes from Greek 'entheos' meaning possessed by a god, from 'en' (in) + 'theos' (god).",
          hint: "Think about divine inspiration and religious ecstasy."
        },
        {
          title: "Sadness Terms",
          description: "Melancholy vocabulary",
          question: "What does 'melancholy' literally mean in Greek?",
          options: ["Deep sadness", "Black bile", "Heavy heart", "Dark mood"],
          correct_answer: 1,
          explanation: "Melancholy comes from Greek 'melas' (black) + 'khole' (bile) - ancient medicine blamed sadness on black bile.",
          hint: "Think about ancient medical theory and bodily fluids."
        }
      ],
      // Set 36: Natural Disasters
      [
        {
          title: "Earthquake Terms",
          description: "Seismic event vocabulary",
          question: "What does 'tsunami' mean in Japanese?",
          options: ["Big wave", "Harbor wave", "Earthquake wave", "Tidal wave"],
          correct_answer: 1,
          explanation: "Tsunami comes from Japanese 'tsu' (harbor) + 'nami' (wave) - waves that are most destructive in harbors.",
          hint: "Think about where these waves cause the most damage."
        },
        {
          title: "Storm Language",
          description: "Severe weather terms",
          question: "The word 'hurricane' comes from which culture?",
          options: ["Spanish", "Taino/Caribbean", "Portuguese", "African"],
          correct_answer: 1,
          explanation: "Hurricane comes from Spanish 'huracán', from Taino 'hurakan' (god of the storm) of Caribbean origin.",
          hint: "Think about indigenous Caribbean peoples."
        },
        {
          title: "Volcano Vocabulary",
          description: "Volcanic terminology",
          question: "The word 'volcano' honors which Roman god?",
          options: ["Jupiter", "Mars", "Vulcan", "Pluto"],
          correct_answer: 2,
          explanation: "Volcano comes from 'Vulcan' (Vulcanus), Roman god of fire and metalworking, whose forge was under Mount Etna.",
          hint: "Think about the god associated with fire and forges."
        }
      ],
      // Set 37: Mathematics
      [
        {
          title: "Number Names",
          description: "Mathematical terminology",
          question: "What does 'calculus' literally mean in Latin?",
          options: ["Calculation", "Small stone", "Mathematical study", "Complex math"],
          correct_answer: 1,
          explanation: "Calculus comes from Latin 'calculus' meaning small stone or pebble. Romans used stones on abacuses for counting.",
          hint: "Think about ancient counting tools."
        },
        {
          title: "Geometry Origins",
          description: "Spatial mathematics terms",
          question: "What does 'geometry' mean in Greek?",
          options: ["Shape study", "Earth measurement", "Space science", "Angle calculation"],
          correct_answer: 1,
          explanation: "Geometry comes from Greek 'geo' (earth) + 'metron' (measurement) - originally for surveying land.",
          hint: "Think about practical uses for ancient Egyptians measuring fields."
        },
        {
          title: "Algebra History",
          description: "Abstract math language",
          question: "What does 'algebra' mean in Arabic?",
          options: ["Numbers", "Reunion of broken parts", "Equation solving", "Abstract math"],
          correct_answer: 1,
          explanation: "Algebra comes from Arabic 'al-jabr' meaning reunion of broken parts, from the title of a 9th century math book.",
          hint: "Think about putting pieces back together."
        }
      ],
      // Set 38: Medicine and Healing
      [
        {
          title: "Antibiotic Origins",
          description: "Medical treatment terms",
          question: "What does 'antibiotic' literally mean in Greek?",
          options: ["Against bacteria", "Against life", "Kills germs", "Medicine"],
          correct_answer: 1,
          explanation: "Antibiotic comes from Greek 'anti' (against) + 'bios' (life) - ironically meaning against life.",
          hint: "Think about the Greek roots literally, not the modern meaning."
        },
        {
          title: "Surgery Terms",
          description: "Medical procedure vocabulary",
          question: "What does 'surgery' originally mean?",
          options: ["Cutting", "Hand work", "Medical procedure", "Healing art"],
          correct_answer: 1,
          explanation: "Surgery comes from Greek 'kheirourgia' meaning hand work, from 'kheir' (hand) + 'ergon' (work).",
          hint: "Think about what surgeons do with their hands."
        },
        {
          title: "Pharmacy History",
          description: "Medication terminology",
          question: "What does 'pharmacy' come from in Greek?",
          options: ["Medicine", "Healing", "Drug", "Poison or remedy"],
          correct_answer: 3,
          explanation: "Pharmacy comes from Greek 'pharmakon' which meant both poison and remedy - a dangerous duality!",
          hint: "Think about how medicine can heal or harm."
        }
      ],
      // Set 39: Religion and Mythology
      [
        {
          title: "Sacred Words",
          description: "Religious terminology",
          question: "What does 'profane' literally mean in Latin?",
          options: ["Against religion", "Before the temple", "Unholy", "Cursed"],
          correct_answer: 1,
          explanation: "Profane comes from Latin 'pro' (before) + 'fanum' (temple) - literally outside the temple, hence not sacred.",
          hint: "Think about physical location relative to sacred space."
        },
        {
          title: "Mythology Terms",
          description: "Ancient story language",
          question: "What does 'myth' mean in Greek?",
          options: ["False story", "Ancient tale", "Speech or story", "Legend"],
          correct_answer: 2,
          explanation: "Myth comes from Greek 'mythos' simply meaning speech, word, or story - not originally 'false'.",
          hint: "Think about the neutral meaning of storytelling."
        },
        {
          title: "Divine Names",
          description: "Religious title origins",
          question: "What does 'deity' come from in Latin?",
          options: ["Divine being", "God", "Heavenly", "Divine"],
          correct_answer: 3,
          explanation: "Deity comes from Latin 'deus' (god) + '-itas' (quality), meaning divine nature or godhood.",
          hint: "Think about the quality of being god-like."
        }
      ],
      // Set 40: Communication Methods
      [
        {
          title: "Telegraph Technology",
          description: "Distance communication terms",
          question: "What does 'telegraph' mean in Greek?",
          options: ["Electric message", "Far writing", "Wire communication", "Fast message"],
          correct_answer: 1,
          explanation: "Telegraph comes from Greek 'tele' (far) + 'graphein' (to write) - writing from a distance.",
          hint: "Think about the components: distance and writing."
        },
        {
          title: "Telephone Origins",
          description: "Voice communication terms",
          question: "What does 'telephone' literally mean?",
          options: ["Electric voice", "Far sound", "Voice transmission", "Speaking device"],
          correct_answer: 1,
          explanation: "Telephone comes from Greek 'tele' (far) + 'phone' (sound/voice) - sound from a distance.",
          hint: "Similar to telegraph, but with sound instead of writing."
        },
        {
          title: "Radio Waves",
          description: "Broadcast terminology",
          question: "What does 'radio' originally refer to?",
          options: ["Waves", "Ray or beam", "Broadcast", "Wireless"],
          correct_answer: 1,
          explanation: "Radio comes from Latin 'radius' meaning ray or beam, referring to electromagnetic radiation.",
          hint: "Think about the physical phenomenon, not the device."
        }
      ],
      // Set 41: Dance and Movement
      [
        {
          title: "Ballet Terms",
          description: "Classical dance vocabulary",
          question: "What does 'ballet' come from in Italian?",
          options: ["Beautiful dance", "Little dance", "Graceful movement", "Court dance"],
          correct_answer: 1,
          explanation: "Ballet comes from Italian 'balletto', diminutive of 'ballo' (dance) - literally 'little dance'.",
          hint: "Think about the Italian diminutive suffix."
        },
        {
          title: "Waltz History",
          description: "Ballroom dance origins",
          question: "What does 'waltz' mean in German?",
          options: ["Spin", "Roll or turn", "Glide", "Three steps"],
          correct_answer: 1,
          explanation: "Waltz comes from German 'walzen' meaning to roll, turn, or revolve - describing the rotating movement.",
          hint: "Think about the characteristic spinning motion."
        },
        {
          title: "Choreography Language",
          description: "Dance composition terms",
          question: "What does 'choreography' mean in Greek?",
          options: ["Dance creation", "Dance writing", "Movement art", "Stage dancing"],
          correct_answer: 1,
          explanation: "Choreography comes from Greek 'khoreia' (dance) + 'graphein' (to write) - literally writing down dances.",
          hint: "Think about notation and recording movements."
        }
      ],
      // Set 42: Weapons and Warfare
      [
        {
          title: "Sword Names",
          description: "Blade terminology",
          question: "What does 'gladiator' literally mean in Latin?",
          options: ["Fighter", "Swordsman", "Arena warrior", "Slave fighter"],
          correct_answer: 1,
          explanation: "Gladiator comes from Latin 'gladius' (sword) + '-ator' (one who) - literally 'swordsman'.",
          hint: "Think about the weapon, not the arena."
        },
        {
          title: "Arrow Etymology",
          description: "Projectile weapon terms",
          question: "The word 'toxic' originally referred to what?",
          options: ["Poison", "Deadly substance", "Arrow poison", "Snake venom"],
          correct_answer: 2,
          explanation: "Toxic comes from Greek 'toxikon' meaning arrow poison, from 'toxon' (bow). Poison for arrows!",
          hint: "Think about what ancient warriors put on their arrows."
        },
        {
          title: "Shield History",
          description: "Defensive weapon vocabulary",
          question: "What does 'aegis' (protective shield) come from?",
          options: ["Zeus's shield", "Goatskin", "Bronze shield", "Athena's armor"],
          correct_answer: 1,
          explanation: "Aegis comes from Greek 'aigis', possibly from 'aix' (goat) - Zeus's shield was made of goatskin.",
          hint: "Think about what material the mythical shield was made from."
        }
      ],
      // Set 43: Economics and Trade
      [
        {
          title: "Money Terms",
          description: "Currency vocabulary",
          question: "Where did the word 'money' come from?",
          options: ["Latin moneta", "Greek nomisma", "Roman mint", "Juno's temple"],
          correct_answer: 3,
          explanation: "Money comes from Latin 'moneta', a title of Juno whose temple housed the Roman mint. 'Moneta' means warner.",
          hint: "Think about where Romans made their coins."
        },
        {
          title: "Market Origins",
          description: "Commerce terminology",
          question: "What does 'bazaar' originally mean in Persian?",
          options: ["Marketplace", "Trading post", "Market", "Public square"],
          correct_answer: 2,
          explanation: "Bazaar comes from Persian 'bāzār' meaning market, from Old Persian meaning 'the place of prices'.",
          hint: "It's the same concept across languages - a place to trade."
        },
        {
          title: "Trade Routes",
          description: "Commercial exchange terms",
          question: "What does 'tariff' originally mean in Arabic?",
          options: ["Tax", "Price list", "Notification", "Import fee"],
          correct_answer: 2,
          explanation: "Tariff comes from Arabic 'ta'rif' meaning notification or definition - originally a list of prices, not taxes.",
          hint: "Think about information and notification, not fees."
        }
      ],
      // Set 44: Astronomy and Space
      [
        {
          title: "Planet Names",
          description: "Celestial body terminology",
          question: "What does 'planet' mean in Greek?",
          options: ["Heavenly body", "Wanderer", "Orbiting object", "Star follower"],
          correct_answer: 1,
          explanation: "Planet comes from Greek 'planetes' meaning wanderer - planets 'wander' across the sky unlike fixed stars.",
          hint: "Think about how planets move differently than stars."
        },
        {
          title: "Cosmic Terms",
          description: "Universe vocabulary",
          question: "What does 'cosmos' mean in Greek?",
          options: ["Universe", "Stars", "Order or harmony", "Everything"],
          correct_answer: 2,
          explanation: "Cosmos comes from Greek 'kosmos' meaning order, harmony, or arrangement - the ordered universe.",
          hint: "Think about organization and beauty, not just space."
        },
        {
          title: "Lunar Language",
          description: "Moon terminology",
          question: "The word 'lunatic' originally connected insanity to what?",
          options: ["Full moon", "Moon phases", "Lunar cycles", "All of these"],
          correct_answer: 3,
          explanation: "Lunatic comes from Latin 'luna' (moon). People believed the moon caused madness, especially during certain phases.",
          hint: "Think about old beliefs about the moon's effects."
        }
      ],
      // Set 45: Philosophy and Thought
      [
        {
          title: "Logical Terms",
          description: "Reasoning vocabulary",
          question: "What does 'logic' come from in Greek?",
          options: ["Thinking", "Reason", "Word or reason", "Truth"],
          correct_answer: 2,
          explanation: "Logic comes from Greek 'logike' from 'logos' meaning word, reason, or principle - the study of reasoning.",
          hint: "Think about the root that appears in many academic words."
        },
        {
          title: "Ethics Origins",
          description: "Moral philosophy terms",
          question: "What does 'ethics' mean in Greek?",
          options: ["Right behavior", "Character or custom", "Morality", "Good actions"],
          correct_answer: 1,
          explanation: "Ethics comes from Greek 'ethikos' meaning character or custom, from 'ethos' (character, custom).",
          hint: "Think about inherent nature and habitual behavior."
        },
        {
          title: "Skeptic Language",
          description: "Philosophical doubt terms",
          question: "What does 'skeptic' literally mean in Greek?",
          options: ["Doubter", "Observer", "Questioner", "Critic"],
          correct_answer: 1,
          explanation: "Skeptic comes from Greek 'skeptikos' meaning thoughtful or inquiring, from 'skeptesthai' (to look, examine).",
          hint: "Think about careful observation and examination."
        }
      ],
      // Set 46: Agriculture and Farming
      [
        {
          title: "Harvest Words",
          description: "Crop gathering terms",
          question: "What does 'harvest' originally mean in Old English?",
          options: ["Crop gathering", "Autumn season", "Reaping time", "Autumn"],
          correct_answer: 3,
          explanation: "Harvest comes from Old English 'hærfest' simply meaning autumn - the season, not the activity.",
          hint: "Think about the time of year, not the action."
        },
        {
          title: "Plow History",
          description: "Farming tool terminology",
          question: "The word 'cultivate' comes from Latin meaning what?",
          options: ["To farm", "To plow", "To care for", "To till"],
          correct_answer: 3,
          explanation: "Cultivate comes from Latin 'colere' meaning to till, inhabit, or care for, related to 'cultus' (tilled).",
          hint: "Think about working the soil before planting."
        },
        {
          title: "Seed Language",
          description: "Plant propagation terms",
          question: "What does 'germinate' come from in Latin?",
          options: ["Seed", "Sprout", "Bud or sprout", "Grow"],
          correct_answer: 2,
          explanation: "Germinate comes from Latin 'germinare' meaning to sprout, from 'germen' (sprout, bud).",
          hint: "Think about the first stage of plant growth."
        }
      ],
      // Set 47: Theater and Performance
      [
        {
          title: "Drama Origins",
          description: "Theatrical terminology",
          question: "What does 'theater' mean in Greek?",
          options: ["Stage", "Play house", "Place for viewing", "Performance space"],
          correct_answer: 2,
          explanation: "Theater comes from Greek 'theatron' meaning place for viewing, from 'theasthai' (to behold).",
          hint: "Think about what the audience does."
        },
        {
          title: "Tragedy Terms",
          description: "Dramatic genre language",
          question: "What does 'tragedy' literally mean in Greek?",
          options: ["Sad story", "Goat song", "Fatal drama", "Death tale"],
          correct_answer: 1,
          explanation: "Tragedy comes from Greek 'tragoidia' from 'tragos' (goat) + 'oide' (song) - possibly goat sacrifices at festivals.",
          hint: "Think about an unexpected animal connection."
        },
        {
          title: "Comedy Etymology",
          description: "Humorous performance terms",
          question: "What does 'comedy' come from in Greek?",
          options: ["Funny play", "Revel song", "Happy ending", "Laughter show"],
          correct_answer: 1,
          explanation: "Comedy comes from Greek 'komoidia' from 'komos' (revel) + 'oide' (song) - songs at festive processions.",
          hint: "Think about celebrations and parties."
        }
      ],
      // Set 48: Navigation and Exploration
      [
        {
          title: "Compass Terms",
          description: "Direction-finding vocabulary",
          question: "What does 'compass' originally mean?",
          options: ["Circle", "Step together", "Direction finder", "Measurement tool"],
          correct_answer: 1,
          explanation: "Compass comes from Latin 'compassare' meaning to pace out, from 'com' (together) + 'passus' (step).",
          hint: "Think about measuring by walking."
        },
        {
          title: "Map Language",
          description: "Cartography terminology",
          question: "What does 'atlas' (map book) refer to?",
          options: ["Titan holding world", "Greek giant", "Map maker", "North Africa"],
          correct_answer: 0,
          explanation: "Atlas comes from the Greek Titan Atlas who held up the sky. Early map books showed him holding a globe.",
          hint: "Think about Greek mythology and someone holding something."
        },
        {
          title: "Voyage Vocabulary",
          description: "Travel and journey terms",
          question: "What does 'navigate' mean in Latin?",
          options: ["To steer", "To ship-drive", "To travel", "To explore"],
          correct_answer: 1,
          explanation: "Navigate comes from Latin 'navigare' from 'navis' (ship) + 'agere' (to drive) - literally to drive a ship.",
          hint: "Think about the components: vessel and driving."
        }
      ],
      // Set 49: Textiles and Weaving
      [
        {
          title: "Fabric Origins",
          description: "Cloth material terminology",
          question: "What does 'textile' mean in Latin?",
          options: ["Fabric", "Woven", "Cloth", "Weaving"],
          correct_answer: 1,
          explanation: "Textile comes from Latin 'textilis' meaning woven, from 'texere' (to weave), related to 'text' (woven words).",
          hint: "Think about the basic technique of making cloth."
        },
        {
          title: "Linen History",
          description: "Natural fiber terms",
          question: "The word 'linen' comes from which plant?",
          options: ["Cotton", "Hemp", "Flax", "Jute"],
          correct_answer: 2,
          explanation: "Linen comes from Latin 'linum' (flax), the plant from which linen fiber is made.",
          hint: "Think about the specific plant, not the fabric."
        },
        {
          title: "Spinning Stories",
          description: "Thread-making vocabulary",
          question: "What does 'spinster' originally mean?",
          options: ["Unmarried woman", "Woman who spins", "Old maid", "Wool worker"],
          correct_answer: 1,
          explanation: "Spinster originally meant a woman who spins thread - a common occupation. Later it meant unmarried woman.",
          hint: "Think about the literal occupation, not the modern meaning."
        }
      ],
      // Set 50: Education and Learning
      [
        {
          title: "School Origins",
          description: "Educational institution terms",
          question: "What did 'school' mean in ancient Greek?",
          options: ["Learning place", "Leisure time", "Study hall", "Teacher's house"],
          correct_answer: 1,
          explanation: "School comes from Greek 'skhole' meaning leisure time - education was for those with free time!",
          hint: "Think about who had time for education in ancient times."
        },
        {
          title: "Pedagogy Terms",
          description: "Teaching vocabulary",
          question: "What does 'pedagogue' literally mean in Greek?",
          options: ["Teacher", "Child leader", "School master", "Instructor"],
          correct_answer: 1,
          explanation: "Pedagogue comes from Greek 'paidagogos' from 'pais' (child) + 'agogos' (leader) - originally a slave who led children to school.",
          hint: "Think about leading children somewhere."
        },
        {
          title: "Academic Language",
          description: "Scholarly terminology",
          question: "The word 'academy' honors what?",
          options: ["Greek school", "Plato's grove", "Scholar's hall", "Learning center"],
          correct_answer: 1,
          explanation: "Academy comes from Akademeia, the grove where Plato taught, named after the hero Akademos.",
          hint: "Think about where a famous philosopher taught."
        }
      ]
    ];

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const challenges = [];

    // Get all recent challenges to avoid duplicates (last 60 days for safety)
    const recentDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: allRecentChallenges } = await supabase
      .from('challenges')
      .select('title, question, date_assigned')
      .gte('date_assigned', recentDate);

    console.log(`Found ${allRecentChallenges?.length || 0} recent challenges since ${recentDate}`);
    
    const recentTitlesSet = new Set(allRecentChallenges?.map(c => c.title?.trim().toLowerCase()) || []);
    const recentQuestionsSet = new Set(allRecentChallenges?.map(c => c.question?.trim().toLowerCase()) || []);

    console.log(`Recent titles: ${Array.from(recentTitlesSet).slice(0, 5).join(', ')}...`);

    // Find a fallback set with no recent conflicts using proper rotation
    let chosenSetIndex = -1;
    const todayNumber = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24));
    
    // Try sets in deterministic but rotating order
    for (let attempt = 0; attempt < extendedFallbackChallenges.length; attempt++) {
      const testIndex = (todayNumber + attempt) % extendedFallbackChallenges.length;
      const testSet = extendedFallbackChallenges[testIndex];
      
      console.log(`Testing set ${testIndex}: [${testSet.map(c => c.title).join(', ')}]`);
      
      const hasConflict = testSet.some(challenge => {
        const titleMatch = recentTitlesSet.has(challenge.title?.trim().toLowerCase());
        const questionMatch = recentQuestionsSet.has(challenge.question?.trim().toLowerCase());
        
        if (titleMatch || questionMatch) {
          console.log(`Conflict found in set ${testIndex}: title="${challenge.title}" (title match: ${titleMatch}, question match: ${questionMatch})`);
          return true;
        }
        return false;
      });
      
      if (!hasConflict) {
        chosenSetIndex = testIndex;
        console.log(`✅ Selected fallback set ${testIndex} with NO conflicts (rotation attempt ${attempt})`);
        break;
      } else {
        console.log(`❌ Set ${testIndex} has conflicts, trying next...`);
      }
    }

    // If all sets have conflicts, find the one used longest ago
    if (chosenSetIndex === -1) {
      console.log(`⚠️ All sets have conflicts, finding least recently used`);
      const setLastUsed = new Map();
      
      for (let i = 0; i < extendedFallbackChallenges.length; i++) {
        const setTitles = new Set(extendedFallbackChallenges[i].map(c => c.title?.trim().toLowerCase()));
        const recentUsage = allRecentChallenges?.filter(c => setTitles.has(c.title?.trim().toLowerCase())) || [];
        
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
      
      console.log(`Selected set ${chosenSetIndex} as least recently used (last used: ${new Date(setLastUsed.get(chosenSetIndex)).toISOString().split('T')[0]})`);
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