import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function StudentDoubtView({ doubts }) {
  return (
    <div className="space-y-6">
      {doubts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          You haven't asked any doubts yet.
        </div>
      ) : (
        doubts.map((doubt) => (
          <div key={doubt.id} className="bg-gray-800 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">{doubt.title}</h3>
              <p className="text-gray-400 mt-2">{doubt.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  doubt.status === 'answered' || doubt.status === 'resolved'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {doubt.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(doubt.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Show messages section */}
            {doubt.messages && doubt.messages.length > 0 && (
              <div className="mt-4 space-y-4">
                {doubt.messages.map((message, index) => (
                  <div 
                    key={message.id || index}
                    className="bg-blue-900/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-blue-400">
                        {message.isResponse ? "Educator's Response" : "Your Message"}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{message.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}



