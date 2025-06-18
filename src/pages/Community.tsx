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
          <Badge className="mb-6 bg-yellow-500/20 text-yellow-300 border-yellow-400">
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
        <div className="container mx-auto px