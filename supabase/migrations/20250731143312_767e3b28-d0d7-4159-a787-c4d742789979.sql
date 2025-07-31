-- First, let's ensure we have some basic achievements in the database
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value) VALUES
  ('First Steps', 'Complete your first daily challenge', '🎯', 'challenges_completed', 1),
  ('Dedicated Learner', 'Complete 5 daily challenges', '📚', 'challenges_completed', 5),
  ('Word Master', 'Complete 10 daily challenges', '🏆', 'challenges_completed', 10),
  ('Streak Starter', 'Maintain a 3-day streak', '🔥', 'streak_days', 3),
  ('Streak Keeper', 'Maintain a 7-day streak', '⚡', 'streak_days', 7),
  ('Point Collector', 'Earn 100 total points', '💎', 'total_points', 100)
ON CONFLICT (title) DO NOTHING;