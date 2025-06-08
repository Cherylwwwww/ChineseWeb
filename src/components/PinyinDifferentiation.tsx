import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface PinyinCard {
  pinyin: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

const pinyinCards: PinyinCard[] = [
  {
    pinyin: 'mā',
    meaning: 'mother',
    options: ['mother', 'hemp'],
    correctAnswer: 'mother'
  },
  {
    pinyin: 'má',
    meaning: 'hemp',
    options: ['mother', 'hemp'],
    correctAnswer: 'hemp'
  },
  // Add more cards as needed
];

const PinyinDifferentiation: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (answer: string) => {
    const correct = answer === pinyinCards[currentCard].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    // Move to next card after a delay
    setTimeout(() => {
      if (currentCard < pinyinCards.length - 1) {
        setCurrentCard(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  const playAudio = () => {
    // In a real implementation, this would play the corresponding audio file
    console.log('Playing audio for:', pinyinCards[currentCard].pinyin);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">Pinyin Differentiation</h3>
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-4xl font-medium">{pinyinCards[currentCard].pinyin}</span>
          <button
            onClick={playAudio}
            className="ml-4 p-2 rounded-full hover:bg-gray-100"
          >
            <Volume2 className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {pinyinCards[currentCard].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${selectedAnswer === option
                  ? isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinyinDifferentiation;