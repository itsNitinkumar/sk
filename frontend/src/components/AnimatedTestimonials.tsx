'use client';

import { motion } from 'framer-motion';
import { Twitter, Linkedin } from 'lucide-react';

interface Testimonial {
  id: string;
  initials: string;
  name: string;
  handle: string;
  content: string;
  platform: 'twitter' | 'linkedin';
  link?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 'gk1',
    initials: 'GK',
    name: 'GAURANG KAUSHIK',
    handle: '@gaurang',
    content: 'I have been using Raj Vikramaditya (Striver) takeUforward for the past few weeks. I must say, I really support his product (well, why not, he has been one of the most inspirational people I have ever encountered). But now, after 3 weeks of usage, I',
    platform: 'linkedin'
  },
  {
    id: 'rm1',
    initials: 'RM',
    name: 'Rajkumar Maskar',
    handle: '@rajkumar',
    content: 'TUF+ customer support is amazing. The speed at which they assisted in solving the problem is insane kudos to @striver_79 and TUF team for this',
    platform: 'linkedin'
  },
  {
    id: 'as1',
    initials: 'AS',
    name: 'Azaan Suhail',
    handle: '@azaan',
    content: 'Got started late, but I discovered Striver\'s takeUforward website very late. As I began learning, I was amazed by the quality of the content, including vid',
    platform: 'linkedin'
  },
  {
    id: 'ht1',
    initials: 'HT',
    name: 'Himanshu Tiwari',
    handle: '@himanshu',
    content: '🚀 Day 6 Update: 📝 I hope everyone had a wonderful start to the new Hindi year! I was delighted to be fully immersed in the vibrant celebrations of Navratri and Gudi Padwa. Today I managed to push through and complete some important problems in the TakeU',
    platform: 'linkedin'
  },
  {
    id: 'rns1',
    initials: 'RNS',
    name: 'Raghu Nandan Sharma',
    handle: '@raghu',
    content: 'It\'s Amazon, I got an offer letter Today. Thanks, @striver_79 and @striv_tw it would not have been possible without you.',
    platform: 'twitter'
  },
  {
    id: 'sa1',
    initials: 'SA',
    name: 'Saket Aryan',
    handle: '@saket',
    content: 'Just a small milestone....but would like to thank one and only @striver_79 and @takeUforward_. One of the best resources available on the internet.... Specially DP series is out of the world 🌍',
    platform: 'twitter'
  }
];

const AnimatedTestimonials = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Hanging Label */}
      <div className="relative">
        <div className="absolute left-1/2 -top-24 transform -translate-x-1/2">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* String effect */}
            <div className="absolute left-1/2 -top-8 w-px h-8 bg-gradient-to-b from-transparent to-[#FF6B47]" />
            
            {/* Label */}
            <div className="bg-[#FF6B47] px-6 py-2 rounded-lg whitespace-nowrap">
              <span className="text-white font-medium">What users say about us</span>
            </div>
            
            {/* Triangle */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-[#FF6B47] rotate-45" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1E1E1E] rounded-xl p-6 hover:bg-[#2A2A2A] transition-colors"
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-white text-sm font-medium">{testimonial.initials}</span>
              </div>
              <div className="ml-3 flex justify-between items-center flex-1">
                <div>
                  <h3 className="text-white text-sm font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-xs">{testimonial.handle}</p>
                </div>
                {testimonial.platform === 'twitter' ? (
                  <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                ) : (
                  <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                )}
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{testimonial.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedTestimonials;

