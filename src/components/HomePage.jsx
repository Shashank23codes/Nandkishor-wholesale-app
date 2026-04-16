import React, { useState, useMemo } from 'react'
import { 
  LayoutGrid, Table2, Plus, Package, Shirt, Download, Loader2, 
  Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal 
} from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import { exportCatalog } from '../utils/exportUtils.js'

const ITEMS_PER_PAGE = 12

export default function HomePage({ products, onAddClick, onProductClick }) {
  const [view, setView] = useState('grid')
  const [isExporting, setIsExporting] = useState(false)
  
  // Search and Filter State
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  // Derive unique categories and genders for filters
  const categories = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.category).filter(Boolean))]
  }, [products])

  const genders = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.gender).filter(Boolean))]
  }, [products])

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = (p.name?.toLowerCase().includes(search.toLowerCase())) || 
                          (p.autoId?.toString().includes(search)) ||
                          (p.customCode?.toLowerCase().includes(search.toLowerCase()))
      
      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter
      const matchGender = genderFilter === 'All' || p.gender === genderFilter
      
      return matchSearch && matchCategory && matchGender
    })
  }, [products, search, categoryFilter, genderFilter])

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter, genderFilter])

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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

      {/* ── Header & Main Controls ── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Product Catalog</h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredProducts.length} of {products.length} items found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                setIsExporting(true)
                await exportCatalog(products)
                setIsExporting(false)
              }}
              disabled={isExporting}
              className="flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-50 transition-all"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Export CSV</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-800 mx-1" />
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-sm">
          <div className="md:col-span-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search by ID, name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
          
          <div className="md:col-span-3 relative flex items-center">
            <Filter className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 relative flex items-center">
            <SlidersHorizontal className="absolute left-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
            >
              <option value="All">All Genders</option>
              {genders.filter(g => g !== 'All').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center bg-slate-950/50 border border-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('grid')}
              className={`flex-1 flex items-center justify-center h-8 rounded-lg transition-all ${
                view === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex-1 flex items-center justify-center h-8 rounded-lg transition-all ${
                view === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Package className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">No results matching your filters</p>
          <button 
            onClick={() => { setSearch(''); setCategoryFilter('All'); setGenderFilter('All'); }}
            className="mt-2 text-xs text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <>
          {/* ── Content View ── */}
          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} p={p} onClick={onProductClick} />
              ))}
            </div>
          ) : (
            <div className="border border-slate-800/60 rounded-2xl overflow-hidden bg-slate-900/20 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-900/60 border-b border-slate-800">
                    <tr>
                      {['ID','Info','Category','Gender','Fabric','Sizes & Price'].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {paginatedProducts.map((p) => (
                      <tr
                        key={p._id || p.id}
                        onClick={() => onProductClick(p)}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono font-bold text-indigo-400/80">#{p.autoId}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {p.images[0] ? (
                              <img src={p.images[0].src} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                                <Shirt className="w-5 h-5 text-slate-600" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-white truncate max-w-[200px]">{p.name}</span>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{p.customCode || 'No Code'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">{p.category}</span></td>
                        <td className="px-4 py-3"><span className="text-xs text-slate-400 font-medium">{p.gender || '—'}</span></td>
                        <td className="px-4 py-3"><span className="text-xs text-slate-400 font-medium">{p.fabric || '—'}</span></td>
                        <td className="px-4 py-3">
                           <div className="flex flex-wrap gap-1">
                              {p.sizePricings.slice(0, 3).map((sp, i) => (
                                <span key={i} className="text-[10px] font-bold text-emerald-400/90">
                                  {sp.size}:₹{sp.price}
                                </span>
                              ))}
                              {p.sizePricings.length > 3 && <span className="text-[10px] text-slate-500">+{p.sizePricings.length-3}</span>}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/60">
              <p className="text-xs font-medium text-slate-500">
                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-800 hover:border-slate-600 disabled:opacity-30 disabled:hover:border-slate-800 transition-all text-slate-400 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i+1}
                      onClick={() => setCurrentPage(i+1)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i+1 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                          : 'text-slate-500 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {i+1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-800 hover:border-slate-600 disabled:opacity-30 disabled:hover:border-slate-800 transition-all text-slate-400 hover:text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
