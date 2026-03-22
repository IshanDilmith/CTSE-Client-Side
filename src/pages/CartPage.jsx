import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Trash2, ArrowLeft, Loader2, Package, MapPin, Truck, CreditCard, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const SRI_LANKA_REGIONS = {
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern Province": ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  "Southern Province": ["Galle", "Hambantota", "Matara"],
  "Uva Province": ["Badulla", "Moneragala"],
  "Western Province": ["Colombo", "Gampaha", "Kalutara"],
};

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearUserCart, cartItemsCount, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: "",
    province: "",
    district: "",
    payMethod: "COD",
  });

  // Dialog states
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const calculateDeliveryFee = () => {
    if (subtotal === 0) return 0;
    if (!checkoutData.province) return 0;
    // Base rule: Western Province is 300, everywhere else is 450
    return checkoutData.province === "Western Province" ? 300 : 450;
  };
  
  const deliveryFee = calculateDeliveryFee();
  const total = subtotal + deliveryFee;

  const provinces = Object.keys(SRI_LANKA_REGIONS).sort();
  const availableDistricts = checkoutData.province ? SRI_LANKA_REGIONS[checkoutData.province].sort() : [];

  const handleInputChange = (e) => {
    setCheckoutData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateAndPrepareCheckout = (e) => {
    e.preventDefault();
    if (!checkoutData.deliveryAddress || !checkoutData.province || !checkoutData.district) {
      toast.error("Please fill in all delivery details");
      return;
    }
    setShowOrderConfirm(true);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : {};
      
      const orderPayload = {
        userId: user._id || user.id,
        items: cartItems.map(item => ({
          productId: item.productId,
          price: item.price,
          quantity: item.quantity
        })),
        ...checkoutData,
        deliveryFee,
        totalDiscount: 0,
        total: total
      };
      console.log("Order Payload: ", orderPayload);

      await createOrder(orderPayload);
      toast.success("Order placed successfully!");
      
      await fetchCart();
      
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const executeRemoveFromCart = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
  };

  const executeClearCart = () => {
    clearUserCart();
    setShowClearCartConfirm(false);
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4 bg-gray-50">
        <ShoppingCart className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-store-text">Your cart is empty</h2>
        <p className="text-store-text-muted">Please log in to view your cart.</p>
        <Link to="/login">
          <Button className="mt-4 rounded-xl">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-15 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-store-text flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-store-primary" />
            Shopping Cart
          </h1>
          <Link to="/products" className="text-store-primary hover:underline flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-store-primary/10 flex items-center justify-center mb-2">
              <Package className="h-12 w-12 text-store-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-store-text">Your cart is empty</h2>
            <p className="text-store-text-muted text-lg max-w-md">
              Looks like you haven't added anything to your cart yet. Discover our amazing products!
            </p>
            <Link to="/products">
              <Button size="lg" className="mt-8 rounded-xl h-12 px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-6">
                        <div className="h-24 w-24 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                          <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-store-text mb-1">{item.name}</h3>
                          <p className="text-store-text-muted font-medium mb-2">LKR {Number(item.price).toLocaleString()}</p>
                          <div className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 text-sm font-medium text-store-text">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                        <div className="text-right">
                          <p className="text-xs text-store-text-muted mb-1">Item Total</p>
                          <p className="text-lg font-bold text-store-primary">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl w-10 h-10 shrink-0"
                          onClick={() => setItemToRemove(item.productId)}
                          disabled={loading}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-store-text-muted">{cartItemsCount} items in cart</span>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl" onClick={() => setShowClearCartConfirm(true)} disabled={loading}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Checkout Form & Summary */}
            <div className="space-y-6">
              <form onSubmit={validateAndPrepareCheckout} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-store-text flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-store-primary" />
                    Delivery Details
                  </h3>
                  
                  <div className="space-y-4 text-left">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress" className="text-store-text">Street Address</Label>
                      <Input 
                        id="deliveryAddress" name="deliveryAddress" 
                        value={checkoutData.deliveryAddress} onChange={handleInputChange}
                        placeholder="123 Main St, Apt 4B" className="rounded-xl" required
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-store-text">Province</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-gray-200 font-normal">
                              <span className={`truncate ${!checkoutData.province ? "text-gray-500" : "text-store-text"}`}>
                                {checkoutData.province || "Select Province"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-auto min-w-[200px]">
                            {provinces.map((prov) => (
                              <DropdownMenuItem 
                                key={prov}
                                onClick={() => setCheckoutData(prev => ({ ...prev, province: prov, district: "" }))}
                                className="cursor-pointer"
                              >
                                {prov}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-store-text">District</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={!checkoutData.province}>
                            <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-gray-200 font-normal">
                              <span className={`truncate ${!checkoutData.district ? "text-gray-500" : "text-store-text"}`}>
                                {checkoutData.province 
                                  ? checkoutData.district || "Select District" 
                                  : "Select Province First"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-auto min-w-[200px]">
                            {availableDistricts.map((dist) => (
                              <DropdownMenuItem 
                                key={dist}
                                onClick={() => setCheckoutData(prev => ({ ...prev, district: dist }))}
                                className="cursor-pointer"
                              >
                                {dist}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-bold text-store-text flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-store-primary" />
                    Payment Method
                  </h3>
                  <div className="flex gap-3">
                    <button type="button" className="flex-1 border-2 border-store-primary bg-store-primary/5 text-store-primary rounded-xl py-3 font-medium transition-colors">
                      COD (Cash on Delivery)
                    </button>
                    <button type="button" className="flex-1 border border-gray-200 text-store-text-muted hover:border-gray-300 rounded-xl py-3 font-medium transition-colors pointer-events-none opacity-60">
                      Card (Unavailable)
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <h3 className="text-lg font-bold text-store-text flex items-center gap-2 mb-2">
                    <Truck className="h-5 w-5 text-store-primary" />
                    Order Summary
                  </h3>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-store-text-muted">Subtotal ({cartItemsCount} items)</span>
                    <span className="font-medium text-store-text">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-store-text-muted">Delivery Fee</span>
                    <span className="font-medium text-store-text">LKR {deliveryFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-store-text">Total</span>
                    <span className="text-2xl font-bold text-store-primary">LKR {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-store-primary/25 hover:shadow-xl hover:shadow-store-primary/40 bg-gradient-to-r from-store-primary to-store-primary-light text-white"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-6 w-6 mr-2 animate-spin" /> : null}
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Native Custom Shadcn Confirms */}
      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this specifically from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeRemoveFromCart} className="bg-red-500 hover:bg-red-600 rounded-xl text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearCartConfirm} onOpenChange={setShowClearCartConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Entire Cart</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to aggressively delete all items inside your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeClearCart} className="bg-red-500 hover:bg-red-600 rounded-xl text-white">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showOrderConfirm} onOpenChange={setShowOrderConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm the processing payload</AlertDialogTitle>
            <AlertDialogDescription>
              We are ready to process and finalize your complete order pipeline under {checkoutData.payMethod}! Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Return to Checkout</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { setShowOrderConfirm(false); handleCheckout(); }} 
              className="bg-store-primary hover:bg-store-primary/90 text-white rounded-xl"
            >
              Order Details Confirmed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
