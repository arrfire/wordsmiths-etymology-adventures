import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Trophy, Clock, Star, Flame, Award, CheckCircle, XCircle, Lightbulb, Users, Crown, Zap, LogOut, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChallenges } from '@/hooks/useChallenges';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const DailyChallengesPage = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generating, setGenerating] = useState(false);
  
  const { user, signOut } = useAuth();
  const { 
    challenges, 
    userProfile, 
    userAttempts, 
    achievements, 
    userAchievements, 
    isLoading, 
    submitAnswer, 
    submitting 
  } = useChallenges(selectedDate);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Calculate time remaining until next day
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const remaining = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleAnswer = (challengeId: string, answerIndex: number) => {
    const userAttempt = userAttempts.find(attempt => attempt.challenge_id === challengeId);
    if (userAttempt) return; // Already answered
    
    setSelectedAnswers(prev => ({ ...prev, [challengeId]: answerIndex }));
  };

  const handleSubmit = () => {
    const challenge = challenges[currentChallenge];
    const selectedAnswer = selectedAnswers[challenge.id];
    
    if (selectedAnswer === undefined) {
      toast.error('Please select an answer first');
      return;
    }

    submitAnswer({ challengeId: challenge.id, selectedAnswer });
  };

  const showHint = (hint: string) => {
    toast.info(hint, { duration: 5000 });
  };

  const changeDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    // Don't allow future dates
    const today = new Date().toISOString().split('T')[0];
    const newDateString = newDate.toISOString().split('T')[0];
    
    if (direction === 'next' && newDateString > today) {
      toast.error('Cannot view future challenges');
      return;
    }
    
    setSelectedDate(newDateString);
    setCurrentChallenge(0);
    setSelectedAnswers({});
  };

  const generateChallenges = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-challenges', {
        body: {}
      });
      
      if (error) {
        console.error('Error:', error);
        toast.error('Failed to generate challenges: ' + error.message);
      } else {
        console.log('Success:', data);
        toast.success('Daily challenges generated successfully!');
        // Refresh the page to show new challenges
        window.location.reload();
      }
    } catch (err) {
      console.error('Error invoking function:', err);
      toast.error('Failed to generate challenges');
    } finally {
      setGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your challenges...</p>
        </div>
      </div>
    );
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // No challenges available
  if (!challenges || challenges.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Challenges Available</h2>
          <p className="text-slate-600 mb-6">No challenges found for {formattedDate}</p>
          {isToday && (
            <Button 
              onClick={generateChallenges}
              disabled={generating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4"
            >
              {generating ? 'Generating...' : 'Generate Today\'s Challenges'}
            </Button>
          )}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => changeDate('prev')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Day
            </Button>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => changeDate('next')}
              disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            >
              Next Day
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const challenge = challenges[currentChallenge];
  const userAttempt = userAttempts.find(attempt => attempt.challenge_id === challenge.id);
  const selectedAnswer = selectedAnswers[challenge.id];
  const isAnswered = !!userAttempt;
  const isCorrect = userAttempt?.is_correct || false;

  const completedChallenges = userAttempts.filter(attempt => attempt.is_correct);
  const todayPoints = userAttempts.reduce((sum, attempt) => sum + attempt.points_earned, 0);

  const unlockedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];
  const achievementsWithStatus = achievements.map(achievement => ({
    ...achievement,
    unlocked: unlockedAchievementIds.includes(achievement.id)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Daily Etymology Challenges</h1>
                <p className="text-slate-600">Welcome back, {userProfile?.username || user?.email}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/community">
                  Join Community
                </Link>
              </Button>
              <Button 
                variant="ghost"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => changeDate('prev')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <Calendar className="h-4 w-4 text-slate-600" />
              <span className="font-medium text-slate-800">
                {formattedDate}
                {isToday && <Badge className="ml-2 bg-green-100 text-green-800">Today</Badge>}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => changeDate('next')}
              disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            {isToday && (
              <Button 
                size="sm"
                onClick={generateChallenges}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Refresh Today’s Set
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{userProfile?.current_streak || 0}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{userProfile?.total_points?.toLocaleString() || 0}</div>
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
                  <div className="text-sm text-gray-500">Challenge {currentChallenge + 1} of {challenges.length}</div>
                  {isAnswered && <CheckCircle className="h-6 w-6 text-green-500 mt-2" />}
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
                          ? index === challenge.correct_answer
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : index === userAttempt?.selected_answer
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-gray-50 text-gray-500'
                          : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          isAnswered && index === challenge.correct_answer
                            ? 'border-green-500 bg-green-500 text-white'
                            : isAnswered && index === userAttempt?.selected_answer && index !== challenge.correct_answer
                            ? 'border-red-500 bg-red-500 text-white'
                            : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {isAnswered && index === challenge.correct_answer && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                        {isAnswered && index === userAttempt?.selected_answer && index !== challenge.correct_answer && <XCircle className="h-5 w-5 text-red-500 ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!isAnswered && (
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    onClick={() => showHint(challenge.hint)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Hint
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === undefined || submitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
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
                  {isCorrect && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      🎉 Correct! You earned {userAttempt.points_earned} points!
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
                  onClick={() => setCurrentChallenge(Math.min(challenges.length - 1, currentChallenge + 1))}
                  disabled={currentChallenge === challenges.length - 1}
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
                {challenges.map((ch, index) => {
                  const attempt = userAttempts.find(a => a.challenge_id === ch.id);
                  const isCompleted = !!attempt?.is_correct;
                  
                  return (
                    <div
                      key={ch.id}
                      onClick={() => setCurrentChallenge(index)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        currentChallenge === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : isCompleted 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : currentChallenge === index 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{ch.difficulty}</div>
                            <div className="text-xs text-gray-500">+{ch.points} pts</div>
                          </div>
                        </div>
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievementsWithStatus.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border ${
                    achievement.unlocked ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-500">{achievement.description}</div>
                      </div>
                      {achievement.unlocked && <Award className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Top Players
              </h3>
              <div className="space-y-3">
                {[
                  { name: "WordMaster", points: 2580, streak: 45 },
                  { name: "EtymoExpert", points: 2340, streak: 32 },
                  { name: "LanguageLover", points: 2100, streak: 28 },
                  { name: "RootSeeker", points: 1950, streak: 25 },
                  { name: "WordWizard", points: 1820, streak: 22 }
                ].map((player, index) => (
                  <div key={player.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-400 text-gray-900' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.points.toLocaleString()} pts</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Flame className="h-3 w-3" />
                      {player.streak}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild className="w-full mt-4" variant="outline">
                <Link to="/community">
                  View Full Leaderboard
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DailyChallengesPage;