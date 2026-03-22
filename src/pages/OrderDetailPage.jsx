import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Package, Truck, CreditCard, ChevronLeft, Loader2, CheckCircle2, Clock, XCircle, MapPin, Receipt } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-amber-600 bg-amber-50 border-amber-200";
      case "processing": return "text-blue-600 bg-blue-50 border-blue-200";
      case "shipped": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "delivered": return "text-green-600 bg-green-50 border-green-200";
      case "cancelled": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <CheckCircle2 className="h-5 w-5 mr-2" />;
      case "cancelled": return <XCircle className="h-5 w-5 mr-2" />;
      default: return <Clock className="h-5 w-5 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4 bg-gray-50">
        <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
        <p className="text-store-text-muted">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4 bg-gray-50">
        <Package className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-store-text">Order not found</h2>
        <p className="text-store-text-muted">This order may not exist or you don't have access.</p>
        <Link to="/orders">
          <Button className="mt-4 rounded-xl">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-15 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link to="/orders" className="text-store-primary hover:underline flex items-center gap-2 font-medium mb-3">
              <ChevronLeft className="h-4 w-4" />
              Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-store-text flex items-center gap-3 tracking-tight">
              Order {order.orderId}
            </h1>
            <p className="text-store-text-muted mt-2 font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          
          <div className={`px-5 py-2.5 rounded-2xl flex items-center font-bold border shadow-sm ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="uppercase tracking-widest text-sm">{order.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content - Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-store-text mb-6 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-store-primary" />
                Order Items
              </h2>
              
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        {/* We don't have product name in the order item if not saved, just productId */}
                        {/* Assuming product info is just what's in order doc. Fallback to generic name with ID */}
                        <h3 className="font-semibold text-store-text line-clamp-1">Product ID: {item.productId}</h3>
                        <p className="text-sm text-store-text-muted mt-1 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-store-primary">
                        LKR {(Number(item.price) * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-store-text-muted mt-1">
                        LKR {Number(item.price).toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Details */}
          <div className="space-y-6">
            
            {/* Delivery Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-store-text mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-store-primary" />
                Delivery Address
              </h3>
              <div className="space-y-2 text-sm text-store-text-muted">
                <p className="font-medium text-store-text">{order.deliveryAddress}</p>
                <p>{order.district}</p>
                <p>{order.province} Province</p>
              </div>
            </div>

            {/* Payment & Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-store-text mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-store-primary" />
                Payment Summary
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-store-text-muted">
                  <span>Method</span>
                  <span className="font-medium text-store-text bg-gray-100 px-3 py-1 rounded-lg">
                    {order.payMethod || "Card"}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-store-text-muted">Subtotal</span>
                    <span className="font-medium text-store-text">
                      LKR {(order.total - order.deliveryFee + order.totalDiscount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-store-text-muted">Delivery Fee</span>
                    <span className="font-medium text-store-text">LKR {order.deliveryFee?.toLocaleString() || 0}</span>
                  </div>
                  {order.totalDiscount > 0 && (
                    <div className="flex justify-between items-center py-1 text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">- LKR {order.totalDiscount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-store-text text-base">Total Price</span>
                    <span className="text-xl font-bold text-store-primary">
                      LKR {Number(order.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
