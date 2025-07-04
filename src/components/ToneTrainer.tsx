import React, { useState, useRef, useEffect } from "react";

type ContourPoint = [number, number];
const AudioURLs: Record<number, string> = {
  1: "https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3/a1.mp3",
  2: "https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3/a2.mp3",
  3: "https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3/a3.mp3",
  4: "https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3/a4.mp3",
};
const ToneProfiles: Record<number, { label: string; contour: ContourPoint[] }> =
  {
    1: {
      label: "Tone 1 (ā) - High-level",
      contour: [
        [0, 0.8],
        [1, 0.8],
      ],
    },
    2: {
      label: "Tone 2 (á) - Rising",
      contour: [
        [0, 0.3],
        [1, 0.8],
      ],
    },
    3: {
      label: "Tone 3 (ǎ) - Fall-Rise",
      contour: [
        [0, 0.8],
        [0.5, 0.2],
        [1, 0.8],
      ],
    },
    4: {
      label: "Tone 4 (à) - Falling",
      contour: [
        [0, 0.8],
        [1, 0.3],
      ],
    },
  };
const WIDTH = 300;
const HEIGHT = 200;
const ERROR_THRESHOLD = 0.1; // tighter
const PLAY_THROTTLE = 100; // ms

// Extend Window for prefixed
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
type AudioCtxType = typeof AudioContext;

const ToneTrainer: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState(1);
  const [path, setPath] = useState<ContourPoint[]>([]);
  const [wrong, setWrong] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferMapRef = useRef<Record<number, AudioBuffer>>(
    {} as Record<number, AudioBuffer>
  );

  const lastPlayRef = useRef<number>(0);

  useEffect(() => {
    const AudioCtxConstructor: AudioCtxType =
      window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtxConstructor();
    audioCtxRef.current = ctx;
    // load all buffers
    Object.entries(AudioURLs).forEach(([tone, url]) => {
      fetch(url)
        .then((r) => r.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((buf) => {
          bufferMapRef.current[Number(tone)] = buf;
        })
        .catch(console.error);
    });
    return () => {
      ctx.close();
    };
  }, []);

  const resetDraw = () => {
    setWrong(false);
    setPath([]);
  };

  const getExpectedY = (t: number): number => {
    const contour = ToneProfiles[selectedTone].contour;
    let yi = contour[0][1];
    for (let j = 1; j < contour.length; j++) {
      const [x0, y0] = contour[j - 1];
      const [x1, y1] = contour[j];
      if (t >= x0 && t <= x1) {
        const r = (t - x0) / (x1 - x0);
        yi = y0 + r * (y1 - y0);
        break;
      }
    }
    return yi;
  };

  const playSegment = (y: number) => {
    const now = Date.now();
    if (now - lastPlayRef.current < PLAY_THROTTLE) return;
    lastPlayRef.current = now;
    const ctx = audioCtxRef.current!;
    const buf = bufferMapRef.current[selectedTone];
    if (!buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const rate = 0.8 + (1 - y / HEIGHT) * 0.4;
    src.playbackRate.value = rate;
    const gain = ctx.createGain();
    gain.gain.value = 1;
    src.connect(gain).connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.15);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (wrong) resetDraw();
    setPath([]);
    svgRef.current?.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!svgRef.current || wrong) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, WIDTH));
    const y = Math.max(0, Math.min(e.clientY - rect.top, HEIGHT));
    const t = x / WIDTH;
    const yNorm = 1 - y / HEIGHT;
    const expected = getExpectedY(t);
    if (Math.abs(yNorm - expected) > ERROR_THRESHOLD) {
      setWrong(true);
      setPath([]);
      return;
    }
    setPath((prev) => [...prev, [x, y]]);
    playSegment(y);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  const renderPath = () => {
    if (!path.length) return null;
    const d = path.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
    return <path d={d} stroke="#333" strokeWidth={2} fill="none" />;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Mandarin Tone Trainer</h2>
      <div className="mb-4">
        {Object.entries(ToneProfiles).map(([k, v]) => (
          <button
            key={k}
            onClick={() => {
              setSelectedTone(Number(k));
              resetDraw();
            }}
            className={`mr-2 mb-2 px-3 py-1 rounded-full ${
              Number(k) === selectedTone
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        className="border bg-white touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <polyline
          points={ToneProfiles[selectedTone].contour
            .map(([x, y]) => `${x * WIDTH},${(1 - y) * HEIGHT}`)
            .join(" ")}
          stroke="lightgray"
          strokeWidth={2}
          fill="none"
          strokeDasharray="4 2"
        />
        {renderPath()}
        {wrong && (
          <text
            x={WIDTH / 2}
            y={HEIGHT / 2}
            fill="red"
            fontSize="48"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            ✕
          </text>
        )}
      </svg>
    </div>
  );
};

export default ToneTrainer;
