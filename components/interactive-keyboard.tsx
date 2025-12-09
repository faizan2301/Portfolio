"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KeyProps {
  label: string;
  sublabel?: string;
  color?: "primary" | "accent" | "default" | "gradient";
  size?: "sm" | "md" | "lg";
  delay?: number;
}

function Key({ label, sublabel, color = "default", size = "md", delay = 0 }: KeyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePress = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, []);

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-20",
  };

  const colorStyles = {
    default: {
      background: "linear-gradient(145deg, #2a2a3e 0%, #1a1a28 50%, #15151f 100%)",
      boxShadow: `
        0 8px 0 #0a0a12,
        0 10px 10px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3)
      `,
      pressedShadow: `0 2px 0 #0a0a12, 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      hoverGlow: "rgba(139, 92, 246, 0.2)",
    },
    primary: {
      background: "linear-gradient(145deg, #0891b2 0%, #0e7490 50%, #164e63 100%)",
      boxShadow: `
        0 8px 0 #083344,
        0 10px 10px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3),
        0 0 30px rgba(6, 182, 212, 0.3)
      `,
      pressedShadow: `0 2px 0 #083344, 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      hoverGlow: "rgba(6, 182, 212, 0.4)",
    },
    accent: {
      background: "linear-gradient(145deg, #a855f7 0%, #8b5cf6 50%, #6d28d9 100%)",
      boxShadow: `
        0 8px 0 #4c1d95,
        0 10px 10px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3),
        0 0 30px rgba(139, 92, 246, 0.3)
      `,
      pressedShadow: `0 2px 0 #4c1d95, 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      hoverGlow: "rgba(139, 92, 246, 0.4)",
    },
    gradient: {
      background: "linear-gradient(145deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
      boxShadow: `
        0 8px 0 #7c2d12,
        0 10px 10px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3),
        0 0 40px rgba(249, 115, 22, 0.4)
      `,
      pressedShadow: `0 2px 0 #7c2d12, 0 3px 5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
      hoverGlow: "rgba(249, 115, 22, 0.5)",
    },
  };

  const currentColor = colorStyles[color];

  // Compute the current box shadow based on pressed state (only after mount)
  const currentBoxShadow = isMounted && isPressed 
    ? currentColor.pressedShadow 
    : currentColor.boxShadow;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
      }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ 
        scale: 1.02,
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handlePress}
      className={`
        ${sizeClasses[size]}
        relative rounded-xl cursor-pointer
        flex flex-col items-center justify-center
        transform-gpu
        transition-all duration-100 ease-out
        overflow-hidden
        border border-white/5
      `}
      style={{
        background: currentColor.background,
        boxShadow: currentBoxShadow,
        transform: isMounted && isPressed ? "translateY(6px)" : "translateY(0)",
      }}
    >
      {/* Key highlight */}
      <div 
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
        }}
      />
      
      {/* Key label */}
      <span 
        className={`
          relative z-10 font-bold tracking-wide transition-transform duration-100
          ${color === "gradient" || color === "primary" || color === "accent" 
            ? "text-white" 
            : "text-gray-300"}
          ${size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-sm"}
        `}
        style={{
          transform: isMounted && isPressed ? "translateY(2px) scale(0.95)" : "translateY(0) scale(1)",
        }}
      >
        {label}
      </span>
      
      {sublabel && (
        <span 
          className={`
            relative z-10 text-[10px] font-medium mt-0.5 transition-transform duration-100
            ${color === "gradient" || color === "primary" || color === "accent" 
              ? "text-white/70" 
              : "text-gray-500"}
          `}
          style={{
            transform: isMounted && isPressed ? "translateY(2px)" : "translateY(0)",
          }}
        >
          {sublabel}
        </span>
      )}

      {/* Ripple effects - only render on client */}
      {isMounted && (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
              }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.button>
  );
}

// Animated mascot (inspired by the bear in the CodePen)
function Mascot() {
  const [isMounted, setIsMounted] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Use consistent initial state for SSR
  const eyeScaleY = isMounted && isBlinking ? 0.1 : 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      className="absolute -top-2 -left-2 w-16 h-16"
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Face */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-lg">
          {/* Ears */}
          <div className="absolute -top-1 left-1 w-4 h-4 bg-gray-300 rounded-full shadow-inner" />
          <div className="absolute -top-1 right-1 w-4 h-4 bg-gray-300 rounded-full shadow-inner" />
          <div className="absolute top-0 left-1.5 w-2 h-2 bg-pink-300 rounded-full" />
          <div className="absolute top-0 right-1.5 w-2 h-2 bg-pink-300 rounded-full" />
          
          {/* Eyes */}
          <div
            className="absolute top-5 left-3 w-3 h-3 bg-gray-800 rounded-full transition-transform duration-100"
            style={{ transform: `scaleY(${eyeScaleY})` }}
          >
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
          <div
            className="absolute top-5 right-3 w-3 h-3 bg-gray-800 rounded-full transition-transform duration-100"
            style={{ transform: `scaleY(${eyeScaleY})` }}
          >
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
          </div>
          
          {/* Nose */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-pink-400 rounded-full" />
          
          {/* Mouth */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-1 border-b-2 border-gray-600 rounded-full" />
          
          {/* Cheeks */}
          <div className="absolute top-7 left-0.5 w-2 h-1.5 bg-pink-200 rounded-full opacity-60" />
          <div className="absolute top-7 right-0.5 w-2 h-1.5 bg-pink-200 rounded-full opacity-60" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function InteractiveKeyboard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
      style={{ perspective: "1000px" }}
    >
      {/* Mascot */}
      <Mascot />
      
      {/* Keyboard container */}
      <motion.div
        className="relative p-6 rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #1a1a28 0%, #12121a 100%)",
          boxShadow: `
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            inset 0 -1px 0 rgba(0, 0, 0, 0.5)
          `,
        }}
        whileHover={{ rotateX: 2, rotateY: -2 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Keyboard base glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: "radial-gradient(ellipse at center bottom, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Keys grid */}
        <div className="relative z-10 flex flex-col gap-2">
          {/* Top row */}
          <div className="flex gap-2 justify-center">
            <Key label="build" color="default" size="md" delay={0.1} />
            <Key label="⚡" color="gradient" size="md" delay={0.2} />
            <Key label="ship" color="default" size="md" delay={0.3} />
          </div>
          
          {/* Middle row */}
          <div className="flex gap-2 justify-center">
            <Key label="create." sublabel="enter" color="primary" size="lg" delay={0.4} />
            <Key label="go →" color="accent" size="md" delay={0.5} />
          </div>
        </div>

        {/* Reflection effect */}
        <div 
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-20 opacity-20"
          style={{
            background: "linear-gradient(180deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%)",
            filter: "blur(10px)",
          }}
        />
      </motion.div>

      {/* Floating particles around keyboard - only render on client */}
      {isMounted && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? "#06b6d4" : "#8b5cf6",
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
