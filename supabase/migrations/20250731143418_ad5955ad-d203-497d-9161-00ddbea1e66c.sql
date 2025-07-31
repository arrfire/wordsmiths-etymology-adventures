-- Clear any existing challenges and add basic achievements
DELETE FROM challenges WHERE date_assigned < CURRENT_DATE;

-- Insert achievements (using INSERT for now)
DELETE FROM achievements;
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value) VALUES
  ('First Steps', 'Complete your first daily challenge', '🎯', 'challenges_completed', 1),
  ('Dedicated Learner', 'Complete 5 daily challenges', '📚', 'challenges_completed', 5),
  ('Word Master', 'Complete 10 daily challenges', '🏆', 'challenges_completed', 10),
  ('Streak Starter', 'Maintain a 3-day streak', '🔥', 'streak_days', 3),
  ('Streak Keeper', 'Maintain a 7-day streak', '⚡', 'streak_days', 7),
  ('Point Collector', 'Earn 100 total points', '💎', 'total_points', 100);