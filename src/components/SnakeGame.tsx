import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Game Constants
const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREMENT = 3;

type Point = { x: number; y: number };
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(direction);
  directionRef.current = direction; // Keep ref updated for immediate access in keyboard listener

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    const initialFood = generateFood(INITIAL_SNAKE);
    setFood(initialFood);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    containerRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      const { key } = e;
      const currentDir = directionRef.current;
      
      let newDir = { ...currentDir };

      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) newDir = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) newDir = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) newDir = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) newDir = { x: 1, y: 0 };
          e.preventDefault();
          break;
      }
      
      setDirection(newDir);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - (score * SPEED_DECREMENT));

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
          // Keep tail (don't pop)
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, food, score, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Score Header */}
      <div className="flex justify-between w-full mb-4 px-4 font-sans">
        <div className="flex flex-col items-start gap-1">
          <span className="text-cyan-500 uppercase tracking-widest text-[10px]">RAW_SCORE //</span>
          <span className="text-2xl text-cyan-400 font-bold tracking-tighter drop-shadow-[2px_2px_0px_rgba(217,70,239,0.5)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-fuchsia-500 uppercase tracking-widest text-[10px] flex items-center gap-1">
            <AlertTriangle size={10} /> SYS_RECORD //
          </span>
          <span className="text-2xl text-fuchsia-500 font-bold tracking-tighter drop-shadow-[-2px_-2px_0px_rgba(34,211,238,0.5)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board container */}
      <div 
        ref={containerRef}
        tabIndex={0}
        className="relative w-full aspect-square bg-[#0a0a0a] border-4 border-cyan-500 overflow-hidden outline-none hover:border-fuchsia-500 transition-colors cursor-default group"
        onClick={() => containerRef.current?.focus()}
      >
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #d946ef 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${
                isHead 
                ? 'bg-cyan-400 z-10 glitch-anim mix-blend-difference' 
                : 'bg-cyan-600/80 z-0'
              }`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
              }}
              initial={false}
              animate={{ opacity: 1, scale: isHead ? 1.1 : 0.95 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}

        {/* Render Food */}
        <motion.div
          className='absolute bg-fuchsia-500 z-10 animate-bounce mix-blend-screen'
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {!isPlaying && !gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-black text-cyan-400 border-2 border-cyan-500 font-sans uppercase tracking-[0.2em] text-sm hover:bg-cyan-500 hover:text-black transition-none group mix-blend-screen"
              >
                <Play className="fill-current w-4 h-4" /> &gt; EXECUTE
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
              animate={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.7)" }}
              className="absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl text-fuchsia-500 font-bold mb-2 tracking-widest uppercase drop-shadow-[2px_2px_0px_theme(colors.cyan.500)] glitch-anim text-center"
              >
                CRITICAL_ERROR <br/> SYS_HALT
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 font-sans mb-8 tracking-[0.2em]"
              >
                SCORE_LOG: <span className="text-cyan-400 font-bold">{score}</span>
              </motion.p>
              
              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-black text-fuchsia-500 border-2 border-fuchsia-500 font-sans uppercase tracking-[0.2em] text-sm hover:bg-fuchsia-500 hover:text-black transition-none group"
              >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" /> &gt; REBOOT
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-center">
         <p className="text-gray-500 font-sans text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
            INPUT_REQUIREMENT: <span className="px-2 py-1 bg-black border border-cyan-500/50 text-cyan-400">WASD</span> // <span className="px-2 py-1 bg-black border border-fuchsia-500/50 text-fuchsia-400">ARROWS</span>
         </p>
      </div>
    </div>
  );
}
