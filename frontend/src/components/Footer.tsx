'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Youtube, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms and Conditions', href: '/terms' },
  ];

  const quickAccessLinks = [
    { label: "Striver's DSA Sheet", href: '/dsa-sheet' },
    { label: 'Technical Blogs', href: '/blogs' },
    { label: 'CS Subjects', href: '/cs-subjects' },
    { label: "Striver's CP Sheet", href: '/cp-sheet' },
  ];

  const dsaSheetsLinks = [
    { label: "Striver's SDE Sheet", href: '/sde-sheet' },
    { label: "Striver's A2Z DSA Playlist", href: '/a2z-dsa' },
    { label: 'SDE Core Sheet', href: '/sde-core' },
    { label: "Striver's CP Sheet", href: '/cp-sheet' },
  ];

  const dsaPlaylistLinks = [
    { label: 'Array Series', href: '/array-series' },
    { label: 'Graph Series', href: '/graph-series' },
    { label: 'DP Series', href: '/dp-series' },
    { label: 'LinkedList Series', href: '/linkedlist-series' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/takeUforward' },
    { icon: Twitter, href: 'https://twitter.com/takeUforward' },
    { icon: Youtube, href: 'https://youtube.com/takeUforward' },
    { icon: Github, href: 'https://github.com/takeUforward' },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-white py-16">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        {/* <div className="bg-[#0F1117] rounded-2xl p-8 mb-16">
          <div className="relative">
            <div className="absolute left-1/2 -top-12 w-px h-12 bg-gradient-to-b from-transparent to-[#FF6B47]" />
            
            <motion.h2 
              className="text-3xl font-bold mb-8 relative"
              animate={{
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                originX: 0.5,
                originY: 0
              }}
            >
              Join a Global Community of{' '}
              <motion.span 
                className="text-[#FF6B47] relative"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                9,02,962+
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#FF6B47] rounded-full"></span>
              </motion.span>
              {' '}Learners
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-[#1A1A1A] rounded-xl p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold mb-2">600+</div>
              <div className="text-gray-400">DSA Problems with Solutions</div>
            </motion.div>
            <motion.div 
              className="bg-[#1A1A1A] rounded-xl p-6"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Free Video Tutorials</div>
            </motion.div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
          <div className='rounded-sm bg-gray-700 h-32 w-32 text-white/90 flex justify-center items-center text-[100px] font-mono m-4'>LS</div>
            <p className="text-gray-400 text-sm mb-6">
              The best place to learn data Structures, algorithms, most asked coding interview questions & real interview experiences free of cost.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link 
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            {companyLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Quick Access</h3>
            {quickAccessLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">DSA Sheets</h3>
            {dsaSheetsLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">DSA Playlist</h3>
            {dsaPlaylistLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
