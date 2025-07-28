
import { Card } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Finally, someone who explains the WHY behind English words!",
      author: "Recent subscriber",
      type: "New Member"
    },
    {
      quote: "I learn more about language in 2 minutes here than in hour-long videos elsewhere.",
      author: "Community member",
      type: "Active Learner"
    },
    {
      quote: "Perfect for my morning coffee - quick, fascinating, and always useful.",
      author: "Daily viewer",
      type: "Regular Viewer"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-slate-600">
            Real feedback from dedicated language learners
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <Quote className="h-8 w-8 text-blue-600 opacity-50" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <blockquote className="text-slate-700 mb-6 text-lg leading-relaxed font-medium">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="border-t pt-4">
                <div className="font-semibold text-slate-900">{testimonial.author}</div>
                <div className="text-sm text-blue-600">{testimonial.type}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
