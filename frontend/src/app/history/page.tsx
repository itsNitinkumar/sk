// 'use client';

// import { Clock } from 'lucide-react';

// export default function History() {
//   const watchHistory = [
//     {
//       id: '1',
//       title: 'React Hooks Deep Dive',
//       thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
//       watchedAt: '2 hours ago',
//       progress: 75
//     },
//     {
//       id: '2',
//       title: 'Node.js Authentication',
//       thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3',
//       watchedAt: '1 day ago',
//       progress: 100
//     },
//     {
//       id: '3',
//       title: 'TypeScript for Beginners',
//       thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
//       watchedAt: '2 days ago',
//       progress: 45
//     }
//   ];

//   return (
//     <div className="ml-64 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-6">
//           <Clock className="w-6 h-6 text-red-600 mr-2" />
//           <h1 className="text-2xl font-bold text-white">Watch History</h1>
//         </div>

//         <div className="space-y-4">
//           {watchHistory.map((item) => (
//             <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden flex">
//               <div className="w-48 h-28">
//                 <img
//                   src={item.thumbnail}
//                   alt={item.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-4 flex-1">
//                 <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
//                 <p className="text-gray-400 text-sm">{item.watchedAt}</p>
//                 <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
//                   <div
//                     className="bg-red-600 h-2 rounded-full"
//                     style={{ width: `${item.progress}%` }}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }