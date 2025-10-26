'use client';

import { Resource } from '@/lib/types';
import { Phone, Globe, Heart, X } from 'lucide-react';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const resources: Resource[] = [
  // Crisis Resources - Most Important
  {
    id: 'crisis-1',
    title: '988 Suicide & Crisis Lifeline',
    description: '24/7 free and confidential support for people in distress',
    type: 'hotline',
    phone: '988',
    category: 'crisis',
  },
  {
    id: 'crisis-2',
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741 - Free 24/7 support',
    type: 'hotline',
    phone: '741741',
    category: 'crisis',
  },
  {
    id: 'crisis-3',
    title: 'The Trevor Project',
    description: 'LGBTQ+ youth crisis support - Call, text, or chat 24/7',
    type: 'hotline',
    phone: '1-866-488-7386',
    category: 'crisis',
  },
  {
    id: 'crisis-4',
    title: 'RAINN (Rape, Abuse & Incest National Network)',
    description: 'Support for survivors of sexual assault - 24/7',
    type: 'hotline',
    phone: '1-800-656-4673',
    category: 'crisis',
  },
  // General Support
  {
    id: 'general-1',
    title: 'Teen Line',
    description: 'Teens helping teens. Call or text for peer support',
    type: 'hotline',
    phone: '1-800-852-8336',
    category: 'general',
  },
  {
    id: 'general-2',
    title: 'SAMHSA National Helpline',
    description: 'Free, confidential mental health and substance abuse referrals',
    type: 'hotline',
    phone: '1-800-662-4357',
    category: 'general',
  },
  {
    id: 'general-3',
    title: 'National Eating Disorders Association',
    description: 'Support for eating disorders and body image concerns',
    type: 'hotline',
    phone: '1-800-931-2237',
    category: 'general',
  },
  // Online Resources
  {
    id: 'website-1',
    title: 'Psychology Today - Find a Therapist',
    description: 'Search for therapists in your area',
    type: 'website',
    url: 'https://www.psychologytoday.com/us/therapists/adolescents',
    category: 'therapy',
  },
  {
    id: 'website-2',
    title: 'HelpGuide.org',
    description: 'Free mental health and wellness resources',
    type: 'website',
    url: 'https://www.helpguide.org',
    category: 'self-help',
  },
  {
    id: 'website-3',
    title: 'Cleveland Clinic - Understanding Stress',
    description: 'Comprehensive guide to understanding and managing stress',
    type: 'website',
    url: 'https://my.clevelandclinic.org/health/diseases/11874-stress',
    category: 'self-help',
  },
];

export default function ResourcesModal({ isOpen, onClose }: ResourcesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-500/95 via-pink-500/95 to-orange-400/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-purple-600 flex-shrink-0" />
            <h1 className="text-base sm:text-2xl font-bold text-gray-800 truncate">Support Resources</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors touch-manipulation cursor-pointer flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* General Support */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-100 p-3 rounded-xl">
              <div className="bg-blue-600 p-2 rounded-full">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-blue-900">Helplines & Support</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {resources.filter(r => r.category === 'general').map((resource) => (
                <div
                  key={resource.id}
                  className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-2 text-sm sm:text-base">
                        <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>{resource.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">{resource.description}</p>
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone}`}
                          className="inline-flex items-center mt-2 px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base touch-manipulation"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {resource.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Resources */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-purple-100 p-3 rounded-xl">
              <div className="bg-purple-600 p-2 rounded-full">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-purple-900">Online Resources</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {resources.filter(r => r.type === 'website').map((resource) => (
                <div
                  key={resource.id}
                  className="p-3 sm:p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-2 text-sm sm:text-base">
                        <Globe className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        <span>{resource.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">{resource.description}</p>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 px-3 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm touch-manipulation"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
              ℹ️ These resources are provided for support and information. Moodify is not a substitute for
              professional mental health care. <strong>If you're experiencing a mental health emergency, call 911
              or visit your nearest emergency room.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
