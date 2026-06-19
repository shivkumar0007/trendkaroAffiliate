import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase.js'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const nextProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setProducts(nextProducts)
        setError('')
        setIsLoading(false)
      },
      () => {
        setProducts([])
        setError('Unable to load products right now.')
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      products,
      isLoading,
      error,
    }),
    [products, isLoading, error],
  )

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)

  if (!context) {
    throw new Error('useProducts must be used inside ProductsProvider')
  }

  return context
}
