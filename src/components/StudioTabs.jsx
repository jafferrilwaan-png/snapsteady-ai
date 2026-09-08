import React from 'react';
import { Gamepad2, Smile, Paintbrush, MessageSquare, Settings } from 'lucide-react';
import { arcadeSound } from '../utils/arcadeAudio';

const TABS = [
  { id: 'games', label: 'Pixel Games', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 'pet', label: 'Companion Visor', icon: <Smile className="w-4 h-4" /> },
  { id: 'pixel', label: 'Pixel Canvas', icon: <Paintbrush className="w-4 h-4" /> },
  { id: 'marquee', label: 'Status Marquee', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export default function StudioTabs({ activeTab, onSelectTab }) {
  return (
    <div className="flex items-center justify-center p-1.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                arcadeSound.playBlip();
                onSelectTab(tab.id);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-sans font-medium transition-all active:scale-95 ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                {tab.icon}
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
