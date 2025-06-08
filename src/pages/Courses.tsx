import React from 'react';
import { BookOpen, Clock, Users, Trophy } from 'lucide-react';

const Courses: React.FC = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Chinese Courses</h1>
        
        {/* Course Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Beginner Level</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Basic pronunciation and tones</li>
              <li>• Essential characters (150+)</li>
              <li>• Simple conversations</li>
              <li>• Cultural introduction</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Intermediate Level</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Advanced grammar patterns</li>
              <li>• Business Chinese</li>
              <li>• Extended vocabulary (500+)</li>
              <li>• Reading comprehension</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Advanced Level</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Complex conversations</li>
              <li>• Literary Chinese</li>
              <li>• Cultural deep-dive</li>
              <li>• HSK preparation</li>
            </ul>
          </div>
        </div>

        {/* Course Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-semibold mb-8">Course Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Flexible Schedule</h3>
                <p className="text-gray-600">Choose from morning, afternoon, or evening sessions that fit your schedule.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Users className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Small Groups</h3>
                <p className="text-gray-600">Maximum 6 students per class for optimal learning experience.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <BookOpen className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Custom Materials</h3>
                <p className="text-gray-600">Tailored learning materials based on your interests and goals.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Trophy className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">HSK Preparation</h3>
                <p className="text-gray-600">Structured preparation for official HSK certification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Basic Package</h3>
            <p className="text-4xl font-bold mb-6">$299<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>• 8 group lessons</li>
              <li>• Basic learning materials</li>
              <li>• Online practice exercises</li>
              <li>• Progress tracking</li>
            </ul>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Get Started
            </button>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-4">Premium Package</h3>
            <p className="text-4xl font-bold mb-6">$499<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>• 12 group lessons</li>
              <li>• 2 private lessons</li>
              <li>• Premium study materials</li>
              <li>• Cultural workshops</li>
              <li>• HSK preparation materials</li>
            </ul>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Get Started
            </button>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">VIP Package</h3>
            <p className="text-4xl font-bold mb-6">$899<span className="text-lg text-gray-600">/month</span></p>
            <ul className="space-y-3 mb-8 text-gray-600">
              <li>• 8 private lessons</li>
              <li>• Customized curriculum</li>
              <li>• All premium materials</li>
              <li>• Priority scheduling</li>
              <li>• Direct teacher contact</li>
              <li>• Cultural immersion events</li>
            </ul>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;