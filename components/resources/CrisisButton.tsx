'use client';

import { Phone, X } from 'lucide-react';

interface CrisisButtonProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrisisButton({ isOpen, onClose }: CrisisButtonProps) {

  const crisisNumbers = [
    { name: '988 Lifeline', number: '988', description: 'Suicide & Crisis Lifeline' },
    { name: 'Crisis Text', number: '741741', description: 'Text HOME to 741741' },
    { name: 'Trevor Project', number: '1-866-488-7386', description: 'LGBTQ+ Youth Support' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-orange-400/95 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div className="bg-white p-2 rounded-full flex-shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold truncate">Crisis Support</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-700 rounded-lg transition-colors touch-manipulation cursor-pointer flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-100 text-sm">
            You're not alone. Help is available 24/7.
          </p>
        </div>

        {/* Crisis Numbers */}
        <div className="p-4 sm:p-6 space-y-3">
          {crisisNumbers.map((crisis) => (
            <a
              key={crisis.number}
              href={`tel:${crisis.number}`}
              className="block p-4 bg-red-50 border-2 border-red-300 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">{crisis.name}</h3>
                  <p className="text-sm text-gray-600">{crisis.description}</p>
                </div>
                <div className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{crisis.number}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 911 Warning */}
        <div className="p-4 sm:p-6 bg-red-50 border-t-2 border-red-200">
          <p className="text-center text-sm text-red-900 font-semibold">
            ⚠️ If this is a life-threatening emergency, call <a href="tel:911" className="underline font-bold">911</a> immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
