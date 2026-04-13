import React, { useState, useEffect } from 'react'
import { FolderOpen, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const [storagePath, setStoragePath] = useState('')
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [updateStatus, setUpdateStatus] = useState('Your app is up to date')

  useEffect(() => {
    async function loadSettings() {
      if (window.electron) {
        const path = await window.electron.getStoragePath()
        setStoragePath(path || 'Not set (Using default)')
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
      toast.success('Storage path updated!')
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
    <div className="max-w-3xl mx-auto py-10 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-2">Configure your local hardware and app preferences.</p>
      </div>

      <div className="space-y-8">
        {/* Storage Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Data Storage</h2>
              <p className="text-xs text-slate-500">Where your products and images are saved on this PC.</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-between group">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Current Location</p>
              <p className="text-sm text-slate-300 font-mono truncate">{storagePath}</p>
            </div>
            <button
              onClick={handleSelectFolder}
              className="ml-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              Change Folder
            </button>
          </div>

          <div className="flex items-start gap-2 px-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              All images and your catalog database will be stored inside this folder. Keep this folder safe to prevent data loss.
            </p>
          </div>
        </section>

        {/* Updates Section */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Application Updates</h2>
              <p className="text-xs text-slate-500">Manage the version of your Nandkishor Wholesale app.</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-emerald-400 gap-1.5 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                {updateStatus}
              </div>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase tracking-widest border border-slate-700">v1.0.0</span>
            </div>
            <button
              onClick={checkUpdates}
              disabled={isCheckingUpdate}
              className={`px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-all border border-slate-700 flex items-center gap-2 ${isCheckingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
              Check for Updates
            </button>
          </div>
        </section>

        {/* About Info */}
        <div className="text-center pt-10">
          <p className="text-[11px] text-slate-600">Built for Windows · Developed by Antigravity</p>
        </div>
      </div>
    </div>
  )
}
