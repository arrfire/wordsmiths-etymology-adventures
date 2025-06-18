
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Calendar, Trophy, Heart } from 'lucide-react';

const Community = () => {
  const benefits = [
    {
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      title: "Personal Responses",
      description: "Get answers to your questions and personalized feedback"
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Tailored Content",
      description: "Content shaped by subscriber feedback and requests"
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "No Noise",
      description: "Focused, quality education without overwhelming content"
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      title: "Consistent Schedule",
      description: "New content every Tuesday & Friday you can count on"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
            Why Small Can Be Mighty
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What Makes Our Small Community Powerful
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our 275 subscribers aren't just numbers - they're dedicated learners who value 
            genuine expertise and quality educational content over entertainment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Intimate Learning Experience
            </h3>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-slate-50 border-0 shadow-lg">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Our Community Members:</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">Ask thoughtful questions in comments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-700">Apply etymology lessons to expand vocabulary</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-700">Share discoveries with friends and colleagues</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-700">Value quality education over entertainment</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">Join Us On:</div>
                <div className="flex justify-center gap-4 text-sm text-slate-600">
                  <span>Instagram</span>
                  <span>•</span>
                  <span>Twitter/X</span>
                  <span>•</span>
                  <span>Telegram</span>
                </div>
                <div className="mt-2 text-blue-600 font-medium">@WordsmithsCorner</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Community;
