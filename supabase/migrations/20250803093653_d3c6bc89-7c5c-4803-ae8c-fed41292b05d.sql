-- Delete today's challenges again
DELETE FROM challenges WHERE date_assigned = CURRENT_DATE;

-- Insert completely new diverse challenges for today
INSERT INTO challenges (title, description, question, options, correct_answer, explanation, hint, difficulty, points, challenge_type, date_assigned) VALUES
(
  'The Mystery of "Bamboozle"',
  'A word that sounds as silly as its meaning',
  'The word "bamboozle" likely originated from:',
  '["Scottish dialect meaning to confuse", "Dutch bamboezelen meaning to puzzle", "Native American term for trickery", "Old English meaning to fool"]'::jsonb,
  0,
  'Bamboozle likely comes from Scottish dialect, first recorded in English around 1700. It may be related to "bam" (meaning to trick) plus a suffix, creating this wonderfully onomatopoetic word.',
  'This playful word matches the regions known for colorful expressions.',
  'Easy',
  10,
  'multiple_choice',
  CURRENT_DATE
),
(
  'The Digital "Avatar"',
  'From Hindu mythology to virtual worlds',
  'The word "avatar" in computing comes from:',
  '["Sanskrit avatara meaning divine incarnation", "Greek avataron meaning virtual form", "Latin avatarus meaning transformation", "Arabic awatar meaning representation"]'::jsonb,
  0,
  'Avatar comes from Sanskrit "avatāra" meaning the incarnation of a deity on earth. It was first used for digital representations in the 1980s, perfectly capturing the idea of a divine being taking earthly form.',
  'Think about Hindu gods taking physical form in our world.',
  'Medium',
  20,
  'multiple_choice',
  CURRENT_DATE
),
(
  'The Enigmatic "Weird"',
  'From ancient fate to modern strangeness',
  'The word "weird" originally meant:',
  '["Supernatural or magical", "Fate or destiny", "Strange or unusual", "Mysterious or hidden"]'::jsonb,
  1,
  'Weird comes from Old English "wyrd" meaning fate or destiny. The "weird sisters" in Macbeth were the Fates who controlled destiny, not strange women. The modern meaning of "strange" only developed in the 19th century.',
  'Shakespeare knew the original meaning when he wrote about three sisters.',
  'Hard',
  30,
  'multiple_choice',
  CURRENT_DATE
);