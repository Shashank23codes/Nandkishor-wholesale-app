import React, { useState, useEffect } from 'react'
import { Menu, Shirt } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import HomePage from './components/HomePage.jsx'
import AddDataPage from './components/AddDataPage.jsx'
import SettingsPage from './components/SettingsPage.jsx'
import ProductDetailPage from './components/ProductDetailPage.jsx'
import { useProducts } from './hooks/useProducts.js'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const [view, setView] = useState(() => sessionStorage.getItem('nk_current_view') || 'home')
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const saved = sessionStorage.getItem('nk_selected_product')
    return saved ? JSON.parse(saved) : null
  })
  const [sidebarOpen, setSidebarOpen]             = useState(false)

  const { products, nextSerial, addProduct, updateProduct, deleteProduct } = useProducts()

  // Track view changes
  useEffect(() => {
    sessionStorage.setItem('nk_current_view', view)
  }, [view])

  useEffect(() => {
    if (selectedProduct) sessionStorage.setItem('nk_selected_product', JSON.stringify(selectedProduct))
    else sessionStorage.removeItem('nk_selected_product')
  }, [selectedProduct])

  /* ── Navigation ── */
  const closeSidebar = () => setSidebarOpen(false)
  const goHome   = ()  => { setView('home');   setSelectedProduct(null); closeSidebar() }
  const goAdd    = ()  => { setView('add');    setSelectedProduct(null); closeSidebar() }
  const goSettings = () => { setView('settings'); setSelectedProduct(null); closeSidebar() }
  const goDetail = (p) => { setView('detail'); setSelectedProduct(p);    closeSidebar() }
  const goEdit   = (p) => { setView('edit');   setSelectedProduct(p) }

  /* ── CRUD ── */
  const handleAdd    = (data) => { addProduct(data); goHome() }
  const handleUpdate = (id, data) => {
    updateProduct(id, data)
    setSelectedProduct((prev) => ({ ...prev, ...data }))
    setView('detail')
  }
  const handleDelete = (id) => { deleteProduct(id); goHome() }

  const sidebarNavigate = (page) => {
    if (page === 'home')     goHome()
    if (page === 'add')      goAdd()
    if (page === 'settings') goSettings()
  }

  const sidebarPage = view === 'add' || view === 'edit' ? 'add' : (view === 'settings' ? 'settings' : 'home')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid #1e293b',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activePage={sidebarPage}
        setActivePage={sidebarNavigate}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Right column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 h-12 bg-slate-900 border-b border-slate-800 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Shirt className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-white">Nandkishor</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {view === 'home' && (
            <HomePage
              products={products}
              onAddClick={goAdd}
              onProductClick={goDetail}
            />
          )}
          {view === 'detail' && selectedProduct && (
            <ProductDetailPage
              product={selectedProduct}
              allProducts={products}
              onBack={goHome}
              onEdit={() => goEdit(selectedProduct)}
              onDelete={handleDelete}
              onProductClick={goDetail}
            />
          )}
          {view === 'settings' && (
            <SettingsPage />
          )}
          {(view === 'add' || view === 'edit') && (
            <AddDataPage
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              onCancel={view === 'edit' ? () => setView('detail') : goHome}
              nextSerial={nextSerial}
              productToEdit={view === 'edit' ? selectedProduct : null}
            />
          )}
        </main>
      </div>
    </div>
  )
}
