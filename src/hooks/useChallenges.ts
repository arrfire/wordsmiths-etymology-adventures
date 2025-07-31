
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  hint: string;
  difficulty: string;
  points: number;
  challenge_type: string;
  date_assigned: string;
}

export interface UserProfile {
  id: string;
  username: string | null;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_challenge_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAttempt {
  id: string;
  user_id: string;
  challenge_id: string;
  selected_answer: number;
  is_correct: boolean;
  points_earned: number;
  completed_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export const useChallenges = (selectedDate?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const targetDate = selectedDate || new Date().toISOString().split('T')[0];

  // Fetch challenges for the selected date
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['challenges', targetDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('date_assigned', targetDate)
        .order('created_at');
      
      if (error) throw error;
      return data as Challenge[];
    },
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserProfile | null;
    },
    enabled: !!user,
  });

  // Fetch user attempts for the selected date
  const { data: userAttempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['attempts', user?.id, targetDate],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_challenge_attempts')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', targetDate)
        .lt('completed_at', new Date(new Date(targetDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      if (error) throw error;
      return data as UserAttempt[];
    },
    enabled: !!user,
  });

  // Fetch achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value');
      
      if (error) throw error;
      return data as Achievement[];
    },
  });

  // Fetch user achievements
  const { data: userAchievements = [] } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user,
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ challengeId, selectedAnswer }: { challengeId: string; selectedAnswer: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');
      
      const isCorrect = selectedAnswer === challenge.correct_answer;
      const pointsEarned = isCorrect ? challenge.points : 0;
      
      // Insert attempt
      const { error: attemptError } = await supabase
        .from('user_challenge_attempts')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          points_earned: pointsEarned,
        });
      
      if (attemptError) throw attemptError;
      
      // Update user profile
      if (isCorrect) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const newStreak = userProfile?.last_challenge_date === yesterday 
          ? (userProfile.current_streak + 1)
          : 1;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: userProfile?.username || user.email?.split('@')[0] || 'Anonymous',
            total_points: (userProfile?.total_points || 0) + pointsEarned,
            current_streak: newStreak,
            longest_streak: Math.max(userProfile?.longest_streak || 0, newStreak),
            last_challenge_date: today,
          });
        
        if (profileError) throw profileError;
        
        // Check for new achievements
        await checkAchievements(user.id, {
          total_points: (userProfile?.total_points || 0) + pointsEarned,
          current_streak: newStreak,
          challenges_completed: userAttempts.filter(a => a.is_correct).length + 1,
        });
      }
      
      return { isCorrect, pointsEarned };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attempts'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
    },
  });

  const checkAchievements = async (userId: string, stats: { total_points: number; current_streak: number; challenges_completed: number }) => {
    const unlockedAchievementIds = userAchievements.map(ua => ua.achievement_id);
    
    for (const achievement of achievements) {
      // Skip if user already has this achievement
      if (unlockedAchievementIds.includes(achievement.id)) continue;
      
      let shouldUnlock = false;
      
      switch (achievement.requirement_type) {
        case 'total_points':
          shouldUnlock = stats.total_points >= achievement.requirement_value;
          break;
        case 'streak_days':
          shouldUnlock = stats.current_streak >= achievement.requirement_value;
          break;
        case 'challenges_completed':
          shouldUnlock = stats.challenges_completed >= achievement.requirement_value;
          break;
      }
      
      if (shouldUnlock) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          });
        
        toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`);
      }
    }
  };

  return {
    challenges,
    userProfile,
    userAttempts,
    achievements,
    userAchievements,
    isLoading: challengesLoading || profileLoading || attemptsLoading,
    submitAnswer: submitAnswerMutation.mutate,
    submitting: submitAnswerMutation.isPending,
  };
};
