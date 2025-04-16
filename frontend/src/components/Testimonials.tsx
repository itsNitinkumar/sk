import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  username: string;
  content: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Himanshu Tiwari",
    username: "@himanshu",
    content: "Today I managed to push through and complete some important problems in the TakeUforward platform!"
  },
  {
    id: 2,
    name: "Walter Brown",
    username: "@walterbrown",
    content: "Thank you @striver_79 for creating @takeUforward_. TuF is definitely a revolution ⭐️⭐️⭐️⭐️⭐️"
  },
  {
    id: 3,
    name: "Rohan",
    username: "@rohan",
    content: "Just a small milestone... but would like to thank one and only @striver_79 and @takeUforward_. One of the best resources available on the internet... Specially DP series is out of the world 🔥"
  }
];

const Testimonials = () => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Where Coders Shine</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="h-full w-full rounded-full"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.username}</p>
                </div>
              </div>
              <p className="text-gray-300">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;