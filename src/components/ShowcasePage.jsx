/**
 * ShowcasePage.jsx
 * ─────────────────────────────────────────────────────────
 * Full-screen showcase wrapper — the "workbench" view.
 *
 * Responsibilities:
 *   1. Renders the app-themed top bar (Back button + Download button)
 *   2. Centers the <ShowcasePoster> on a dark canvas background
 *   3. Handles the html-to-image export logic (keeping it out of ProductDetailPage)
 *
 * Props:
 *   product     (object)   — full product data
 *   onClose     (function) — called when user clicks "Back to Product"
 * ─────────────────────────────────────────────────────────
 */

import React, { useState } from 'react'
import { 
  ArrowLeft, DownloadCloud, Loader2, Save,
  Columns2, Layout, Square, Terminal 
} from 'lucide-react'
import * as htmlToImage from 'html-to-image'
import ShowcasePoster from './ShowcasePoster.jsx'

export default function ShowcasePage({ product: p, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [activeLayout, setActiveLayout] = useState('classic')
  const [customDesc, setCustomDesc] = useState('')

  const handleDownload = async () => {
    const el = document.getElementById('live-poster-node')
    if (!el) {
      console.warn('[ShowcasePage] Capture element #live-poster-node not found.')
      return
    }
    setIsDownloading(true)
    try {
      const dataUrl = await htmlToImage.toPng(el, {
        pixelRatio: 2,
        backgroundColor: activeLayout === 'dark' ? '#020617' : (activeLayout === 'social' ? null : '#ffffff'),
        skipWebFonts: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
        cacheBust: true, // Force re-render of images
      })
      const link = document.createElement('a')
      link.download = `Showcase_${p.name.replace(/\s+/g, '_')}_${activeLayout}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('[ShowcasePage] Export failed:', err)
      alert("Download failed. Please check your browser's console for security errors.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSaveToPC = async () => {
    const el = document.getElementById('live-poster-node')
    if (!el) return
    setIsDownloading(true)
    try {
      const dataUrl = await htmlToImage.toPng(el, {
        pixelRatio: 2,
        backgroundColor: activeLayout === 'dark' ? '#020617' : (activeLayout === 'social' ? null : '#ffffff'),
        skipWebFonts: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' },
      })
      
      const res = await fetch('http://localhost:5000/api/save-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          filename: `Poster_${p.autoId}_${activeLayout}`
        })
      })
      
      if (res.ok) {
        alert('Poster saved successfully to your local folder!')
      } else {
        throw new Error('Failed to save to PC')
      }
    } catch (err) {
      console.error('Save to PC error:', err)
      alert('Error saving to PC. Please ensure the backend is running.')
    } finally {
      setIsDownloading(false)
    }
  }

  const layouts = [
    { id: 'classic', icon: Columns2, label: 'Classic' },
    { id: 'minimal', icon: Layout, label: 'Minimal' },
    { id: 'social', icon: Square, label: 'Social' },
    { id: 'dark', icon: Terminal, label: 'Terminal' },
  ]

  const getExportSize = () => {
    if (activeLayout === 'social') return '1080 × 1080 · 2×'
    return '1080 × 650 · 2×'
  }

  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >

      {/* ── Top Bar (matches app design system) ── */}
      <header className="flex-shrink-0 bg-slate-950 border-b border-slate-800/60 px-8 py-4 flex items-center justify-between">

        {/* Left: Back + product name breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2.5 h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-widest group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <div className="h-6 w-px bg-slate-800" />
          
          {/* Layout Selector */}
          <div className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            {layouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLayout(l.id)}
                className={`flex items-center gap-2 px-3 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeLayout === l.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title={l.label}
              >
                <l.icon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{l.label}</span>
              </button>
            ))}
          </div>

          {/* Social Poster Description Input */}
          {activeLayout === 'social' && (
            <div className="hidden xl:flex items-center gap-2 ml-2 bg-slate-900 border border-slate-700/50 rounded-xl px-4 h-10 w-80 lg:w-96">
              <input 
                type="text" 
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Custom square post description..."
                className="bg-transparent border-none text-[11px] font-bold text-white placeholder:text-slate-600 focus:outline-none w-full"
              />
            </div>
          )}
        </div>

        {/* Right: export info + download button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
              Export Format
            </span>
            <span className="text-xs font-mono text-slate-400">{getExportSize()} PNG</span>
          </div>
          <button
            onClick={handleSaveToPC}
            disabled={isDownloading}
            className="flex items-center gap-2.5 h-10 px-5 text-xs font-black rounded-xl bg-slate-100 hover:bg-white disabled:opacity-60 text-slate-900 transition-all uppercase tracking-widest shadow-lg shadow-white/5 active:scale-95"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save to PC
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2.5 h-10 px-7 text-xs font-black rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white transition-all uppercase tracking-widest shadow-lg shadow-indigo-900/40"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
            {isDownloading ? 'Capturing…' : 'Download'}
          </button>
        </div>
      </header>

      {/* ── Canvas / Workbench Area ── */}
      <main
        className="flex-1 overflow-auto flex items-start justify-center py-10 px-8"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(79,70,229,0.06) 0%, transparent 66%)',
        }}
      >
        <ShowcasePoster product={p} layout={activeLayout} customDesc={customDesc} />
      </main>
    </div>
  )
}

