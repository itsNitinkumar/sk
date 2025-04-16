// import { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { doubtService } from '@/services/doubt.service';

// interface DoubtFormProps {
//   courseId: string;
//   onDoubtCreated?: () => void;
// }

// export default function DoubtForm({ courseId, onDoubtCreated }: DoubtFormProps) {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim() || !description.trim()) {
//       toast.error('Please fill in all fields');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await doubtService.createDoubt(courseId, title, description);
//       console.log('Doubt creation response:', response); // Debug log
//       if (response.success) {
//         toast.success('Doubt posted successfully');
//         setTitle('');
//         setDescription('');
//         onDoubtCreated?.();
//       } else {
//         throw new Error(response.message || 'Failed to create doubt');
//       }
//     } catch (error: any) {
//       console.error('Error creating doubt:', error);
//       toast.error(error.response?.data?.message || 'Failed to post doubt');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg">
//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
//           Title
//         </label>
//         <input
//           type="text"
//           id="title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//           placeholder="Enter your doubt title"
//           minLength={5}
//           required
//         />
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
//           Description
//         </label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
//           rows={4}
//           placeholder="Describe your doubt in detail"
//           minLength={20}
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//       >
//         {isSubmitting ? 'Posting...' : 'Post Doubt'}
//       </button>
//     </form>
//   );
// }
