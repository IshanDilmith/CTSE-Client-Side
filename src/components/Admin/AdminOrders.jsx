import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Search, ChevronRight, ChevronLeft, CheckCircle2, Clock, XCircle, FileText, Eye, MapPin, CreditCard, User, Mail, Phone, Receipt } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [confirmStatusUpdate, setConfirmStatusUpdate] = useState(null); // { orderId, newStatus }
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChangeClick = (e, orderId) => {
    const newStatus = e.target.value;
    const oldStatus = orders.find(o => o._id === orderId)?.status || 'Pending';
    
    setConfirmStatusUpdate({ orderId, newStatus, oldStatus });
    // Reset the select value temporarily until confirmed
    e.target.value = oldStatus;
  };

  const executeStatusChange = async () => {
    if (!confirmStatusUpdate) return;
    
    const { orderId, newStatus } = confirmStatusUpdate;
    
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated and notification sent");
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
      setConfirmStatusUpdate(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-amber-600 bg-amber-50 border-amber-200";
      case "confirmed": return "text-blue-600 bg-blue-50 border-blue-200";
      case "notified": return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "failed": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 text-store-primary animate-spin" />
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => 
    o.orderId && o.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            View orders and update their fulfillment status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchOrders} className="bg-white border-slate-200">
            Refresh
          </Button>
        </div>
      </div>

      {/* Toolbar: Search and Row Count */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 h-11 rounded-xl border-slate-200 bg-white"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Rows per page:</span>
          <select
            className="h-11 rounded-xl border border-slate-200 px-3 bg-white text-sm outline-none cursor-pointer focus:ring-2 focus:ring-store-primary/20 w-full sm:w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Package className="h-16 w-16 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-600 mt-4">
            {searchQuery ? "No matching orders found" : "No orders received yet"}
          </h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-store-primary">
                      LKR {Number(order.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4">
                      {updatingId === order._id ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin text-store-primary" /> Updating
                        </div>
                      ) : (
                        <select
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer ${getStatusColor(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusChangeClick(e, order._id)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Notified">Notified</option>
                          <option value="Failed">Failed</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-store-primary hover:bg-store-primary/10"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing {filteredOrders.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Status Update Confirmation Dialog */}
      <AlertDialog open={!!confirmStatusUpdate} onOpenChange={(open) => !open && setConfirmStatusUpdate(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of order <span className="font-semibold text-slate-800">{orders.find(o => o._id === confirmStatusUpdate?.orderId)?.orderId}</span> to <span className="font-bold text-store-primary">{confirmStatusUpdate?.newStatus}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeStatusChange}
              className="bg-store-primary hover:bg-store-primary/90 text-white rounded-xl"
            >
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Overview Dialog */}
      <AlertDialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <AlertDialogContent size="xl" className="rounded-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center text-xl font-bold border-b pb-4">
              <span>Order Details - {selectedOrder?.orderId}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(selectedOrder?.status)} uppercase tracking-wider`}>
                {selectedOrder?.status}
              </span>
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="space-y-6 pt-4 text-left">
            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tight">
                  <User className="h-4 w-4" /> Customer Info
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-sm">
                  <p className="font-bold text-slate-800">{selectedOrder?.userId?.fullname || "Customer"}</p>
                  <p className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-3 w-3" /> {selectedOrder?.userEmail || selectedOrder?.userId?.email || "No email provided"}
                  </p>
                  {selectedOrder?.userId?.phone && (
                    <p className="flex items-center gap-2 text-slate-600">
                      <Phone className="h-3 w-3" /> {selectedOrder?.userId?.phone || selectedOrder.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tight">
                  <MapPin className="h-4 w-4" /> Shipping
                </h4>
                <div className="bg-slate-50 p-4 rounded-2xl space-y-1 text-sm">
                  <p className="font-bold text-slate-800">{selectedOrder?.deliveryAddress}</p>
                  <p className="text-slate-600">{selectedOrder?.district}, {selectedOrder?.province}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-tight">
                <Receipt className="h-4 w-4" /> Items ({selectedOrder?.items?.length || 0})
              </h4>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Product</th>
                      <th className="px-4 py-2 text-center font-semibold">Qty</th>
                      <th className="px-4 py-2 text-right font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder?.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                              {item.productImage?.url ? (
                                <img src={item.productImage.url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <Package className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{item.productName || "Product"}</p>
                              <p className="text-xs text-slate-400 font-medium">ID: {item.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-700">LKR {item.price?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right text-slate-500 uppercase">Subtotal</td>
                      <td className="px-4 py-3 text-right">LKR {(Number(selectedOrder?.total) - (selectedOrder?.deliveryFee || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-2 text-right text-slate-500 uppercase">Delivery Fee</td>
                      <td className="px-4 py-2 text-right">LKR {selectedOrder?.deliveryFee?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || "0.00"}</td>
                    </tr>
                    <tr className="bg-slate-100 text-store-primary">
                      <td colSpan="2" className="px-4 py-3 text-right text-lg uppercase">Total Amount</td>
                      <td className="px-4 py-3 text-right text-lg">LKR {Number(selectedOrder?.total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase">
                <CreditCard className="h-4 w-4 text-store-primary" /> Payment Method
              </span>
              <span className="text-sm font-bold text-store-primary uppercase">{selectedOrder?.payMethod || "COD"}</span>
            </div>
          </div>

          <AlertDialogFooter className="mt-6 border-t pt-4">
            <AlertDialogCancel className="rounded-xl bg-slate-100 border-none hover:bg-slate-200 text-slate-600">
              Close Overview
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
