import WatchCard from '../components/WatchCard'
import ShopBanner from '../components/ShopBanner'
import { boutiqueProductIds, getProductsByIds } from '../data/products'
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory'

export default function Boutique() {
  const products = getProductsByIds(boutiqueProductIds)
  const { items } = usePublicInventory()
  const inventoryMap = toInventoryMap(items)

  return (
    <section className="bg-base text-textMain min-h-screen">
      <ShopBanner />
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-10 text-center text-textMain">
            Our Collection
          </h2>
          <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto leading-relaxed">
            Discover our refined eyewear models, combining timeless craftsmanship with contemporary design.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <WatchCard key={product.id} {...product} stock={inventoryMap[product.id]?.stock} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
