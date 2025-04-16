// 'use client';
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import doubtService from '@/services/doubt.service';
// import { Loader2, MessageCircle, Send } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Doubt } from '@/types';

// export default function DoubtsPage({ params }: { params: { courseId: string } }) {
//   const { user } = useAuth();
//   const [doubts, setDoubts] = useState<Doubt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [replyContent, setReplyContent] = useState('');
//   const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDoubts();
//   }, [params.courseId]);

//   const fetchDoubts = async () => {
//     try {
//       setLoading(true);
//       const response = await doubtService.getDoubtsByCourse(params.courseId);
//       if (response.success) {
//         setDoubts(response.doubts);
//       } else {
//         throw new Error(response.message || 'Failed to fetch doubts');
//       }
//     } catch (error) {
//       console.error('Error fetching doubts:', error);
//       toast.error('Failed to fetch doubts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReply = async (doubtId: string) => {
//     try {
//       const response = await doubtService.replyToDoubt(doubtId, replyContent);
//       if (response.success) {
//         toast.success('Reply sent successfully');
//         setReplyContent('');
//         setSelectedDoubtId(null);
//         // Use the courseId from the URL params directly
//         await fetchDoubts(); // This will use params.courseId internally
//       } else {
//         throw new Error(response.message || 'Failed to send reply');
//       }
//     } catch (error) {
//       console.error('Error sending reply:', error);
//       toast.error('Failed to send reply');
//     }
//   };

//   const handleCreateDoubt = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const form = event.target as HTMLFormElement;
//     const titleInput = form.querySelector('input[type="text"]') as HTMLInputElement;
//     const descriptionInput = form.querySelector('textarea') as HTMLTextAreaElement;

//     try {
//       const response = await doubtService.createDoubt(
//         params.courseId,
//         titleInput?.value || '',
//         descriptionInput?.value || ''
//       );
//       if (response.success) {
//         toast.success('Doubt created successfully');
//         // Reset form
//         titleInput.value = '';
//         descriptionInput.value = '';
//         fetchDoubts(); // Refresh doubts after creating
//       } else {
//         throw new Error(response.message || 'Failed to create doubt');
//       }
//     } catch (error) {
//       console.error('Error creating doubt:', error);
//       toast.error('Failed to create doubt');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="animate-spin h-8 w-8 text-white" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Doubts</h1>
//       {user?.role === 'educator' ? (
//         <div className="space-y-6">
//           {doubts.map((doubt) => (
//             <div key={doubt.id} className="bg-gray-800 p-4 rounded-lg">
//               <h2 className="text-xl font-semibold">{doubt.title}</h2>
//               <p className="text-gray-300 mt-2">{doubt.description}</p>
//               <div className="mt-4">
//                 <button
//                   onClick={() => setSelectedDoubtId(doubt.id)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Reply
//                 </button>
//               </div>
//               {selectedDoubtId === doubt.id && (
//                 <div className="mt-4">
//                   <textarea
//                     value={replyContent}
//                     onChange={(e) => setReplyContent(e.target.value)}
//                     className="w-full p-2 bg-gray-700 text-white rounded"
//                     placeholder="Type your reply here..."
//                   />
//                   <button
//                     onClick={() => handleReply(doubt.id)}
//                     className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                   >
//                     Send Reply
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div>
//           <form onSubmit={handleCreateDoubt} className="mb-8">
//             <input
//               type="text"
//               placeholder="Doubt title"
//               className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
//             />
//             <textarea
//               placeholder="Describe your doubt"
//               className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
//             />
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Create Doubt
//             </button>
//           </form>
//           <div className="space-y-6">
//             {doubts.filter(doubt => doubt.userId === user?.id).map((doubt) => (
//               <div key={doubt.id} className="bg-gray-800 p-4 rounded-lg">
//                 <h2 className="text-xl font-semibold">{doubt.title}</h2>
//                 <p className="text-gray-300 mt-2">{doubt.description}</p>
//                 {doubt.status === 'resolved' && (
//                   <div className="mt-4 bg-gray-700 p-3 rounded">
//                     <p className="font-semibold">Educator's Reply:</p>
//                     <p>{doubt.message}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import doubtService from '@/services/doubt.service';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Doubt } from '@/types';

export default function DoubtsPage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);

  useEffect(() => {
    fetchDoubts();
  }, [params.courseId]);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const response = await doubtService.getDoubtsByCourse(params.courseId);
      if (response.success) {
        setDoubts(response.doubts);
      } else {
        throw new Error(response.message || 'Failed to fetch doubts');
      }
    } catch (error) {
      console.error('Error fetching doubts:', error);
      toast.error('Failed to fetch doubts');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (doubtId: string) => {
    try {
      const response = await doubtService.replyToDoubt(doubtId, replyContent);
      if (response.success) {
        toast.success('Reply sent successfully');
        setReplyContent('');
        setSelectedDoubtId(null);
        // Use the courseId from the URL params directly
        await fetchDoubts(); // This will use params.courseId internally
      } else {
        throw new Error(response.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    }
  };

  const handleCreateDoubt = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const titleInput = form.querySelector('input[type="text"]') as HTMLInputElement;
    const descriptionInput = form.querySelector('textarea') as HTMLTextAreaElement;

    try {
      const response = await doubtService.createDoubt(
        params.courseId,
        titleInput?.value || '',
        descriptionInput?.value || ''
      );
      if (response.success) {
        toast.success('Doubt created successfully');
        // Reset form
        titleInput.value = '';
        descriptionInput.value = '';
        fetchDoubts(); // Refresh doubts after creating
      } else {
        throw new Error(response.message || 'Failed to create doubt');
      }
    } catch (error) {
      console.error('Error creating doubt:', error);
      toast.error('Failed to create doubt');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Doubts</h1>
      {user?.role === 'educator' ? (
        <div className="space-y-6">
          {doubts.map((doubt) => (
            <div key={doubt.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{doubt.title}</h2>
              <p className="text-gray-300 mt-2">{doubt.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedDoubtId(doubt.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Reply
                </button>
              </div>
              {selectedDoubtId === doubt.id && (
                <div className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    placeholder="Type your reply here..."
                  />
                  <button
                    onClick={() => handleReply(doubt.id)}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <form onSubmit={handleCreateDoubt} className="mb-8">
            <input
              type="text"
              placeholder="Doubt title"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <textarea
              placeholder="Describe your doubt"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Doubt
            </button>
          </form>
          <div className="space-y-6">
            {doubts.filter(doubt => doubt.userId === user?.id).map((doubt) => (
              <div key={doubt.id} className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{doubt.title}</h2>
                <p className="text-gray-300 mt-2">{doubt.description}</p>
                {doubt.status === 'resolved' && (
                  <div className="mt-4 bg-gray-700 p-3 rounded">
                    <p className="font-semibold">Educator's Reply:</p>
                    <p>{doubt.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
