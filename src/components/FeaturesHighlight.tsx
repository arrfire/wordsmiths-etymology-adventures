// src/components/FeaturesHighlight.tsx - NEW COMPONENT
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesHighlight = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Daily Etymology Challenges",
      description: "Test your word knowledge with fun, educational challenges every day",
      highlight: "NEW",
      link: "/challenges",
      buttonText: "Try Today's Challenge",
      buttonClass: "bg-purple-600 hover:bg-purple-700"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Community Learning",
      description: "Join 275+ dedicated word enthusiasts in our growing community",
      highlight: "275+ Members",
      link: "/community",
      buttonText: "Join Community",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Expert Video Lessons",
      description: "Learn etymology through our acclaimed 2-minute video format",
      highlight: "40 Videos",
      link: "https://www.youtube.com/@thewordsmithscorner",
      buttonText: "Watch Now",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      external: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Explore Etymology Like Never Before
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From daily challenges to expert lessons, discover multiple ways to deepen 
            your understanding of word origins and linguistic history.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden">
              {feature.highlight && (
                <Badge 
                  variant="outline" 
                  className={`absolute top-4 right-4 ${
                    feature.highlight === "NEW" 
                      ? "bg-purple-100 text-purple-700 border-purple-300" 
                      : "bg-emerald-100 text-emerald-700 border-emerald-300"
                  }`}
                >
                  {feature.highlight}
                </Badge>
              )}
              
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{feature.description}</p>
              
              <Button 
                asChild
                className={`w-full ${feature.buttonClass} text-white font-semibold`}
              >
                {feature.external ? (
                  <a href={feature.link} target="_blank" rel="noopener noreferrer">
                    {feature.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link to={feature.link}>
                    {feature.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </Button>
            </Card>
          ))}
        </div>
        
        {/* Achievement Showcase */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Join Our Achievement System
            </h3>
            <p className="text-slate-600">
              Earn badges, build streaks, and compete with fellow word enthusiasts
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">🏆</div>
              <div className="text-sm font-medium text-slate-700">Weekly Champion</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">🔥</div>
              <div className="text-sm font-medium text-slate-700">7-Day Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">🎯</div>
              <div className="text-sm font-medium text-slate-700">Perfect Score</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600 mb-1">⚡</div>
              <div className="text-sm font-medium text-slate-700">Speed Demon</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesHighlight;