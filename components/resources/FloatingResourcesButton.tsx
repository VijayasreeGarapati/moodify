'use client';

import { Heart, Phone } from 'lucide-react';

interface FloatingResourcesButtonProps {
  onResourcesClick: () => void;
  onCrisisClick: () => void;
}

export default function FloatingResourcesButton({ onResourcesClick, onCrisisClick }: FloatingResourcesButtonProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-t border-purple-200/50 shadow-2xl">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto">
          {/* Action Buttons Row - Consistent across all devices */}
          <div className="flex items-center justify-center gap-3">
            {/* Resources Button */}
            <button
              onClick={onResourcesClick}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation"
              aria-label="View Support Resources"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              <span className="text-sm sm:text-base">Resources</span>
            </button>

            {/* Crisis Support Button */}
            <button
              onClick={onCrisisClick}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation"
              aria-label="Crisis Support - Call Now"
            >
              <Phone className="w-5 h-5" fill="currentColor" />
              <span className="text-sm sm:text-base">Crisis Help</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
