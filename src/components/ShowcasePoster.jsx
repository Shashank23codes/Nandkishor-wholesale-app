import React, { useState, useEffect } from 'react'
import { Zap, ShieldCheck, Award, Truck, Globe } from 'lucide-react'

/** ── Main Component ────────────────────────────────────── */
export default function ShowcasePoster({ product, layout = 'classic', customDesc = '' }) {
  const p = product
  const [theme, setTheme] = useState({
    primary: '#064e3b',
    text: '#ffffff',
    accent: '#fbbf24',
    isDark: true
  })

  // Help browser resolve color names correctly
  const nameToHex = (name) => {
    if (!name) return 'transparent';
    const n = name.toLowerCase().trim();
    const map = {
      'navy': '#000080', 'maroon': '#800000', 'gold': '#ffd700', 'silver': '#c0c0c0',
      'off white': '#f5f5f5', 'charcoal': '#36454f', 'sky blue': '#87ceeb', 'royal blue': '#4169e1',
      'wine': '#722f37', 'beige': '#f5f5dc', 'peach': '#ffdab9'
    };
    return map[n] || n;
  };

  // Extract dominant color from image to automate theme
  useEffect(() => {
    const imgUrl = p.images?.[0]?.src;
    if (!imgUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      const data = ctx.getImageData(0, 0, 50, 50).data;

      let r = 0, g = 0, b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]; g += data[i + 1]; b += data[i + 2];
      }
      const count = data.length / 4;
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      // Brightness for contrast (YIQ)
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      const isDark = yiq < 160;

      setTheme({
        primary: `rgb(${Math.round(r * 0.6)}, ${Math.round(g * 0.6)}, ${Math.round(b * 0.6)})`,
        secondary: `rgb(${Math.round(r * 0.3)}, ${Math.round(g * 0.3)}, ${Math.round(b * 0.3)})`,
        text: '#ffffff', // Force white for the hero background
        accent: '#fbbf24',
        isDark: true
      });
    };
  }, [p.images?.[0]?.src]);

  const sizes = p.sizePricings?.map((sp) => sp.size).join(', ') || '—'
  const colorsText = p.colors?.filter(Boolean).length > 0
    ? p.colors.filter(Boolean).map(c => typeof c === 'object' ? c.name : c).join(', ')
    : 'Standard Assorted'

  return (
    <>
      <style>{`
        #live-poster-node * { box-sizing: border-box; }
        #live-poster-node img { user-select: none; pointer-events: none; }
      `}</style>
      {(() => {
        switch (layout) {
          case 'minimal': return <MinimalLayout p={p} colors={colorsText} sizes={sizes} />
          case 'social': return <SocialSquareLayout p={p} colors={colorsText} sizes={sizes} customDesc={customDesc} theme={theme} />
          case 'dark': return <DarkTerminalLayout p={p} colors={colorsText} sizes={sizes} />
          case 'classic':
          default: return <ClassicLayout p={p} colors={colorsText} sizes={sizes} />
        }
      })()}
    </>
  )
}

/** ── Helper: StatPill (as per User UI) ── */
function StatPill({ label, value, accentRaw }) {
  const isString = typeof value === 'string';
  return (
    <div style={{
      flex: 1, background: '#fff', border: '1px solid #edf2f7', borderRadius: '32px',
      padding: '24px', position: 'relative', borderLeftWidth: '10px', borderLeftColor: accentRaw,
      boxShadow: '0 20px 40px rgba(0,0,0,0.03)', minHeight: '120px', display: 'flex', flexDirection: 'column'
    }}>
      <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.1em' }}>{label?.toUpperCase()}</p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        flex: 1
      }}>
        {isString ? (
          <p style={{
            fontSize: value?.length > 15 ? '16px' : '24px',
            fontWeight: 900,
            color: '#0f172a',
            margin: 0,
            lineHeight: 1.2,
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}>{value}</p>
        ) : value}
      </div>
    </div>
  )
}

/** ── Layout 01: Classic Split (User's Exact UI - Fixed) ── */
function ClassicLayout({ p, colors, sizes }) {
  // Define variables used in user's UI snippet
  const palette = {
    bg: '#0f172a',
    accent: '#fbce1b',
    tag: '#1e293b',
    pillAccent: '#f59e0b'
  }
  const imgUrl = p.images?.[0]?.src || ''
  const firstVariant = p.sizePricings?.[0] || { size: 'XS', price: '0' }
  const currentPrice = firstVariant.price
  const selectedSize = firstVariant.size

  return (
    <div
      id="live-poster-node"
      style={{
        display: 'flex', width: '1200px', minHeight: '750px', height: 'auto',
        borderRadius: '32px', overflow: 'hidden',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        fontFamily: '"Inter", sans-serif', margin: '0 auto', position: 'relative',
        background: '#fff'
      }}
    >
      {/* ── LEFT: IMAGE PANEL ──────────────────────────────────────── */}
      <div style={{
        flex: '0 0 45%', background: palette.bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Background image with overlay */}
        <div style={{
          position: 'absolute', inset: 0, background: `url(${imgUrl}) center/cover no-repeat`,
          filter: 'brightness(0.45) saturate(0.8)',
        }} />

        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${palette.bg}ee 0%, transparent 60%, ${palette.bg}dd 100%)` }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: `linear-gradient(to top, ${palette.bg} 0%, transparent 100%)` }} />

        {/* Brand badge top-left */}
        <div style={{
          position: 'relative', zIndex: 10, margin: '28px', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: '12px',
          padding: '8px 14px', border: '1px solid rgba(255,255,255,0.12)', width: 'fit-content',
        }}>
          <Zap size={14} fill={palette.accent} color={palette.accent} />
          <span style={{ color: 'white', fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>nandkishor readymade</span>
          <ShieldCheck size={12} fill="#0095f6" color="white" />
        </div>

        {/* Main product image spotlight */}
        <div style={{
          position: 'sticky', top: '50px', margin: 'auto',
          width: '80%', height: '500px', background: `url(${imgUrl}) center/cover no-repeat #f3f4f6`,
          borderRadius: '20px', boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 2px ${palette.accent}30`,
          filter: 'brightness(1.05) saturate(1.1)', zIndex: 5
        }} />

      </div>

      {/* ── RIGHT: INFO PANEL ──────────────────────────────────────── */}
      <div style={{ flex: 1, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '36px 40px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${palette.accent}08 1px, transparent 1px)`, backgroundSize: '24px 24px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: palette.tag, border: `1px solid ${palette.accent}40`, color: palette.accent, padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
              <Award size={10} /> {p.category || 'COLLECTION'}
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
              {p.name}
              {/* {p.customCode && <span style={{ opacity: 0.4, fontWeight: 300, fontSize: '0.6em', marginLeft: '12px' }}>{p.customCode}</span>} */}
            </h1>
          </div>
          <div style={{ background: '#000000', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px', minWidth: '120px' }}>
            <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Product Code</p>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>{p.customCode || p.autoId}</p>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, background: '#0f172a', borderRadius: '24px', padding: '24px', marginBottom: '28px', border: `1px solid ${palette.accent}20` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${palette.accent}30`, paddingBottom: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: palette.accent, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Pricing Table</p>
            <div style={{ background: palette.accent, color: palette.bg, padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
              NET RATES
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: p.sizePricings?.length > 4 ? 'repeat(2, 1fr)' : '1fr',
            gap: '8px',
            padding: '4px'
          }}>
            {p.sizePricings?.length > 0 ? (
              p.sizePricings.map((sp, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontWeight: 600 }}>Size {sp.size}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ color: palette.accent, fontSize: '20px', fontWeight: 800 }}>₹</span>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 900 }}>{sp.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'white', opacity: 0.5, fontSize: '12px', textAlign: 'center' }}>No variants available</p>
            )}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatPill
            label="Colors"
            accentRaw={palette.pillAccent || palette.accent}
            value={p.colors?.filter(Boolean).map((c, i) => {
              const name = typeof c === 'object' ? c.name : c;
              const hex = typeof c === 'object' ? c.hex : c;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{name}</span>
                </div>
              );
            }) || 'Standard'}
          />
          <StatPill label="Sizes List" value={sizes} accentRaw={palette.pillAccent || palette.accent} />
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '32px', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Quality Guaranteed by</p>
            <h4 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', color: palette.accent }}>nandkishor readymade</h4>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Truck size={14} color={palette.accent} />
            <Globe size={14} color={palette.accent} />
            <Award size={14} color={palette.accent} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** ── Layout 02: Minimalist Luxury ── */
function MinimalLayout({ p, colors, sizes }) {
  const gold = '#cfae70';
  const charcoal = '#1e1e1e';
  const ivory = '#fcfaf7';

  return (
    <div id="live-poster-node" style={{
      width: '1200px', minHeight: '750px', height: 'auto', padding: '0', background: ivory,
      display: 'flex', position: 'relative', fontFamily: "'Inter', sans-serif", overflow: 'hidden', border: '1px solid #e5e7eb'
    }}>
      {/* ── Outer Decorative Frame ── */}
      <div style={{ position: 'absolute', inset: '24px', border: `1px solid ${gold}40`, pointerEvents: 'none', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', inset: '32px', border: `1px solid ${gold}20`, pointerEvents: 'none', zIndex: 10 }}></div>

      {/* ── LEFT: ARTISTIC IMAGE PANEL ── */}
      <div style={{ flex: '0 0 55%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          background: 'white', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        }}>
          {/* Subtle background texture or watermark */}
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '80px', fontWeight: 900, color: '#000', opacity: 0.02, letterSpacing: '-0.05em' }}>PREMIUM</div>

          {p.images?.[0] && (
            <img
              src={p.images[0].src}
              crossOrigin="anonymous"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', zIndex: 2 }}
            />
          )}
        </div>
      </div>

      {/* ── RIGHT: SOPHISTICATED DETAILS ── */}
      <div style={{ flex: 1, padding: '80px 60px 80px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, color: gold, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '16px' }}>Catalog Selection</p>
          <h1 style={{ fontSize: '48px', fontWeight: 300, color: charcoal, margin: 0, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {p.name} {p.customCode && <span style={{ fontSize: '24px', opacity: 0.5, marginLeft: '10px' }}>[{p.customCode}]</span>}
          </h1>
          <div style={{ width: '60px', height: '3px', background: gold, marginTop: '24px' }}></div>
        </div>

        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: charcoal, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', opacity: 0.6 }}>Rate Matrix / Sizes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: p.sizePricings?.length > 4 ? '1fr 1fr' : '1fr', gap: '16px 40px' }}>
            {p.sizePricings?.map((sp, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#6b7280' }}>{sp.size}</span>
                <span style={{ fontWeight: 800, fontSize: '18px', color: charcoal }}>₹{Number(sp.price).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: charcoal, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', opacity: 0.6 }}>Available Palette</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {p.colors?.filter(Boolean).map((c, i) => {
              const name = typeof c === 'object' ? c.name : c;
              const hex = typeof c === 'object' ? c.hex : c;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '4px 12px', borderRadius: '100px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '11px', color: charcoal, fontWeight: 700 }}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '32px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: charcoal, letterSpacing: '0.1em' }}>NK <span style={{ fontWeight: 300, color: gold }}>READYMADE</span></div>
            <p style={{ fontSize: '9px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginTop: '4px' }}>Established Excellence · Wholesale</p>
          </div>
          <div style={{ background: charcoal, color: 'white', padding: '8px 16px', fontSize: '10px', fontWeight: 800, borderRadius: '2px', letterSpacing: '0.1em' }}>{p.autoId}</div>
        </div>
      </div>
    </div>
  )
}

/** ── Layout 03: Social Square ── */
function SocialSquareLayout({ p, colors, sizes, customDesc, theme }) {
  const primaryColor = theme?.primary || '#064e3b';
  const secondaryColor = theme?.secondary || '#0f172a';
  const textColor = '#ffffff';
  const accentColor = '#fbbf24';
  const ivory = '#ffffff';

  // Intensified pattern for better visibility
  const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E`;

  return (
    <div id="live-poster-node" style={{
      width: '1080px', height: '1080px', background: primaryColor,
      backgroundImage: `url("${patternSvg}")`,
      padding: '40px', display: 'flex', flexDirection: 'column', color: textColor,
      position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif"
    }}>
      {/* ── Top Bar ── */}
      <div style={{ textAlign: 'center', marginTop: '20px', position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: '14px', letterSpacing: '0.8em', opacity: 0.9, marginBottom: '0px', color: textColor, fontWeight: 700 }}>WWW . NKREADYMADE . COM</p>
        <h1 style={{ fontSize: '120px', fontWeight: 900, letterSpacing: '0.05em', margin: '0', textTransform: 'uppercase', color: textColor, textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>PREMIUM</h1>
        <p style={{ fontSize: '13px', maxWidth: '700px', margin: '15px auto', opacity: 0.9, lineHeight: 1.6, color: textColor, fontWeight: 700 }}>
          A high-quality boutique wholesale selection crafted for durability and style.
          Available now for bulk distribution across all major regions.
        </p>
      </div>

      {/* ── Main Showcase Area ── */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Rounded Background Panel */}
        <div style={{
          width: '75%', height: '75%', background: ivory, borderRadius: '25px',
          position: 'absolute', transform: 'rotate(-2deg)', opacity: 1,
          backgroundImage: `url("${patternSvg}")`, backgroundSize: '100px 100px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.4)', zIndex: 1
        }}></div>

        {/* Product Image */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {p.images?.[0] && (
            <img
              src={p.images[0].src}
              crossOrigin="anonymous"
              style={{ maxHeight: '82%', maxWidth: '82%', objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }}
            />
          )}
        </div>

        {/* Floating Badge (Left Bottom) */}
        <div style={{
          position: 'absolute', bottom: '15%', left: '40px', zIndex: 20,
          background: primaryColor, border: `4px solid ${textColor}`, padding: '15px 30px', borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', width: 'fit-content'
        }}>
          <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px', color: textColor, whiteSpace: 'nowrap' }}>{p.category} COLLECTION</p>
          <h3 style={{ fontSize: '36px', fontWeight: 900, margin: 0, textTransform: 'uppercase', color: textColor, whiteSpace: 'nowrap' }}>ORDER NOW</h3>
        </div>

        {/* Info Block (Right) */}
        <div style={{
          //  position: 'absolute', top: '55%', right: '40px', zIndex: 20,
          //  width: '260px', textAlign: 'right', color: secondaryColor
          position: 'absolute', top: '55%', right: '40px', zIndex: 20,
          width: '260px', textAlign: 'right', 
          background: primaryColor, border: `4px solid ${textColor}`, padding: '15px 30px', borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', width: 'fit-content'
        }}>
          <h4 style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 10px', lineHeight: 1 }}>{p.subcategory || 'QUALITY'}</h4>
          <p style={{ fontSize: '14px', fontWeight: 800, opacity: 1, lineHeight: 1.5, textAlign: 'right', width: '200px' }}>
            {customDesc || `Expertly stitched and quality checked. Available in multiple sizes for bulk wholesale orders.`}
          </p>
        </div>
      </div>

      {/* ── Bottom Details ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '20px', alignItems: 'flex-end', paddingBottom: '30px', position: 'relative', zIndex: 10 }}>
        <div>
          <h5 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 4px', color: textColor }}>CLASSICAL FABRICS</h5>
          <p style={{ fontSize: '11px', opacity: 1, maxWidth: '280px', color: textColor, fontWeight: 700 }}>
            ID: {p.autoId} • {p.fabric || 'PREMIUM TEXTILE'} • All variants are quality authenticated.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.2em', opacity: 0.9, color: textColor }}>PRICE MATRIX</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: accentColor, marginTop: '5px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Starting ₹{p.sizePricings?.[0]?.price || '0'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h5 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 4px', maxWidth: '250px', marginLeft: 'auto', color: textColor }}>
            FASHION THAT CELEBRATES!
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
            {p.colors?.filter(Boolean).map((c, i) => {
              const hex = typeof c === 'object' ? c.hex : c;
              return (
                <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: hex, border: `2px solid ${textColor}80` }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** ── Layout 04: Dark Terminal ── */
function DarkTerminalLayout({ p, colors, sizes }) {
  return (
    <div id="live-poster-node" style={{
      width: '1080px', height: '650px', background: '#020617', padding: '40px', color: 'white', fontFamily: 'monospace', position: 'relative'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px', zIndex: 2 }}>
        <div style={{ width: '40%' }}>
          <div style={{ border: '1px solid #10b981', padding: '15px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.images?.[0] && <img src={p.images[0].src} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
          </div>
          <div style={{ marginTop: '20px', background: '#10b981', color: '#020617', padding: '10px', fontWeight: 900 }}>ID: {p.autoId} // {p.category}</div>
          <div style={{ marginTop: '10px', border: '1px solid #1e293b', padding: '10px' }}>
            <p style={{ color: '#64748b', fontSize: '10px' }}>// AVAILABLE_COLORS</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
              {p.colors?.filter(Boolean).map((c, i) => {
                const name = typeof c === 'object' ? c.name : c;
                const hex = typeof c === 'object' ? c.hex : c;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: hex, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: '12px', color: '#10b981' }}>{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#10b981', marginBottom: '10px' }}>
            {p.name}
            {p.customCode && <span style={{ fontSize: '20px', color: '#64748b', marginLeft: '15px' }}>// CODE:{p.customCode}</span>}
          </h1>
          <div style={{ borderTop: '1px dashed #334155', paddingTop: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '10px' }}>// SIZE_PRICING_MATRIX</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '10px' }}>
              {p.sizePricings?.map((sp, i) => (
                <div key={i} style={{ border: '1px solid #1e293b', padding: '10px' }}>
                  <p style={{ color: '#64748b', fontSize: '10px' }}>{sp.size}</p>
                  <p style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>₹{sp.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
