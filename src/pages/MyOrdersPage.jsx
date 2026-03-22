import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, Loader2, ArrowLeft } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 mr-1.5" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-1.5" />;
      default:
        return <Clock className="h-4 w-4 mr-1.5" />;
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4 bg-gray-50">
        <Package className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-store-text">Access Denied</h2>
        <p className="text-store-text-muted">Please log in to view your orders.</p>
        <Link to="/login">
          <Button className="mt-4 rounded-xl">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-15 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-store-text flex items-center gap-3">
            <Package className="h-8 w-8 text-store-primary" />
            My Orders
          </h1>
          <Link to="/" className="text-store-primary hover:underline flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
            <p className="text-store-text-muted text-sm">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-store-primary/10 flex items-center justify-center mb-2">
              <Package className="h-12 w-12 text-store-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-store-text">No orders found</h2>
            <p className="text-store-text-muted text-lg max-w-md">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products">
              <Button size="lg" className="mt-8 rounded-xl h-12 px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50">
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-bold text-lg text-store-text">
                        {order.orderId}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)} uppercase tracking-wider`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-store-text-muted">
                      <div>
                        <span className="font-medium text-gray-500">Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Items:</span>{" "}
                        {order.items?.length || 0}
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Total:</span>{" "}
                        <span className="text-store-primary font-bold">LKR {Number(order.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <Link to={`/orders/${order._id}`}>
                      <Button variant="outline" className="rounded-xl px-6 border-gray-200 hover:border-store-primary hover:bg-store-primary/5 hover:text-store-primary">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
