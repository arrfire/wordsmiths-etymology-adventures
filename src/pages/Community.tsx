
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Youtube, Instagram, MessageSquare, Users, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Join Our Growing Community
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Connect with Fellow
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Word Enthusiasts
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join 275+ dedicated learners who share your passion for etymology, 
            language mastery, and the fascinating stories behind words.
          </p>
        </div>
      </section>

      {/* Social Platforms */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Connect With Us Across Platforms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Youtube className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">YouTube Channel</h3>
              <p className="text-slate-600 text-sm mb-4">
                29 expert videos with 700+ average views each
              </p>
              <Button 
                asChild
                className="w-full bg-red-500 hover:bg-red-600"
              >
                <a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer">
                  Subscribe Now
                </a>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <MessageSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Telegram Channel</h3>
              <p className="text-slate-600 text-sm mb-4">
                Daily discussions and exclusive content
              </p>
              <Button 
                asChild
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                  Join Channel
                </a>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Instagram className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Instagram</h3>
              <p className="text-slate-600 text-sm mb-4">
                Visual word stories and quick etymology tips
              </p>
              <Button 
                asChild
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                <a href="https://www.instagram.com/rajanph_12/" target="_blank" rel="noopener noreferrer">
                  Follow Us
                </a>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <svg className="h-12 w-12 text-slate-800 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <h3 className="font-bold mb-2">Twitter/X</h3>
              <p className="text-slate-600 text-sm mb-4">
                Quick etymology facts and language insights
              </p>
              <Button 
                asChild
                className="w-full bg-slate-800 hover:bg-slate-900"
              >
                <a href="https://x.com/0xwordsmith" target="_blank" rel="noopener noreferrer">
                  Follow Us
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Join Our Community?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the difference of being part of a focused, quality-driven learning community.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Quality Over Quantity</h3>
              <p className="text-slate-600">
                275+ engaged subscribers who genuinely care about language learning, 
                not millions of passive viewers.
              </p>
            </Card>

            <Card className="p-6">
              <BookOpen className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Expert Content</h3>
              <p className="text-slate-600">
                Every piece of content is researched and crafted by language experts 
                with genuine passion for etymology.
              </p>
            </Card>

            <Card className="p-6">
              <MessageSquare className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Personal Interaction</h3>
              <p className="text-slate-600">
                Get personal responses to your questions and engage in meaningful 
                discussions about language and etymology.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Etymology Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose your preferred platform and become part of our growing community of word enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 text-lg"
            >
              <a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-5 w-5" />
                Subscribe on YouTube
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" />
                Join Telegram
              </a>
            </Button>
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/">
                ← Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
