import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addItem, removeItem, clearCart } from "@/services/cartService";
import { toast } from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    
    try {
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      const data = await getCart(userId);
      setCartItems(data?.data?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener("auth-change", fetchCart);
    return () => window.removeEventListener("auth-change", fetchCart);
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userStr || !token) {
      toast.error("Please log in first to add items to the cart");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      await addItem(userId, productId, quantity);
      await fetchCart();
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    try {
      setLoading(true);
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      await removeItem(userId, productId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  const clearUserCart = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;

    try {
      setLoading(true);
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      await clearCart(userId);
      await fetchCart();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartItemsCount, addToCart, removeFromCart, clearUserCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
