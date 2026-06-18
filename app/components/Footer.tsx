'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const recentPosts = [
  { id: 1, title: 'Cozy Knit Cardigan Sweater', date: 'Jan 23, 2025', color: 'bg-purple-300', img: 'https://pixio-react.vercel.app/assets/1-Cx9eAfJp.png' },
  { id: 2, title: 'Sophisticated Swagger Suit', date: 'Jan 23, 2025', color: 'bg-blue-300', img: 'https://pixio-react.vercel.app/assets/2-D-31DoBL.png' },
  { id: 3, title: 'Athletic Mesh Sports Leggings', date: 'Jan 23, 2025', color: 'bg-orange-300', img: ' https://pixio-react.vercel.app/assets/3-B3tJCLiH.png' },
];

const stores = ['New York', 'London SF', 'Edinburgh', 'Los Angeles', 'Chicago', 'Las Vegas'];
const usefulLinks = ['Privacy Policy', 'Returns', 'Terms & Conditions', 'Contact Us', 'Latest News', 'Our Sitemap'];
const footerMenu = ['Instagram Profile', 'New Collection', 'Woman Dress', 'Contact Us', 'Latest News'];

export default function Footer() {
  return (
    <footer className="w-full bg-brand-bg pt-16 lg:pt-24 pb-8 border-t border-black relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Contact (Wider) */}
          <motion.div 
            className="lg:col-span-4 flex flex-col items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                <span className="font-extrabold text-brand-dark text-lg leading-none">P</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-brand-dark">Logo</span>
            </Link>
            
            <div className="text-sm font-medium text-brand-dark space-y-2 mb-8">
              <p>Address : 451 Wall Street, UK, London</p>
              <p>E-mail : example@info.com</p>
              <p>Phone : (064) 332-1233</p>
            </div>

            <div className="w-full max-w-sm">
              <h4 className="text-brand-dark font-extrabold mb-4">Subscribe To Our Newsletter</h4>
              <div className="flex items-center bg-[#f7f7f7] rounded-full p-1 border border-gray-200 focus-within:border-brand-dark transition-colors">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="flex-1 bg-transparent outline-none px-4 text-sm text-brand-dark placeholder-gray-500"
                />
                <button className="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark hover:bg-yellow-400 transition-colors shrink-0">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Recent Posts (Medium) */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h4 className="text-lg font-extrabold text-brand-dark mb-6">Recent Posts</h4>
            <div className="flex flex-col gap-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 group cursor-pointer">
                  <img src={post.img} className="w-14 h-14 rounded-[8px] group-hover:scale-105 transition-transform" />
                  <div>
                    <h5 className="text-sm font-extrabold text-brand-dark leading-tight group-hover:text-brand-red transition-colors">
                      {post.title}
                    </h5>
                    <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
                      {post.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 3: Our Stores (Small) */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h4 className="text-lg font-extrabold text-brand-dark mb-6">Our Stores</h4>
            <ul className="flex flex-col gap-3">
              {stores.map((store) => (
                <li key={store}>
                  <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
                    {store}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Useful Links (Small) */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h4 className="text-lg font-extrabold text-brand-dark mb-6">Useful Links</h4>
            <ul className="flex flex-col gap-3">
              {usefulLinks.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Footer Menu (Small) */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h4 className="text-lg font-extrabold text-brand-dark mb-6 whitespace-nowrap">Footer Menu</h4>
            <ul className="flex flex-col gap-3">
              {footerMenu.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors whitespace-nowrap">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Bottom Bar: Copyright & Payments */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 gap-4">
          <p className="text-sm font-medium text-brand-dark">
            © 2026 <span className="font-extrabold text-brand-red">website.com</span>. All Rights Reserved.
          </p>
          
          {/* Payment Methods (Simulated with simple pills for exact visual match) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-brand-dark mr-2">We Accept:</span>
            <img src="/images/card.png" alt="img" />
          </div>
        </div>

      </div>
    </footer>
  );
}