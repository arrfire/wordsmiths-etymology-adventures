-- Delete today's duplicate challenges
DELETE FROM challenges WHERE date_assigned = CURRENT_DATE;

-- Insert completely new and unique challenges for August 6, 2025
INSERT INTO challenges (title, description, question, options, correct_answer, explanation, hint, difficulty, points, challenge_type, date_assigned) VALUES
(
  'The Mysterious "Sabotage"',
  'From wooden shoes to industrial disruption',
  'The word "sabotage" supposedly comes from:',
  '["French sabot (wooden shoes) thrown into machinery", "Italian sabotaggio meaning deliberate damage", "Spanish sabotear meaning to hinder", "German sabotage meaning workplace rebellion"]'::jsonb,
  0,
  'Sabotage comes from French "sabot" (wooden shoe). Legend says French workers threw their wooden shoes into machinery to stop production, though historians debate this origin. The word entered English around 1910 during industrial conflicts.',
  'Think about what French workers might throw into machines to stop them.',
  'Easy',
  10,
  'multiple_choice',
  CURRENT_DATE
),
(
  'The Scholarly "Trivia"',
  'From Roman crossroads to modern knowledge games',
  'The word "trivia" originally referred to:',
  '["Three-way road intersections in Rome", "Minor academic subjects", "Unimportant daily conversations", "Simple arithmetic with three numbers"]'::jsonb,
  0,
  'Trivia comes from Latin "trivium" meaning a place where three roads meet. In medieval education, the trivium was the foundation curriculum (grammar, logic, rhetoric), considered basic knowledge - hence "trivial" meant commonplace.',
  'Romans would meet and chat where three roads crossed.',
  'Medium',
  20,
  'multiple_choice',
  CURRENT_DATE
),
(
  'The Noble "Sinister"',
  'From left-handed omens to evil intentions',
  'The word "sinister" originally meant:',
  '["Left-handed or on the left side", "Evil or wicked by nature", "Hidden or secretive", "Dark or shadowy"]'::jsonb,
  0,
  'Sinister comes from Latin "sinister" meaning "left" or "on the left side." In Roman augury, omens appearing on the left were considered unlucky, while those on the right were favorable. This association gave "sinister" its modern meaning of evil.',
  'Romans considered one direction unlucky for bird omens.',
  'Hard',
  30,
  'multiple_choice',
  CURRENT_DATE
);