import React, { useState, useRef, useEffect } from 'react'
import { ImagePlus, X, Plus, Trash2, ChevronDown, Hash, PlusCircle, List } from 'lucide-react'

/* ─── Domain data ─── */
const CATEGORIES = {
  'Workwear':      ['Office', 'Nurse', 'Factory', 'Chef', 'Safety'],
  'Rainwear':      ['Raincoat', 'Pants', 'Poncho', 'Apron'],
  'Houseware':     ['Bedsheet', 'Towel', 'Tablecloth', 'Napkin'],
  'Shirts':        ['Formal', 'Casual', 'Blouse', 'Kids'],
  'Tops':          ['T-shirt', 'Polo', 'Tank', 'Hoodie', 'Crop'],
  'Bottoms':       ['Trousers', 'Jeans', 'Chinos', 'Cargo'],
  'Dresses/Suits': ['Dress', 'Suit', 'Jumpsuit'],
  'Ethnic':        ['Kurta', 'Salwar', 'Saree', 'Dhoti', 'Sherwani'],
  'Outerwear':     ['Jacket', 'Windcheater', 'Blazer', 'Fleece'],
  'Innerwear':     ['Vest', 'Underwear', 'Nightwear', 'Pajama'],
  'Activewear':    ['Sports T', 'Sports Bra', 'Track', 'Compression'],
  'Swimwear':      ['Swimsuit', 'Bikini', 'Trunks', 'Cover-up'],
  'Kids Uniforms': ['School Shirt', 'School Pants', 'Tie', 'Socks', 'Set'],
}
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids', 'Boys', 'Girls']
const FABRICS = [
  'Cotton', 'Polyester', 'Cotton-Poly', 'Twill', 'PVC', 'PVC-Poly', 'Nylon', 'Terry', 
  'Poplin', 'Fleece', 'Spandex', 'Denim', 'Wool', 'Chiffon', 'Silk', 'Georgette', 
  'Poly-Spandex', 'Satin', 'Other'
]
const SIZES   = ['XS','S','M','L','XL','XXL','3XL','4XL','26','28','30','32','34','36','38','40','42','44','Free Size']

/* ─── Shared input / select classes ─── */
const INPUT  = 'bg-slate-800 border border-slate-700 rounded-md px-3 h-9 w-full text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-600'
const SELECT = 'bg-slate-800 border border-slate-700 rounded-md pl-3 pr-8 h-9 w-full text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

/* ─── Reusable wrappers ─── */
function Sel({ value, onChange, disabled, placeholder, children }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} disabled={disabled} className={SELECT}>
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
    </div>
  )
}

function Label({ children, error }) {
  return (
    <label className="block text-xs font-medium text-slate-400 mb-1.5">
      {children}
      {error && <span className="ml-2 text-red-400 font-normal">{error}</span>}
    </label>
  )
}

function SectionHead({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      {action}
    </div>
  )
}

/* ─── Main component ─── */
export default function AddDataPage({ onAdd, onUpdate, onCancel, nextSerial, productToEdit }) {
  const isEdit  = !!productToEdit
  const autoId  = isEdit ? productToEdit.autoId : `NK-${String(nextSerial).padStart(4, '0')}`

  /* Pre-fill when editing */
  const [customCode,   setCustomCode]   = useState(productToEdit?.customCode   ?? '')
  const [name,         setName]         = useState(productToEdit?.name         ?? '')
  const [category,     setCategory]     = useState(productToEdit?.category     ?? '')
  const [subcategory,  setSubcategory]  = useState(productToEdit?.subcategory  ?? '')
  const [gender,       setGender]       = useState(productToEdit?.gender       ?? '')
  const [fabric,       setFabric]       = useState(productToEdit?.fabric       ?? '')
  const [images,       setImages]       = useState(productToEdit?.images       ?? [])
  const [colors,       setColors]       = useState(productToEdit?.colors?.length ? productToEdit.colors : [{ name: '', hex: '' }])
  const [sizePricings, setSizePricings] = useState(productToEdit?.sizePricings?.length ? productToEdit.sizePricings : [{ size: '', price: '' }])
  const [errors,       setErrors]       = useState({})
  
  // --- New: Custom Input Toggles ---
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  const [useCustomSubcategory, setUseCustomSubcategory] = useState(false)
  const [useCustomFabric, setUseCustomFabric] = useState(false)

  const fileRef = useRef()

  // ─── Draft Persistence ───
  const DRAFT_KEY = 'nk_product_draft'

  // Load draft on mount (only for new products)
  useEffect(() => {
    if (isEdit) return
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        const d = JSON.parse(saved)
        if (d.name) setName(d.name)
        if (d.category) {
          setCategory(d.category)
          if (d.category && !CATEGORIES[d.category]) setUseCustomCategory(true)
        }
        if (d.subcategory) {
          setSubcategory(d.subcategory)
          if (d.category && CATEGORIES[d.category] && !CATEGORIES[d.category].includes(d.subcategory)) setUseCustomSubcategory(true)
          else if (d.category && !CATEGORIES[d.category]) setUseCustomSubcategory(true)
        }
        if (d.gender) setGender(d.gender)
        if (d.fabric) {
          setFabric(d.fabric)
          if (d.fabric && !FABRICS.includes(d.fabric)) setUseCustomFabric(true)
        }
        if (d.customCode) setCustomCode(d.customCode)
        if (d.colors) setColors(d.colors)
        if (d.sizePricings) setSizePricings(d.sizePricings)
        if (d.images) setImages(d.images)
      } catch (e) {
        console.warn('Failed to load draft:', e)
      }
    }
  }, [isEdit])

  // Save draft whenever inputs change
  useEffect(() => {
    if (isEdit) return
    const draft = { name, category, subcategory, gender, fabric, customCode, colors, sizePricings, images }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [name, category, subcategory, gender, fabric, customCode, colors, sizePricings, images, isEdit])

  // Clear draft on success
  const clearDraft = () => localStorage.removeItem(DRAFT_KEY)

  // Reset form if productToEdit changes (e.g. navigating between edits)
  useEffect(() => {
    if (!productToEdit) return
    setCustomCode(productToEdit.customCode ?? '')
    setName(productToEdit.name ?? '')
    
    // Check if category is custom
    const cat = productToEdit.category ?? ''
    setCategory(cat)
    setUseCustomCategory(cat && !CATEGORIES[cat])

    // Check if subcategory is custom
    const sub = productToEdit.subcategory ?? ''
    setSubcategory(sub)
    const subIsCustom = cat && CATEGORIES[cat] ? !CATEGORIES[cat].includes(sub) : !!sub;
    setUseCustomSubcategory(subIsCustom)

    setGender(productToEdit.gender ?? '')
    
    // Check if fabric is custom
    const fab = productToEdit.fabric ?? ''
    setFabric(fab)
    setUseCustomFabric(fab && !FABRICS.includes(fab))

    setImages(productToEdit.images ?? [])
    setColors(productToEdit.colors?.length ? productToEdit.colors : [{ name: '', hex: '' }])
    setSizePricings(productToEdit.sizePricings?.length ? productToEdit.sizePricings : [{ size: '', price: '' }])
    setErrors({})
  }, [productToEdit?._id || productToEdit?.id])

  /* ── Images ── */
  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length)
    files.forEach((f) => {
      const r = new FileReader()
      r.onload = (ev) => setImages((p) => [...p, { src: ev.target.result, name: f.name }])
      r.readAsDataURL(f)
    })
    e.target.value = ''
  }

  /* ── Colors ── */
  const COLOR_MAP = {
    '#000000': 'Black', '#ffffff': 'White', '#ff0000': 'Red', '#00ff00': 'Green',
    '#0000ff': 'Blue', '#ffff00': 'Yellow', '#ffa500': 'Orange', '#800080': 'Purple',
    '#ffc0cb': 'Pink', '#808080': 'Grey', '#a52a2a': 'Brown', '#00ffff': 'Cyan',
    '#ff00ff': 'Magenta','#ffd700': 'Gold', '#c0c0c0': 'Silver', '#008080': 'Teal',
    '#4b0082': 'Indigo', '#ee82ee': 'Violet', '#f5f5dc': 'Beige', '#f5f5f5': 'Off White',
    '#000080': 'Navy', '#800000': 'Maroon', '#olive': 'Olive', '#00ff7f': 'Spring Green'
  };

  // Expanded color name to hex for preview support
  const nameToHex = (name) => {
    const n = name.toLowerCase().trim();
    const map = {
      'navy': '#000080', 'maroon': '#800000', 'gold': '#ffd700', 'silver': '#c0c0c0',
      'off white': '#f5f5f5', 'charcoal': '#36454f', 'sky blue': '#87ceeb', 'royal blue': '#4169e1',
      'dark green': '#006400', 'wine': '#722f37', 'beige': '#f5f5dc', 'peach': '#ffdab9'
    };
    return map[n] || n; // fallback to name itself (browser handles standard CSS names)
  };

  const setColor = async (i, v) => {
    let finalName = v;
    let finalHex = v;
    const input = v.trim();
    
    // Check if it's a valid 6-digit hex (with or without #)
    const hexRegex = /^#?([0-9a-fA-F]{6})$/;
    const match = input.match(hexRegex);

    if (match) {
      const hex = match[1];
      finalHex = '#' + hex;
      try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);
        const data = await response.json();
        if (data && data.name && data.name.value) {
          finalName = data.name.value;
        }
      } catch (err) {
        // Fallback
        const lowerHex = '#' + hex.toLowerCase();
        finalName = COLOR_MAP[lowerHex] || lowerHex;
      }
    } else {
        // If it's just a name, try to resolve to a hex for preview
        const hexVal = nameToHex(v);
        finalName = v;
        finalHex = hexVal;
    }

    setColors((p) => p.map((c, j) => j === i ? { name: finalName, hex: finalHex } : c))
  }
  const addColor    = () => colors.length < 12 && setColors((p) => [...p, { name: '', hex: '' }])
  const removeColor = (i) => setColors((p) => p.filter((_, j) => j !== i))

  /* ── Sizes ── */
  const setSP = (i, f, v) => setSizePricings((p) => p.map((sp, j) => j === i ? { ...sp, [f]: v } : sp))
  const addSP = () => setSizePricings((p) => [...p, { size: '', price: '', isCustom: false }])
  const removeSP = (i) => setSizePricings((p) => p.filter((_, j) => j !== i))
  const toggleCustomSize = (i) => setSizePricings((p) => p.map((sp, j) => j === i ? { ...sp, isCustom: !sp.isCustom, size: '' } : sp))

  /* ── Validate ── */
// ... (rest of the code update below in the actual replacement block)

  /* ── Validate ── */
  const validate = () => {
    const e = {}
    if (!name.trim())  e.name       = 'Required'
    if (!category)     e.category   = 'Required'
    if (!subcategory)  e.subcategory = 'Required'
    if (!images.length) e.images    = 'Add at least 1 photo'
    if (sizePricings.some((sp) => !sp.size || !sp.price)) e.sizes = 'Fill all rows'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!validate()) return
    // Clean up colors: only send those with a name or hex
    const cleanColors = colors.filter(c => typeof c === 'object' && (c.name?.trim() || c.hex?.trim()));
    const data = { customCode, name, category, subcategory, gender, fabric, images, colors: cleanColors, sizePricings }
    if (isEdit) onUpdate(productToEdit._id || productToEdit.id, data)
    else {
      onAdd(data)
      clearDraft()
    }
  }

  /* ── Small add button ── */
  const AddBtn = ({ label, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 h-7 px-3 text-xs rounded-md border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
    >
      <Plus className="w-3 h-3" /> {label}
    </button>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-base font-semibold text-white">
              {isEdit ? 'Edit Product' : 'Add Product'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? `Editing ${productToEdit.autoId}` : 'New entry for wholesale catalog'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="h-8 px-3 text-xs rounded-md border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-8 px-3 text-xs rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              {isEdit ? 'Update' : 'Save Product'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── 1. Product Numbers ── */}
        <div>
          <SectionHead title="Product Numbers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Auto ID (system)</Label>
              <div className="flex items-center h-9 bg-slate-800/40 border border-slate-700/50 rounded-md px-3 gap-2">
                <Hash className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-sm font-mono text-indigo-300">{autoId}</span>
              </div>
            </div>
            <div>
              <Label>Custom Code (your reference)</Label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="e.g. VEN-001 / MFG-XY"
                className={INPUT}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* ── 2. Product Details ── */}
        <div>
          <SectionHead title="Product Details" />
          <div className="space-y-4">
            <div>
              <Label error={errors.name}>Product Name</Label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. White Cotton Baniyan — Men"
                className={INPUT}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label error={errors.category}>Category</Label>
                  <button 
                    type="button" 
                    onClick={() => { setUseCustomCategory(!useCustomCategory); setCategory(''); setSubcategory('') }}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors uppercase font-bold tracking-tighter"
                  >
                    {useCustomCategory ? <><List className="w-3 h-3" /> Use List</> : <><PlusCircle className="w-3 h-3" /> Custom</>}
                  </button>
                </div>
                {useCustomCategory ? (
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter custom category"
                    className={INPUT}
                  />
                ) : (
                  <Sel value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory('') }} placeholder="Select category">
                    {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                  </Sel>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label error={errors.subcategory}>Subcategory</Label>
                  <button 
                    type="button" 
                    onClick={() => { setUseCustomSubcategory(!useCustomSubcategory); setSubcategory('') }}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors uppercase font-bold tracking-tighter"
                  >
                    {useCustomSubcategory ? <><List className="w-3 h-3" /> Use List</> : <><PlusCircle className="w-3 h-3" /> Custom</>}
                  </button>
                </div>
                {useCustomSubcategory || useCustomCategory ? (
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Enter custom subcategory"
                    className={INPUT}
                  />
                ) : (
                  <Sel value={subcategory} onChange={(e) => setSubcategory(e.target.value)} disabled={!category} placeholder="Select subcategory">
                    {(CATEGORIES[category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                  </Sel>
                )}
              </div>
              <div>
                <Label>Gender</Label>
                <Sel value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Select gender">
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </Sel>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Fabric / Material</Label>
                  <button 
                    type="button" 
                    onClick={() => { setUseCustomFabric(!useCustomFabric); setFabric('') }}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors uppercase font-bold tracking-tighter"
                  >
                    {useCustomFabric ? <><List className="w-3 h-3" /> Use List</> : <><PlusCircle className="w-3 h-3" /> Custom</>}
                  </button>
                </div>
                {useCustomFabric ? (
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="Enter custom material"
                    className={INPUT}
                  />
                ) : (
                  <Sel value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="Select fabric">
                    {FABRICS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </Sel>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* ── 3. Images ── */}
        <div>
          <SectionHead
            title={`Product Images (${images.length}/5)`}
          />
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 group">
                <img src={img.src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-white bg-black/50 py-0.5">
                  #{i + 1}
                </span>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-20 h-20 rounded-lg border border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-indigo-400 transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px]">Add</span>
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          {errors.images && <p className="text-xs text-red-400 mt-2">{errors.images}</p>}
        </div>

        <div className="border-t border-slate-800" />

        {/* ── 4. Colours ── */}
        <div>
          <SectionHead title="Available Colours" action={<AddBtn label="Add Colour" onClick={addColor} />} />
          <div className="flex flex-wrap gap-4">
            {colors.map((c, i) => {
              const colorObj = typeof c === 'object' ? c : { name: c, hex: c };
              return (
                <div key={i} className="flex items-center gap-2 group">
                  <div 
                    className="w-8 h-8 rounded-full border border-slate-700 shadow-inner flex-shrink-0 transition-transform group-hover:scale-110" 
                    style={{ background: colorObj.hex || '#334155' }}
                  />
                  <div className="flex items-center gap-0 bg-slate-800 border border-slate-700 rounded-md focus-within:border-indigo-500 transition-colors">
                    <input
                      type="text"
                      value={colorObj.name}
                      onChange={(e) => setColor(i, e.target.value)}
                      placeholder="#Hex or Name"
                      className="bg-transparent border-none px-3 h-9 text-sm text-slate-100 focus:outline-none placeholder:text-slate-600 w-32"
                    />
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(i)}
                        className="h-9 w-8 flex items-center justify-center text-slate-600 hover:text-red-400 transition-colors border-l border-slate-700/50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-800" />

        {/* ── 5. Sizes & Pricing ── */}
        <div>
          <SectionHead title="Sizes & Pricing" action={<AddBtn label="Add Size" onClick={addSP} />} />

          <div className="space-y-4">
            {sizePricings.map((sp, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_42px] gap-3 items-end bg-slate-900/20 p-2 rounded-xl border border-slate-800/30">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Size</span>
                    <button 
                      type="button" 
                      onClick={() => toggleCustomSize(i)}
                      className="text-[9px] text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest"
                    >
                      {sp.isCustom ? 'Use List' : 'Custom'}
                    </button>
                  </div>
                  {sp.isCustom ? (
                    <input
                      type="text"
                      value={sp.size}
                      onChange={(e) => setSP(i, 'size', e.target.value)}
                      placeholder="e.g. 5XL"
                      className={INPUT}
                    />
                  ) : (
                    <div className="relative">
                      <select
                        value={sp.size}
                        onChange={(e) => setSP(i, 'size', e.target.value)}
                        className={SELECT}
                      >
                        <option value="">Select size</option>
                        {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="px-1 h-[14px] flex items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Price (₹)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">₹</span>
                    <input
                      type="number"
                      value={sp.price}
                      onChange={(e) => setSP(i, 'price', e.target.value)}
                      min="0"
                      placeholder="0"
                      className="bg-slate-800 border border-slate-700 rounded-md pl-7 pr-3 h-9 w-full text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => sizePricings.length > 1 && removeSP(i)}
                    disabled={sizePricings.length === 1}
                    className="h-9 w-9 flex items-center justify-center text-slate-600 hover:text-red-400 disabled:opacity-0 transition-all bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/30 hover:bg-red-500/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.sizes && <p className="text-xs text-red-400 mt-2">{errors.sizes}</p>}
        </div>

          <div className="h-10" />
        </form>
      </div>
    </div>
  )
}
