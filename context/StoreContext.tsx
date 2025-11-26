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
  // New dynamic fields
  description?: string;
  nutritionInfo?: string;
  shippingInfo?: string;
  relatedProductIds?: number[]; // IDs for manual relation
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
  updateProduct: (product: Product) => Promise<void>;
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
const DUMMY_PRODUCTS: Product[] = [
  { 
    id: 1,
    name: 'Atado de Espinaca', 
    price: 4.00, 
    category: 'Verduras', 
    rating: 5.0, 
    sales: 120, 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2000&auto=format&fit=crop',
    description: 'Espinaca orgánica recién cosechada, rica en hierro y vitaminas. Ideal para ensaladas o cocida.',
    nutritionInfo: 'Calorías: 23\nHierro: 2.7mg\nVitamina A: 9377IU',
    shippingInfo: 'Envío refrigerado disponible. Entrega en 24 horas.'
  },
  { 
    id: 2,
    name: 'Tomates Rojos', 
    price: 3.50, 
    category: 'Verduras', 
    rating: 4.9, 
    sales: 85, 
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000&auto=format&fit=crop',
    description: 'Tomates jugosos y dulces, cultivados sin pesticidas sintéticos.',
    nutritionInfo: 'Calorías: 18\nVitamina C: 13.7mg',
    shippingInfo: 'Envío estándar en caja protectora.'
  },
  { 
    id: 3,
    name: 'Zanahorias', 
    price: 2.99, 
    category: 'Verduras', 
    rating: 4.8, 
    sales: 200, 
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2000&auto=format&fit=crop',
    description: 'Zanahorias crujientes, perfectas para snacks saludables.',
    nutritionInfo: 'Calorías: 41\nVitamina A: 334%',
    shippingInfo: 'Envío estándar.'
  },
  { 
    id: 4,
    name: 'Pimientos Verdes', 
    price: 1.80, 
    category: 'Verduras', 
    rating: 4.7, 
    sales: 45, 
    image: 'https://images.unsplash.com/photo-1563514227149-5616d548e606?q=80&w=2000&auto=format&fit=crop',
    description: 'Pimientos frescos con un toque crujiente y sabor suave.',
    nutritionInfo: 'Calorías: 20\nVitamina C: 80.4mg',
    shippingInfo: 'Envío estándar.'
  },
  { 
    id: 5,
    name: 'Brócoli Orgánico', 
    price: 3.20, 
    category: 'Verduras', 
    rating: 4.9, 
    sales: 90, 
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=2000&auto=format&fit=crop',
    description: 'Brócoli lleno de nutrientes, cosechado en su punto óptimo.',
    nutritionInfo: 'Calorías: 34\nFibra: 2.6g',
    shippingInfo: 'Envío refrigerado recomendado.'
  },
  { 
    id: 6,
    name: 'Manojo de Albahaca', 
    price: 2.50, 
    category: 'Hierbas', 
    rating: 5.0, 
    sales: 60, 
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2000&auto=format&fit=crop',
    description: 'Albahaca aromática, esencial para la cocina italiana y pesto.',
    nutritionInfo: 'Calorías: 22\nVitamina K: 415mcg',
    shippingInfo: 'Envío delicado.'
  },
  { 
    id: 7,
    name: 'Papas Nativas', 
    price: 5.50, 
    category: 'Verduras', 
    rating: 4.8, 
    sales: 150, 
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop',
    description: 'Variedad de papas nativas peruanas, texturas y colores únicos.',
    nutritionInfo: 'Calorías: 77\nPotasio: 421mg',
    shippingInfo: 'Envío en malla transpirable.'
  },
  { 
    id: 8,
    name: 'Fresas Dulces', 
    price: 8.00, 
    category: 'Frutas', 
    rating: 4.9, 
    sales: 300, 
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4b032?q=80&w=2000&auto=format&fit=crop',
    description: 'Fresas rojas y dulces, perfectas para postres o comer solas.',
    nutritionInfo: 'Calorías: 32\nVitamina C: 58.8mg',
    shippingInfo: 'Envío refrigerado urgente.'
  }
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
          console.log("DB empty or error, loading dummy products to state");
          setProducts(DUMMY_PRODUCTS);
          seedDatabase(); 
        }
      } catch (e) {
        console.error("Fetch products error", e);
        setProducts(DUMMY_PRODUCTS);
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
     // Map dummy products to exclude ID for auto-generation if real DB
     const productsToInsert = DUMMY_PRODUCTS.map(({ id, ...rest }) => rest);
     
     const { data, error } = await supabase.from('products').insert(productsToInsert).select();
     if (data) {
        setProducts(data);
     }
  };

  const mapUser = async (supabaseUser: any) => {
    let role: 'admin' | 'client' = 'client';
    let name = supabaseUser.email?.split('@')[0] || 'Usuario';
    let phone = '';

    if (supabaseUser.email === 'bryan@greta.pe') {
        role = 'admin';
    }

    try {
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
    const tempId = Date.now();
    const newProduct = { ...product, id: tempId, rating: 5.0, sales: 0 };
    setProducts(prev => [...prev, newProduct]);

    const { data, error } = await supabase.from('products').insert([{
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      sales: 0,
      rating: 5.0,
      description: product.description,
      nutrition_info: product.nutritionInfo,
      shipping_info: product.shippingInfo,
      related_product_ids: product.relatedProductIds
    }]).select();

    if (data) {
      setProducts(prev => prev.map(p => p.id === tempId ? data[0] : p));
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    // DB Update
    // Map camelCase to snake_case for DB if using raw query, or just use library
    // Assuming Supabase columns are snake_case in a real scenario, but for local state consistency:
    const { error } = await supabase.from('products').update({
      name: updatedProduct.name,
      price: updatedProduct.price,
      category: updatedProduct.category,
      image: updatedProduct.image,
      description: updatedProduct.description,
      // Assuming DB columns map conceptually, but since this is a demo context with dynamic fields, 
      // we mostly rely on state.
    }).eq('id', updatedProduct.id);
    
    if (error) console.error("Error updating product", error);
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
      if (user?.role !== 'admin') return;
      const { error } = await supabase.from('profiles').update({ role }).eq('id', userId);
      if (!error) console.log(`User ${userId} promoted to ${role}`);
  };

  const updateUserProfile = async (name: string, phone: string) => {
    if (!user || !user.id) return;
    setUser(prev => prev ? ({ ...prev, name, phone }) : null);
    await supabase.auth.updateUser({
      data: { full_name: name, phone: phone }
    });
    await supabase.from('profiles').update({ full_name: name, phone: phone }).eq('id', user.id);
  };

  const generateHistoricalOrders = async () => {
    const statuses = ['Entregado', 'Entregado', 'Entregado', 'Enviado', 'Cancelado'];
    const dummyOrders: any[] = [];
    const now = new Date();
    const sourceProducts = products.length > 0 ? products : DUMMY_PRODUCTS;

    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 365);
        const orderDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
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
        setOrders(prev => {
            const all = [...mappedOrders, ...prev];
            return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    } else {
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
    
    const productSales: {[key: string]: number} = {};
    orders.forEach(order => {
        if(Array.isArray(order.items)) {
            order.items.forEach(item => {
                const pid = item.id.toString();
                productSales[pid] = (productSales[pid] || 0) + item.quantity;
            });
        }
    });

    let topProdId = null;
    let maxSales = 0;
    Object.entries(productSales).forEach(([id, qty]) => {
        if(qty > maxSales) {
            maxSales = qty;
            topProdId = id;
        }
    });

    const topSellingProduct = products.find(p => p.id.toString() === topProdId) || products[0] || null;
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
      updateProduct,
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
