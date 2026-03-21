import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/Products/ProductCard";
import { getAllProducts } from "@/services/productService";
import {
  Search,
  SlidersHorizontal,
  X,
  Package,
  Loader2,
  Headphones,
  BatteryCharging,
  Smartphone,
  Watch,
  Cable,
  Speaker,
  Grid3X3,
} from "lucide-react";

const categories = [
  { name: "All", icon: Grid3X3, key: "all" },
  { name: "Earbuds", icon: Headphones, key: "earbuds" },
  { name: "Chargers", icon: BatteryCharging, key: "chargers" },
  { name: "Phone Cases", icon: Smartphone, key: "phone cases" },
  { name: "Smart Watches", icon: Watch, key: "smart watches" },
  { name: "Cables", icon: Cable, key: "cables" },
  { name: "Speakers", icon: Speaker, key: "speakers" },
  { name: "Gadgets", icon: SlidersHorizontal, key: "gadgets" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name A–Z", value: "name-asc" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description || "").toLowerCase().includes(query) ||
          (p.category || "").toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-store-bg via-white to-blue-50 py-6 sm:py-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-store-primary/5 blur-3xl" />
          <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-store-accent/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 animate-fade-in-up">
            <span className="inline-block rounded-full bg-store-primary/10 px-4 py-1.5 text-sm font-medium text-store-primary">
              Our Collection
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-store-text">
              All Products
            </h1>
            <p className="text-store-text-muted max-w-2xl mx-auto text-base sm:text-lg">
              Browse our premium selection of mobile accessories and smart gadgets
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-store-primary/10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-store-text-muted" />
              <Input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl border-store-primary/15 bg-store-bg/50 focus:bg-white focus:border-store-primary/30 transition-all"
                id="product-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-store-text-muted/20 flex items-center justify-center hover:bg-store-text-muted/30 transition-colors"
                >
                  <X className="h-3 w-3 text-store-text-muted" />
                </button>
              )}
            </div>

            {/* Sort + Filter Toggle */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 rounded-xl border border-store-primary/15 bg-store-bg/50 px-3 text-sm text-store-text focus:border-store-primary/30 outline-none appearance-none cursor-pointer min-w-[160px]"
                id="product-sort-select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-11 rounded-xl border-store-primary/15 sm:hidden ${
                  showFilters ? "bg-store-primary/10 text-store-primary" : ""
                }`}
                id="toggle-filters-btn"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Chips - Desktop always visible, Mobile toggle */}
          <div
            className={`mt-3 overflow-x-auto scrollbar-hide transition-all duration-300 ${
              showFilters ? "block" : "hidden sm:block"
            }`}
          >
            <div className="flex gap-2 pb-1 min-w-max">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-store-primary text-white shadow-md shadow-store-primary/25"
                        : "bg-store-bg/80 text-store-text-muted hover:bg-store-primary/10 hover:text-store-primary"
                    }`}
                    id={`category-filter-${cat.key}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results Info */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-store-text-muted">
            Showing{" "}
            <span className="font-semibold text-store-text">
              {filteredProducts.length}
            </span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {selectedCategory !== "all" && (
              <span>
                {" "}in{" "}
                <span className="font-semibold text-store-primary capitalize">
                  {selectedCategory}
                </span>
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}matching &quot;
                <span className="font-semibold text-store-primary">
                  {searchQuery}
                </span>
                &quot;
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
            <p className="text-store-text-muted">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-20 w-20 rounded-2xl bg-store-bg flex items-center justify-center">
              <Package className="h-10 w-10 text-store-text-muted/50" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-semibold text-store-text text-lg">No products found</p>
              <p className="text-store-text-muted text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="rounded-xl border-store-primary/20 text-store-primary hover:bg-store-primary/5"
              id="clear-filters-btn"
            >
              Clear All Filters
            </Button>
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
