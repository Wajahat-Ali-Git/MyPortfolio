"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ─── Workflow Stages ─── */

const CLIENT_REQUESTS = [
  "I need a Backend!",
  "I need a Frontend!",
  "I need a Full-Stack App!",
];

const DEV_STAGES = [
  { text: "Analyzing", icon: "🔍", color: "#818cf8" },
  { text: "Requirement Gathering", icon: "📋", color: "#60a5fa" },
  { text: "Design & Develop", icon: "⚙️", color: "#a78bfa" },
  { text: "Testing", icon: "🧪", color: "#34d399" },
  { text: "Deployed ✓", icon: "🚀", color: "#f59e0b" },
];

const STAGE_DURATION = 2200;

/* ─── Typing Effect Hook ─── */

function useTypingEffect(text: string, isActive: boolean, speed = 45) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isActive) {
      setDisplayText("");
      return;
    }
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return displayText;
}

/* ─── Client Avatar ─── */

function ClientAvatar({ isThinking }: { isThinking: boolean }) {
  return (
    <div className="wf-avatar-wrapper">
      {/* Glow ring */}
      <motion.div
        className="wf-avatar-glow wf-avatar-glow--client"
        animate={isThinking ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none" className="wf-avatar-svg">
        {/* Body */}
        <ellipse cx="50" cy="100" rx="30" ry="16" fill="url(#cBody)" />
        {/* Neck */}
        <rect x="43" y="68" width="14" height="14" rx="4" fill="#d4a574" />
        {/* Head */}
        <motion.circle
          cx="50" cy="45" r="26"
          fill="url(#cSkin)"
          animate={isThinking ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Hair */}
        <path d="M24 40 C24 18 76 18 76 40 C76 30 24 30 24 40Z" fill="#3d2b1f" />
        <path d="M22 43 C22 22 78 22 78 43 L76 40 C76 26 24 26 24 40Z" fill="#4a3728" />
        {/* Eyes */}
        <motion.g animate={isThinking ? { y: [0, -1, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}>
          <circle cx="39" cy="43" r="3.5" fill="white" />
          <circle cx="61" cy="43" r="3.5" fill="white" />
          <motion.circle
            cx="40" cy="43" r="1.8" fill="#2d1b0e"
            animate={isThinking ? { cx: [40, 42, 40, 38, 40] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="62" cy="43" r="1.8" fill="#2d1b0e"
            animate={isThinking ? { cx: [62, 64, 62, 60, 62] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.g>
        {/* Mouth */}
        <path d="M43 55 Q50 59 57 55" stroke="#c5846b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Laptop */}
        <rect x="27" y="88" width="46" height="5" rx="2" fill="#64748b" />
        <rect x="30" y="82" width="40" height="8" rx="2" fill="#475569" />
        <motion.rect
          x="32" y="83.5" width="36" height="5" rx="1"
          fill="#60a5fa" opacity="0.35"
          animate={isThinking ? { opacity: [0.25, 0.45, 0.25] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="cBody" x1="20" y1="84" x2="80" y2="116">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <radialGradient id="cSkin" cx="50" cy="40" r="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0d5b8" />
            <stop offset="100%" stopColor="#d4a574" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Developer Avatar ─── */

function DevAvatar({ isWorking }: { isWorking: boolean }) {
  return (
    <div className="wf-avatar-wrapper">
      {/* Glow ring */}
      <motion.div
        className="wf-avatar-glow wf-avatar-glow--dev"
        animate={isWorking ? { opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none" className="wf-avatar-svg">
        {/* Body */}
        <ellipse cx="50" cy="100" rx="30" ry="16" fill="url(#dBody)" />
        {/* Neck */}
        <rect x="43" y="68" width="14" height="14" rx="4" fill="#d4a574" />
        {/* Head */}
        <motion.circle
          cx="50" cy="45" r="26"
          fill="url(#dSkin)"
          animate={isWorking ? { rotate: [0, 1, -1, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Hair */}
        <path d="M24 37 C24 17 76 17 76 37 C74 27 26 27 24 37Z" fill="#1a1a2e" />
        {/* Glasses */}
        <rect x="31" y="38" width="14" height="10" rx="5" stroke="#a5b4fc" strokeWidth="1.8" fill="none" />
        <rect x="55" y="38" width="14" height="10" rx="5" stroke="#a5b4fc" strokeWidth="1.8" fill="none" />
        <line x1="45" y1="43" x2="55" y2="43" stroke="#a5b4fc" strokeWidth="1.8" />
        {/* Eyes */}
        <motion.g
          animate={isWorking ? { scaleY: [1, 1, 0.1, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
        >
          <circle cx="38" cy="43" r="2" fill="#1e293b" />
          <circle cx="62" cy="43" r="2" fill="#1e293b" />
        </motion.g>
        {/* Mouth */}
        <path d="M42 56 Q50 61 58 56" stroke="#c5846b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Laptop with code */}
        <rect x="27" y="88" width="46" height="5" rx="2" fill="#64748b" />
        <rect x="30" y="80" width="40" height="10" rx="2" fill="#1e293b" />
        <motion.g
          animate={isWorking ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <rect x="33" y="82.5" width="14" height="1.5" rx="1" fill="#60a5fa" opacity="0.7" />
          <rect x="33" y="86" width="10" height="1.5" rx="1" fill="#a78bfa" opacity="0.5" />
          <rect x="49" y="82.5" width="18" height="1.5" rx="1" fill="#34d399" opacity="0.6" />
          <rect x="46" y="86" width="12" height="1.5" rx="1" fill="#fbbf24" opacity="0.5" />
        </motion.g>
        <defs>
          <linearGradient id="dBody" x1="20" y1="84" x2="80" y2="116">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <radialGradient id="dSkin" cx="50" cy="40" r="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f0d5b8" />
            <stop offset="100%" stopColor="#d4a574" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Speech Bubble ─── */

function SpeechBubble({ text, icon, isActive, color, position }: {
  text: string;
  icon?: string;
  isActive: boolean;
  color: string;
  position: "above-left" | "above-right";
}) {
  const displayText = useTypingEffect(text, isActive, 35);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={text}
          initial={{ opacity: 0, scale: 0.7, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`wf-speech ${position === "above-left" ? "wf-speech--left" : "wf-speech--right"}`}
          style={{
            background: `linear-gradient(135deg, ${color}18, ${color}0a)`,
            borderColor: `${color}35`,
            boxShadow: `0 4px 24px ${color}15, 0 0 0 1px ${color}10`,
          }}
        >
          {icon && <span className="wf-speech-icon">{icon}</span>}
          <span className="wf-speech-text">{displayText}</span>
          <motion.span
            className="wf-speech-cursor"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ▎
          </motion.span>
          {/* Triangle tail */}
          <svg
            className={`wf-speech-tail ${position === "above-left" ? "wf-speech-tail--left" : "wf-speech-tail--right"}`}
            width="16" height="8" viewBox="0 0 16 8"
          >
            <path d="M0 0 L8 8 L16 0" fill={`${color}14`} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Horizontal Pipeline ─── */

function HorizontalPipeline({ progress, isActive }: { progress: number; isActive: boolean }) {
  return (
    <div className="wf-pipeline">
      <svg width="100%" height="48" viewBox="0 0 400 48" preserveAspectRatio="none">
        {/* Track BG */}
        <line x1="0" y1="24" x2="400" y2="24" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="6 8" />
        {/* Progress fill */}
        <motion.line
          x1="0" y1="24" x2="400" y2="24"
          stroke="url(#pGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? progress : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Traveling dots */}
        {isActive && (
          <>
            <motion.circle
              r="3.5" fill="#818cf8" cy="24"
              animate={{ cx: [0, 200, 400], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="2.5" fill="#60a5fa" cy="24"
              animate={{ cx: [0, 200, 400], opacity: [0, 0.8, 0] }}
              transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              r="2" fill="#a78bfa" cy="24"
              animate={{ cx: [0, 200, 400], opacity: [0, 0.6, 0] }}
              transition={{ duration: 2.5, delay: 1.6, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
        <defs>
          <linearGradient id="pGrad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Packet emoji */}
      <AnimatePresence>
        {isActive && progress > 0 && progress < 1 && (
          <motion.div
            className="wf-packet"
            initial={{ left: "0%", opacity: 0, scale: 0.5 }}
            animate={{
              left: `${Math.min(progress * 100, 90)}%`,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            📨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return packet */}
      <AnimatePresence>
        {progress >= 1 && (
          <motion.div
            className="wf-packet"
            initial={{ left: "90%", opacity: 0, scale: 0.5 }}
            animate={{ left: "5%", opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1, 0.5] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            📦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Dev Stage Timeline (horizontal) ─── */

function StageTimeline({ stages, currentIndex }: { stages: typeof DEV_STAGES; currentIndex: number }) {
  return (
    <div className="wf-timeline">
      {stages.map((stage, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;
        return (
          <div key={stage.text} className="wf-timeline-step">
            {/* Connector line (not on first) */}
            {i > 0 && (
              <div className={`wf-timeline-connector ${isDone || isCurrent ? "active" : ""}`} />
            )}
            {/* Dot */}
            <motion.div
              className={`wf-timeline-dot ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isPending ? "pending" : ""}`}
              animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: [`0 0 0px ${stage.color}`, `0 0 16px ${stage.color}`, `0 0 0px ${stage.color}`] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={isDone || isCurrent ? { background: stage.color, borderColor: stage.color } : {}}
            >
              {isDone ? (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <motion.path
                    d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="2" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              ) : isCurrent ? (
                <span className="wf-timeline-dot-icon">{stage.icon}</span>
              ) : null}
            </motion.div>
            {/* Label */}
            <span className={`wf-timeline-label ${isDone || isCurrent ? "active" : ""}`}>
              {stage.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */

export default function WorkflowAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [phase, setPhase] = useState(0);
  const [devStageIndex, setDevStageIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);

  const totalDevStages = DEV_STAGES.length;

  const runAnimation = useCallback(async () => {
    // Phase 1: Thinking
    setPhase(1);
    await delay(2200);

    // Phase 2: Idea
    setPhase(2);
    await delay(2200);

    // Phase 3: Sending
    setPhase(3);
    await delay(1600);

    // Phases 4+: Dev stages
    for (let i = 0; i < totalDevStages; i++) {
      setPhase(4 + i);
      setDevStageIndex(i);
      await delay(STAGE_DURATION);
    }

    // Phase 9: Delivering
    setPhase(9);
    await delay(1800);

    // Phase 10: Done
    setPhase(10);
    await delay(3000);

    // Reset
    setPhase(0);
    setDevStageIndex(-1);
    setIsAnimating(false);
    setCycleKey((c) => c + 1);
  }, [totalDevStages]);

  useEffect(() => {
    if (!isInView || isAnimating) return;
    setIsAnimating(true);
    runAnimation();
  }, [isInView, isAnimating, cycleKey, runAnimation]);

  // Derived state
  const currentRequest = CLIENT_REQUESTS[cycleKey % CLIENT_REQUESTS.length];
  const clientText = phase === 1 ? "Thinking..." : phase === 2 ? currentRequest : phase === 10 ? "Thank you! 🎉" : "";
  const clientColor = phase === 1 ? "#a78bfa" : phase === 2 ? "#6366f1" : "#10b981";
  const clientActive = phase === 1 || phase === 2 || phase === 10;

  const devText = devStageIndex >= 0 && phase >= 4 && phase <= 8 ? DEV_STAGES[devStageIndex].text : phase === 10 ? "Happy to help! 😊" : "";
  const devIcon = devStageIndex >= 0 && phase >= 4 && phase <= 8 ? DEV_STAGES[devStageIndex].icon : "";
  const devColor = phase === 10 ? "#10b981" : "#0ea5e9";
  const devActive = (phase >= 4 && phase <= 8) || phase === 10;

  const pipelineProgress = phase >= 3 ? Math.min(1, (phase - 2) / (totalDevStages + 2)) : 0;

  // Bottom status text
  const statusText = [
    "Watch the workflow unfold...",
    "Client is brainstorming...",
    "Client has an idea!",
    "Sending the request...",
    ...DEV_STAGES.map((s, i) => `Step ${i + 1}/${totalDevStages} — ${s.text}`),
    "Delivering the project...",
    "Project delivered successfully! 🎉",
  ][phase] || "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="wf-root"
    >
      {/* ── Title ── */}
      <div className="wf-header">
        <motion.div
          className="wf-header-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          ⚡ How I Work
        </motion.div>
        <p className="wf-header-sub">From client request to deployed product</p>
      </div>

      {/* ── Side-by-side Characters ── */}
      <div className="wf-characters">
        {/* Client Card */}
        <motion.div
          className="wf-card wf-card--client"
          animate={clientActive ? { borderColor: `${clientColor}40` } : { borderColor: "rgba(255,255,255,0.06)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="wf-card-bubble-area">
            <SpeechBubble
              text={clientText}
              isActive={clientActive}
              color={clientColor}
              position="above-left"
            />
            {/* Thinking dots */}
            <AnimatePresence>
              {phase === 1 && (
                <motion.div
                  className="wf-thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                    >
                      •
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ClientAvatar isThinking={phase === 1 || phase === 2} />
          <span className="wf-card-label">Client</span>
        </motion.div>

        {/* Center Pipeline */}
        <div className="wf-pipeline-area">
          <HorizontalPipeline progress={pipelineProgress} isActive={phase >= 3} />
        </div>

        {/* Developer Card */}
        <motion.div
          className="wf-card wf-card--dev"
          animate={devActive ? { borderColor: `${devColor}40` } : { borderColor: "rgba(255,255,255,0.06)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="wf-card-bubble-area">
            <SpeechBubble
              text={devText}
              icon={devIcon}
              isActive={devActive}
              color={devColor}
              position="above-right"
            />
          </div>
          <DevAvatar isWorking={phase >= 4 && phase <= 8} />
          <span className="wf-card-label">Me (Developer)</span>
        </motion.div>
      </div>

      {/* ── Stage Timeline ── */}
      <AnimatePresence>
        {phase >= 4 && phase <= 8 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <StageTimeline stages={DEV_STAGES} currentIndex={devStageIndex} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status bar ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          className="wf-status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <div className="wf-status-dot" />
          {statusText}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Helper ─── */

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
