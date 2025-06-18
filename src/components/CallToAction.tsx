import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayCircle, Users, Bell, ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Relationship with English?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Join a community where every word has a fascinating backstory, grammar becomes logical, 
            and vocabulary expansion happens naturally through understanding roots.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <h3 className="text-xl font-bold mb-6">Subscribe now and get:</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Every word's fascinating backstory revealed</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Grammar that becomes logical instead of arbitrary</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Natural vocabulary expansion through root understanding</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Language learning that feels like solving historical puzzles</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <h3 className="text-xl font-bold mb-6">Join Our Elite Community:</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-yellow-400" />
                <div>
                  <div className="font-semibold">275+ Word Detectives</div>
                  <div className="text-sm text-slate-300">Dedicated language enthusiasts</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Bell className="h-8 w-8 text-green-400" />
                <div>
                  <div className="font-semibold">Tuesday & Friday</div>
                  <div className="text-sm text-slate-300">Regular content delivery</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <PlayCircle className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="font-semibold">Quality Since 2021</div>
                  <div className="text-sm text-slate-300">Consistent excellence</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 text-lg w-full sm:w-auto"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Your Etymology Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg w-full sm:w-auto"
            >
              <Users className="mr-2 h-5 w-5" />
              Join 275+ Word Enthusiasts
            </Button>
          </div>
          
          <p className="mt-8 text-slate-300 text-lg">
            <span className="font-semibold text-white">Wordsmith's Corner:</span> Where every word tells a story, and every story enriches your mind.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
