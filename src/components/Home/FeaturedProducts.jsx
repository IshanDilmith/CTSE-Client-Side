import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { getAllProducts } from "@/services/productService";
import ProductCard from "@/components/Products/ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProducts();
        setProducts(data.products?.slice(0, 6) || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section id="featured-products" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block rounded-full bg-store-primary/10 px-4 py-1.5 text-sm font-medium text-store-primary">
            Featured Products
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-store-text">
            Our Most Popular Picks
          </h2>
          <p className="text-store-text-muted max-w-2xl mx-auto">
            Handpicked accessories loved by thousands of customers worldwide
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
            <p className="text-store-text-muted text-sm">Loading featured collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-store-bg/30 rounded-3xl border border-dashed border-gray-200">
            <Package className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500 font-medium">New collection arriving soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* View All */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-16 animate-fade-in-up">
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-store-primary/20 text-store-primary hover:bg-store-primary/5 rounded-xl px-10 h-13 font-semibold group"
                id="view-all-products-btn"
              >
                View All Products
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
