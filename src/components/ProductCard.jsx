import React from 'react';
import { Shirt, Info } from 'lucide-react';

export default function ProductCard({ p, onClick }) {
  const minPrice = p.sizePricings && p.sizePricings.length > 0 
    ? Math.min(...p.sizePricings.map(sp => Number(sp.price) || 0))
    : 0;

  return (
    <button
      onClick={() => onClick(p)}
      className="group relative flex flex-col bg-slate-900/40 rounded-xl border border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-300 text-left overflow-hidden h-full w-full"
    >
      {/* Image Area */}
      <div className="relative aspect-[1/1.1] bg-slate-950 overflow-hidden w-full shrink-0">
        {p.images[0] ? (
          <img
            src={p.images[0].src}
            alt={p.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Shirt className="w-6 h-6 text-slate-800" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-600/90 backdrop-blur-md text-white px-1.5 py-0.5 rounded shadow-sm border border-white/10">
            {p.category}
          </span>
        </div>
        
        {/* Floating ID badge */}
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-black/40 backdrop-blur-md text-white/90 px-1.5 py-0.5 rounded border border-white/10 shadow-sm">
            #{p.autoId}
          </span>
        </div>

        {/* Info Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
            <Info className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        
        {/* Title & Custom Code */}
        <div className="space-y-0.5">
          {p.customCode && (
            <p className="text-[9px] uppercase font-bold tracking-widest text-indigo-400/80 truncate">{p.customCode}</p>
          )}
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {p.name}
          </h3>
        </div>

        {/* Pricing & Sizes */}
        <div className="mt-auto">
          {minPrice > 0 ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-medium text-slate-500 uppercase">From</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{minPrice.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="flex gap-1">
                {p.sizePricings.slice(0, 2).map((sp, i) => (
                  <span key={i} className="text-[9px] font-bold bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-slate-700/50">
                    {sp.size}
                  </span>
                ))}
                {p.sizePricings.length > 2 && (
                  <span className="text-[9px] font-bold text-slate-600 self-center">
                    +{p.sizePricings.length - 2}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-[10px] text-slate-600 font-medium">No price set</span>
          )}
        </div>
      </div>
    </button>
  );
}
