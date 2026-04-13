import React from 'react';
import { Shirt } from 'lucide-react';

export default function ProductCard({ p, onClick }) {
  return (
    <button
      onClick={() => onClick(p)}
      className="group relative flex flex-col bg-slate-900 rounded-2xl border border-slate-800 hover:border-indigo-500/30 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] transition-all duration-300 text-left overflow-hidden h-full flex-1 w-full"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden w-full shrink-0">
        {p.images[0] ? (
          <img
            src={p.images[0].src}
            alt={p.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Shirt className="w-8 h-8 text-slate-800" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm shadow-sm border border-indigo-500/20">
            {p.category}
          </span>
          {p.images.length > 1 && (
            <span className="text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-sm shadow-sm border border-white/10">
              +{p.images.length - 1} Photos
            </span>
          )}
        </div>
        
        {/* Floating ID badge */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded-sm border border-white/20 shadow-sm">
            {p.autoId}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-gradient-to-b from-slate-900 to-slate-950/80">
        
        {/* Title & Custom Code */}
        <div>
          {p.customCode && (
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">{p.customCode}</p>
          )}
          <h3 className="text-sm md:text-base font-bold text-white leading-tight line-clamp-2 group-hover:text-indigo-400 transition-colors">
            {p.name}
          </h3>
        </div>

        {/* Spacer to push pricing to bottom */}
        <div className="flex-1" />

        {/* Pricing & Sizes */}
        {p.sizePricings && p.sizePricings.length > 0 && (
          <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between gap-2 mt-auto">
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">Base Rate</p>
              <p className="text-lg font-black text-emerald-400">
                ₹{Math.min(...p.sizePricings.map(sp => Number(sp.price) || 0)).toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
              {p.sizePricings.slice(0, 3).map((sp, i) => (
                <span key={i} className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 shadow-sm">
                  {sp.size}
                </span>
              ))}
              {p.sizePricings.length > 3 && (
                <span className="text-[10px] font-bold text-slate-500 self-center ml-0.5">
                  +{p.sizePricings.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
