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

/** ── Helper: StatPill (Enhanced Visibility) ── */
function StatPill({ label, value, accentRaw }) {
  const isString = typeof value === 'string';
  return (
    <div style={{
      flex: 1, 
      background: '#ffffff', 
      border: '2px solid #f1f5f9', 
      borderRadius: '24px',
      padding: '24px', 
      position: 'relative', 
      borderLeftWidth: '8px', 
      borderLeftColor: accentRaw,
      boxShadow: '0 12px 24px -4px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.06)', 
      minHeight: '130px', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s ease'
    }}>
      <p style={{ 
        fontSize: '11px', 
        fontWeight: 900, 
        color: '#64748b', 
        marginBottom: '16px', 
        letterSpacing: '0.15em', 
        textTransform: 'uppercase' 
      }}>{label}</p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        flex: 1
      }}>
        {isString ? (
          <p style={{
            fontSize: value?.length > 15 ? '20px' : '28px',
            fontWeight: 950,
            color: '#0f172a',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.5px'
          }}>{value}</p>
        ) : value}
      </div>
    </div>
  )
}

/** ── Layout 01: Classic Split (Refined UI) ── */
function ClassicLayout({ p, colors, sizes }) {
  const palette = {
    bg: '#0f172a',
    accent: '#fbce1b',
    tag: '#1e293b',
    pillAccent: '#f59e0b'
  }
  const imgUrl = p.images?.[0]?.src || ''
  
  const hasColors = p.colors?.filter(Boolean).length > 0
  const hasSizes = p.sizePricings?.length > 0

  return (
    <div
      id="live-poster-node"
      style={{
        display: 'flex', width: '1200px', minHeight: '800px', height: 'auto',
        borderRadius: '0px', overflow: 'hidden',
        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
        fontFamily: '"Inter", sans-serif', margin: '0 auto', position: 'relative',
        background: '#fff'
      }}
    >
      {/* ── LEFT: IMAGE PANEL ──────────────────────────────────────── */}
      <div style={{
        flex: '0 0 45%', background: palette.bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: `url(${imgUrl}) center/cover no-repeat`,
          filter: 'brightness(0.3) saturate(0.5) blur(3px)', transform: 'scale(1.1)'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${palette.bg}, transparent)` }} />
        
        {/* Brand badge top-left (Simplified) */}
        <div style={{
          position: 'relative', zIndex: 10, margin: '40px', display: 'flex', alignItems: 'center', 
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '4px',
          padding: '12px 24px', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content',
        }}>
          <span style={{ color: 'white', fontSize: '13px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>nandkishor readymade</span>
        </div>

        {/* Main product image spotlight - Portrait Aspect Ratio (2:3) */}
        <div style={{
          position: 'relative', 
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '40px',
          marginBottom: '40px',
          height:'100%',
          width: '82%', 
          aspectRatio: '2 / 3',
          background: `url(${imgUrl}) center/cover no-repeat`,
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)', 
          zIndex: 5
        }} />
      </div>

      {/* ── RIGHT: INFO PANEL ──────────────────────────────────────── */}
      <div style={{ flex: 1, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '60px 50px', position: 'relative' }}>
        {/* Background Watermark */}
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', fontSize: '240px', fontWeight: 950, color: '#f1f5f9', opacity: 0.4, letterSpacing: '-0.05em', zIndex: 0, lineHeight: 1, pointerEvents: 'none' }}>NK</div>
        
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: `radial-gradient(circle at top right, ${palette.accent}10, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

        {/* Header Section */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            {p.category && (
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '8px', 
                background: '#0f172a', color: palette.accent, 
                padding: '6px 16px', borderRadius: '4px', 
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', 
                marginBottom: '16px', letterSpacing: '2px' 
              }}>
                {p.category}
              </div>
            )}
            <h1 style={{ fontSize: '48px', fontWeight: 950, color: '#0f172a', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              {p.name}
            </h1>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '4px', padding: '15px 24px', textAlign: 'right', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)' }}>
            <p style={{ fontSize: '10px', color: palette.accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Product Code</p>
            <p style={{ fontSize: '24px', fontWeight: 950, color: '#ffffff', fontFamily: 'monospace' }}>{p.customCode || p.autoId}</p>
          </div>
        </div>

        {/* Pricing Matrix */}
        {hasSizes && (
          <div style={{ position: 'relative', zIndex: 1, background: '#0f172a', padding: '36px', marginBottom: '32px', borderLeft: `8px solid ${palette.accent}`, boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <p style={{ fontSize: '12px', fontWeight: 950, color: '#fff', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>Size & Price Matrix</p>
              <span style={{ fontSize: '10px', fontWeight: 900, color: palette.accent, letterSpacing: '1px' }}>★ B2B WHOLESALE RATES</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: p.sizePricings.length > 4 ? 'repeat(2, 1fr)' : '1fr',
              gap: '12px'
            }}>
              {p.sizePricings.map((sp, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', fontWeight: 800 }}>SIZE {sp.size}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: palette.accent, fontSize: '18px', fontWeight: 900 }}>₹</span>
                    <span style={{ color: 'white', fontSize: '28px', fontWeight: 950, letterSpacing: '-1px' }}>{sp.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variations (Colors & Sizes List) */}
        {(hasColors || hasSizes) && (
          <div style={{ 
            position: 'relative', zIndex: 1, 
            display: 'grid', 
            gridTemplateColumns: (hasColors && hasSizes) ? '1fr 1fr' : '1fr', 
            gap: '24px', marginBottom: '48px' 
          }}>
            {hasColors && (
              <StatPill
                label="Available Colors"
                accentRaw={palette.pillAccent}
                value={p.colors.filter(Boolean).map((c, i) => {
                  const name = typeof c === 'object' ? c.name : c;
                  const hex = typeof c === 'object' ? c.hex : c;
                  return (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '8px', 
                      background: '#fff', padding: '6px 14px', border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ width: '12px', height: '12px', background: hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>{name}</span>
                    </div>
                  );
                })}
              />
            )}
            {hasSizes && (
              <StatPill 
                label="Full Size Run" 
                value={p.sizePricings.map(s => s.size).join(' / ')} 
                accentRaw={palette.pillAccent} 
              />
            )}
          </div>
        )}

        {/* Footer section */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '40px', borderTop: '4px solid #0f172a' }}>
          <div>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Wholesale Catalog</p>
            <h4 style={{ fontSize: '24px', fontWeight: 950, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-1px' }}>
              nandkishor <span style={{ color: palette.accent }}>readymade</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  )
}

/** ── Layout 02: Minimalist Luxury (Refined & Sharp) ── */
function MinimalLayout({ p, colors, sizes }) {
  const gold = '#cfae70';
  const charcoal = '#1e1e1e';
  const ivory = '#ffffff';

  return (
    <div id="live-poster-node" style={{
      width: '1200px', minHeight: '800px', height: 'auto', padding: '0', background: ivory,
      display: 'flex', position: 'relative', fontFamily: "'Inter', sans-serif", overflow: 'hidden', border: '1px solid #1e1e1e'
    }}>
      {/* ── Outer Decorative Frame (Sharp Cornered) ── */}
      <div style={{ position: 'absolute', inset: '20px', border: `1px solid ${gold}60`, pointerEvents: 'none', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', inset: '30px', border: `1px solid ${charcoal}10`, pointerEvents: 'none', zIndex: 10 }}></div>

      {/* ── LEFT: ARCHITECTURAL IMAGE PANEL ── */}
      <div style={{ flex: '0 0 50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', borderRight: `1px solid ${charcoal}15` }}>
        <div style={{ width: '82%', height: '82%', background: 'white', position: 'relative', boxShadow: 'none', border: `1px solid ${charcoal}05`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '15px', left: '15px', color: gold, fontSize: '10px', fontWeight: 900, letterSpacing: '0.4em' }}>[ PREMIUM SELECT ]</div>
          {p.images?.[0] && (
            <img
              src={p.images[0].src}
              crossOrigin="anonymous"
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', zIndex: 2 }}
            />
          )}
        </div>
      </div>

      {/* ── RIGHT: GEOMETRIC DETAILS ── */}
      <div style={{ flex: 1, padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
        {/* Top Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '24px', height: '1px', background: gold }}></div>
          <p style={{ fontSize: '10px', fontWeight: 900, color: gold, letterSpacing: '0.5em', textTransform: 'uppercase' }}>Established Excellence</p>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '56px', fontWeight: 200, color: charcoal, margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {p.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: charcoal, letterSpacing: '0.2em' }}>{p.category || 'COLLECTION'}</span>
            <div style={{ width: '4px', height: '4px', background: gold }}></div>
            <span style={{ fontSize: '12px', fontWeight: 900, color: charcoal, letterSpacing: '0.2em' }}>{p.autoId}</span>
          </div>
        </div>

        {/* Pricing Matrix (Menu Style) */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${charcoal}`, paddingBottom: '12px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 900, color: charcoal, textTransform: 'uppercase', letterSpacing: '0.3em' }}>Rate Matrix</h3>
            <span style={{ fontSize: '10px', fontWeight: 800, color: gold, textTransform: 'uppercase', letterSpacing: '0.2em' }}>★ Star Signature</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {p.sizePricings?.length > 0 ? (
              p.sizePricings.map((sp, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '4px', borderBottom: `1px solid ${charcoal}10` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '14px', color: charcoal }}>SIZE {sp.size}</span>
                    <span style={{ fontWeight: 400, fontSize: '10px', color: '#999', letterSpacing: '0.1em' }}>/ UNIT PRICE</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '24px', color: charcoal, letterSpacing: '-0.02em' }}>₹{sp.price}</span>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '12px', opacity: 0.5 }}>No pricing data provided</p>
            )}
          </div>
        </div>

        {/* Available Colors (Minimalist Tags) */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 900, color: charcoal, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>Available Palette</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {p.colors?.filter(Boolean).map((c, i) => {
              const name = typeof c === 'object' ? c.name : c;
              const hex = typeof c === 'object' ? c.hex : c;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: `1px solid ${charcoal}15`, padding: '6px 14px', background: '#fff' }}>
                  <div style={{ width: '8px', height: '8px', background: hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '10px', color: charcoal, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: charcoal, letterSpacing: '0.05em' }}>NANDKISHOR <span style={{ fontWeight: 200, color: gold }}>READYMADE</span></div>
            <p style={{ fontSize: '8px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.3em' }}>Bespoke Wholesale Excellence Since 1994</p>
          </div>
          <div style={{ border: `1px solid ${charcoal}`, padding: '10px 18px', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: charcoal }}>{p.customCode || p.autoId}</span>
            <span style={{ display: 'block', fontSize: '8px', fontWeight: 800, color: gold, textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.1em' }}>Serial No.</span>
          </div>
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
          textAlign: 'right', 
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
