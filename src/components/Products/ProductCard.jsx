import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Eye } from "lucide-react";

const categoryColors = {
  earbuds: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  chargers: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  cases: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  "phone cases": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  gadgets: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  cables: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  speakers: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
  "smart watches": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
};

function getStockBadge(stock) {
  if (stock <= 0) return { label: "Out of Stock", cls: "bg-red-100 text-red-700" };
  if (stock <= 5) return { label: "Low Stock", cls: "bg-amber-100 text-amber-700" };
  return { label: "In Stock", cls: "bg-green-100 text-green-700" };
}

export default function ProductCard({ product, index = 0 }) {
  const catKey = (product.category || "").toLowerCase();
  const colors = categoryColors[catKey] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  const stockBadge = getStockBadge(product.stock);

  const mainImage = product.images && product.images.length > 0 ? product.images[0].url : null;

  return (
    <Card
      className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-xl hover:shadow-store-primary/10 transition-all duration-500 animate-fade-in-up rounded-2xl"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Stock Badge */}
      <span
        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${stockBadge.cls}`}
      >
        {stockBadge.label}
      </span>

      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-store-bg to-blue-50 flex items-center justify-center overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-store-text-muted/50">
            <Package className="h-16 w-16" />
            <span className="text-xs">No Image</span>
          </div>
        )}
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4 gap-3">
          <Link to={`/products/${product._id}`}>
            <Button
              size="sm"
              className="bg-white/90 text-store-text hover:bg-white rounded-xl shadow-lg backdrop-blur-sm"
              id={`view-product-${product._id}`}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-store-primary text-white hover:bg-store-primary-dark rounded-xl shadow-lg"
            disabled={product.stock <= 0}
            id={`cart-product-${product._id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </div>

      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span
            className={`inline-block rounded-full ${colors.bg} ${colors.text} border ${colors.border} px-3 py-0.5 text-xs font-medium uppercase tracking-wider`}
          >
            {product.category || "Uncategorized"}
          </span>
          {product.weight > 0 && (
            <span className="text-xs text-store-text-muted">{product.weight}g</span>
          )}
        </div>

        <h3 className="font-semibold text-store-text group-hover:text-store-primary transition-colors line-clamp-1 text-base">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-store-text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-bold text-store-primary">
            LKR {Number(product.price).toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-store-text-muted">
            <Package className="h-3.5 w-3.5" />
            <span>{product.stock} left</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
