import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllProducts } from "@/services/productService";
import ProductCard from "@/components/Products/ProductCard";
import {
  Headphones,
  BatteryCharging,
  Smartphone,
  Watch,
  Cable,
  Speaker,
  Loader2,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Earbuds",
    slug: "earbuds",
    description: "Wireless & noise-cancelling earbuds for immersive audio experiences",
    icon: Headphones,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
    bg: "bg-violet-50",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
    image: "🎧",
  },
  {
    name: "Chargers",
    slug: "chargers",
    description: "Fast & wireless charging solutions to keep you powered up all day",
    icon: BatteryCharging,
    gradient: "from-store-primary to-blue-600",
    shadow: "shadow-blue-500/25",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    image: "⚡",
  },
  {
    name: "Phone Cases",
    slug: "phone-cases",
    description: "Stylish protection for your device — cases that match your personality",
    icon: Smartphone,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    image: "📱",
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Stay connected and track your fitness with cutting-edge wearables",
    icon: Watch,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
    bg: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    image: "⌚",
  },
  {
    name: "Cables",
    slug: "cables",
    description: "Premium Lightning & USB-C cables built for speed and durability",
    icon: Cable,
    gradient: "from-rose-500 to-pink-600",
    shadow: "shadow-rose-500/25",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    image: "🔌",
  },
  {
    name: "Speakers",
    slug: "speakers",
    description: "Portable Bluetooth speakers with powerful sound wherever you go",
    icon: Speaker,
    gradient: "from-store-accent to-cyan-600",
    shadow: "shadow-cyan-500/25",
    bg: "bg-cyan-50",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
    image: "🔊",
  },
];

function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export default function CategoriesPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch {
        // Silently handle — show empty product list
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // If slug is provided, show single category view
  const activeCategory = slug ? getCategoryBySlug(slug) : null;

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat.slug] = products.filter(
        (p) => (p.category || "").toLowerCase() === cat.name.toLowerCase()
      ).length;
    });
    return counts;
  }, [products]);

  // Filter products by active category
  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    return products.filter(
      (p) => (p.category || "").toLowerCase() === activeCategory.name.toLowerCase()
    );
  }, [products, activeCategory]);

  // ─── Single Category View ────────────────────────────────
  if (activeCategory) {
    const Icon = activeCategory.icon;
    return (
      <div className="min-h-screen">
        {/* Category Hero */}
        <section
          className={`relative overflow-hidden py-6 sm:py-8 ${activeCategory.bg}`}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6 animate-fade-in-up">
              <Link to="/" className={`${activeCategory.textColor} opacity-60 hover:opacity-100 transition-opacity`}>
                Home
              </Link>
              <span className={`${activeCategory.textColor} opacity-40`}>/</span>
              <Link to="/categories" className={`${activeCategory.textColor} opacity-60 hover:opacity-100 transition-opacity`}>
                Categories
              </Link>
              <span className={`${activeCategory.textColor} opacity-40`}>/</span>
              <span className={`${activeCategory.textColor} font-medium`}>
                {activeCategory.name}
              </span>
            </nav>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-in-up">
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${activeCategory.gradient} ${activeCategory.shadow} shadow-xl`}
              >
                <Icon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-store-text">
                  {activeCategory.name}
                </h1>
                <p className="text-store-text-muted mt-2 max-w-xl">
                  {activeCategory.description}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <span
                    className={`inline-block rounded-full ${activeCategory.bg} border ${activeCategory.borderColor} ${activeCategory.textColor} px-3 py-1 text-sm font-semibold`}
                  >
                    {loading ? "..." : `${filteredProducts.length} products`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
              <p className="text-store-text-muted">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-20 w-20 rounded-2xl bg-store-bg flex items-center justify-center">
                <Package className="h-10 w-10 text-store-text-muted/50" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-store-text text-lg">No products in this category</p>
                <p className="text-store-text-muted text-sm">
                  Check back later for new arrivals
                </p>
              </div>
              <Link to="/products">
                <Button
                  variant="outline"
                  className="rounded-xl border-store-primary/20 text-store-primary hover:bg-store-primary/5"
                >
                  Browse All Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // ─── All Categories Overview ────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-store-bg via-white to-blue-50 py-8 sm:py-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-store-primary/5 blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-store-accent/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 animate-fade-in-up">
            <span className="inline-block rounded-full bg-store-accent/10 px-4 py-1.5 text-sm font-medium text-store-accent">
              Browse Collection
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-store-text">
              Shop by Category
            </h1>
            <p className="text-store-text-muted max-w-2xl mx-auto text-base sm:text-lg">
              Find exactly what you need — browse our curated collections of premium mobile accessories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  {/* Top gradient band */}
                  <div
                    className={`h-2 bg-gradient-to-r ${cat.gradient}`}
                  />

                  <div className="p-6 sm:p-8">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div
                        className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} ${cat.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-store-text group-hover:text-store-primary transition-colors">
                          {cat.name}
                        </h2>
                        <p className="text-sm text-store-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className={`rounded-full ${cat.bg} border ${cat.borderColor} px-3 py-0.5 text-xs font-semibold ${cat.textColor}`}
                          >
                            {loading ? "..." : `${count} products`}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-store-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                            Browse
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
