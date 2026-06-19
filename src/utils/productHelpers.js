export const getProductCategories = (product) => {
  if (Array.isArray(product.categories)) {
    return product.categories
  }

  if (product.category) {
    return [product.category]
  }

  return []
}
