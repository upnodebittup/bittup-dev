export const DIGITAL_CATEGORY_SLUG = 'produto-digital'

export function isDigitalProduct(product: { categories: { slug?: string }[] }) {
  return product.categories.some(category => category.slug === DIGITAL_CATEGORY_SLUG)
}

export function physicalQuantity(
  products: { id: string; categories: { slug?: string }[] }[],
  quantities: Map<string, number>,
) {
  return products.reduce((sum, product) => sum + (isDigitalProduct(product) ? 0 : quantities.get(product.id) ?? 0), 0)
}
