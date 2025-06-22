
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Youtube, Instagram, MessageSquare, Mail, Users, Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About <span className="text-yellow-400">Wordsmith's Corner</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Where words come alive!
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Mission Statement */}
            <Card className="p-8 mb-12 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-slate-700 mb-6 leading-relaxed">
                At Wordsmith's Corner, we believe that every word has a story, and every story has the power to engage, educate, and inspire. Through crisp, insightful, and entertaining videos, we unravel the fascinating world of English vocabulary, idioms, expressions, and etymology — one delightful snippet at a time.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Our mission is to make English vocabulary and language appreciation fun, memorable, and meaningful — for everyone from students and teachers to trivia fans and lifelong learners.
              </p>
            </Card>

            {/* Team Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Meet Our Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="p-8 text-center shadow-lg">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Dr. Rajan Philips</h3>
                  <p className="text-blue-600 font-medium mb-4">Founder & Content Creator</p>
                  <p className="text-slate-600 leading-relaxed">
                    A lifelong educator, seasoned public speaker, and columnist with over three decades of experience in English Language Teaching (ELT). From Kendriya Vidyalayas in India to university classrooms in Oman, Dr. Philips has taught thousands of students, always driven by one passion: the magic and mystery of words.
                  </p>
                </Card>

                <Card className="p-8 text-center shadow-lg">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-16 w-16 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Arun Philips</h3>
                  <p className="text-purple-600 font-medium mb-4">Tech Lead & Developer</p>
                  <p className="text-slate-600 leading-relaxed">
                    A Web3 developer and AI enthusiast who ensures the content reaches you in the most accessible, modern, and engaging format. He brings cutting-edge technology to make language learning more interactive and enjoyable.
                  </p>
                </Card>
              </div>

              <Card className="p-8 text-center shadow-lg">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Award className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nevil Philips</h3>
                <p className="text-green-600 font-medium mb-4">Creative Contributor</p>
                <p className="text-slate-600 leading-relaxed">
                  Part of our creative team, bringing fresh perspectives and innovative ideas to help make etymology and language learning even more engaging for our growing community.
                </p>
              </Card>
            </div>

            {/* What Makes Us Different */}
            <Card className="p-8 mb-12 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What Makes Us Different</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Quality Over Quantity</h3>
                  <p className="text-slate-600 text-sm">Every Thursday, we deliver carefully crafted content under 2 minutes that packs maximum educational value.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Expert Knowledge</h3>
                  <p className="text-slate-600 text-sm">Three decades of teaching experience ensures authentic, accurate, and engaging content.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Technology-Enhanced</h3>
                  <p className="text-slate-600 text-sm">Modern technology meets traditional pedagogy for the best learning experience.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Community-Focused</h3>
                  <p className="text-slate-600 text-sm">Building a dedicated community of language enthusiasts who value depth and quality.</p>
                </div>
              </div>
            </Card>

            {/* Contact & Join */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Join Our Journey</h2>
              <p className="text-slate-600 mb-8">
                Subscribe to our YouTube channel, drop a comment, and be part of a growing community that celebrates the English language — one word at a time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  <a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-2 h-5 w-5" />
                    Subscribe on YouTube
                  </a>
                </Button>
                
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Join Telegram
                  </a>
                </Button>
                
                <Button 
                  asChild
                  size="lg" 
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <a href="mailto:contact@wordsmithscorner.com">
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Us
                  </a>
                </Button>
              </div>

              <div className="flex justify-center gap-6">
                <a href="https://www.instagram.com/rajanph_12/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-6 w-6 text-slate-400 hover:text-pink-500 transition-colors" />
                </a>
                <a href="https://x.com/0xwordsmith" target="_blank" rel="noopener noreferrer">
                  <svg className="h-6 w-6 text-slate-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
