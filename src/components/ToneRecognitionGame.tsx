import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface ToneCard {
  id: number;
  tone: number;
  pinyin: string;
  example: string;
  color: string;
}

const toneCards: ToneCard[] = [
  { id: 1, tone: 1, pinyin: 'ā', example: 'high level', color: '#e74c3c' },
  { id: 2, tone: 2, pinyin: 'á', example: 'rising', color: '#3498db' },
  { id: 3, tone: 3, pinyin: 'ǎ', example: 'falling-rising', color: '#2ecc71' },
  { id: 4, tone: 4, pinyin: 'à', example: 'falling', color: '#f39c12' },
];

const ToneRecognitionGame: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;

    // Check microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setHasPermission(true);
        mediaStreamRef.current = stream;
      })
      .catch(() => {
        setHasPermission(false);
      });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async (toneId: number) => {
    if (!mediaStreamRef.current || !audioContextRef.current || !analyserRef.current) return;

    setSelectedTone(toneId);
    const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
    source.connect(analyserRef.current);
    
    setIsRecording(true);
    analyzeTone();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setSelectedTone(null);
  };

  const analyzeTone = () => {
    if (!analyserRef.current || !isRecording) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    // Calculate accuracy based on tone analysis
    const currentAccuracy = calculateAccuracy(dataArray, selectedTone!);
    setAccuracy(currentAccuracy);

    if (isRecording) {
      requestAnimationFrame(analyzeTone);
    }
  };

  const calculateAccuracy = (dataArray: Uint8Array, tone: number): number => {
    // Simplified accuracy calculation
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += Math.abs(dataArray[i] - 128) / 128;
    }
    const avgDeviation = sum / dataArray.length;
    return Math.max(0, Math.min(1, 1 - avgDeviation));
  };

  const playReferenceTone = (tone: number) => {
    // In a real implementation, this would play a pre-recorded reference tone
    console.log(`Playing reference tone ${tone}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold mb-6">Tone Recognition</h3>
      
      {/* Tone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {toneCards.map(card => (
          <div
            key={card.id}
            className="p-4 rounded-lg border-2"
            style={{ borderColor: card.color }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-3xl font-medium">{card.pinyin}</span>
                <span className="text-lg ml-2 text-gray-600">{card.example}</span>
              </div>
              <button
                onClick={() => playReferenceTone(card.tone)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Volume2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={() => isRecording ? stopRecording() : startRecording(card.tone)}
              disabled={!hasPermission || (isRecording && selectedTone !== card.tone)}
              className={`
                w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium
                ${isRecording && selectedTone === card.tone
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }
                ${(!hasPermission || (isRecording && selectedTone !== card.tone)) && 'opacity-50 cursor-not-allowed'}
              `}
            >
              {isRecording && selectedTone === card.tone ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Record
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Accuracy Display */}
      {isRecording && (
        <div className="text-center">
          <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
            <span className="font-medium">Accuracy: </span>
            <span className="text-blue-600">{Math.round(accuracy * 100)}%</span>
          </div>
        </div>
      )}

      {!hasPermission && (
        <div className="text-center text-gray-600">
          Microphone access is required for tone recognition.
          Please allow microphone access to use this feature.
        </div>
      )}
    </div>
  );
};

export default ToneRecognitionGame;