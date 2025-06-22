import { Card } from '@/components/ui/card';
import { BookOpen, Brain, PenTool, Globe, Clock, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-blue-600" />,
      title: "Etymology Deep Dives",
      description: "Ancient Greek and Latin roots that unlock hundreds of English words",
      details: [
        "Surprising connections between unrelated vocabulary",
        "Historical events that shaped modern English",
        "Mind-blowing word origins in under 2 minutes"
      ]
    },
    {
      icon: <PenTool className="h-12 w-12 text-green-600" />,
      title: "Grammar Mastery",
      description: "Common mistakes that make even educated speakers sound unprofessional",
      details: [
        "Advanced punctuation rules that transform writing",
        "Subtle differences between good and exceptional English",
        "Professional communication tips for career advancement"
      ]
    },
    {
      icon: <Brain className="h-12 w-12 text-purple-600" />,
      title: "Vocabulary Expansion",
      description: "Precise word choices that make your communication more powerful",
      details: [
        "Professional terminology for career growth",
        "Archaic words making surprising comebacks",
        "Etymology-based learning for natural retention"
      ]
    }
  ];

  const learnerTypes = [
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "Quality-Focused Students",
      description: "Who prefer depth over superficial content"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Etymology Enthusiasts", 
      description: "Fascinated by word origins and language history"
    },
    {
      icon: <PenTool className="h-8 w-8 text-green-500" />,
      title: "Professional Writers",
      description: "Seeking to elevate vocabulary precision"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      title: "English Teachers",
      description: "Looking for engaging content to share"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What You'll Discover
          </h2>
          <p className="text-xl text-slate-600">
            Every video delivers concentrated learning that transforms your relationship with English
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <div className="text-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">{feature.title}</h3>
              <p className="text-slate-600 mb-6 text-center">{feature.description}</p>
              <ul className="space-y-3">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-slate-700 text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Perfect for These Learners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learnerTypes.map((type, index) => (
              <div key={index} className="text-center p-4">
                <div className="flex justify-center mb-4">
                  {type.icon}
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{type.title}</h4>
                <p className="text-sm text-slate-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
