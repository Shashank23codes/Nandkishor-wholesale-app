import React from 'react'
import { Home, PlusCircle, Settings, Shirt, X } from 'lucide-react'

const NAV = [
  { id: 'home',     label: 'Home',        sub: 'View products', Icon: Home },
  { id: 'add',      label: 'Add Product', sub: 'New entry',     Icon: PlusCircle },
  { id: 'settings', label: 'Settings',    sub: 'App Config',    Icon: Settings },
]

export default function Sidebar({ activePage, setActivePage, isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-52 bg-slate-900 border-r border-slate-800
        flex flex-col shrink-0 h-full
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Brand */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <Shirt className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">Nandkishor</p>
            <p className="text-[11px] text-slate-500 leading-tight">Wholesale Catalog</p>
          </div>
        </div>
        {/* Close — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 text-slate-500 hover:text-white rounded-md hover:bg-slate-800 transition-colors shrink-0 ml-2"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {NAV.map(({ id, label, sub, Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => { setActivePage(id); onClose?.() }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left w-full transition-colors duration-150 ${
                active
                  ? 'bg-indigo-600/10 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-400' : ''}`}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <div>
                <p className={`text-sm font-medium leading-tight ${active ? 'text-indigo-300' : ''}`}>
                  {label}
                </p>
                <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{sub}</p>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 shrink-0">
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Hosiery · Garments · Uniforms
        </p>
      </div>
    </aside>
  )
}
