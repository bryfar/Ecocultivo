import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Types
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  sales: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: CartItem[];
  total: number;
  status: 'Pendiente' | 'Enviado' | 'Entregado' | 'Cancelado' | 'Devuelto';
  paymentStatus: 'Pagado' | 'Pendiente' | 'Reembolsado';
  date: string;
}

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
  id?: string;
  phone?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProduct: Product | null;
}

interface StoreContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<{ error?: string }>;
  logout: () => void;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  addProduct: (product: Omit<Product, 'id' | 'sales' | 'rating'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  placeOrder: (customer: { name: string; email: string }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateUserRole: (userId: string, role: 'admin' | 'client') => Promise<void>;
  updateUserProfile: (name: string, phone: string) => Promise<void>;
  generateHistoricalOrders: () => Promise<void>;
  getAnalytics: () => AnalyticsData;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// CONSTANTS - DUMMY DATA BACKUP
const DUMMY_PRODUCTS = [
  { name: 'Atado de Espinaca', price: 4.00, category: 'Verduras', rating: 5.0, sales: 120, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Tomates Rojos', price: 3.50, category: 'Verduras', rating: 4.9, sales: 85, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Zanahorias', price: 2.99, category: 'Verduras', rating: 4.8, sales: 200, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Pimientos Verdes', price: 1.80, category: 'Verduras', rating: 4.7, sales: 45, image: 'https://images.unsplash.com/photo-1563514227149-5616d548e606?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Brócoli Orgánico', price: 3.20, category: 'Verduras', rating: 4.9, sales: 90, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Manojo de Albahaca', price: 2.50, category: 'Hierbas', rating: 5.0, sales: 60, image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Papas Nativas', price: 5.50, category: 'Verduras', rating: 4.8, sales: 150, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Fresas Dulces', price: 8.00, category: 'Frutas', rating: 4.9, sales: 300, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4b032?q=80&w=2000&auto=format&fit=crop' }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Keep cart local only
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await mapUser(session.user);
        }
      } catch (e) {
        console.error("Session error", e);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          // If DB is empty or error, use DUMMY DATA in memory immediately
          console.log("DB empty or error, loading dummy products to state");
          // Use negative IDs for local dummy data to avoid key conflicts
          const localProducts = DUMMY_PRODUCTS.map((p, i) => ({...p, id: i + 1}));
          setProducts(localProducts);
          
          // Try to seed DB in background (silent fail is ok)
          seedDatabase(); 
        }
      } catch (e) {
        console.error("Fetch products error", e);
        const localProducts = DUMMY_PRODUCTS.map((p, i) => ({...p, id: i + 1}));
        setProducts(localProducts);
      }
    };

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false });
        if (data && data.length > 0) {
          const mappedOrders: Order[] = data.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            email: o.email,
            items: o.items, // JSONB
            total: o.total,
            status: o.status,
            paymentStatus: o.payment_status,
            date: o.date
          }));
          setOrders(mappedOrders);
        }
      } catch (e) {
        console.error("Fetch orders error", e);
      }
    };

    fetchSession();
    fetchProducts();
    fetchOrders();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await mapUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const seedDatabase = async () => {
     // Try to insert into DB
     const { data, error } = await supabase.from('products').insert(DUMMY_PRODUCTS).select();
     if (data) {
        setProducts(data);
     } else if (error) {
        console.warn("Could not seed DB (likely permissions). Using local state.", error);
     }
  };

  const mapUser = async (supabaseUser: any) => {
    let role: 'admin' | 'client' = 'client';
    let name = supabaseUser.email?.split('@')[0] || 'Usuario';
    let phone = '';

    // Hardcoded Admin Check for Fallback
    if (supabaseUser.email === 'bryan@greta.pe') {
        role = 'admin';
    }

    try {
        // Fetch profile from 'profiles' table to get the role and phone
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();
        
        if (profile) {
            role = profile.role;
            name = profile.full_name || name;
            phone = profile.phone || '';
        }
    } catch (e) {
        console.warn("Could not fetch profile, using fallback auth data");
    }

    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: name,
      role: role,
      phone: phone,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=a3e635&color=18181b`
    });
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
            full_name: name,
            phone: phone 
        }
      }
    });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- DB Operations ---

  const addProduct = async (product: Omit<Product, 'id' | 'sales' | 'rating'>) => {
    // Optimistic UI update
    const tempId = Date.now();
    const newProduct = { ...product, id: tempId, rating: 5.0, sales: 0 };
    setProducts(prev => [...prev, newProduct]);

    // DB Insert
    const { data, error } = await supabase.from('products').insert([{
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      sales: 0,
      rating: 5.0
    }]).select();

    if (data) {
      // Replace temp ID with real ID
      setProducts(prev => prev.map(p => p.id === tempId ? data[0] : p));
    }
  };

  const deleteProduct = async (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const placeOrder = async (customer: { name: string; email: string }) => {
    const orderData = {
      customer_name: customer.name,
      email: customer.email,
      items: cart,
      total: cartTotal,
      status: 'Pendiente',
      payment_status: 'Pagado',
      date: new Date().toISOString()
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select();

    if (data) {
      const newOrder: Order = {
        id: data[0].id,
        customerName: data[0].customer_name,
        email: data[0].email,
        items: data[0].items,
        total: data[0].total,
        status: data[0].status,
        paymentStatus: data[0].payment_status,
        date: data[0].date
      };
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
    await supabase.from('orders').update({ status }).eq('id', orderId);
  };
  
  const updateUserRole = async (userId: string, role: 'admin' | 'client') => {
      // 1. Check if executing user is admin in state (optimistic check)
      if (user?.role !== 'admin') return;
      
      // 2. Update in Supabase
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      
      if (!error) {
          console.log(`User ${userId} promoted to ${role}`);
      }
  };

  const updateUserProfile = async (name: string, phone: string) => {
    if (!user || !user.id) return;

    // Update state
    setUser(prev => prev ? ({ ...prev, name, phone }) : null);

    // Update Supabase
    // Using raw_user_meta_data for sync with Auth, and profiles table for logic
    await supabase.auth.updateUser({
      data: { full_name: name, phone: phone }
    });

    await supabase.from('profiles').update({ 
      full_name: name, 
      phone: phone 
    }).eq('id', user.id);
  };

  // Function to seed historical orders for charts
  const generateHistoricalOrders = async () => {
    const statuses = ['Entregado', 'Entregado', 'Entregado', 'Enviado', 'Cancelado'];
    const dummyOrders: any[] = [];
    const now = new Date();
    
    // Ensure we have products to create orders from
    const sourceProducts = products.length > 0 ? products : DUMMY_PRODUCTS.map((p, i) => ({...p, id: i + 1}));

    // Generate 50 orders spread across the last 12 months
    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 365);
        const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        
        // Random items (1 to 4 items)
        const itemsCount = Math.floor(Math.random() * 4) + 1;
        const orderItems = [];
        let total = 0;

        for (let j = 0; j < itemsCount; j++) {
            const product = sourceProducts[Math.floor(Math.random() * sourceProducts.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            orderItems.push({ ...product, quantity });
            total += product.price * quantity;
        }

        dummyOrders.push({
            customer_name: `Cliente Demo ${i}`,
            email: `cliente${i}@demo.com`,
            items: orderItems,
            total: parseFloat(total.toFixed(2)),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            payment_status: 'Pagado',
            date: orderDate.toISOString()
        });
    }

    // Try DB Insert
    const { data, error } = await supabase.from('orders').insert(dummyOrders).select();
    
    if (data) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          customerName: o.customer_name,
          email: o.email,
          items: o.items,
          total: o.total,
          status: o.status,
          paymentStatus: o.payment_status,
          date: o.date
        }));
        // Sort descending
        setOrders(prev => {
            const all = [...mappedOrders, ...prev];
            return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    } else {
        // Fallback: Populate Local State if DB fails (Permissions/RLS)
        console.warn("Generating local dummy orders because DB insert failed:", error);
        const localDummyOrders = dummyOrders.map((o, i) => ({
            ...o,
            id: `local-dummy-${i}`,
            customerName: o.customer_name,
            email: o.email,
            items: o.items,
            total: o.total,
            status: o.status,
            paymentStatus: o.payment_status,
            date: o.date
        }));
        setOrders(prev => {
             const all = [...localDummyOrders, ...prev];
             return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    }
  };

  const getAnalytics = (): AnalyticsData => {
    const totalRevenue = orders.reduce((sum, order) => {
        return order.paymentStatus === 'Pagado' ? sum + order.total : sum;
    }, 0);
    
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate top selling based on mock/real order history
    const productSales: {[key: string]: number} = {};
    orders.forEach(order => {
        if(Array.isArray(order.items)) {
            order.items.forEach(item => {
                const pid = item.id.toString();
                productSales[pid] = (productSales[pid] || 0) + item.quantity;
            });
        }
    });

    // Find max
    let topProdId = null;
    let maxSales = 0;
    Object.entries(productSales).forEach(([id, qty]) => {
        if(qty > maxSales) {
            maxSales = qty;
            topProdId = id;
        }
    });

    const topSellingProduct = products.find(p => p.id.toString() === topProdId) || products[0] || null;
    // Inject calculated sales into the product object for display
    if(topSellingProduct) {
        topSellingProduct.sales = maxSales;
    }

    return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topSellingProduct
    };
  };

  return (
    <StoreContext.Provider value={{
      user,
      login,
      signup,
      logout,
      products,
      cart,
      orders,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      addProduct,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      updateUserRole,
      updateUserProfile,
      generateHistoricalOrders,
      getAnalytics,
      loading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};