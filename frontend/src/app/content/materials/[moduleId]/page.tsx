// 'use client'
// import { useState, useEffect } from 'react'
// import ContentService from '@/services/content.service'
// import { FileText, Download, Eye } from 'lucide-react'

// export default function StudyMaterialsPage({ params }: { params: { moduleId: string } }) {
//     const [materials, setMaterials] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchMaterials();
//     }, [params.moduleId]);

//     const fetchMaterials = async () => {
//         try {
//             const response = await ContentService.getModuleStudyMaterials(params.moduleId);
//             if (response.success) {
//                 setMaterials(response.data);
//             }
//         } catch (error) {
//             console.error('Failed to fetch materials:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8">Study Materials</h1>
            
//             {loading ? (
//                 <div className="flex justify-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                 </div>
//             ) : materials.length === 0 ? (
//                 <div className="text-center text-gray-400 py-8">
//                     No study materials available for this module.
//                 </div>
//             ) : (
//                 <div className="grid gap-4">
//                     {materials.map((material) => (
//                         <div 
//                             key={(material as { id: string }).id}
//                             className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
//                         >
//                             <div className="flex items-center gap-3 flex-1">
//                                 <div className="p-2 bg-blue-500/10 rounded-lg">
//                                     <FileText className="w-6 h-6 text-blue-500" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3 className="font-medium text-lg">{(material as { title: string }).title}</h3>
//                                     <p className="text-sm text-gray-400">{(material as { description?: string }).description}</p>
//                                     <div className="flex items-center gap-2 mt-1">
//                                         <span className="text-xs bg-gray-700 px-2 py-1 rounded">
//                                             {(material as { type: string }).type}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {(material as { size?: number })?.size && `${((material as { size: number }).size / (1024 * 1024)).toFixed(2)} MB`}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={() => window.open((material as { fileUrl: string }).fileUrl, '_blank')}
//                                     className="p-2 hover:bg-gray-600 rounded-full transition-colors"
//                                     title="Preview"
//                                 >
//                                     <Eye className="w-5 h-5 text-gray-400 hover:text-white" />
//                                 </button>
//                                 <a 
//                                     href={(material as { fileUrl: string }).fileUrl}
//                                     download
//                                     className="p-2 hover:bg-gray-600 rounded-full transition-colors"
//                                     title="Download"
//                                 >
//                                     <Download className="w-5 h-5 text-gray-400 hover:text-white" />
//                                 </a>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }







