// src/components/Footer.tsx - UPDATED
import { Separator } from '@/components/ui/separator';
import { Youtube, Instagram, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Wordsmith's Corner</h3>
            <p className="text-slate-300 mb-6 max-w-md">
              Discover the fascinating stories behind everyday words in under 3 minutes.
            </p>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-6 w-6 text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
              </a>
              <a href="https://www.instagram.com/rajanph_12/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
              </a>
              <a href="https://x.com/0xwordsmith" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-6 w-6 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Learning</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Latest Videos</a></li>
              <li><Link to="/challenges" className="hover:text-white transition-colors">Daily Challenges</Link></li> {/* NEW */}
              <li><a href="https://www.youtube.com/@thewordsmithscorner/playlists" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Etymology Series</a></li>
              <li><a href="https://www.youtube.com/@thewordsmithscorner" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Word Origins</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="https://t.me/wordsmithscorner" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram Channel</a></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Join Community</Link></li>
              <li><a href="https://www.youtube.com/@thewordsmithscorner/community" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Newsletter</a></li>
              <li><a href="https://www.instagram.com/rajanph_12/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-slate-700 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © 2024 Wordsmith's Corner. All rights reserved. • Quality etymology education since 2021
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;