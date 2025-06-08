import React, { useState } from 'react';

interface Character {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
}

const characters: Character[] = [
  { id: '1', character: '爱', pinyin: 'ài', meaning: 'love' },
  { id: '2', character: '好', pinyin: 'hǎo', meaning: 'good' },
  { id: '3', character: '学', pinyin: 'xué', meaning: 'study' },
  // Add more characters as needed
];

const CharacterMatching: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setSelectedCharacter(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (selectedCharacter === targetId) {
      setMatchedPairs(prev => [...prev, selectedCharacter]);
    }
    setSelectedCharacter(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">Character Matching</h3>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          {characters.map(char => (
            <div
              key={char.id}
              draggable={!matchedPairs.includes(char.id)}
              onDragStart={(e) => handleDragStart(e, char.id)}
              className={`
                p-4 border-2 rounded-lg text-center cursor-move
                ${matchedPairs.includes(char.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-red-500'
                }
              `}
            >
              <span className="text-4xl">{char.character}</span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {characters.map(char => (
            <div
              key={char.id}
              onDrop={(e) => handleDrop(e, char.id)}
              onDragOver={handleDragOver}
              className={`
                p-4 border-2 rounded-lg
                ${matchedPairs.includes(char.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-dashed border-gray-200'
                }
              `}
            >
              <p className="font-medium">{char.pinyin}</p>
              <p className="text-gray-600">{char.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterMatching;