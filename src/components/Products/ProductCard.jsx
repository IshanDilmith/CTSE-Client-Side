import { Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Eye, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";

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
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const catKey = (product.category || "").toLowerCase();
  const colors = categoryColors[catKey] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  const stockBadge = getStockBadge(product.stock);

  const mainImage = product.images && product.images.length > 0 ? product.images[0].url : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      toast.error("Please log in first to add items to the cart");
      return;
    }

    try {
      setAdding(true);
      await addToCart(product._id, quantity);
    } catch (err) {
      // CartContext handles the error toast already, but we can catch if we need
    } finally {
      setAdding(false);
    }
  };

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
              className="bg-white/90 text-store-text hover:bg-white rounded-xl shadow-lg backdrop-blur-sm px-6"
              id={`view-product-${product._id}`}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Quick View
            </Button>
          </Link>
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
            LKR {Number(product.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-store-text-muted">
            <Package className="h-3.5 w-3.5" />
            <span>{product.stock} left</span>
          </div>
        </div>

        {/* Action Area (Quantity & Add to Cart) Visible Always */}
        <div className="pt-2 flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 w-24 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-full w-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex-1 flex items-center justify-center font-medium text-store-text text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="h-full w-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-50"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <Button
            size="sm"
            className="h-10 flex-1 bg-store-primary text-white hover:bg-store-primary-dark rounded-lg shadow-sm"
            disabled={product.stock <= 0 || adding}
            onClick={handleAddToCart}
          >
            {adding ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-1.5" />}
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
