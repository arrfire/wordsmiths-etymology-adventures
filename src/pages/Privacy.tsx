import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Eye, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-slate-300">
              How we protect and handle your information at Wordsmith's Corner
            </p>
            <p className="text-sm text-slate-400 mt-4">Last updated: June 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Privacy</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                At Wordsmith's Corner, we are committed to protecting your privacy and being transparent about how we collect, use, and share your information. This privacy policy explains our practices for our YouTube channel, Telegram community, Instagram, and X/Twitter accounts.
              </p>
              <p className="text-slate-700 leading-relaxed">
                We believe in keeping things simple and honest - just like our etymology lessons.
              </p>
            </Card>

            {/* What We Collect */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">What Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">YouTube</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Public interactions (comments, likes, subscriptions) - managed by YouTube</li>
                    <li>Analytics data provided by YouTube (views, demographics, engagement)</li>
                    <li>We do not collect personal information directly through YouTube</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Telegram</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Username and public profile information you choose to share</li>
                    <li>Messages and interactions within our community channel</li>
                    <li>Telegram handles all data according to their privacy policy</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Instagram & X/Twitter</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Public interactions (comments, likes, follows, shares)</li>
                    <li>Basic analytics provided by the platforms</li>
                    <li>All data handling is governed by respective platform policies</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* How We Use Information */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
              </div>
              
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>To create and improve our educational content about etymology</li>
                <li>To respond to comments and engage with our community</li>
                <li>To understand what content our audience finds most valuable</li>
                <li>To comply with platform policies and legal requirements</li>
                <li>To maintain a safe and respectful learning environment</li>
              </ul>
            </Card>

            {/* Data Protection */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-900">How We Protect Your Information</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Platform Security:</strong> We rely on the security measures of established platforms (YouTube, Telegram, Instagram, X/Twitter) to protect your data.
                </p>
                <p>
                  <strong>Limited Data Collection:</strong> We only access information that you make publicly available or that platforms provide through their analytics.
                </p>
                <p>
                  <strong>No Direct Data Storage:</strong> We do not maintain independent databases of user information.
                </p>
                <p>
                  <strong>Community Guidelines:</strong> We maintain clear community guidelines to ensure respectful interactions.
                </p>
              </div>
            </Card>

            {/* Your Rights */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights and Choices</h2>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Platform Controls:</strong> You can control your privacy settings on each platform (YouTube, Telegram, Instagram, X/Twitter) according to their respective policies.
                </p>
                <p>
                  <strong>Unsubscribe/Leave:</strong> You can unsubscribe or leave our communities at any time through the platform controls.
                </p>
                <p>
                  <strong>Content Removal:</strong> You can delete your comments or messages according to each platform's policies.
                </p>
                <p>
                  <strong>Contact Us:</strong> If you have questions about how we handle information, you can reach us through any of our social media platforms.
                </p>
              </div>
            </Card>

            {/* Third Party Links */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Platforms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our content is hosted on third-party platforms (YouTube, Telegram, Instagram, X/Twitter). These platforms have their own privacy policies that govern how they collect, use, and protect your information:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YouTube/Google Privacy Policy</a></li>
                <li><a href="https://telegram.org/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram Privacy Policy</a></li>
                <li><a href="https://help.instagram.com/519522125107875" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Instagram Privacy Policy</a></li>
                <li><a href="https://twitter.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">X/Twitter Privacy Policy</a></li>
              </ul>
            </Card>

            {/* Contact */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-slate-50 border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions or Concerns?</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                If you have any questions about this privacy policy or how we handle information, 
                please don't hesitate to reach out to us through any of our social media platforms. 
                We're committed to transparency and will respond to your inquiries promptly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                    Contact via Telegram
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    ← Back to Home
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;