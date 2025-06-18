import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Youtube, 
  Instagram, 
  ArrowRight, 
  Star,
  Globe,
  Heart,
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const platforms = [
    {
      name: "YouTube",
      description: "Watch etymology videos and join discussions",
      subscribers: "275+ subscribers",
      engagement: "700+ avg views",
      icon: <Youtube className="h-8 w-8 text-red-500" />,
      link: "https://www.youtube.com/@thewordsmithscorner",
      buttonText: "Subscribe",
      buttonClass: "bg-red-500 hover:bg-red-600"
    },
    {
      name: "Telegram",
      description: "Join our active community for real-time discussions",
      subscribers: "275+ members",
      engagement: "Daily discussions",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      link: "https://t.me/wordsmithscorner",
      buttonText: "Join Channel",
      buttonClass: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "Instagram",
      description: "Visual content and behind-the-scenes",
      subscribers: "Growing daily",
      engagement: "Visual etymology",
      icon: <Instagram className="h-8 w-8 text-pink-500" />,
      link: "https://www.instagram.com/rajanph_12/",
      buttonText: "Follow",
      buttonClass: "bg-pink-500 hover:bg-pink-600"
    },
    {
      name: "Twitter/X",
      description: "Quick etymology facts and community updates",
      subscribers: "Daily tweets",
      engagement: "Quick learning",
      icon: (
        <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      link: "https://x.com/0xwordsmith",
      buttonText: "Follow",
      buttonClass: "bg-blue-400 hover:bg-blue-500"
    }
  ];

  const communityFeatures = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Passionate Learners",
      description: "Connect with fellow word enthusiasts who share your love for language"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Continuous Growth",
      description: "Be part of a growing community that values quality over quantity"
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-500" />,
      title: "Global Reach",
      description: "Learn alongside people from around the world, all united by language"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Quality Content",
      description: "Enjoy carefully crafted content that respects your time and intelligence"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="outline" className="mb-6 bg-yellow-500/20 text-yellow-300 border-yellow-400">
            Growing Community
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Join the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Wordsmith's Corner
            </span>
            Community
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Connect with 275+ dedicated word lovers across multiple platforms. 
            Choose your preferred way to learn and engage with our etymology community.
          </p>
        </div>
      </section>

      {/* Platform Cards */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join us wherever you feel most comfortable. Each platform offers unique ways to engage with our content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {platforms.map((platform, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  {platform.icon}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{platform.name}</h3>
                    <p className="text-slate-600">{platform.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="font-semibold text-slate-900">{platform.subscribers}</div>
                    <div className="text-sm text-slate-600">Community Size</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="font-semibold text-slate-900">{platform.engagement}</div>
                    <div className="text-sm text-slate-600">Engagement</div>
                  </div>
                </div>
                
                <Button 
                  asChild
                  className={`w-full ${platform.buttonClass} text-white font-semibold`}
                >
                  <a href={platform.link} target="_blank" rel="noopener noreferrer">
                    {platform.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Our Community is Special
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We've built more than just an audience - we've created a family of language lovers 
              who support each other's learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Join 275+ Word Enthusiasts
                </h2>
                <p className="text-lg text-slate-600">
                  Our community members come from all walks of life, united by their passion for language learning.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">275+</div>
                  <div className="text-slate-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">700+</div>
                  <div className="text-slate-600">Avg Video Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4+</div>
                  <div className="text-slate-600">Platforms</div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-4 text-lg"
                >
                  <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                    <Users className="mr-2 h-5 w-5" />
                    Join 275+ Enthusiasts
                  </a>
                </Button>
              </div>
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
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-bold"
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