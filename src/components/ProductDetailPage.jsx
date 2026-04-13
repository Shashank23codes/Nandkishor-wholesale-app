/**
 * ProductDetailPage.jsx
 * ─────────────────────────────────────────────────────────
 * Displays full product details: gallery, specs, pricing table,
 * related products, delete confirmation.
 *
 * Showcase mode is fully delegated to ShowcasePage + ShowcasePoster.
 * ─────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft, Pencil, Trash2, Hash, Shirt, X,
  ChevronLeft, ChevronRight, Share2, Layers, Check,
  DownloadCloud,
} from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import ShowcasePage from './ShowcasePage.jsx'

export default function ProductDetailPage({
  product: p,
  allProducts,
  onBack,
  onEdit,
  onDelete,
  onProductClick,
}) {
  const [activeImg, setActiveImg]           = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [copied, setCopied]                 = useState(false)
  const [isShowcaseMode, setIsShowcaseMode] = useState(false)

  // Reset active image whenever the viewed product changes
  useEffect(() => { setActiveImg(0) }, [p._id || p.id])

  // Limit related products to the same category (max 5)
  const related = allProducts
    .filter((x) => x.category === p.category && (x._id || x.id) !== (p._id || p.id))
    .slice(0, 5)

  const prevImg = () => setActiveImg((i) => (i - 1 + p.images.length) % p.images.length)
  const nextImg = () => setActiveImg((i) => (i + 1) % p.images.length)

  const copyLink = () => {
    navigator.clipboard.writeText(
      `Product: ${p.name}\nCode: ${p.autoId}\nCategory: ${p.category}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lowestPrice =
    p.sizePricings?.length > 0
      ? Math.min(...p.sizePricings.map((sp) => Number(sp.price)))
      : null

  // ── Showcase Mode: delegate to dedicated component ──
  if (isShowcaseMode) {
    return (
      <ShowcasePage
        product={p}
        onClose={() => setIsShowcaseMode(false)}
      />
    )
  }

  // ── Normal Product Detail View ──
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8 lg:space-y-12">

      {/* ── Top Action Bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          Back to Catalog
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 h-9 px-4 text-xs font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Info'}</span>
          </button>

          <button
            onClick={() => setIsShowcaseMode(true)}
            className="flex items-center gap-2 h-9 px-4 text-xs font-bold rounded-lg bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20 transition-colors uppercase"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Showcase</span>
          </button>

          <div className="w-px h-5 bg-slate-800 mx-2" />

          <button
            onClick={onEdit}
            className="flex items-center gap-2 h-9 px-4 text-xs font-bold tracking-wide rounded-lg bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors uppercase"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 h-9 px-4 text-xs font-bold tracking-wide rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors uppercase"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* ── Hero Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-start">

        {/* LEFT: Image Gallery */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="relative aspect-[4/5] sm:aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group shadow-2xl">
            {p.images.length > 0 ? (
              <img
                key={activeImg}
                src={p.images[activeImg]?.src}
                alt={p.name}
                className="w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-700 bg-slate-900/50">
                <Shirt className="w-20 h-20 opacity-50" />
                <p className="text-sm font-medium">No Image Available</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {p.images.length > 1 && (
              <>
                <button
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {p.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`rounded-full transition-all duration-300 shadow-sm ${
                        i === activeImg
                          ? 'w-8 h-1.5 bg-indigo-500'
                          : 'w-2 h-1.5 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-black uppercase tracking-widest bg-indigo-600/90 backdrop-blur-md shadow-lg text-white px-3 py-1.5 rounded border border-indigo-500/50">
                {p.category}
              </span>
            </div>
          </div>

          {p.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x mt-4">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative shrink-0 w-20 h-24 rounded-xl overflow-hidden snap-start transition-all duration-300 ${
                    activeImg === i
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 opacity-100 scale-105'
                      : 'border border-slate-800 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Details */}
        <div className="flex flex-col gap-8 lg:gap-10">

          {/* Title & IDs */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 border border-indigo-500/30 bg-indigo-500/10 rounded-md px-2.5 py-1 shadow-sm">
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-xs font-bold text-indigo-300">{p.autoId}</span>
              </div>
              {p.customCode && (
                <span className="text-xs font-bold tracking-widest uppercase bg-slate-800 border border-slate-700 text-slate-400 rounded-md px-2.5 py-1">
                  {p.customCode}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
              {p.name}
            </h1>

            {lowestPrice !== null && (
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl lg:text-5xl font-black text-emerald-400 drop-shadow-md">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </p>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  Base Rate
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Specifications Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2 uppercase tracking-wide">
              Product Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <SpecCell label="Category"    value={p.category} />
              <SpecCell label="Subcategory" value={p.subcategory} />
              <SpecCell label="Gender"      value={p.gender || '—'} />
              <SpecCell label="Fabric"      value={p.fabric || '—'} />
            </div>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Available Colors */}
          {p.colors?.filter(Boolean).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
                Available Colors
              </h3>
              <div className="flex flex-wrap gap-3">
                {p.colors.filter(Boolean).map((c, i) => {
                  const name = typeof c === 'object' ? c.name : c;
                  const hex = typeof c === 'object' ? c.hex : c;
                  return (
                    <span
                      key={i}
                      className="flex items-center gap-2.5 text-sm font-bold bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-4 py-2 hover:bg-slate-800 hover:border-slate-600 transition-colors shadow-sm"
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)] inline-block border border-slate-400" 
                        style={{ background: hex?.toLowerCase().trim() }}
                      />
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes & Pricing Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">
              Sizes &amp; Wholesale Pricing
            </h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800">
                    <th className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 py-4">
                      Size
                    </th>
                    <th className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 py-4 text-right">
                      Rate per Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {p.sizePricings.map((sp, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-3.5 text-sm font-bold text-white">
                        <span className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 shadow-sm group-hover:border-indigo-500/30 transition-colors">
                          {sp.size}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-xl font-black text-emerald-400/90 group-hover:text-emerald-400 transition-colors">
                          ₹{Number(sp.price).toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Timestamps */}
          {p.createdAt && (
            <div className="pt-6 border-t border-slate-800/80">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Added {fmtDate(p.createdAt)}
                {p.updatedAt && ` • Updated ${fmtDate(p.updatedAt)}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-800">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shadow-lg">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                More from {p.category}
              </h2>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Explore similar items in our catalog
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {related.map((r) => (
              <ProductCard
                key={r._id || r.id}
                p={r}
                onClick={(prod) => {
                  onProductClick(prod)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-red-900/30 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5 border border-red-500/20 shadow-inner">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Product</h3>
              <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="text-white font-bold">"{p.name}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 rounded-xl border border-slate-700 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(p._id || p.id)}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-bold text-white transition-colors uppercase tracking-wide shadow-lg shadow-red-900/50"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ── Sub-components ──────────────────────────────────────

function SpecCell({ label, value }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-colors shadow-sm">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-sm sm:text-base font-bold text-slate-200 truncate">
        {value || 'N/A'}
      </p>
    </div>
  )
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
