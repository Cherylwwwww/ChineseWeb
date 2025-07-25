import React, { useRef, useState, useEffect } from "react";

const WIDTH = 300;
const HEIGHT = 150;
const THRESHOLD = 20;
const START_X = 10;
const ICON_SIZE = 32;

const paths: Record<number, string> = {
  1: `M0,${HEIGHT / 2} L${WIDTH},${HEIGHT / 2}`,
  2: `M0,${HEIGHT} L${WIDTH},0`,
  3: `M0,0 L${WIDTH / 2},${HEIGHT} L${WIDTH},0`,
  4: `M0,0 L${WIDTH},${HEIGHT}`,
};

const audioPaths: Record<number, string> = {
  1: "/audio/ma1.mp3",
  2: "/audio/ma2.mp3",
  3: "/audio/ma3.mp3",
  4: "/audio/ma4.mp3",
};

const COLORS: Record<number, { path: string; dot: string }> = {
  1: { path: "#e74c3c", dot: "#c0392b" }, // red
  2: { path: "#3498db", dot: "#2980b9" }, // blue
  3: { path: "#2ecc71", dot: "#27ae60" }, // green
  4: { path: "#f1c40f", dot: "#f39c12" },
}; // yellow

// Pre-stored durations in seconds
const durations: Record<number, number> = {
  1: 0.770612,
  2: 0.927347,
  3: 0.666122,
  4: 0.561633,
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
  const [cursorX, setCursorX] = useState<number>(START_X);
  const [cursorY, setCursorY] = useState<number>(
    getToneY(selectedTone, START_X)
  );
  const [dragging, setDragging] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const audioRefs = useRef<Partial<Record<number, HTMLAudioElement>>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const dragStatsRef = useRef<{ lastX: number }>({ lastX: START_X });
  const pauseTimeoutRef = useRef<number | null>(null);

  // Preload audio elements
  useEffect(() => {
    for (let t = 1; t <= 4; t++) {
      const audio = new Audio(audioPaths[t]);
      audio.preload = "auto";
      audioRefs.current[t] = audio;
    }
  }, []);

  // Reset cursor and drag state
  const resetPosition = (tone: number = selectedTone) => {
    setCursorX(START_X);
    setCursorY(getToneY(tone, START_X));
    dragStatsRef.current.lastX = START_X;
  };

  // Stop any audio playback
  const clearAudio = () => {
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  // Show success feedback
  const handleSuccess = () => {
    setShowSuccess(true);
    clearAudio();
    setTimeout(() => {
      setShowSuccess(false);
      resetPosition(selectedTone);
    }, 2000);
  };

  // Show error feedback
  const indicateError = () => {
    setShowError(true);
    clearAudio();
    setTimeout(() => {
      setShowError(false);
      resetPosition();
    }, 1000);
  };

  // Play a segment from start up to the given X fraction after drag ends
  const playSegment = (x: number) => {
    clearAudio();
    const audio = audioRefs.current[selectedTone]!;
    currentAudioRef.current = audio;
    const fraction = Math.min(1, Math.max(0, x / WIDTH));
    const segmentMs = durations[selectedTone] * fraction * 1000;
    audio.currentTime = 0;
    audio.play().catch((err) => console.error("Playback error", err));
    pauseTimeoutRef.current = window.setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      pauseTimeoutRef.current = null;
    }, segmentMs);
  };

  // Mouse down: record start and begin drag (no sound here)
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || showSuccess || showError) return;
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
    setDragging(true);
    dragStatsRef.current.lastX = x0;
  };

  // Mouse move: update position but don't play
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging || showSuccess || showError || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svgRef.current.getScreenCTM()?.inverse();
    if (!ctm) return;
    const { x: svgX, y: svgY } = pt.matrixTransform(ctm);
    const x = Math.max(0, Math.min(WIDTH, svgX));
    const yUser = Math.max(0, Math.min(HEIGHT, svgY));
    const yTarget = getToneY(selectedTone, x);

    if (
      x < dragStatsRef.current.lastX ||
      Math.abs(yUser - yTarget) > THRESHOLD
    ) {
      setDragging(false);
      indicateError();
      return;
    }

    setCursorX(x);
    setCursorY(yTarget);
    dragStatsRef.current.lastX = x;
  };

  // Mouse up: end drag, play segment, then check success
  const handleMouseUp = () => {
    if (!dragging || showSuccess || showError) return;
    setDragging(false);
    const finalX = dragStatsRef.current.lastX;
    playSegment(finalX);
    if (finalX >= WIDTH * 0.8) {
      const segmentMs = durations[selectedTone] * (finalX / WIDTH) * 1000;
      setTimeout(() => {
        handleSuccess();
      }, segmentMs + 100);
    }
  };

  return (
    <div style={{ position: "relative", textAlign: "center", padding: "1rem" }}>
      <h3 className="text-2xl font-semibold mb-6 ">Tone Practice Game</h3>

      {/* Error Overlay */}
      {showError && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(231,76,60,0.9)",
            padding: "0.75rem 1.5rem",
            border: "2px solid #e74c3c",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Wrong direction!
          </p>
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(46,204,113,0.9)",
            padding: "1rem 2rem",
            border: "2px solid #2ecc71",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Correct!
          </p>
        </div>
      )}

      <div style={{ marginBottom: "0.5rem" }}>
        <label
          htmlFor="tone-select"
          style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}
          className="text-xl text-gray-600 mb-12"
        >
          Choose Tone:
        </label>
        <select
          id="tone-select"
          value={selectedTone}
          onChange={(e) => {
            const t = Number(e.target.value);
            setSelectedTone(t);
            setShowSuccess(false);
            setShowError(false);
            resetPosition(t);
            clearAudio();
          }}
        >
          {[1, 2, 3, 4].map((t) => (
            <option key={t} value={t} className="text-xl text-gray-600 mb-12">
              Tone {t}
            </option>
          ))}
        </select>
      </div>

      <svg
        ref={svgRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          display: "block",
          margin: "0 auto",
          border: `3px solid ${COLORS[selectedTone].path}`,
          borderRadius: "8px",
          background: "#fff",
          cursor: showSuccess || showError ? "not-allowed" : "pointer",
          pointerEvents: showSuccess || showError ? "none" : "auto",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <path
          d={paths[selectedTone]}
          stroke={COLORS[selectedTone].path}
          strokeWidth={4}
          fill="none"
        />
        <image
          href="/icons/pacman.png"
          x={cursorX - ICON_SIZE / 2}
          y={cursorY - ICON_SIZE / 2}
          width={ICON_SIZE}
          height={ICON_SIZE}
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>

      <p className="text-xl text-gray-600 mb-12">
        Drag the dot along the path to practice Tone {selectedTone}.
      </p>
    </div>
  );
};

export default VoiceControlGame;
