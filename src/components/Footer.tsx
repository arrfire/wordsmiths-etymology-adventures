
import { Separator } from '@/components/ui/separator';
import { BookOpen, Youtube, Instagram, Twitter, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold">Wordsmith's Corner</span>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              Quality etymology education for passionate language learners. 
              Discover the fascinating stories behind everyday words in under 3 minutes.
            </p>
            <div className="flex gap-4">
              <Youtube className="h-6 w-6 text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <MessageSquare className="h-6 w-6 text-slate-400 hover:text-purple-400 cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Latest Videos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Etymology Series</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Grammar Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Word Origins</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Discord Server</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Study Groups</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-slate-700 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © 2024 Wordsmith's Corner. All rights reserved. • Quality etymology education since 2021
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
