import Image from 'next/image';
import { useState } from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export const TestimonialCard = ({ name, role, text, avatar }: TestimonialCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-start gap-4">
      <div className="relative w-12 h-12">
        <Image
          src={imageError ? '/avatars/default-avatar.png' : avatar}
          alt={name}
          width={48}
          height={48}
          className="rounded-full border-2 border-[#FF6B47]"
          onError={() => setImageError(true)}
          priority={false}
        />
      </div>
      <div>
        <h4 className="text-white font-semibold">{name}</h4>
        <p className="text-[#FF6B47]">{role}</p>
        <p className="text-gray-300 mt-4">{text}</p>
      </div>
    </div>
  );
};