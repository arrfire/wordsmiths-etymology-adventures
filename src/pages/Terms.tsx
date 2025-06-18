import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-slate-300">
              Guidelines for using Wordsmith's Corner content and community
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Wordsmith's Corner</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                By accessing or using any of our content on YouTube, Telegram, Instagram, or X/Twitter, you agree to comply with these terms of service. These terms help us maintain a positive, educational environment for all members of our community.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Just like learning etymology, understanding these terms helps create a foundation for a great learning experience together.
              </p>
            </Card>

            {/* Acceptable Use */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-slate-900">Community Guidelines</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">What We Encourage:</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Thoughtful questions about etymology and language</li>
                    <li>Respectful discussions about word origins and meanings</li>
                    <li>Sharing our content with proper attribution</li>
                    <li>Constructive feedback and suggestions for future topics</li>
                    <li>Supporting fellow community members' learning journeys</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">What We Don't Allow:</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Harassment, bullying, or disrespectful behavior toward any community member</li>
                    <li>Spam, promotional content, or off-topic discussions</li>
                    <li>Sharing false or misleading etymology information</li>
                    <li>Using our content for commercial purposes without permission</li>
                    <li>Violating the community guidelines of host platforms</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Content Use */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Content Usage Rights</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Educational Use</h3>
                  <p>You may use our content for personal educational purposes, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Personal study and learning</li>
                    <li>Teaching in educational settings with proper attribution</li>
                    <li>Sharing with friends and family for educational purposes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Attribution Requirements</h3>
                  <p>When sharing our content, please include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Credit to "Wordsmith's Corner"</li>
                    <li>Link to our original content when possible</li>
                    <li>Clear indication that content is educational in nature</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Prohibited Uses</h3>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    <li>Commercial use without explicit written permission</li>
                    <li>Modifying content in ways that misrepresent our educational mission</li>
                    <li>Using content for purposes that conflict with our educational values</li>
                    <li>Claiming our content as your own original work</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Platform Specific Terms */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Platform-Specific Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">YouTube</h3>
                  <p className="text-slate-700">
                    All interactions on our YouTube channel are subject to YouTube's Terms of Service and Community Guidelines. 
                    We encourage meaningful comments and discussions about etymology topics.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Telegram</h3>
                  <p className="text-slate-700">
                    Our Telegram community is a space for real-time discussions about language and etymology. 
                    Please keep conversations respectful and on-topic. We reserve the right to remove members who violate community standards.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Instagram & X/Twitter</h3>
                  <p className="text-slate-700">
                    These platforms are used for sharing quick etymology facts and community updates. 
                    Standard platform terms apply to all interactions.
                  </p>
                </div>
              </div>
            </Card>

            {/* Disclaimers */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-slate-900">Educational Disclaimers</h2>
              </div>
              
              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Educational Purpose:</strong> Our content is provided for educational and informational purposes. 
                  While we strive for accuracy, etymology is a complex field with ongoing research and differing scholarly opinions.
                </p>
                <p>
                  <strong>Not Professional Advice:</strong> Our content should not be considered professional linguistic or academic advice. 
                  For formal academic work, please consult peer-reviewed sources and qualified professionals.
                </p>
                <p>
                  <strong>Continuous Learning:</strong> Language and etymology research evolve. We may update our understanding 
                  and content as new information becomes available.
                </p>
              </div>
            </Card>

            {/* Modifications */}
            <Card className="p-8 mb-8 bg-white border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may update these terms from time to time to reflect changes in our community or legal requirements. 
                When we make significant changes, we'll notify our community through our social media channels.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Continued use of our content and participation in our community after changes are posted 
                constitutes acceptance of the updated terms.
              </p>
            </Card>

            {/* Contact */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-slate-50 border-0 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions About These Terms?</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                If you have questions about these terms of service or need clarification about appropriate use of our content, 
                please reach out to us through any of our social media platforms. We're here to help ensure everyone has 
                a positive learning experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                    Contact Us
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    ← Back to Home
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Final Note */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <p className="text-center font-medium">
                Thank you for being part of the Wordsmith's Corner community. Together, we're making language learning 
                more fascinating, one etymology at a time! 🌟
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;