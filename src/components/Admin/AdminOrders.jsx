import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Package, Search, ChevronRight, ChevronLeft, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    
    if (!window.confirm(`Are you sure you want to update this order's status to ${newStatus}?`)) {

      e.target.value = orders.find(o => o._id === orderId)?.status || 'Pending';
      return;
    }

    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated and notification sent");
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
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
                  <th className="px-6 py-4">Actions</th>
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
                      LKR {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {updatingId === order._id ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin text-store-primary" /> Updating
                        </div>
                      ) : (
                        <select
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer ${getStatusColor(order.status)}`}
                          defaultValue={order.status}
                          onChange={(e) => handleStatusChange(e, order._id)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Notified">Notified</option>
                          <option value="Failed">Failed</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-slate-400">Manage via Status</span>
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
    </div>
  );
}
