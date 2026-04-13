/* ─────────────────────────────────────────────────────────────
   Catalog Export  →  single self-contained HTML file
   Opens in any browser as a pixel-perfect product table with
   embedded product images (base64 data-URIs — works fully offline)
───────────────────────────────────────────────────────────── */

/* Convert any image src (URL or existing base64) to an inline
   data-URI via an off-screen canvas. Returns null on failure. */
function srcToDataURL(src, maxPx = 180) {
  if (!src) return Promise.resolve(null)
  if (src.startsWith('data:')) return Promise.resolve(src)

  return new Promise((resolve) => {
    const img   = new Image()
    img.crossOrigin = 'anonymous'
    const timer = setTimeout(() => resolve(null), 8000)

    img.onload = () => {
      clearTimeout(timer)
      const nw    = img.naturalWidth  || maxPx
      const nh    = img.naturalHeight || maxPx
      const scale = Math.min(1, maxPx / Math.max(nw, nh))
      const w     = Math.max(1, Math.floor(nw * scale))
      const h     = Math.max(1, Math.floor(nh * scale))
      const cvs   = document.createElement('canvas')
      cvs.width   = w
      cvs.height  = h
      cvs.getContext('2d').drawImage(img, 0, 0, w, h)
      try { resolve(cvs.toDataURL('image/jpeg', 0.82)) }
      catch (_) { resolve(null) }
    }
    img.onerror = () => { clearTimeout(timer); resolve(null) }
    img.src     = src
  })
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT FUNCTION
───────────────────────────────────────────────────────────── */
export async function exportCatalog(products, filename = 'nk-catalog') {

  /* Step 1 — convert all images to embedded base64 */
  const enriched = await Promise.all(
    products.map(async (p) => {
      const imgSrc = await srcToDataURL(p.images?.[0]?.src)
      return { ...p, _img: imgSrc }
    })
  )

  /* Step 2 — build table rows */
  const rows = enriched.map((p, idx) => {
    const bg     = idx % 2 === 0 ? '#ffffff' : '#f8fafc'
    const imgTag = p._img
      ? `<img src="${p._img}" style="width:72px;height:72px;object-fit:cover;
           border-radius:6px;display:block;border:1px solid #e2e8f0;" />`
      : `<div style="width:72px;height:72px;border-radius:6px;
           background:#f1f5f9;border:1px solid #e2e8f0;display:flex;
           align-items:center;justify-content:center;color:#94a3b8;
           font-size:10px;">No image</div>`

    return `
      <tr style="background:${bg};">
        <td style="${TD} color:#6366f1;font-family:Consolas,monospace;
            font-weight:700;white-space:nowrap;">${p.autoId}</td>
        <td style="${TD} text-align:center;padding:6px;">
          ${imgTag}
        </td>
        <td style="${TD} font-weight:600;min-width:180px;">${p.name}</td>
        <td style="${TD} white-space:nowrap;">${p.category}</td>
        <td style="${TD} white-space:nowrap;">${p.subcategory}</td>
        <td style="${TD}">${p.gender  || '—'}</td>
        <td style="${TD}">${p.fabric  || '—'}</td>
        <td style="${TD}">${(p.colors || []).filter(Boolean).join(', ') || '—'}</td>
        <td style="${TD} min-width:160px;">
          ${p.sizePricings.map((s) =>
            `<span style="display:inline-block;margin:1px 2px 1px 0;
              padding:2px 7px;background:#eef2ff;color:#4338ca;
              border-radius:4px;font-size:11px;white-space:nowrap;">
              ${s.size} — ₹${Number(s.price).toLocaleString('en-IN')}
            </span>`
          ).join('')}
        </td>
        <td style="${TD} color:#94a3b8;white-space:nowrap;font-size:11px;">${fmtDate(p.createdAt)}</td>
      </tr>`
  }).join('\n')

  /* Step 3 — assemble full HTML document */
  const now = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Nandkishor Wholesale Catalog — ${now}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 13px;
      color: #1e293b;
      background: #f8fafc;
      padding: 24px;
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 2px solid #6366f1;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand { font-size: 22px; font-weight: 800; color: #1e293b; }
    .brand span { color: #6366f1; }
    .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
    .stats {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .stat {
      text-align: center;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: 8px;
      padding: 8px 16px;
    }
    .stat-n { font-size: 20px; font-weight: 700; color: #4338ca; }
    .stat-l { font-size: 10px; color: #6366f1; text-transform: uppercase;
               letter-spacing: .05em; font-weight: 600; }
    .table-wrap {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0,0,0,.04);
    }
    table { border-collapse: collapse; width: 100%; }
    thead { background: #4f46e5; }
    th {
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .06em;
      padding: 11px 14px;
      text-align: left;
      white-space: nowrap;
    }
    td { vertical-align: middle; }
    tbody tr:hover { background: #f0f4ff !important; }
    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
    }
    @media print {
      body { background: #fff; padding: 10px; }
      .table-wrap { box-shadow: none; border: 1px solid #ddd; }
      thead { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">Nandkishor <span>Wholesale</span> Catalog</div>
      <div class="meta">Generated: ${now} &nbsp;·&nbsp; Hosiery · Garments · Uniforms</div>
    </div>
    <div class="stats">
      <div class="stat">
        <div class="stat-n">${products.length}</div>
        <div class="stat-l">SKUs</div>
      </div>
      <div class="stat">
        <div class="stat-n">${[...new Set(products.map((p) => p.category))].length}</div>
        <div class="stat-l">Categories</div>
      </div>
    </div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Auto ID</th>
          <th>Photo</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Gender</th>
          <th>Fabric</th>
          <th>Colours</th>
          <th>Sizes &amp; Pricing</th>
          <th>Added On</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Nandkishor Wholesale Catalog — ${products.length} products — ${now}
  </div>
</body>
</html>`

  const dateTag = new Date().toISOString().slice(0, 10)
  triggerDownload(html, `${filename}-${dateTag}.html`)
}

const TD = 'padding:10px 12px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;'
