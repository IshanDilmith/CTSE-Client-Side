import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "@/services/productService";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Loader2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data.product);
      } catch {
        // Silently handle — product will be null, showing not-found state
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const getStockInfo = (stock) => {
    if (stock <= 0) return { label: "Out of Stock", cls: "text-red-600 bg-red-50 border-red-200" };
    if (stock <= 5)
      return { label: `Only ${stock} left — order soon!`, cls: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "In Stock", cls: "text-green-600 bg-green-50 border-green-200" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
        <p className="text-store-text-muted">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20">
        <div className="h-20 w-20 rounded-2xl bg-store-bg flex items-center justify-center">
          <Package className="h-10 w-10 text-store-text-muted/50" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-semibold text-store-text text-lg">Product not found</p>
          <p className="text-store-text-muted text-sm">
            This product may have been removed or is currently unavailable
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-xl border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Go Back
          </Button>
          <Link to="/products">
            <Button
              variant="outline"
              className="rounded-xl border-store-primary/20 text-store-primary hover:bg-store-primary/5"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const catKey = (product.category || "").toLowerCase();
  const colors = categoryColors[catKey] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  const stockInfo = getStockInfo(product.stock);
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-store-bg to-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav className="flex items-center gap-2 text-sm text-store-text-muted animate-fade-in-up">
          <Link
            to="/"
            className="hover:text-store-primary transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-store-primary transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-store-text font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4 animate-fade-in-up">
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100">
              {hasImages ? (
                <>
                  <img
                    src={product.images[selectedImageIndex].url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-500"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        id="prev-image-btn"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                        id="next-image-btn"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                      {/* Image counter */}
                      <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
                        {selectedImageIndex + 1} / {product.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-store-text-muted/40 bg-gradient-to-br from-store-bg to-blue-50">
                  <Package className="h-24 w-24" />
                  <span className="text-sm mt-2">No Image Available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-store-primary shadow-md shadow-store-primary/20 ring-2 ring-store-primary/20"
                        : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up delay-100">
            {/* Category & Stock */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-block rounded-full ${colors.bg} ${colors.text} border ${colors.border} px-4 py-1 text-xs font-semibold uppercase tracking-wider`}
              >
                {product.category || "Uncategorized"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${stockInfo.cls}`}
              >
                {product.stock > 0 && <Check className="h-3 w-3" />}
                {stockInfo.label}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-store-text leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-store-primary">
                LKR {Number(product.price).toLocaleString()}
              </span>
              {product.weight > 0 && (
                <span className="text-sm text-store-text-muted bg-gray-100 rounded-full px-3 py-0.5">
                  {product.weight}g
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-store-text uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-store-text-muted leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Quantity Selector + Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-store-text">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                    id="qty-decrease-btn"
                  >
                    <Minus className="h-4 w-4 text-gray-500" />
                  </button>
                  <span className="h-10 w-14 flex items-center justify-center font-semibold text-store-text border-x border-gray-200 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="h-10 w-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stock}
                    id="qty-increase-btn"
                  >
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <span className="text-xs text-store-text-muted">
                  {product.stock} available
                </span>
              </div>

              <Button
                size="lg"
                disabled={product.stock <= 0}
                className="w-full h-13 bg-gradient-to-r from-store-primary to-store-primary-light text-white shadow-xl shadow-store-primary/25 hover:shadow-2xl hover:shadow-store-primary/30 transition-all duration-300 rounded-xl text-base font-semibold"
                id="add-to-cart-detail-btn"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>



            {/* Product Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-store-text">Product Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-store-text-muted">Category</span>
                  <p className="font-medium text-store-text">{product.category || "N/A"}</p>
                </div>
                <div>
                  <span className="text-store-text-muted">Weight</span>
                  <p className="font-medium text-store-text">{product.weight ? `${product.weight}g` : "N/A"}</p>
                </div>
                <div>
                  <span className="text-store-text-muted">Stock</span>
                  <p className="font-medium text-store-text">{product.stock} units</p>
                </div>
                <div>
                  <span className="text-store-text-muted">Product ID</span>
                  <p className="font-medium text-store-text text-xs truncate">{product._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
