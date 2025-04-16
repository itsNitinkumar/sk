import Image from 'next/image';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 pt-32">
        <button className="mx-auto block px-4 py-2 bg-[#2A2A2A] text-[#FF6B6B] rounded-full text-sm mb-8">
          Meet your Instructor
        </button>

        <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-16">
          The Architect of Your Success
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="mb-8">
              <blockquote className="text-lg text-gray-300 mb-6">
                A Google Software Engineer, ex-Amazon and Media.net, with offers from Facebook London, 
                and a competitive coding ace with CodeChef Master and 6★ Codechef accolades.
              </blockquote>
              
              <div className="text-gray-400">
                Find more about me on
                <div className="flex gap-4 mt-4">
                  <Link href="https://instagram.com" className="text-gray-400 hover:text-white">
                    <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
                  </Link>
                  <Link href="https://linkedin.com" className="text-gray-400 hover:text-white">
                    <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} />
                  </Link>
                  <Link href="https://twitter.com" className="text-gray-400 hover:text-white">
                    <Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-xl p-4 flex items-center gap-4 max-w-md">
              <Image 
                src="/images/profile-small.jpg" 
                alt="Raj Vikramaditya" 
                width={48} 
                height={48} 
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">Raj Vikramaditya</h3>
                  <Image src="/icons/verified.svg" alt="Verified" width={16} height={16} />
                </div>
                <p className="text-sm text-gray-400">Founder takeUforward | SWE-III @ Google</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-[500px] h-[500px] rounded-full bg-[#FF6B6B] opacity-90">
              <Image
                src="/images/raj-profile.png"
                alt="Raj Vikramaditya"
                width={500}
                height={500}
                className="object-cover"
              />
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1A1A1A] px-6 py-4 rounded-xl">
              <p className="text-center text-sm text-gray-400 mb-4">Bringing work experience from</p>
              <div className="flex items-center gap-6">
                <Image src="/logos/google.svg" alt="Google" width={80} height={24} />
                <Image src="/logos/amazon.svg" alt="Amazon" width={80} height={24} />
                <Image src="/logos/medianet.svg" alt="Media.net" width={80} height={24} />
                <Image src="/logos/meta.svg" alt="Meta" width={80} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}