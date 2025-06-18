
import { Card } from '@/components/ui/card';
import { TrendingUp, Heart, Clock, Target } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Quality Over Quantity",
      description: "275+ dedicated subscribers who genuinely engage with every lesson",
      highlight: "275+ Subscribers"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Genuine Engagement",
      description: "700+ average views per video - proof our content resonates",
      highlight: "High Engagement"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Efficient Learning",
      description: "Under 3 minutes of concentrated, valuable education per video",
      highlight: "<3 Minutes"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Consistent Growth",
      description: "Building a community that values depth over viral trends",
      highlight: "Steady Growth"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Why Wordsmith's Corner is Different
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            In a world of millions of subscribers and viral content, we offer something rare: 
            genuine expertise delivered to people who truly care about language mastery.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{stat.title}</h3>
              <div className="text-sm font-medium text-blue-600 mb-3">{stat.highlight}</div>
              <p className="text-slate-600 text-sm leading-relaxed">{stat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
