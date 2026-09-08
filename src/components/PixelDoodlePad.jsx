import React, { useState, useRef } from 'react';
import { Paintbrush, Eraser, RotateCcw, Send, Sparkles, Wand2 } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

const COLS = 32;
const ROWS = 16;

const PRESET_STAMPS = {
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

export default function PixelDoodlePad({ onBeamDoodle, currentGrid, setGrid }) {
  const [tool, setTool] = useState('draw'); // 'draw' | 'erase'
  const isMouseDownRef = useRef(false);

  // Initialize empty grid if needed
  const grid = currentGrid || Array.from({ length: COLS }, () => Array(ROWS).fill(false));

  const updateCell = (x, y, state) => {
    setGrid((prev) => {
      const copy = prev.map((col) => [...col]);
      copy[x][y] = state;
      return copy;
    });
  };

  const handleMouseDown = (x, y) => {
    isMouseDownRef.current = true;
    arcadeSound.playBlip();
    updateCell(x, y, tool === 'draw');
  };

  const handleMouseEnter = (x, y) => {
    if (isMouseDownRef.current) {
      updateCell(x, y, tool === 'draw');
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleClear = () => {
    arcadeSound.playBlip();
    setGrid(Array.from({ length: COLS }, () => Array(ROWS).fill(false)));
  };

  const handleInvert = () => {
    arcadeSound.playLaser();
    setGrid((prev) => prev.map((col) => col.map((cell) => !cell)));
  };

  const applyStamp = (stampKey) => {
    arcadeSound.playPowerUp();
    const stamp = PRESET_STAMPS[stampKey];
    if (!stamp) return;

    const sRows = stamp.length;
    const sCols = stamp[0].length;
    const startX = Math.floor((COLS - sCols) / 2);
    const startY = Math.floor((ROWS - sRows) / 2);

    setGrid((prev) => {
      const copy = prev.map((col) => [...col]);
      for (let r = 0; r < sRows; r++) {
        for (let c = 0; c < sCols; c++) {
          if (stamp[r][c]) {
            copy[startX + c][startY + r] = true;
          }
        }
      }
      return copy;
    });
  };

  const handleBeam = () => {
    arcadeSound.playVictory();
    onBeamDoodle(grid);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
            Pixel Art Doodle Pad
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
            {COLS} &times; {ROWS}
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTool('draw')}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              tool === 'draw'
                ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Pencil"
          >
            <Paintbrush className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('erase')}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              tool === 'erase'
                ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleInvert}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs transition-colors"
            title="Invert Pixels"
          >
            <Wand2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-950/60 border border-white/10 hover:border-rose-700 text-slate-400 hover:text-rose-300 text-xs transition-colors"
            title="Clear Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawing Grid */}
      <div className="p-2.5 rounded-2xl bg-black/80 border border-white/10 overflow-x-auto flex justify-center shadow-inner">
        <div
          className="grid gap-[1px] bg-slate-900/60 p-1 rounded-xl"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            width: '100%',
            maxWidth: '560px',
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
                      ? 'bg-purple-400 shadow-[0_0_6px_#c084fc]'
                      : 'bg-slate-950/80 hover:bg-purple-950/40'
                  }`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Stamp Presets & Beam Button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Stamps:
          </span>
          <button
            onClick={() => applyStamp('heart')}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-purple-950 border border-white/10 text-xs text-slate-300 hover:text-purple-300 transition-colors"
          >
            ♥ Heart
          </button>
          <button
            onClick={() => applyStamp('ghost')}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-purple-950 border border-white/10 text-xs text-slate-300 hover:text-purple-300 transition-colors"
          >
            👻 Ghost
          </button>
          <button
            onClick={() => applyStamp('pacman')}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-purple-950 border border-white/10 text-xs text-slate-300 hover:text-purple-300 transition-colors"
          >
            👾 Arcade
          </button>
          <button
            onClick={() => applyStamp('alien')}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-purple-950 border border-white/10 text-xs text-slate-300 hover:text-purple-300 transition-colors"
          >
            👽 Alien
          </button>
        </div>

        <button
          onClick={handleBeam}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-lg shadow-purple-950/50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Beam To OLED</span>
        </button>
      </div>
    </div>
  );
}
