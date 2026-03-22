import { useState, useEffect } from "react";
import { fetchAllUsers } from "@/services/userService";
import { registerUser } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Plus, Search, ChevronRight, ChevronLeft, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Registration Form State
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formLoading, setFormLoading] = useState(false);

  // Pagination & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      
      const adminsList = data.adminUsers || [];
      setAdmins(adminsList);
    } catch (error) {
      toast.error("Failed to fetch administrators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setFormLoading(true);
      await registerUser({ ...formData, role: "admin" });
      toast.success("Administrator added successfully");
      setIsAdding(false);
      setFormData({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Failed to add administrator");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    (admin.name && admin.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAdmins.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Administrators</h2>
          <p className="text-sm text-slate-500 mt-1">Manage system administrators and their access</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-store-primary hover:bg-store-primary/90 text-white rounded-xl shadow-sm h-11 px-6"
        >
          {isAdding ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Admin</>}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-store-primary" />
            Add New Administrator
          </h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name" name="name"
                  value={formData.name} onChange={handleInputChange}
                  placeholder="Admin Name" className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleInputChange}
                  placeholder="admin@example.com" className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password" name="password" type="password"
                  value={formData.password} onChange={handleInputChange}
                  placeholder="Enter secure password" className="rounded-xl"
                  required minLength="6"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={formLoading} className="rounded-xl px-8 h-11 bg-slate-900 text-white hover:bg-slate-800">
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Administrator
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar: Search and Row Count */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search admins by name or email..."
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

      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
          <Loader2 className="h-8 w-8 text-store-primary animate-spin" />
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
          <ShieldAlert className="h-16 w-16 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-600 mt-4">
            {searchQuery ? "No matching administrators found" : "No administrators exist yet"}
          </h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 font-medium">Administrator</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {currentAdmins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-store-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-semibold text-store-primary">
                            {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{admin.name}</p>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100/50">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Super Admin
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing {filteredAdmins.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + rowsPerPage, filteredAdmins.length)} of {filteredAdmins.length} admins
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon" className="h-7 w-7 rounded-md"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost" size="icon" className="h-7 w-7 rounded-md"
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
