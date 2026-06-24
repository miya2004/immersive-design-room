import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const portraits = [
  {
    url: "https://images.unsplash.com/photo-1534143826428-81fc61582afd?w=320&h=420&fit=crop&auto=format",
    alt: "Woman with natural skin",
    caption: "Every mark tells a story",
    row: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1607749091702-1bab1be215a4?w=320&h=380&fit=crop&auto=format",
    alt: "Woman wearing white-framed glasses",
    caption: "Vision is clarity",
    row: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1758874384719-5a157c27b092?w=320&h=420&fit=crop&auto=format",
    alt: "Young woman with curly hair",
    caption: "Texture is texture",
    row: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=320&h=400&fit=crop&auto=format",
    alt: "Man in collared shirt",
    caption: "Presence speaks",
    row: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=320&h=360&fit=crop&auto=format",
    alt: "Smiling man with glasses and beard",
    caption: "Joy is unconditional",
    row: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=320&h=400&fit=crop&auto=format",
    alt: "Man with black-framed glasses",
    caption: "Intelligence shines through",
    row: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1525786210598-d527194d3e9a?w=320&h=380&fit=crop&auto=format",
    alt: "Woman with black-framed glasses",
    caption: "You see clearly",
    row: 3,
  },
  {
    url: "https://images.unsplash.com/photo-1674932668403-33398b81c92f?w=320&h=360&fit=crop&auto=format",
    alt: "Woman close-up portrait",
    caption: "Softness is strength",
    row: 3,
  },
  {
    url: "https://images.unsplash.com/photo-1758874384753-b9672af6b063?w=320&h=400&fit=crop&auto=format",
    alt: "Young woman with curly hair smiling",
    caption: "A smile that begins within",
    row: 3,
  },
];

const floatingNotes = [
  { text: "Your skin tells your story.", x: 6, delay: 0, rot: -3 },
  { text: "Beauty is not a standard.", x: 22, delay: 2.2, rot: 2 },
  { text: "You are more than a reflection.", x: 41, delay: 0.7, rot: -1 },
  { text: "Scars are maps of survival.", x: 59, delay: 1.8, rot: 3 },
  { text: "Freckles are constellations.", x: 74, delay: 3.1, rot: -2 },
  { text: "You are seen.", x: 14, delay: 4.2, rot: 1 },
  { text: "Your features belong to you.", x: 50, delay: 2.8, rot: -4 },
  { text: "Whole. Enough. Here.", x: 84, delay: 1.3, rot: 2 },
  { text: "The mirror lies. People don't.", x: 30, delay: 3.7, rot: -1 },
  { text: "You are complete.", x: 66, delay: 0.4, rot: 3 },
  { text: "Every face is the right face.", x: 10, delay: 5.1, rot: -2 },
  { text: "There is no flaw in being human.", x: 78, delay: 4.6, rot: 1 },
];

const stationLabels = [
  "01 — Introduction",
  "02 — Capture",
  "03 — Reflection",
  "04 — Perspective",
  "05 — Mirror",
];

export default function App() {
  const [station, setStation] = useState(0);
  const [insecurities, setInsecurities] = useState(["", "", ""]);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | "flash" | null>(null);
  const [brightness, setBrightness] = useState(8);
  const [notesActive, setNotesActive] = useState(false);
  const [finalPhase, setFinalPhase] = useState<"all" | "isolate" | "message" | "cross">("all");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch {
      // silently fall through — fake camera experience kicks in
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const captureFakePhoto = useCallback(() => {
    if (!canvasRef.current) return;
    const cvs = canvasRef.current;
    cvs.width = 480;
    cvs.height = 480;
    const ctx = cvs.getContext("2d")!;
    // Background: deep dark radial
    const bg = ctx.createRadialGradient(240, 160, 20, 240, 240, 260);
    bg.addColorStop(0, "#18130c");
    bg.addColorStop(0.5, "#0d0b08");
    bg.addColorStop(1, "#060606");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 480, 480);
    // Warm spotlight from above
    const spot = ctx.createRadialGradient(240, 60, 0, 240, 100, 220);
    spot.addColorStop(0, "rgba(201,169,110,0.18)");
    spot.addColorStop(0.5, "rgba(201,169,110,0.05)");
    spot.addColorStop(1, "rgba(201,169,110,0)");
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, 480, 480);
    // Silhouette — head
    ctx.fillStyle = "rgba(8,6,4,0.92)";
    ctx.beginPath();
    ctx.arc(240, 158, 62, 0, Math.PI * 2);
    ctx.fill();
    // Silhouette — shoulders/torso
    ctx.beginPath();
    ctx.ellipse(240, 360, 110, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    // Neck
    ctx.beginPath();
    ctx.roundRect(220, 210, 40, 50, 4);
    ctx.fill();
    // Subtle rim light on silhouette edges
    const rim = ctx.createRadialGradient(240, 158, 45, 240, 158, 68);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.85, "rgba(0,0,0,0)");
    rim.addColorStop(1, "rgba(201,169,110,0.12)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(240, 158, 68, 0, Math.PI * 2);
    ctx.fill();
    setCapturedPhoto(cvs.toDataURL("image/jpeg", 0.92));
  }, []);

  const beginCountdown = useCallback(() => {
    setCountdown(3);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === "flash") {
      const t = setTimeout(() => {
        if (cameraReady && videoRef.current && canvasRef.current) {
          const vid = videoRef.current;
          const cvs = canvasRef.current;
          cvs.width = vid.videoWidth || 640;
          cvs.height = vid.videoHeight || 480;
          const ctx = cvs.getContext("2d");
          if (ctx) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(vid, -cvs.width, 0, cvs.width, cvs.height);
            ctx.restore();
            setCapturedPhoto(cvs.toDataURL("image/jpeg", 0.92));
          }
        } else {
          captureFakePhoto();
        }
        stopCamera();
        setCountdown(null);
        setStation(2);
      }, 400);
      return () => clearTimeout(t);
    }
    if (typeof countdown === "number" && countdown > 0) {
      const t = setTimeout(() => {
        setCountdown((c) => (typeof c === "number" ? c - 1 : c));
      }, 1000);
      return () => clearTimeout(t);
    }
    if (countdown === 0) {
      setCountdown("flash");
    }
  }, [countdown, cameraReady, captureFakePhoto, stopCamera]);

  useEffect(() => {
    if (station === 1) {
      setCountdown(null);
      startCamera();
    } else {
      stopCamera();
    }
  }, [station]);

  useEffect(() => {
    if (station === 3) {
      setBrightness(8);
      setNotesActive(false);
      const brightTimer = setInterval(() => {
        setBrightness((b) => {
          if (b >= 55) {
            clearInterval(brightTimer);
            return 55;
          }
          return b + 0.4;
        });
      }, 80);
      const noteTimer = setTimeout(() => setNotesActive(true), 1200);
      return () => {
        clearInterval(brightTimer);
        clearTimeout(noteTimer);
      };
    } else {
      setNotesActive(false);
    }
  }, [station]);

  useEffect(() => {
    if (station !== 4) return;
    setFinalPhase("all");
    const t1 = setTimeout(() => setFinalPhase("isolate"), 2200);
    const t2 = setTimeout(() => setFinalPhase("message"), 5000);
    const t3 = setTimeout(() => setFinalPhase("cross"), 7500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [station]);

  const updateInsecurity = (idx: number, val: string) =>
    setInsecurities((prev) => prev.map((v, i) => (i === idx ? val : v)));

  const canProceedReflection = insecurities.some((s) => s.trim().length > 0);

  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-background text-foreground"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <style>{`
        @keyframes float-note {
          0%   { transform: translateY(-80px) rotate(var(--rot)); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.9; }
          100% { transform: translateY(105vh) rotate(calc(var(--rot) + 12deg)); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.75; }
          50%       { opacity: 1; }
        }
        @keyframes button-ring {
          0%   { box-shadow: 0 0 0 0 rgba(201,169,110,0.55); }
          70%  { box-shadow: 0 0 0 14px rgba(201,169,110,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
        }
        @keyframes camera-ring {
          0%, 100% { box-shadow: 0 0 0 1px rgba(201,169,110,0.3), 0 0 40px rgba(201,169,110,0.06); }
          50%       { box-shadow: 0 0 0 2px rgba(201,169,110,0.6), 0 0 60px rgba(201,169,110,0.15); }
        }
        @keyframes fade-line {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        @keyframes text-breathe {
          0%, 100% { text-shadow: 0 0 24px rgba(201,169,110,0.35), 0 0 60px rgba(201,169,110,0.12); }
          50%       { text-shadow: 0 0 40px rgba(201,169,110,0.6), 0 0 100px rgba(201,169,110,0.25); }
        }
        .glow-gold {
          animation: text-breathe 4s ease-in-out infinite;
        }
        .btn-pulse {
          animation: button-ring 2s ease-out infinite;
        }
        .cam-ring {
          animation: camera-ring 3s ease-in-out infinite;
        }
        .spotlight-bg {
          background: radial-gradient(ellipse 600px 500px at 50% -5%, rgba(201,169,110,0.07) 0%, transparent 68%), #060606;
        }
        .spotlight-tight {
          background: radial-gradient(ellipse 400px 320px at 50% 45%, rgba(255,248,235,0.045) 0%, transparent 65%), #060606;
        }
        .spotlight-low {
          background: radial-gradient(ellipse 700px 600px at 50% 90%, rgba(201,169,110,0.05) 0%, transparent 70%), #060606;
        }
        .journal-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(201,169,110,0.2);
          color: #ede8df;
          outline: none;
          width: 100%;
          padding: 12px 0;
          font-family: 'Spectral', serif;
          font-size: 1.05rem;
          font-weight: 300;
          font-style: italic;
          letter-spacing: 0.02em;
          transition: border-color 0.3s;
        }
        .journal-input::placeholder {
          color: rgba(237,232,223,0.25);
        }
        .journal-input:focus {
          border-bottom-color: rgba(201,169,110,0.6);
        }
        .portrait-frame {
          position: relative;
          overflow: hidden;
        }
        .portrait-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 1px rgba(201,169,110,0.25);
          z-index: 2;
          pointer-events: none;
        }
        .portrait-frame::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 40%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }
        @keyframes strike-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes insecurity-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes flash-white {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes countdown-pop {
          0%   { transform: scale(1.4); opacity: 0; }
          20%  { transform: scale(1); opacity: 1; }
          75%  { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0; }
        }
        @keyframes scan-line {
          0%   { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .flash-overlay {
          animation: flash-white 0.55s ease-out forwards;
        }
        .countdown-num {
          animation: countdown-pop 0.95s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Station progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-px flex-1 transition-all duration-1000"
            style={{
              background: i < station
                ? "#c9a96e"
                : i === station
                  ? "rgba(201,169,110,0.5)"
                  : "rgba(201,169,110,0.1)",
            }}
          />
        ))}
      </div>

      {/* Station label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`label-${station}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.8 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed top-6 left-8 z-40"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", color: "rgba(201,169,110,0.45)", textTransform: "uppercase" }}
        >
          {stationLabels[station]}
        </motion.div>
      </AnimatePresence>

      {/* STATION 0 — INTRODUCTION */}
      <AnimatePresence mode="wait">
        {station === 0 && (
          <motion.div
            key="station-0"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center spotlight-bg"
          >
            <div className="flex flex-col items-center gap-16 px-6 text-center" style={{ maxWidth: 680 }}>
              <div>
                <p
                  className="glow-gold"
                  style={{
                    fontFamily: "'Spectral', serif",
                    fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    lineHeight: 1.55,
                    color: "#ede8df",
                    letterSpacing: "0.01em",
                  }}
                >
                  This experience is not about
                  <br />
                  changing how you look.
                  <br />
                  <span style={{ color: "rgba(237,232,223,0.6)" }}>
                    It is about changing
                    <br />
                    how you see yourself.
                  </span>
                </p>
                <div
                  className="mx-auto mt-8"
                  style={{
                    height: 1,
                    background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)",
                    animation: "fade-line 2s 1.5s both",
                    width: "60%",
                  }}
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setStation(1)}
                  className="btn-pulse relative group"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "1px solid rgba(201,169,110,0.5)",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.3s, border-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.5)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <polygon points="3,1 13,7 3,13" fill="rgba(201,169,110,0.9)" />
                  </svg>
                </button>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(201,169,110,0.35)", textTransform: "uppercase" }}>
                  Press when you're ready
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATION 1 — PHOTO */}
        {station === 1 && (
          <motion.div
            key="station-1"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center spotlight-bg"
          >
            <canvas ref={canvasRef} className="hidden" />

            {/* Full-screen flash overlay */}
            {countdown === "flash" && (
              <div
                className="flash-overlay absolute inset-0 z-50 pointer-events-none"
                style={{ background: "#fff" }}
              />
            )}

            <div className="flex flex-col items-center gap-10">
              <div className="text-center" style={{ maxWidth: 480 }}>
                <h2 style={{ fontFamily: "'Spectral', serif", fontWeight: 300, fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#ede8df", letterSpacing: "0.02em" }}>
                  Capture yourself.
                </h2>
                <p style={{ marginTop: 8, fontSize: "0.8rem", letterSpacing: "0.12em", color: "rgba(237,232,223,0.35)", textTransform: "uppercase" }}>
                  As you are. Right now.
                </p>
              </div>

              {/* Camera circle */}
              <div
                className="cam-ring relative flex items-center justify-center"
                style={{
                  width: "clamp(220px, 36vw, 340px)",
                  height: "clamp(220px, 36vw, 340px)",
                  borderRadius: "50%",
                  background: "#0a0806",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* Real camera feed */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)", opacity: cameraReady ? 1 : 0, transition: "opacity 0.8s" }}
                />

                {/* Fake mirror — always rendered underneath; visible when no real feed */}
                <div
                  className="absolute inset-0"
                  style={{
                    opacity: cameraReady ? 0 : 1,
                    transition: "opacity 0.8s",
                    background: "radial-gradient(ellipse 70% 55% at 50% 32%, rgba(201,169,110,0.10) 0%, rgba(12,9,5,0.7) 55%, #080604 100%)",
                  }}
                >
                  {/* Silhouette SVG */}
                  <svg
                    viewBox="0 0 200 200"
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", inset: 0 }}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Shoulder/body */}
                    <ellipse cx="100" cy="165" rx="58" ry="60" fill="rgba(6,5,3,0.88)" />
                    {/* Neck */}
                    <rect x="89" y="103" width="22" height="28" rx="4" fill="rgba(6,5,3,0.88)" />
                    {/* Head */}
                    <ellipse cx="100" cy="88" rx="34" ry="38" fill="rgba(6,5,3,0.88)" />
                    {/* Subtle rim light */}
                    <ellipse cx="100" cy="88" rx="34" ry="38" fill="none" stroke="rgba(201,169,110,0.10)" strokeWidth="2" />
                  </svg>
                  {/* Scanning line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "35%",
                    background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.04), transparent)",
                    animation: "scan-line 3s linear infinite",
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Countdown overlay */}
                {typeof countdown === "number" && countdown > 0 && (
                  <div
                    key={countdown}
                    className="countdown-num absolute inset-0 flex items-center justify-center z-10"
                    style={{ pointerEvents: "none" }}
                  >
                    <span style={{
                      fontFamily: "'Spectral', serif",
                      fontSize: "clamp(5rem, 18vw, 8rem)",
                      fontWeight: 300,
                      color: "rgba(237,232,223,0.9)",
                      textShadow: "0 0 40px rgba(201,169,110,0.5)",
                      lineHeight: 1,
                    }}>
                      {countdown}
                    </span>
                  </div>
                )}

                {/* Corner reticles — always visible */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  {(["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const).map((pos, idx) => (
                    <div
                      key={idx}
                      className={`absolute ${pos}`}
                      style={{
                        width: 16, height: 16,
                        borderTop: idx < 2 ? "1px solid rgba(201,169,110,0.45)" : "none",
                        borderBottom: idx >= 2 ? "1px solid rgba(201,169,110,0.45)" : "none",
                        borderLeft: idx % 2 === 0 ? "1px solid rgba(201,169,110,0.45)" : "none",
                        borderRight: idx % 2 === 1 ? "1px solid rgba(201,169,110,0.45)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Capture button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={beginCountdown}
                  disabled={countdown !== null}
                  style={{
                    padding: "12px 40px",
                    border: "1px solid rgba(201,169,110,0.5)",
                    background: "transparent",
                    color: "#c9a96e",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.78rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: countdown !== null ? "not-allowed" : "pointer",
                    opacity: countdown !== null ? 0.4 : 1,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (countdown === null) (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {countdown === null ? "Capture this moment" : countdown === "flash" ? "…" : `Ready in ${countdown}`}
                </button>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(201,169,110,0.22)", textTransform: "uppercase" }}>
                  3 second countdown
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATION 2 — REFLECTION */}
        {station === 2 && (
          <motion.div
            key="station-2"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex flex-col items-center justify-center spotlight-tight"
          >
            <div className="flex flex-col gap-12" style={{ width: "min(520px, 88vw)" }}>
              <div>
                <h2 style={{
                  fontFamily: "'Spectral', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                  color: "#ede8df",
                  lineHeight: 1.4,
                }}>
                  What do you carry?
                </h2>
                <p style={{ marginTop: 10, fontSize: "0.78rem", color: "rgba(237,232,223,0.35)", letterSpacing: "0.08em", lineHeight: 1.7 }}>
                  Write down three things about yourself you have struggled to accept.
                  <br />
                  <span style={{ color: "rgba(237,232,223,0.18)" }}>This stays here. This is yours.</span>
                </p>
              </div>

              <div className="flex flex-col gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(201,169,110,0.4)", marginTop: 14, minWidth: 20, textAlign: "right" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <input
                      className="journal-input"
                      placeholder={["My skin, my scars…", "The way I look, sound…", "Something only I notice…"][i]}
                      value={insecurities[i]}
                      onChange={(e) => updateInsecurity(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start gap-4 pt-2">
                <button
                  onClick={() => setStation(3)}
                  disabled={!canProceedReflection}
                  style={{
                    padding: "12px 36px",
                    border: "1px solid rgba(201,169,110,0.4)",
                    background: "transparent",
                    color: "#c9a96e",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: canProceedReflection ? "pointer" : "not-allowed",
                    opacity: canProceedReflection ? 1 : 0.3,
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    if (canProceedReflection) (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  Seal &amp; step forward
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M7 2l4 4-4 4" stroke="rgba(201,169,110,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {!canProceedReflection && (
                  <span style={{ fontSize: "0.65rem", color: "rgba(237,232,223,0.2)", letterSpacing: "0.1em" }}>
                    Write at least one line to continue
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STATION 3 — PERSPECTIVE SHIFT */}
        {station === 3 && (() => {
          // Build gallery: user's photo spliced in at position 4
          const userTile = capturedPhoto
            ? { url: capturedPhoto, alt: "You", caption: "You belong here", isUser: true }
            : null;
          const allTiles = userTile
            ? [...portraits.slice(0, 4), userTile, ...portraits.slice(4)]
            : portraits;

          return (
            <motion.div
              key="station-3"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 overflow-y-auto scrollbar-hide"
              style={{ background: `rgb(${Math.round(6 + brightness * 0.5)}, ${Math.round(6 + brightness * 0.3)}, ${Math.round(6 + brightness * 0.15)})` }}
            >
              {/* Floating notes */}
              {notesActive && floatingNotes.map((note, i) => (
                <div
                  key={i}
                  style={{
                    position: "fixed",
                    left: `${note.x}%`,
                    top: 0,
                    zIndex: 30,
                    pointerEvents: "none",
                    "--rot": `${note.rot}deg`,
                    animationName: "float-note",
                    animationDuration: `${14 + (i % 4) * 2}s`,
                    animationDelay: `${note.delay}s`,
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                    animationFillMode: "both",
                  } as React.CSSProperties}
                >
                  <div style={{
                    background: "rgba(253,248,235,0.96)",
                    color: "#2a2018",
                    padding: "8px 12px",
                    fontSize: "0.68rem",
                    fontFamily: "'Spectral', serif",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    maxWidth: 160,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}>
                    {note.text}
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-center" style={{ minHeight: "100%", paddingTop: "clamp(60px, 10vh, 100px)", paddingBottom: 80 }}>
                <div className="text-center mb-12 px-6" style={{ maxWidth: 560 }}>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 1 } }}
                    style={{ fontFamily: "'Spectral', serif", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", color: "#ede8df" }}
                  >
                    You are not alone in this.
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1, duration: 0.8 } }}
                    style={{ marginTop: 10, fontSize: "0.78rem", color: "rgba(237,232,223,0.35)", letterSpacing: "0.08em" }}
                  >
                    These people carry what you carry — and they are radiant.
                  </motion.p>
                </div>

                {/* Portrait gallery — user's photo blends in as one of many */}
                <div style={{ width: "min(960px, 92vw)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(8px, 1.5vw, 16px)" }}>
                    {allTiles.map((p, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.1, duration: 0.9 } }}
                        className="portrait-frame"
                        style={{ background: "#0e0e0e", gridColumn: i === allTiles.length - 1 && allTiles.length % 3 === 1 ? "2" : undefined }}
                      >
                        <img
                          src={p.url}
                          alt={p.alt}
                          style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/5" : "3/4" }}
                        />
                        <div style={{ padding: "10px 12px 12px", background: "#0e0e0e" }}>
                          <p style={{ fontFamily: "'Spectral', serif", fontStyle: "italic", fontWeight: 300, fontSize: "0.78rem", color: "rgba(237,232,223,0.55)", lineHeight: 1.5 }}>
                            {p.caption}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 2.5, duration: 1 } }}
                  className="mt-16 flex flex-col items-center gap-4"
                >
                  <button
                    onClick={() => setStation(4)}
                    style={{
                      padding: "13px 44px",
                      border: "1px solid rgba(201,169,110,0.5)",
                      background: "transparent",
                      color: "#c9a96e",
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,169,110,0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    Continue
                  </button>
                </motion.div>
              </div>
            </motion.div>
          );
        })()}

        {/* STATION 4 — FINAL REFLECTION */}
        {station === 4 && (() => {
          const userTile = capturedPhoto
            ? { url: capturedPhoto, alt: "You", caption: "You belong here", isUser: true }
            : null;
          const allTiles = userTile
            ? [...portraits.slice(0, 4), userTile, ...portraits.slice(4)]
            : portraits;
          const filledInsecurities = insecurities.filter((s) => s.trim().length > 0);

          return (
            <motion.div
              key="station-4"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 overflow-hidden"
              style={{ background: "#060606" }}
            >
              {/* PHASE: all — full gallery visible, same as station 3 but static */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  opacity: finalPhase === "all" ? 1 : 0,
                  transition: "opacity 1.4s ease-in-out",
                  pointerEvents: finalPhase === "all" ? "auto" : "none",
                }}
              >
                <div
                  className="flex flex-col items-center overflow-y-auto scrollbar-hide"
                  style={{ height: "100%", paddingTop: "clamp(60px, 10vh, 100px)", paddingBottom: 80 }}
                >
                  <div style={{ width: "min(960px, 92vw)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(8px, 1.5vw, 16px)" }}>
                      {allTiles.map((p, i) => (
                        <div
                          key={i}
                          className="portrait-frame"
                          style={{
                            background: "#0e0e0e",
                            gridColumn: i === allTiles.length - 1 && allTiles.length % 3 === 1 ? "2" : undefined,
                          }}
                        >
                          <img
                            src={p.url}
                            alt={p.alt}
                            style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/5" : "3/4" }}
                          />
                          <div style={{ padding: "10px 12px 12px", background: "#0e0e0e" }}>
                            <p style={{ fontFamily: "'Spectral', serif", fontStyle: "italic", fontWeight: 300, fontSize: "0.78rem", color: "rgba(237,232,223,0.55)", lineHeight: 1.5 }}>
                              {p.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE: isolate → message → cross — user's photo centered, others gone */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "clamp(24px, 4vh, 48px)",
                  padding: "clamp(40px, 8vh, 80px) 24px",
                  opacity: finalPhase === "all" ? 0 : 1,
                  transition: "opacity 1.6s ease-in-out",
                  background: "radial-gradient(ellipse 700px 500px at 50% 30%, rgba(201,169,110,0.04) 0%, transparent 70%), #060606",
                }}
              >
                {/* User photo — large, centered */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "clamp(180px, 30vw, 280px)",
                    height: "clamp(180px, 30vw, 280px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 0 0 1px rgba(201,169,110,0.35), 0 0 80px rgba(201,169,110,0.12)",
                    background: "#0d0b08",
                  }}>
                    {capturedPhoto ? (
                      <img src={capturedPhoto} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.10) 0%, #0a0806 80%)" }}>
                        <ellipse cx="100" cy="165" rx="58" ry="60" fill="rgba(6,5,3,0.88)" />
                        <rect x="89" y="103" width="22" height="28" rx="4" fill="rgba(6,5,3,0.88)" />
                        <ellipse cx="100" cy="88" rx="34" ry="38" fill="rgba(6,5,3,0.88)" />
                      </svg>
                    )}
                  </div>
                  {/* Glow ring */}
                  <div style={{
                    position: "absolute", inset: -16, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "glow-pulse 5s ease-in-out infinite",
                  }} />
                </div>

                {/* Quote — fades in on 'message' phase */}
                <div style={{
                  opacity: finalPhase === "message" || finalPhase === "cross" ? 1 : 0,
                  transform: finalPhase === "message" || finalPhase === "cross" ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 1.2s ease-in-out, transform 1.2s ease-in-out",
                  textAlign: "center",
                  maxWidth: 520,
                }}>
                  <p style={{
                    fontFamily: "'Spectral', serif",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "clamp(1rem, 2.6vw, 1.55rem)",
                    lineHeight: 1.75,
                    color: "#ede8df",
                  }}>
                    "If this feature does not define them,
                    <br />
                    <span style={{ color: "#c9a96e" }}>why should it define you?"</span>
                  </p>
                </div>

                {/* Insecurities with red strikethrough — fades in on 'cross' phase */}
                {filledInsecurities.length > 0 && (
                  <div style={{
                    opacity: finalPhase === "cross" ? 1 : 0,
                    transition: "opacity 1s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                    width: "min(480px, 88vw)",
                  }}>
                    <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.18), transparent)", width: "100%" }} />
                    {filledInsecurities.map((text, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          display: "inline-block",
                          opacity: finalPhase === "cross" ? 1 : 0,
                          animation: finalPhase === "cross" ? `insecurity-fade-in 0.6s ${0.2 + i * 0.35}s ease-out both` : "none",
                        }}
                      >
                        <span style={{
                          fontFamily: "'Spectral', serif",
                          fontStyle: "italic",
                          fontWeight: 300,
                          fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
                          color: "rgba(237,232,223,0.6)",
                          letterSpacing: "0.01em",
                          display: "block",
                          padding: "0 4px",
                        }}>
                          {text}
                        </span>
                        {/* Red strikethrough line — draws from left to right */}
                        <div style={{
                          position: "absolute",
                          left: 0,
                          top: "52%",
                          width: "100%",
                          height: 2,
                          background: "#b83232",
                          transformOrigin: "left center",
                          transform: "scaleX(0)",
                          animation: finalPhase === "cross"
                            ? `strike-draw 0.55s ${0.6 + i * 0.35}s cubic-bezier(0.4,0,0.2,1) forwards`
                            : "none",
                          boxShadow: "0 0 6px rgba(184,50,50,0.5)",
                        }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Restart button */}
                <div style={{
                  opacity: finalPhase === "cross" ? 1 : 0,
                  transition: "opacity 1s 2s ease-in-out",
                  marginTop: 8,
                }}>
                  <button
                    onClick={() => {
                      setStation(0);
                      setInsecurities(["", "", ""]);
                      setCapturedPhoto(null);
                      setFinalPhase("all");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(201,169,110,0.3)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,169,110,0.65)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,169,110,0.3)"; }}
                  >
                    Return to the beginning
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Footer exhibition credit */}
      <div
        className="fixed bottom-6 right-8 z-40"
        style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.14em", color: "rgba(237,232,223,0.15)", textTransform: "uppercase" }}
      >
        Confidence Mirror — Interactive Installation
      </div>
    </div>
  );
}
