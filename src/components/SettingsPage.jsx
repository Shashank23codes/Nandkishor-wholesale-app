import React, { useState, useEffect } from 'react'
import { FolderOpen, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const [storagePath, setStoragePath] = useState('')
  const [posterPath, setPosterPath] = useState('')
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('Your app is up to date')

  useEffect(() => {
    async function loadSettings() {
      if (window.electron) {
        const path = await window.electron.getStoragePath()
        const pPath = await window.electron.getPosterStoragePath()
        setStoragePath(path || 'Not set (Using default)')
        setPosterPath(pPath || 'Not set (Using default)')
      }
    }
    loadSettings()
  }, [])

  const handleSelectFolder = async () => {
    if (!window.electron) {
      toast.error('Electron features not available in browser')
      return
    }

    const newPath = await window.electron.selectFolder()
    if (newPath) {
      setStoragePath(newPath)
      window.electron.restartServer()
      toast.success('Database folder updated! Reloading app...', { duration: 3000 })
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  const handleSelectPosterFolder = async () => {
    if (!window.electron) {
      toast.error('Electron features not available in browser')
      return
    }

    const newPath = await window.electron.selectPosterFolder()
    if (newPath) {
      setPosterPath(newPath)
      window.electron.restartServer()
      toast.success('Poster location updated! Reloading app...', { duration: 3000 })
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  const checkUpdates = () => {
    setIsCheckingUpdate(true)
    // In a real app, this would trigger electron-updater
    setTimeout(() => {
      setIsCheckingUpdate(false)
      toast.success('No updates found')
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2">Configure your local hardware and app preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Data Storage Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Database & Images</h2>
              <p className="text-xs text-slate-500">Core catalog data and product photos.</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 group hover:border-slate-700 transition-colors">
            <div className="min-w-0 mb-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-indigo-500" />
                Root Folder
              </p>
              <p className="text-xs text-slate-300 font-mono truncate bg-slate-900/50 p-2 rounded border border-slate-800/50">{storagePath}</p>
            </div>
            <button
              onClick={handleSelectFolder}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2"
            >
              Change Database Folder
            </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed italic px-1">
             Images and the SQLite database will reside here.
          </p>
        </section>

        {/* Poster Storage Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Save className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Showcase Posters</h2>
              <p className="text-xs text-slate-500">Destination for generated marketing posters.</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 group hover:border-slate-700 transition-colors">
            <div className="min-w-0 mb-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                Export Location
              </p>
              <p className="text-xs text-slate-300 font-mono truncate bg-slate-900/50 p-2 rounded border border-slate-800/50">{posterPath}</p>
            </div>
            <button
              onClick={handleSelectPosterFolder}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all border border-white/5 active:scale-95 flex items-center justify-center gap-2"
            >
              Set Poster Location
            </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed italic px-1">
             When you click "Save to PC" in showcase, images go here.
          </p>
        </section>

        {/* Updates Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Application Updates</h2>
              <p className="text-xs text-slate-500">Keep your software running with the latest features.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-emerald-500/10 text-emerald-400 gap-2 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {updateStatus}
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-black rounded uppercase tracking-widest border border-slate-700">v1.0.0</span>
            </div>
            <button
              onClick={checkUpdates}
              disabled={isCheckingUpdate}
              className={`w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black rounded-lg transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 uppercase tracking-widest ${isCheckingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
              Search Updates
            </button>
          </div>
        </section>

        {/* About Info */}
        <div className="md:col-span-2 text-center pt-6 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nandkishor Wholesale · 2024 · Developed by Code Clover Studio</p>
        </div>
      </div>
    </div>
  )
}
