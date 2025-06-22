
-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of answer options
  correct_answer INTEGER NOT NULL, -- Index of correct option
  explanation TEXT NOT NULL,
  hint TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  points INTEGER NOT NULL DEFAULT 10,
  challenge_type TEXT NOT NULL,
  date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_challenge_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user challenge attempts table
CREATE TABLE public.user_challenge_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'streak', 'points', 'challenges_completed', 'perfect_week'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenges (public read access)
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_challenge_attempts
CREATE POLICY "Users can view their own attempts" ON public.user_challenge_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own attempts" ON public.user_challenge_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (public read access)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first challenge', 'Target', 'challenges_completed', 1),
('Week Warrior', '7-day streak', 'Flame', 'streak', 7),
('Etymology Explorer', 'Complete 25 challenges', 'Award', 'challenges_completed', 25),
('Word Wizard', 'Score 1000+ points', 'Star', 'points', 1000),
('Perfect Week', '7 perfect scores in a row', 'Crown', 'perfect_week', 7),
('Lightning Round', 'Complete challenge in under 30 seconds', 'Zap', 'speed', 30);

-- Insert sample daily challenges
INSERT INTO public.challenges (title, description, question, options, correct_answer, explanation, hint, difficulty, points, challenge_type, date_assigned) VALUES
('Etymology Detective', 'Trace the word salary back to its ancient origins', 'The word "salary" comes from the Latin "salarium". What was salarium originally used for?', 
'["Payment for soldiers'' salt rations", "A type of ancient currency", "Temple offerings", "Marriage dowries"]', 
0, 'Salarium comes from "sal" (salt) and was the allowance given to Roman soldiers to buy salt, a precious commodity used for food preservation.', 
'Think about a white crystalline substance essential for food preservation...', 'Medium', 25, 'etymology_trace', CURRENT_DATE),

('Word Time Machine', 'Watch how nice evolved through centuries', 'The word "nice" originally meant something very different. What was its first meaning in Middle English?', 
'["Pleasant and agreeable", "Foolish or ignorant", "Expensive and valuable", "Quick and fast"]', 
1, 'Originally from Latin "nescius" (ignorant), "nice" first meant "foolish" in the 1300s, then evolved through "precise" and "delicate" to mean "pleasant" by the 1700s.', 
'The Latin root "nescius" relates to not knowing something...', 'Hard', 35, 'word_evolution', CURRENT_DATE),

('Language Family Reunion', 'Connect related words across languages', 'Which of these words is NOT related to the English word "mother"?', 
'["German: Mutter", "Spanish: Madre", "Russian: Mat''", "Chinese: Mā"]', 
3, 'While Chinese "mā" sounds similar, it''s not from the same Indo-European root as the others. The resemblance is coincidental!', 
'Think about language families - which one doesn''t belong to the Indo-European group?', 'Easy', 15, 'cognate_connection', CURRENT_DATE),

('Prefix Power', 'Master the art of word building', 'The prefix "circum-" means "around". Which word means "to go around an obstacle"?', 
'["Circumvent", "Circumscribe", "Circumnavigate", "Circumstance"]', 
0, '"Circumvent" combines "circum" (around) + "venire" (to come/go), literally meaning "to come around" or bypass.', 
'Think about which action involves going around to avoid something...', 'Medium', 20, 'prefix_puzzle', CURRENT_DATE),

('Mythological Origins', 'Discover words born from ancient stories', 'The word "narcissistic" comes from Greek mythology. Who was Narcissus?', 
'["A god of wine and celebration", "A youth who fell in love with his reflection", "A monster with snakes for hair", "A hero who fought the Minotaur"]', 
1, 'Narcissus was a beautiful youth who fell in love with his own reflection in a pool and wasted away, giving us words related to self-obsession.', 
'Think about someone who loves looking at themselves...', 'Hard', 30, 'mythology_words', CURRENT_DATE);
