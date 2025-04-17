'use client';

import { motion } from 'framer-motion';
import { Twitter, Linkedin } from 'lucide-react';

interface TestimonialProps {
  testimonials: Array<{
    id: string;
    user: string;
    role?: string;
    message: string;
    rating: number;
    avatar?: string;
  }>;
}

export default function AnimatedTestimonials({ testimonials }: TestimonialProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            {testimonial.avatar && (
              <Image
                src={testimonial.avatar}
                alt={testimonial.user}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold text-white">{testimonial.user}</h3>
              {testimonial.role && (
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              )}
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-300">{testimonial.message}</p>
        </motion.div>
      ))}
    </div>
  );
}

