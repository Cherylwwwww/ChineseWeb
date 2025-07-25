import React, { useRef, useState, useEffect } from "react";

const WIDTH = 300;
const HEIGHT = 150;
const THRESHOLD = 20;

const paths: Record<number, string> = {
  1: `M0,${HEIGHT / 2} L${WIDTH},${HEIGHT / 2}`,
  2: `M0,${HEIGHT} L${WIDTH},0`,
  3: `M0,0 L${WIDTH / 2},${HEIGHT} L${WIDTH},0`,
  4: `M0,0 L${WIDTH},${HEIGHT}`,
};

// Local audio file URLs for each tone
const audioPaths: Record<number, string> = {
  1: "/audio/ma1.mp3",
  2: "/audio/ma2.mp3",
  3: "/audio/ma3.mp3",
  4: "/audio/ma4.mp3",
};

const getToneY = (tone: number, x: number): number => {
  switch (tone) {
    case 1:
      return HEIGHT / 2;
    case 2:
      return HEIGHT - (x / WIDTH) * HEIGHT;
    case 3:
      return x <= WIDTH / 2
        ? (x / (WIDTH / 2)) * HEIGHT
        : HEIGHT - ((x - WIDTH / 2) / (WIDTH / 2)) * HEIGHT;
    case 4:
      return (x / WIDTH) * HEIGHT;
    default:
      return HEIGHT / 2;
  }
};

const VoiceControlGame: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState<number>(1);
  const [cursorX, setCursorX] = useState<number>(0);
  const [cursorY, setCursorY] = useState<number>(getToneY(1, 0));
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [dragging, setDragging] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const audioRefs = useRef<Partial<Record<number, HTMLAudioElement>>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragStatsRef = useRef<{ lastX: number; lastTime: number }>({
    lastX: 0,
    lastTime: performance.now(),
  });

  // Preload MP3s
  useEffect(() => {
    for (let t = 1; t <= 4; t++) {
      const audio = new Audio(audioPaths[t]);
      audio.preload = "auto";
      audio.loop = true;
      audioRefs.current[t] = audio;
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM()?.inverse();
    if (!ctm) return;
    const { x: svgX } = pt.matrixTransform(ctm);
    const x0 = Math.max(0, Math.min(WIDTH, svgX));
    const y0 = getToneY(selectedTone, x0);

    setCursorX(x0);
    setCursorY(y0);
    setIsCorrect(true);
    setDragging(true);

    // Start audio playback
    const audio = audioRefs.current[selectedTone]!;
    currentAudioRef.current = audio;
    audio.currentTime = 0;
    audio.play().catch((err) => console.error("Playback error", err));

    // Initialize drag stats
    dragStatsRef.current.lastX = x0;
    dragStatsRef.current.lastTime = performance.now();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM()?.inverse();
    if (!ctm) return;
    const { x: svgX, y: svgY } = pt.matrixTransform(ctm);
    const x = Math.max(0, Math.min(WIDTH, svgX));
    const yUser = Math.max(0, Math.min(HEIGHT, svgY));
    const yTarget = getToneY(selectedTone, x);
    const correct = Math.abs(yUser - yTarget) < THRESHOLD;

    if (!correct) {
      setIsCorrect(false);
      setDragging(false);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
      setCursorX(0);
      setCursorY(getToneY(selectedTone, 0));
      return;
    }

    setIsCorrect(true);
    setCursorX(x);
    setCursorY(yTarget);

    // Adjust playbackRate based on drag speed
    if (currentAudioRef.current) {
      const audio = currentAudioRef.current;
      const now = performance.now();
      const dx = x - dragStatsRef.current.lastX;
      const dt = now - dragStatsRef.current.lastTime;
      const speed = dt > 0 ? dx / dt : 0;
      const rate = Math.min(Math.max(speed * 0.05 + 1, 0.5), 2);
      audio.playbackRate = rate;
      dragStatsRef.current.lastX = x;
      dragStatsRef.current.lastTime = now;
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h2>Tone Practice Game</h2>
      <div style={{ marginBottom: "0.5rem" }}>
        <label htmlFor="tone-select">Choose Tone: </label>
        <select
          id="tone-select"
          value={selectedTone}
          onChange={(e) => {
            const t = Number(e.target.value);
            setSelectedTone(t);
            setCursorX(10);
            setCursorY(getToneY(t, 10));
            setIsCorrect(true);
            setDragging(false);
            if (currentAudioRef.current) {
              currentAudioRef.current.pause();
              currentAudioRef.current.currentTime = 0;
              currentAudioRef.current = null;
            }
          }}
        >
          {[1, 2, 3, 4].map((t) => (
            <option key={t} value={t}>
              Tone {t}
            </option>
          ))}
        </select>
      </div>
      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: "1px solid #ccc", cursor: "pointer" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <path
          d={paths[selectedTone]}
          stroke="#aaa"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={cursorX}
          cy={cursorY}
          r={8}
          fill={isCorrect ? "green" : "red"}
        />
        {!isCorrect && (
          <text
            x={cursorX}
            y={cursorY - 15}
            textAnchor="middle"
            fill="red"
            fontSize="24"
          >
            ✕
          </text>
        )}
      </svg>
      <p>Drag the dot along the path to practice Tone {selectedTone}.</p>
      {!isCorrect && (
        <p style={{ color: "red" }}>Wrong path! Try to follow the line.</p>
      )}
    </div>
  );
};

export default VoiceControlGame;
