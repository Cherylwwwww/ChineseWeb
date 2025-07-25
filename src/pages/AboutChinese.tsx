import React from "react";
import ToneRecognitionGame from "../components/ToneRecognitionGame";
import PinyinDifferentiation from "../components/PinyinDifferentiation";
import CharacterMatching from "../components/CharacterMatching";

const AboutChinese: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Interactive Chinese Learning
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Explore the fascinating aspects of Chinese language through our
          interactive learning tools. Master tones, practice pronunciation, and
          learn characters through engaging exercises.
        </p>

        <div className="space-y-12">
          <ToneRecognitionGame />

          <PinyinDifferentiation />
          <CharacterMatching />
        </div>
      </div>
    </div>
  );
};

export default AboutChinese;
