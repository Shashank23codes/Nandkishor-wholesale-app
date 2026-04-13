import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Failed to fetch products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  /* ── CREATE ── */
  const addProduct = async (data) => {
    const tid = toast.loading('Saving product...')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to save product')
      const newProduct = await res.json()
      setProducts((prev) => [newProduct, ...prev])
      toast.success('Product added successfully', { id: tid })
      return newProduct
    } catch (err) {
      console.error('Add error:', err)
      toast.error('Error saving to database', { id: tid })
    }
  }

  /* ── UPDATE ── */
  const updateProduct = async (id, data) => {
    const tid = toast.loading('Updating product...')
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Failed to update product')
      const updated = await res.json()
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updated : p))
      )
      toast.success('Product updated', { id: tid })
      return updated
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Update failed', { id: tid })
    }
  }

  /* ── DELETE ── */
  const deleteProduct = async (id) => {
    const tid = toast.loading('Deleting...')
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id))
      toast.success('Product removed', { id: tid })
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Delete failed', { id: tid })
    }
  }

  const nextSerial = products.length + 1

  return { products, nextSerial, addProduct, updateProduct, deleteProduct, loading, error }
}
