// 'use client';

// import Link from 'next/link';
// import { PlaySquare, Plus } from 'lucide-react';

// export default function Playlists() {
//   const playlists = [
//     {
//       id: '1',
//       name: 'Web Development',
//       courseCount: 5,
//       thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
//       lastUpdated: '2 days ago'
//     },
//     {
//       id: '2',
//       name: 'Data Science',
//       courseCount: 3,
//       thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
//       lastUpdated: '1 week ago'
//     }
//   ];

//   return (
//     <div className="ml-64 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center">
//             <PlaySquare className="w-6 h-6 text-red-600 mr-2" />
//             <h1 className="text-2xl font-bold text-white">Playlists</h1>
//           </div>
//           <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
//             <Plus className="w-5 h-5" />
//             <span>Create Playlist</span>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {playlists.map((playlist) => (
//             <Link
//               key={playlist.id}
//               href={`/playlist/${playlist.id}`}
//               className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-red-600 transition-all"
//             >
//               <div className="relative aspect-video">
//                 <img
//                   src={playlist.thumbnail}
//                   alt={playlist.name}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-sm text-white">
//                   {playlist.courseCount} courses
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-white mb-1">{playlist.name}</h3>
//                 <p className="text-sm text-gray-400">Last updated {playlist.lastUpdated}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }