'use client';

import { Resource } from '@/lib/types';
import { Phone, Globe, Book, Heart, X } from 'lucide-react';

interface ResourcesScreenProps {
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

export default function ResourcesScreen({ onClose }: ResourcesScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/moodify-logo.svg"
              alt="Moodify Logo"
              className="w-10 h-10"
            />
            <h1 className="text-3xl font-bold text-gray-800">Support Resources</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Crisis Resources */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Phone className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Crisis Support</h2>
          </div>
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl mb-4">
            <p className="text-red-800 font-medium text-center">
              If you're in crisis or thinking about self-harm, please reach out for help immediately.
              You're not alone, and there are people who care.
            </p>
          </div>
          <div className="space-y-3">
            {resources.filter(r => r.category === 'crisis').map((resource) => (
              <div
                key={resource.id}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-red-600" />
                      <span>{resource.title}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-block mt-2 text-red-600 font-semibold hover:text-red-700 text-lg"
                      >
                        {resource.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Support */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Phone className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Helplines & Support</h2>
          </div>
          <div className="space-y-3">
            {resources.filter(r => r.category === 'general').map((resource) => (
              <div
                key={resource.id}
                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>{resource.title}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-block mt-2 text-blue-600 font-semibold hover:text-blue-700"
                      >
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Online Resources</h2>
          </div>
          <div className="space-y-3">
            {resources.filter(r => r.type === 'website').map((resource) => (
              <div
                key={resource.id}
                className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span>{resource.title}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-purple-600 font-semibold hover:text-purple-700"
                      >
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
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <p className="text-sm text-gray-600 text-center">
            These resources are provided for support and information. Moodify is not a substitute for
            professional mental health care. If you're experiencing a mental health emergency, call 911
            or visit your nearest emergency room.
          </p>
        </div>
      </div>
    </div>
  );
}
