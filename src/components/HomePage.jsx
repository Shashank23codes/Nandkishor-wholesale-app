import React, { useState } from 'react'
import { LayoutGrid, Table2, Plus, Package, Shirt, Download, Loader2 } from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import { exportCatalog } from '../utils/exportUtils.js'

export default function HomePage({ products, onAddClick, onProductClick }) {
  const [view, setView]               = useState('grid')
  const [isExporting, setIsExporting] = useState(false)

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 text-center p-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Package className="w-7 h-7 text-slate-700" />
        </div>
        <div>
          <p className="text-base font-semibold text-white">No products yet</p>
          <p className="text-xs text-slate-500 mt-1">Add your first product to the catalog.</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 h-9 px-4 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-semibold text-white">Product Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {products.length} item{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Catalog */}
          <button
            onClick={async () => {
              setIsExporting(true)
              await exportCatalog(products)
              setIsExporting(false)
            }}
            disabled={isExporting}
            title="Download catalog with images"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-50 disabled:cursor-wait transition-colors"
          >
            {isExporting
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isExporting ? 'Preparing…' : 'Export'}
            </span>
          </button>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 gap-0.5">
            {[
              { id: 'grid',  Icon: LayoutGrid, label: 'Grid'  },
              { id: 'table', Icon: Table2,      label: 'Table' },
            ].map(({ id, Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors ${
                  view === id ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ── Grid view ── */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p._id || p.id} p={p} onClick={onProductClick} />
          ))}
        </div>
      )}

      {/* ── Table view ── */}
      {view === 'table' && (
        <div className="border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                {['Auto ID','Code','Product','Category','Subcategory','Gender','Fabric','Sizes & Pricing','Colours','Photos'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {products.map((p) => (
                <tr
                  key={p._id || p.id}
                  onClick={() => onProductClick(p)}
                  className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-indigo-400">{p.autoId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400">{p.customCode || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {p.images[0] ? (
                        <img src={p.images[0].src} alt="" className="w-8 h-8 rounded-md object-cover shrink-0 border border-slate-800" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                          <Shirt className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-white max-w-[140px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-300">{p.category}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-400">{p.subcategory}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-400">{p.gender || '—'}</span></td>
                  <td className="px-4 py-3"><span className="text-xs text-slate-400">{p.fabric || '—'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.sizePricings.map((sp, i) => (
                        <span key={i} className="text-[11px] bg-slate-800 border border-slate-700/50 text-slate-300 rounded px-1.5 py-0.5">
                          {sp.size} <span className="text-indigo-400">₹{Number(sp.price).toLocaleString('en-IN')}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.colors?.filter(Boolean).length > 0
                        ? p.colors.filter(Boolean).map((c, i) => (
                            <span key={i} className="text-[11px] bg-slate-800 text-slate-300 rounded px-1.5 py-0.5">
                              {typeof c === 'object' ? c.name : c}
                            </span>
                          ))
                        : <span className="text-slate-600 text-xs">—</span>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400">{p.images.length}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
