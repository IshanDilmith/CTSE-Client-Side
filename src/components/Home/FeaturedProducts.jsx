import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "AirPods Pro Max",
    category: "Earbuds",
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 245,
    badge: "Best Seller",
    emoji: "🎧",
  },
  {
    id: 2,
    name: "GaN 65W Charger",
    category: "Chargers",
    price: 29.99,
    originalPrice: 44.99,
    rating: 4.6,
    reviews: 189,
    badge: "New",
    emoji: "⚡",
  },
  {
    id: 3,
    name: "MagSafe Crystal Case",
    category: "Cases",
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviews: 312,
    badge: "Trending",
    emoji: "📱",
  },
  {
    id: 4,
    name: "Smart Fitness Band",
    category: "Gadgets",
    price: 59.99,
    originalPrice: 89.99,
    rating: 4.7,
    reviews: 156,
    badge: "Hot",
    emoji: "⌚",
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    category: "Chargers",
    price: 19.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviews: 203,
    emoji: "🔋",
  },
  {
    id: 6,
    name: "Noise Cancel Buds",
    category: "Earbuds",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.8,
    reviews: 178,
    badge: "Sale",
    emoji: "🎵",
  },
];

const badgeColors = {
  "Best Seller": "bg-amber-100 text-amber-700",
  New: "bg-store-primary/10 text-store-primary",
  Trending: "bg-purple-100 text-purple-700",
  Hot: "bg-red-100 text-red-700",
  Sale: "bg-green-100 text-green-700",
};

export default function FeaturedProducts() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-xl hover:shadow-store-primary/10 transition-all duration-500 animate-fade-in-up rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge */}
              {product.badge && (
                <span
                  className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
                    badgeColors[product.badge] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {product.badge}
                </span>
              )}

              {/* Product Visual */}
              <div className="relative h-52 bg-gradient-to-br from-store-bg to-blue-50 flex items-center justify-center overflow-hidden">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {product.emoji}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-store-primary/0 group-hover:bg-store-primary/5 transition-all duration-500" />
              </div>

              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-store-accent uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-store-text">
                      {product.rating}
                    </span>
                    <span className="text-xs text-store-text-muted">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-store-text group-hover:text-store-primary transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-store-primary">
                      ${product.price}
                    </span>
                    <span className="text-sm text-store-text-muted line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-store-primary/10 text-store-primary hover:bg-store-primary hover:text-white transition-all duration-300 rounded-xl"
                    id={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="border-store-primary/20 text-store-primary hover:bg-store-primary/5 rounded-xl px-8"
              id="view-all-products-btn"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
