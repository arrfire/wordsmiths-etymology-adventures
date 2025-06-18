import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Flame, 
  Award, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  Users,
  Crown,
  Zap
} from 'lucide-react';

const DailyChallengesSystem = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [streakCount, setStreakCount] = useState(7);
  const [totalPoints, setTotalPoints] = useState(1240);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(14 * 3600 + 32 * 60 + 45); // 14h 32m 45s
  
  // Sample daily challenges data
  const dailyChallenges = [
    {
      id: 1,
      type: "etymology_trace",
      title: "Etymology Detective",
      description: "Trace the word 'salary' back to its ancient origins",
      difficulty: "Medium",
      points: 25,
      question: "The word 'salary' comes from the Latin 'salarium'. What was salarium originally used for?",
      options: [
        "Payment for soldiers' salt rations",
        "A type of ancient currency",
        "Temple offerings",
        "Marriage dowries"
      ],
      correct: 0,
      explanation: "Salarium comes from 'sal' (salt) and was the allowance given to Roman soldiers to buy salt, a precious commodity used for food preservation.",
      hint: "Think about a white crystalline substance essential for food preservation..."
    },
    {
      id: 2,
      type: "word_evolution",
      title: "Word Time Machine",
      description: "Watch how 'nice' evolved through centuries",
      difficulty: "Hard",
      points: 35,
      question: "The word 'nice' originally meant something very different. What was its first meaning in Middle English?",
      options: [
        "Pleasant and agreeable",
        "Foolish or ignorant",
        "Expensive and valuable",
        "Quick and fast"
      ],
      correct: 1,
      explanation: "Originally from Latin 'nescius' (ignorant), 'nice' first meant 'foolish' in the 1300s, then evolved through 'precise' and 'delicate' to mean 'pleasant' by the 1700s.",
      hint: "The Latin root 'nescius' relates to not knowing something..."
    },
    {
      id: 3,
      type: "cognate_connection",
      title: "Language Family Reunion",
      description: "Connect related words across languages",
      difficulty: "Easy",
      points: 15,
      question: "Which of these words is NOT related to the English word 'mother'?",
      options: [
        "German: Mutter",
        "Spanish: Madre",
        "Russian: Mat'",
        "Chinese: Mā"
      ],
      correct: 3,
      explanation: "While Chinese 'mā' sounds similar, it's not from the same Indo-European root as the others. The resemblance is coincidental!",
      hint: "Think about language families - which one doesn't belong to the Indo-European group?"
    },
    {
      id: 4,
      type: "prefix_puzzle",
      title: "Prefix Power",
      description: "Master the art of word building",
      difficulty: "Medium",
      points: 20,
      question: "The prefix 'circum-' means 'around'. Which word means 'to go around an obstacle'?",
      options: [
        "Circumvent",
        "Circumscribe",
        "Circumnavigate",
        "Circumstance"
      ],
      correct: 0,
      explanation: "'Circumvent' combines 'circum' (around) + 'venire' (to come/go), literally meaning 'to come around' or bypass.",
      hint: "Think about which action involves going around to avoid something..."
    },
    {
      id: 5,
      type: "mythology_words",
      title: "Mythological Origins",
      description: "Discover words born from ancient stories",
      difficulty: "Hard",
      points: 30,
      question: "The word 'narcissistic' comes from Greek mythology. Who was Narcissus?",
      options: [
        "A god of wine and celebration",
        "A youth who fell in love with his reflection",
        "A monster with snakes for hair",
        "A hero who fought the Minotaur"
      ],
      correct: 1,
      explanation: "Narcissus was a beautiful youth who fell in love with his own reflection in a pool and wasted away, giving us words related to self-obsession.",
      hint: "Think about someone who loves looking at themselves..."
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first challenge", icon: <Target className="h-5 w-5" />, unlocked: true },
    { id: 2, title: "Week Warrior", description: "7-day streak", icon: <Flame className="h-5 w-5" />, unlocked: true },
    { id: 3, title: "Etymology Explorer", description: "Complete 25 challenges", icon: <Award className="h-5 w-5" />, unlocked: true },
    { id: 4, title: "Word Wizard", description: "Score 1000+ points", icon: <Star className="h-5 w-5" />, unlocked: true },
    { id: 5, title: "Perfect Week", description: "7 perfect scores in a row", icon: <Crown className="h-5 w-5" />, unlocked: false },
    { id: 6, title: "Lightning Round", description: "Complete challenge in under 30 seconds", icon: <Zap className="h-5 w-5" />, unlocked: false }
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleAnswer = (challengeId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [challengeId]: answerIndex
    }));
  };

  const submitChallenge = () => {
    const challenge = dailyChallenges[currentChallenge];
    const userAnswer = userAnswers[challenge.id];
    const isCorrect = userAnswer === challenge.correct;
    
    if (isCorrect && !completedChallenges.includes(challenge.id)) {
      setTotalPoints(prev => prev + challenge.points);
      setCompletedChallenges(prev => [...prev, challenge.id]);
    }
  };

  const getCurrentChallenge = () => dailyChallenges[currentChallenge];
  const challenge = getCurrentChallenge();
  const userAnswer = userAnswers[challenge?.id];
  const isAnswered = userAnswer !== undefined;
  const isCorrect = userAnswer === challenge?.correct;
  const isCompleted = completedChallenges.includes(challenge?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{streakCount}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{completedChallenges.length}</div>
                <div className="text-sm opacity-90">Completed Today</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8" />
              <div>
                <div className="text-lg font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-sm opacity-90">Until Reset</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Challenge Area */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className={`${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700">
                      +{challenge.points} points
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
                  <p className="text-gray-600">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Challenge {currentChallenge + 1} of {dailyChallenges.length}</div>
                  {isCompleted && <CheckCircle className="h-6 w-6 text-green-500 mt-2" />}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{challenge.question}</h3>
                
                <div className="space-y-3">
                  {challenge.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !isAnswered && handleAnswer(challenge.id, index)}
                      disabled={isAnswered}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                        isAnswered
                          ? index === challenge.correct
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : index === userAnswer
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : userAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          isAnswered && index === challenge.correct
                            ? 'border-green-500 bg-green-500 text-white'
                            : isAnswered && index === userAnswer && index !== challenge.correct
                            ? 'border-red-500 bg-red-500 text-white'
                            : userAnswer === index
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {isAnswered && index === challenge.correct && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                        {isAnswered && index === userAnswer && index !== challenge.correct && <XCircle className="h-5 w-5 text-red-500 ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!isAnswered && (
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    onClick={() => {
                      // Show hint
                      alert(challenge.hint);
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Hint
                  </Button>
                  <Button
                    onClick={submitChallenge}
                    disabled={userAnswer === undefined}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}

              {isAnswered && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Etymology Explanation
                  </h4>
                  <p className="text-gray-700">{challenge.explanation}</p>
                  {isCorrect && !isCompleted && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      🎉 Correct! You earned {challenge.points} points!
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  onClick={() => setCurrentChallenge(Math.max(0, currentChallenge - 1))}
                  disabled={currentChallenge === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentChallenge(Math.min(dailyChallenges.length - 1, currentChallenge + 1))}
                  disabled={currentChallenge === dailyChallenges.length - 1}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Next Challenge
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Challenge Progress */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Today's Progress
              </h3>
              <div className="space-y-3">
                {dailyChallenges.map((ch, index) => (
                  <div
                    key={ch.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                      currentChallenge === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentChallenge(index)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      completedChallenges.includes(ch.id)
                        ? 'bg-green-500 text-white'
                        : currentChallenge === index
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {completedChallenges.includes(ch.id) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{ch.title}</div>
                      <div className="text-xs text-gray-500">{ch.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.unlocked 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : 'bg-gray-50 border border-gray-200 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      achievement.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Daily Leaderboard
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <Crown className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm">EtymologyMaster</span>
                  <span className="text-xs text-gray-500 ml-auto">125 pts</span>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-bold">2</div>
                  <span className="text-sm">WordWizard</span>
                  <span className="text-xs text-gray-500 ml-auto">95 pts</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">3</div>
                  <span className="text-sm font-medium">You</span>
                  <span className="text-xs text-gray-500 ml-auto">{completedChallenges.reduce((sum, id) => sum + (dailyChallenges.find(c => c.id === id)?.points || 0), 0)} pts</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengesSystem;