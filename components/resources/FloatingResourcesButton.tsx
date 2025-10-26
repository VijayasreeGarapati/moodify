'use client';

import { Heart, Phone } from 'lucide-react';

interface FloatingResourcesButtonProps {
  onResourcesClick: () => void;
  onCrisisClick: () => void;
}

export default function FloatingResourcesButton({ onResourcesClick, onCrisisClick }: FloatingResourcesButtonProps) {
  return (
    <>
      {/* Mobile & Tablet (< 1280px): Bottom Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-2xl">
        <div className="px-3 py-2.5 flex items-center gap-2.5 max-w-md mx-auto">
          {/* Resources Button */}
          <button
            onClick={onResourcesClick}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer"
            aria-label="View Support Resources"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            <span className="text-sm">Resources</span>
          </button>

          {/* Crisis Support Button */}
          <button
            onClick={onCrisisClick}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer"
            aria-label="Crisis Support - Call Now"
          >
            <Phone className="w-5 h-5" fill="currentColor" />
            <span className="text-sm">Crisis Help</span>
          </button>
        </div>
      </div>

      {/* Desktop (>= 1280px): FABs on opposite sides - Resources left, Crisis right */}
      <>
        {/* Resources Button - Bottom Left */}
        <button
          onClick={onResourcesClick}
          className="hidden xl:flex group/resources fixed bottom-6 left-6 items-center justify-center gap-0 px-5 py-3.5 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-40"
          aria-label="View Support Resources"
        >
          <Heart className="w-6 h-6 flex-shrink-0" fill="currentColor" />
          <span className="text-sm font-semibold whitespace-nowrap overflow-hidden max-w-0 group-hover/resources:max-w-[100px] group-hover/resources:ml-2 transition-all duration-300 ease-in-out">
            Resources
          </span>
        </button>

        {/* Crisis Support Button - Bottom Right */}
        <button
          onClick={onCrisisClick}
          className="hidden xl:flex group/crisis fixed bottom-6 right-6 items-center justify-center gap-0 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-40"
          aria-label="Crisis Support - Call Now"
        >
          <Phone className="w-6 h-6 flex-shrink-0" fill="currentColor" />
          <span className="text-sm font-bold whitespace-nowrap overflow-hidden max-w-0 group-hover/crisis:max-w-[120px] group-hover/crisis:ml-2 transition-all duration-300 ease-in-out">
            Crisis Help
          </span>
        </button>
      </>
    </>
  );
}
