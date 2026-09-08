import React, { useState, useRef } from 'react';
import { Paintbrush, Eraser, RotateCcw, Send, Wand2, Sparkles } from 'lucide-react';
import { arcadeSound } from '../../utils/arcadeAudio';

const COLS = 32;
const ROWS = 16;

const STAMPS = {
  heart: [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ],
  ghost: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
  ],
  pacman: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],
  alien: [
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
  ],
};

export default function PixelStudioTab({ onBeamDoodle, currentGrid, setGrid }) {
  const [tool, setTool] = useState('draw');
  const isMouseDown = useRef(false);

  const grid = currentGrid || Array.from({ length: COLS }, () => Array(ROWS).fill(false));

  const setCell = (x, y, state) => {
    setGrid((prev) => {
      const copy = prev.map((col) => [...col]);
      copy[x][y] = state;
      return copy;
    });
  };

  const handleMouseDown = (x, y) => {
    isMouseDown.current = true;
    arcadeSound.playBlip();
    setCell(x, y, tool === 'draw');
  };

  const handleMouseEnter = (x, y) => {
    if (isMouseDown.current) {
      setCell(x, y, tool === 'draw');
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleClear = () => {
    arcadeSound.playBlip();
    setGrid(Array.from({ length: COLS }, () => Array(ROWS).fill(false)));
  };

  const handleInvert = () => {
    arcadeSound.playLaser();
    setGrid((prev) => prev.map((col) => col.map((cell) => !cell)));
  };

  const applyStamp = (key) => {
    arcadeSound.playPowerUp();
    const stamp = STAMPS[key];
    if (!stamp) return;
    const sR = stamp.length;
    const sC = stamp[0].length;
    const sX = Math.floor((COLS - sC) / 2);
    const sY = Math.floor((ROWS - sR) / 2);

    setGrid((prev) => {
      const copy = prev.map((col) => [...col]);
      for (let r = 0; r < sR; r++) {
        for (let c = 0; c < sC; c++) {
          if (stamp[r][c]) copy[sX + c][sY + r] = true;
        }
      }
      return copy;
    });
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="flex flex-col gap-4 animate-in fade-in duration-200 select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 font-sans">
            Pixel Canvas Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Draw custom 32&times;16 pixel graphics with mouse/touch and beam them straight to the OLED.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('draw')}
            className={`p-2 rounded-xl border text-xs transition-all ${
              tool === 'draw'
                ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Pencil"
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('erase')}
            className={`p-2 rounded-xl border text-xs transition-all ${
              tool === 'erase'
                ? 'bg-amber-500 border-amber-400 text-zinc-950 font-bold shadow-sm'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <button
            onClick={handleInvert}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs transition-colors"
            title="Invert Pixels"
          >
            <Wand2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 text-xs transition-colors"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 32x16 Pixel Drawing Board */}
      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-center shadow-inner">
        <div
          className="grid gap-[1px] bg-zinc-900 p-1.5 rounded-xl w-full max-w-2xl"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            aspectRatio: '2 / 1',
          }}
        >
          {Array.from({ length: ROWS }).map((_, y) =>
            Array.from({ length: COLS }).map((_, x) => {
              const active = grid[x]?.[y];
              return (
                <div
                  key={`${x}-${y}`}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseEnter={() => handleMouseEnter(x, y)}
                  className={`cursor-crosshair rounded-[1px] transition-colors ${
                    active
                      ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                      : 'bg-zinc-950 hover:bg-zinc-800'
                  }`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Stamps & Beam Action */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-zinc-500 uppercase mr-1">
            Stamps:
          </span>
          <button
            onClick={() => applyStamp('heart')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300"
          >
            ♥ Heart
          </button>
          <button
            onClick={() => applyStamp('ghost')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300"
          >
            👻 Ghost
          </button>
          <button
            onClick={() => applyStamp('pacman')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300"
          >
            👾 Arcade
          </button>
          <button
            onClick={() => applyStamp('alien')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300"
          >
            👽 Alien
          </button>
        </div>

        <button
          onClick={() => {
            arcadeSound.playVictory();
            onBeamDoodle(grid);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Beam To Physical OLED</span>
        </button>
      </div>
    </div>
  );
}
