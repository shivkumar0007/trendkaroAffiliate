import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { FiEdit2, FiLogOut, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import { auth, db } from '../firebase.js'
import categories from '../data/categories.js'
import SEO, { SITE_NAME, SITE_URL } from '../components/SEO.jsx'
import './Admin.css'

const emptyForm = {
  title: '',
  description: '',
  affiliateLink: '',
  category: 'trend',
  isFeatured: false,
  images: [''],
}

function Admin() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [products, setProducts] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [formData, setFormData] = useState(emptyForm)
  const [editingProductId, setEditingProductId] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSaving, setIsSaving] = useState(false)

  const categoryLabelById = useMemo(
    () =>
      categories.reduce((labels, category) => {
        labels[category.id] = category.label
        return labels
      }, {}),
    [],
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin-login', { replace: true })
        return
      }

      setUser(currentUser)
      setIsCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const nextProducts = snapshot.docs.map((productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        }))

        setProducts(nextProducts)
        setIsProductsLoading(false)
      },
      () => {
        setStatus({ type: 'error', message: 'Could not load products.' })
        setProducts([])
        setIsProductsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateImage = (index, value) => {
    setFormData((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    }))
  }

  const addImageInput = () => {
    setFormData((current) => ({
      ...current,
      images: [...current.images, ''],
    }))
  }

  const removeImageInput = (index) => {
    setFormData((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingProductId('')
  }

  const validateForm = () => {
    const images = formData.images.map((image) => image.trim()).filter(Boolean)

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.affiliateLink.trim() ||
      !formData.category ||
      images.length === 0
    ) {
      return 'Please fill all fields and add at least one image URL.'
    }

    try {
      new URL(formData.affiliateLink)
    } catch {
      return 'Please enter a valid affiliate URL.'
    }

    for (const imageUrl of images) {
      try {
        new URL(imageUrl)
      } catch {
        return 'Please enter valid image URLs.'
      }
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const validationError = validateForm()

    if (validationError) {
      setStatus({ type: 'error', message: validationError })
      return
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      affiliateLink: formData.affiliateLink.trim(),
      category: formData.category,
      isFeatured: formData.isFeatured,
      images: formData.images.map((image) => image.trim()).filter(Boolean),
    }

    setIsSaving(true)

    try {
      if (editingProductId) {
        await updateDoc(doc(db, 'products', editingProductId), payload)
        setStatus({ type: 'success', message: 'Product updated successfully!' })
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          createdAt: serverTimestamp(),
        })
        setStatus({ type: 'success', message: 'Product added successfully!' })
      }

      resetForm()
    } catch {
      setStatus({ type: 'error', message: 'Firestore write failed. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProductId(product.id)
    setFormData({
      title: product.title || '',
      description: product.description || '',
      affiliateLink: product.affiliateLink || '',
      category: product.category || 'trend',
      isFeatured: Boolean(product.isFeatured),
      images: product.images?.length ? product.images : [''],
    })
    setStatus({ type: '', message: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm('Are you sure?')

    if (!shouldDelete) {
      return
    }

    try {
      await deleteDoc(doc(db, 'products', productId))
      setStatus({ type: 'success', message: 'Product deleted successfully.' })
    } catch {
      setStatus({ type: 'error', message: 'Could not delete product.' })
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin-login', { replace: true })
  }

  if (isCheckingAuth) {
    return (
      <>
        <SEO
          title={`Admin - ${SITE_NAME}`}
          description="Admin dashboard for Trendkaro."
          url={`${SITE_URL}/admin`}
          noIndex
        />
        <main className="admin-page">Checking admin session...</main>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`Admin - ${SITE_NAME}`}
        description="Admin dashboard for Trendkaro."
        url={`${SITE_URL}/admin`}
        noIndex
      />
      <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Add and manage affiliate products in Firestore.</p>
          </div>
          <button type="button" className="secondary-button" onClick={handleLogout}>
            <FiLogOut aria-hidden="true" />
            Logout
          </button>
        </header>

        <section className="admin-card">
          <div className="section-heading">
            <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
            {editingProductId && (
              <button type="button" className="text-button" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>

          <form className="product-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input
                type="text"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows="4"
                required
              />
            </label>

            <label>
              Affiliate Link
              <input
                type="url"
                value={formData.affiliateLink}
                onChange={(event) => updateField('affiliateLink', event.target.value)}
                placeholder="https://example.com/product"
                required
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={formData.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="featured-check">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(event) => updateField('isFeatured', event.target.checked)}
                />
                Show in top banner carousel
              </label>
            </div>

            <div className="image-fields">
              <span className="field-label">Images</span>
              {formData.images.map((image, index) => (
                <div className="image-input-row" key={index}>
                  <input
                    type="url"
                    value={image}
                    onChange={(event) => updateImage(index, event.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required={index === 0}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeImageInput(index)}
                    disabled={formData.images.length === 1}
                    aria-label="Remove image URL"
                    title="Remove"
                  >
                    <FiX aria-hidden="true" />
                  </button>
                </div>
              ))}

              <button type="button" className="secondary-button add-image-button" onClick={addImageInput}>
                <FiPlus aria-hidden="true" />
                Add another image
              </button>
            </div>

            {status.message && (
              <p className={`admin-status ${status.type}`}>{status.message}</p>
            )}

            <button type="submit" className="primary-button" disabled={isSaving}>
              {isSaving
                ? 'Saving...'
                : editingProductId
                  ? 'Update Product'
                  : 'Add Product'}
            </button>
          </form>
        </section>

        <section className="admin-card">
          <div className="section-heading">
            <h2>Manage Products</h2>
            <span>{products.length} total</span>
          </div>

          {isProductsLoading ? (
            <p className="admin-empty">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="admin-empty">No products added yet.</p>
          ) : (
            <div className="product-table">
              {products.map((product) => (
                <article className="product-row" key={product.id}>
                  <img
                    src={product.images?.[0] || 'https://placehold.co/96x96?text=Product'}
                    alt={product.title}
                  />
                  <div className="product-row-main">
                    <strong>{product.title}</strong>
                    <span>{categoryLabelById[product.category] || product.category}</span>
                  </div>
                  <span className={`featured-badge ${product.isFeatured ? 'yes' : 'no'}`}>
                    {product.isFeatured ? 'Featured' : 'No'}
                  </span>
                  <div className="product-row-actions">
                    <button type="button" className="secondary-button" onClick={() => handleEdit(product)}>
                      <FiEdit2 aria-hidden="true" />
                      Edit
                    </button>
                    <button type="button" className="danger-button" onClick={() => handleDelete(product.id)}>
                      <FiTrash2 aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      </main>
    </>
  )
}

export default Admin
