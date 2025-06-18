
import { Button } from '@/components/ui/button';
import { PlayCircle, Users, BookOpen, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-blue-800/30 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-blue-400/20">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>275+ Dedicated Subscribers</span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Master English Through
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Etymology
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-slate-300 leading-relaxed">
            Join our growing community of word lovers and discover the fascinating stories behind everyday words with 
            <span className="font-semibold text-white"> Wordsmith's Corner</span> - Where English Comes Alive in Minutes!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg">
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Learning Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">29</div>
              <div className="text-slate-300">Expert Videos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">700+</div>
              <div className="text-slate-300">Avg Views/Video</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">&lt;3</div>
              <div className="text-slate-300">Minute Lessons</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
