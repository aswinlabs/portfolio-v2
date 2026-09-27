"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import useIsMobile from "@/hooks/useIsMobile";

type SpideyPhase = "hidden" | "hanging" | "peeking";
type EntranceMode = "top" | "side";

const FACTS = [
  "Fun fact: Aswin built this entire retro desktop OS from scratch because flat portfolios bored him!",
  "Aswin's superpower: He writes TypeScript so strict that bugs apologize before crashing.",
  "Did you know? Aswin built an automated Astro deployer that parses messy WhatsApp text and deploys a live site in 30s!",
  "Aswin's rule: Problem-solving first, stack second. Pixel-perfect frontend, bulletproof backend, zero fluff.",
  "Node.js, React, TypeScript, Go, Supabase, Cloudflare edge... you name the stack, Aswin has shipped with it.",
  "Spider-sense tingling! A recruiter is looking at this screen right now... You should definitely hire Aswin!",
  "Rumor has it Aswin writes Node.js RAG pipelines so tight that hallucinations literally refuse to exist.",
];

interface PixelSpeechBubbleProps {
  tail: "top" | "side";
  text: string;
  onClose: () => void;
}

const PixelSpeechBubble: React.FC<PixelSpeechBubbleProps> = ({ tail, text, onClose }) => (
  <div
    className={`pointer-events-auto absolute w-60 sm:w-72 z-[1001] animate-in fade-in zoom-in-95 duration-200 ${
      tail === "top" ? "top-20 sm:top-28 right-16 sm:right-22" : "right-24 sm:right-32"
    }`}
  >
    {/* Stepped Pixel Pointer Tail pointing right to Spidey (as in user reference) */}
    <div className="absolute top-6 -right-[9px] w-[10px] h-[16px] pointer-events-none z-20">
      <svg width="10" height="16" viewBox="0 0 10 16" shapeRendering="crispEdges">
        <rect x="0" y="0" width="2" height="16" fill="black" />
        <rect x="2" y="2" width="2" height="12" fill="black" />
        <rect x="4" y="4" width="2" height="8" fill="black" />
        <rect x="6" y="6" width="2" height="4" fill="black" />
        <rect x="8" y="7" width="2" height="2" fill="black" />
        <rect x="0" y="2" width="2" height="12" fill="white" />
        <rect x="2" y="4" width="2" height="8" fill="white" />
        <rect x="4" y="6" width="2" height="4" fill="white" />
        <rect x="6" y="7" width="2" height="2" fill="white" />
      </svg>
    </div>

    {/* Outer 3px Black Pixel Outline with Stepped Corners */}
    <div
      className="p-[3px] bg-black shadow-[3px_3px_0px_rgba(0,0,0,0.85)]"
      style={{
        clipPath:
          "polygon(0 8px, 2px 8px, 2px 5px, 5px 5px, 5px 2px, 8px 2px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 2px, calc(100% - 5px) 2px, calc(100% - 5px) 5px, calc(100% - 2px) 5px, calc(100% - 2px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 2px) calc(100% - 8px), calc(100% - 2px) calc(100% - 5px), calc(100% - 5px) calc(100% - 5px), calc(100% - 5px) calc(100% - 2px), calc(100% - 8px) calc(100% - 2px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 2px), 5px calc(100% - 2px), 5px calc(100% - 5px), 2px calc(100% - 5px), 2px calc(100% - 8px), 0 calc(100% - 8px))",
      }}
    >
      {/* Inner White Body with Matching Stepped Corners */}
      <div
        className="relative bg-white text-black p-3.5 select-text"
        style={{
          clipPath:
            "polygon(0 6px, 2px 6px, 2px 3px, 3px 3px, 3px 2px, 6px 2px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 2px, calc(100% - 3px) 2px, calc(100% - 3px) 3px, calc(100% - 2px) 3px, calc(100% - 2px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 2px) calc(100% - 6px), calc(100% - 2px) calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) calc(100% - 2px), calc(100% - 6px) calc(100% - 2px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 2px), 3px calc(100% - 2px), 3px calc(100% - 3px), 2px calc(100% - 3px), 2px calc(100% - 6px), 0 calc(100% - 6px))",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-black font-bold text-xs select-none leading-none cursor-pointer"
          aria-label="Close dialogue"
        >
          ×
        </button>
        <p className="leading-snug font-medium text-black pr-3 text-xs sm:text-sm">
          {text}
        </p>
      </div>
    </div>
  </div>
);

export const SpideyEasterEgg: React.FC = () => {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<SpideyPhase>("hidden");
  const [entranceMode, setEntranceMode] = useState<EntranceMode>("top");
  const [activeFactIndex, setActiveFactIndex] = useState(0);
  const [speechBubbleOpen, setSpeechBubbleOpen] = useState(false);
  const [comicBadge, setComicBadge] = useState<string | null>(null);
  const [horizontalOffset, setHorizontalOffset] = useState<string>("right-6 sm:right-10");
  const [sideVerticalClass, setSideVerticalClass] = useState<string>("top-1/3");
  const [pokeCount, setPokeCount] = useState(0);
  const [customDialogueText, setCustomDialogueText] = useState<string | null>(null);

  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSafeTimeout = useCallback((fn: () => void, delayMs: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      fn();
    }, delayMs);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearIdleTimer();
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();
  }, [clearIdleTimer]);

  const handleRetreat = useCallback(() => {
    clearIdleTimer();
    setSpeechBubbleOpen(false);
    setComicBadge("THWIP! 🕸️");
    setPhase("hidden");

    setSafeTimeout(() => {
      setComicBadge(null);
      setPokeCount(0);
      setCustomDialogueText(null);
      scheduleArrival(12000);
    }, 500);
  }, [clearIdleTimer, setSafeTimeout]); // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleArrival = useCallback(
    (delayMs = 10000) => {
      setSafeTimeout(() => {
        const nextMode: EntranceMode = Math.random() < 0.5 ? "side" : "top";
        setEntranceMode(nextMode);
        setPokeCount(0);
        setCustomDialogueText(null);
        setActiveFactIndex((prev) => (prev + 1) % FACTS.length);

        if (nextMode === "top") {
          const offsets = ["right-4 sm:right-8", "right-6 sm:right-10"];
          setHorizontalOffset(offsets[Math.floor(Math.random() * offsets.length)]);
          setPhase("hanging");
          setSafeTimeout(() => setSpeechBubbleOpen(true), 600);
        } else {
          const verticalSpots = ["top-1/4", "top-1/3", "top-1/2"];
          setSideVerticalClass(verticalSpots[Math.floor(Math.random() * verticalSpots.length)]);
          setPhase("peeking");
          setSafeTimeout(() => setSpeechBubbleOpen(true), 500);
        }

        clearIdleTimer();
        idleTimerRef.current = setTimeout(() => {
          handleRetreat();
        }, 11000);
      }, delayMs);
    },
    [clearIdleTimer, setSafeTimeout, handleRetreat]
  );

  const handleCloseDialogueOnly = useCallback(() => {
    setSpeechBubbleOpen(false);
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      handleRetreat();
    }, 6000);
  }, [clearIdleTimer, handleRetreat]);

  // Initial arrival trigger after 3s (desktop only)
  useEffect(() => {
    if (isMobile) return;
    scheduleArrival(3000);
    return () => clearAllTimers();
  }, [scheduleArrival, clearAllTimers, isMobile]);

  const handleSpideyClick = () => {
    const nextCount = pokeCount + 1;
    setPokeCount(nextCount);
    clearIdleTimer();

    if (nextCount === 1) {
      setComicBadge("HEY! 🕷️");
      setSafeTimeout(() => setComicBadge(null), 1200);
      setActiveFactIndex((prev) => (prev + 1) % FACTS.length);
      setCustomDialogueText(null);
      setSpeechBubbleOpen(true);
      idleTimerRef.current = setTimeout(() => handleRetreat(), 8000);
    } else if (nextCount === 2) {
      setComicBadge("GRRR! 💢");
      setSafeTimeout(() => setComicBadge(null), 1500);
      setCustomDialogueText("Dude, stop poking me! One more click and I'm swinging outta here! 😤");
      setSpeechBubbleOpen(true);
      idleTimerRef.current = setTimeout(() => handleRetreat(), 7000);
    } else {
      setComicBadge("ANGRY! 💨");
      setCustomDialogueText("That's it, I'm out! Have fun exploring Aswin's portfolio! ✌️");
      setSpeechBubbleOpen(true);
      setSafeTimeout(() => handleRetreat(), 1200);
    }
  };

  const currentFact = customDialogueText || FACTS[activeFactIndex];

  const getTopContainerStyle = (): React.CSSProperties => ({
    transform: phase === "hanging" ? "translateY(0)" : "translateY(-120%)",
    transition:
      phase === "hanging"
        ? "transform 0.7s cubic-bezier(0.34, 1.4, 0.64, 1)"
        : "transform 0.5s ease-in",
    pointerEvents: phase === "hanging" ? "auto" : "none",
  });

  const getSideContainerStyle = (): React.CSSProperties => ({
    transform: phase === "peeking" ? "translateX(0)" : "translateX(120%)",
    transition:
      phase === "peeking"
        ? "transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1)"
        : "transform 0.5s ease-in",
    pointerEvents: phase === "peeking" ? "auto" : "none",
  });

  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* MODE 1: TOP DROP-DOWN ON WEB STRAND */}
      {(entranceMode === "top" || phase === "hanging") && (
        <div
          style={getTopContainerStyle()}
          className={`fixed top-0 ${horizontalOffset} z-[1000] pointer-events-none select-none`}
        >
          <div className="relative flex flex-col items-center">
            {comicBadge && (
              <div className="absolute -top-6 left-10 bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-bold text-xs px-2 py-0.5 animate-bounce z-[1002] whitespace-nowrap">
                {comicBadge}
              </div>
            )}

            <div
              onClick={phase === "hanging" ? handleSpideyClick : undefined}
              className={`pointer-events-auto cursor-pointer relative origin-top ${
                phase === "hanging"
                  ? "animate-[spidey-swing_3s_ease-in-out_infinite_alternate] hover:scale-110 active:scale-95"
                  : ""
              }`}
            >
              <div className="relative drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                <Image
                  src="/images/spidey-drop.png"
                  alt="Spider-Man Hanging"
                  width={70}
                  height={230}
                  priority
                  className="select-none pointer-events-none w-[64px] sm:w-[72px] h-auto"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            {speechBubbleOpen && phase === "hanging" && (
              <PixelSpeechBubble tail="top" text={currentFact} onClose={handleCloseDialogueOnly} />
            )}
          </div>
        </div>
      )}

      {/* MODE 2: WALL-CRAWLING FROM THE RIGHT SIDE */}
      {(entranceMode === "side" || phase === "peeking") && (
        <div
          style={getSideContainerStyle()}
          className={`fixed right-0 ${sideVerticalClass} z-[1000] pointer-events-none select-none`}
        >
          <div className="relative flex items-center">
            {speechBubbleOpen && phase === "peeking" && (
              <PixelSpeechBubble tail="side" text={currentFact} onClose={handleCloseDialogueOnly} />
            )}

            <div
              onClick={phase === "peeking" ? handleSpideyClick : undefined}
              className="pointer-events-auto cursor-pointer relative hover:scale-105 active:scale-95 transition-transform"
            >
              {comicBadge && (
                <div className="absolute -top-7 right-4 bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000000] font-bold text-xs px-2 py-0.5 animate-bounce z-[1002] whitespace-nowrap">
                  {comicBadge}
                </div>
              )}

              <Image
                src="/images/spidey-peek.png"
                alt="Spider-Man Peeking from Wall"
                width={120}
                height={106}
                priority
                className="select-none pointer-events-none translate-x-2 drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpideyEasterEgg;
