'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Mock data based on the text in your screenshots
const posts = [
  {
    id: 1,
    title: 'Trendsetter Chronicles: Unveiling the Latest in Fashion',
    date: '20 January 2025',
    color: 'bg-teal-700', // Placeholder colors for the images
  },
  {
    id: 2,
    title: "Runway Rundown: Decoding Fashion Week's Best Looks",
    date: '21 January 2025',
    color: 'bg-blue-300',
  },
  {
    id: 3,
    title: 'Closet Confidential: Behind-the-Scenes of a Fashionista',
    date: '22 January 2025',
    color: 'bg-rose-200',
  },
  {
    id: 4,
    title: 'DIY Couture: Crafting Your Own Fashion Masterpieces',
    date: '24 January 2025',
    color: 'bg-gray-200',
  },
];

export default function LatestPosts() {
  return (
    <section className="w-full bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-dark mb-2">
              Latest Post
            </h2>
            <p className="text-gray-600 font-medium">
              Discover the most trending products in Pixio.
            </p>
          </div>
          <button className="bg-black cursor-pointer text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shrink-0 shadow-md">
            View All
          </button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {posts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-6 group cursor-pointer bg-white rounded-[2rem] px-6 pt-6"
            >
              
              {/* Circular Image Container */}
              <div className="shrink-0 w-32 h-32 sm:w-50 sm:h-50 md:w-60 md:h-60 rounded-t-[150px] overflow-hidden shadow-sm relative">
                {/* Replace this div with a Next.js Image component when you have the assets */}
                <img src="https://pixio-react.vercel.app/assets/pic1-CkG-zlPz.jpg"  className="w-full h-full object-cover" />
              </div>

              {/* Content Area */}
              <div className="flex flex-col items-start flex-1">
                {/* Date Badge */}
                <div className="bg-black text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-sm mb-3 uppercase tracking-wider">
                  {post.date}
                </div>
                
                {/* Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-brand-dark leading-snug mb-4 group-hover:text-brand-red transition-colors">
                  {post.title}
                </h3>
                
                {/* Read More Button */}
                <button className="flex items-center gap-2 border-2 border-gray-200 text-brand-dark px-5 py-2.5 rounded-full text-xs font-bold group-hover:bg-black group-hover:border-brand-dark group-hover:text-white transition-all">
                  READ MORE
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}