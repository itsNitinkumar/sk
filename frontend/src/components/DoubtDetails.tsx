// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { doubtService } from '@/services/doubt.service';
// import { Doubt, Message } from '@/types';
// import DoubtReply from './DoubtReply';
// import { supabase } from '@/utils/supabase';

// interface DoubtDetailsProps {
//   doubtId: string;
// }

// export default function DoubtDetails({ doubtId }: DoubtDetailsProps) {
//   const [doubt, setDoubt] = useState<Doubt | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDoubtDetails();

//     // Subscribe to real-time updates for both doubt and message changes
//     const doubtChannel = supabase.channel('doubt-updates')
//       .on('broadcast', { event: 'doubt-updated' }, (payload) => {
//         if (payload.payload.doubtId === doubtId) {
//           setDoubt(prev => prev ? { ...prev, status: payload.payload.status } : null);
//         }
//       })
//       .subscribe();

//     const messageChannel = supabase.channel('message-changes')
//       .on('broadcast', { event: 'message-created' }, (payload) => {
//         if (payload.payload.doubtId === doubtId) {
//           setMessages(prev => [...prev, payload.payload.message]);
//         }
//       })
//       .subscribe();

//     return () => {
//       doubtChannel.unsubscribe();
//       messageChannel.unsubscribe();
//     };
//   }, [doubtId]);

//   const fetchDoubtDetails = async () => {
//     try {
//       setLoading(true);
//       const doubtResponse = await doubtService.getDoubtById(doubtId);
//       const messagesResponse = await doubtService.getDoubtMessages(doubtId);
      
//       if (doubtResponse.success) {
//         setDoubt(doubtResponse.data);
//       }
//       if (messagesResponse.success) {
//         setMessages(messagesResponse.data);
//       }
//     } catch (error) {
//       console.error('Error fetching doubt details:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!doubt) {
//     return <div>Doubt not found</div>;
//   }

//   return (
//     <div className="bg-gray-800 rounded-lg p-6">
//       <h2 className="text-2xl font-bold mb-4">{doubt.title}</h2>
//       <p className="text-gray-300 mb-6">{doubt.description}</p>
      
//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold">Responses</h3>
//         {messages.length === 0 ? (
//           <p className="text-gray-400">No responses yet</p>
//         ) : (
//           messages.map((message) => (
//             <div 
//               key={message.id} 
//               className={`p-4 rounded-lg ${
//                 message.isResponse 
//                   ? 'bg-blue-900 ml-4' 
//                   : 'bg-gray-700'
//               }`}
//             >
//               <p className="text-white">{message.text}</p>
//               <p className="text-sm text-gray-400 mt-2">
//                 {new Date(message.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="mt-4">
//         <p className="text-sm text-gray-400">
//           Status: {doubt.status}
//         </p>
//       </div>
//     </div>
//   );
// }

