import { useState, useEffect } from "react";
import { getAllProducts } from "@/services/productService";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Loader2,
  ArrowUpRight,
  Boxes,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch {
        // Silent fail — dashboard overview
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      gradient: "from-store-primary to-blue-600",
      shadow: "shadow-blue-500/20",
      bg: "bg-blue-50",
    },
    {
      label: "Total Stock",
      value: totalStock.toLocaleString(),
      icon: Boxes,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      bg: "bg-emerald-50",
    },
    {
      label: "Inventory Value",
      value: `LKR ${totalValue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20",
      bg: "bg-amber-50",
    },
    {
      label: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      gradient: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/20",
      bg: "bg-rose-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here&apos;s your inventory overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-5 rounded-bl-[4rem]" />
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Products</h2>
            <Link to="/admin/products">
              <Button
                variant="ghost"
                size="sm"
                className="text-store-primary hover:bg-store-primary/10 rounded-lg text-xs"
              >
                View All
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {products.slice(0, 5).map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-400">{product.category || "Uncategorized"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-slate-700">
                    LKR {Number(product.price).toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      product.stock <= 0
                        ? "text-red-500"
                        : product.stock <= 5
                        ? "text-amber-500"
                        : "text-green-500"
                    }`}
                  >
                    {product.stock} in stock
                  </p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No products yet. Add your first product to see it here.
              </div>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-5">
          {/* Out of stock alert */}
          {outOfStockCount > 0 && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Out of Stock</p>
                  <p className="text-xs text-red-500 mt-0.5">
                    {outOfStockCount} product{outOfStockCount > 1 ? "s" : ""} need restocking
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Quick Actions</h3>
            <Link to="/admin/products" className="block">
              <div className="flex items-center gap-3 rounded-xl p-3 bg-store-primary/5 hover:bg-store-primary/10 transition-colors cursor-pointer">
                <div className="h-9 w-9 rounded-lg bg-store-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-store-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Manage Products</p>
                  <p className="text-xs text-slate-400">Add, edit, or remove products</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 ml-auto" />
              </div>
            </Link>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-store-primary to-store-primary-dark rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Inventory Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-100">Products</span>
                <span className="font-semibold">{totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Total Units</span>
                <span className="font-semibold">{totalStock.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Avg. Price</span>
                <span className="font-semibold">
                  LKR{" "}
                  {totalProducts > 0
                    ? Math.round(
                        products.reduce((s, p) => s + p.price, 0) / totalProducts
                      ).toLocaleString()
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
