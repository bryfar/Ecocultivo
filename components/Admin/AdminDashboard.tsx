
import React, { useState, useRef, useEffect } from 'react';
import { useStore, Order, Product } from '../../context/StoreContext';
import { 
  LayoutDashboard, ShoppingBag, ListOrdered, CreditCard, Users, PieChart, 
  Settings, LogOut, Bell, Filter, ChevronDown, MoreHorizontal,
  X, Truck, Package, CheckCircle, Clock, Ban, Plus, Trash2, TrendingUp, DollarSign, User, Save, Database, Loader2,
  Menu, Edit, Upload, Eye, ArrowLeft, Calendar, FileText, Download
} from 'lucide-react';
import Logo from '../ui/Logo';
import ProductDetail from '../ProductDetail';

interface AdminDashboardProps {
  onNavigate: (page: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { orders, products, user, logout, updateOrderStatus, addProduct, updateProduct, deleteProduct, getAnalytics, updateUserProfile, generateHistoricalOrders } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Product Edit Mode State
  const [isProductEditMode, setIsProductEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Customer Detail View
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);

  const [salesTimeRange, setSalesTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'annual'>('weekly');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Interactive UI States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
      name: user?.name || '',
      phone: user?.phone || ''
  });

  const analytics = getAnalytics();

  // Handle Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const startEditingProduct = (product?: Product) => {
      if (product) {
          setEditingProduct({...product});
      } else {
          // New Product Template
          setEditingProduct({
              id: 0, // Temporary ID
              name: '',
              price: 0,
              category: 'Verduras',
              image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2670&auto=format&fit=crop',
              rating: 5.0,
              sales: 0,
              description: '',
              nutritionInfo: '',
              shippingInfo: '',
              relatedProductIds: []
          });
      }
      setIsProductEditMode(true);
  };

  const saveProductEdit = async () => {
      if (editingProduct) {
          if (editingProduct.id === 0) {
              // Create new
              const { id, ...rest } = editingProduct;
              await addProduct(rest);
          } else {
              // Update existing
              await updateProduct(editingProduct);
          }
          setIsProductEditMode(false);
          setEditingProduct(null);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0] && editingProduct) {
          const url = URL.createObjectURL(e.target.files[0]);
          setEditingProduct({...editingProduct, image: url});
      }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateUserProfile(settingsForm.name, settingsForm.phone);
      setShowSettingsModal(false);
  };

  const handleGenerateData = async () => {
      if(window.confirm('¿Desea generar 50 órdenes de venta históricas para probar los gráficos?')) {
          setIsGenerating(true);
          try {
             await generateHistoricalOrders();
          } catch (error) {
             console.error("Error generating data", error);
             alert("Error generando datos. Asegúrate de tener permisos.");
          } finally {
             setIsGenerating(false);
          }
      }
  }

  // Dynamic Notifications Logic
  const getNotifications = () => {
      const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
      const lowStock = products.filter(p => p.sales > 50).length; 
      
      const notifs = [];
      if (pendingOrders > 0) notifs.push({ title: 'Pedidos Pendientes', msg: `Tienes ${pendingOrders} pedidos por enviar.`, icon: <Package size={16} className="text-blue-400"/>, time: 'Ahora' });
      if (lowStock > 0) notifs.push({ title: 'Stock Bajo', msg: `${lowStock} productos se están agotando rápido.`, icon: <TrendingUp size={16} className="text-red-400"/>, time: 'Hace 2h' });
      notifs.push({ title: 'Sistema', msg: 'Backup de base de datos completado.', icon: <Database size={16} className="text-green-400"/>, time: 'Hace 5h' });
      
      return notifs;
  }
  const notifications = getNotifications();

  // ---- VIEW COMPONENTS ----

  const RenderSalesHistory = () => {
      return (
        <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden bg-zinc-950">
            <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white">Historial de Ventas</h2>
                    <p className="text-zinc-500 text-sm mt-1">Registro completo de transacciones</p>
                </div>
                <button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Download size={16} /> Exportar Reporte
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                    <div className="min-w-[900px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase bg-zinc-950/50 sticky top-0 z-10">
                            <div>ID Venta</div>
                            <div>Cliente</div>
                            <div>Producto / Detalle</div>
                            <div>Fecha</div>
                            <div className="text-right">Monto</div>
                            <div className="text-center">Estado</div>
                        </div>
                        
                        {/* Table Body */}
                        <div>
                            {orders.map((order) => (
                                <div 
                                    key={order.id} 
                                    className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group"
                                >
                                    <div className="font-mono text-zinc-400 text-sm group-hover:text-lime-400 transition-colors">
                                        #{order.id.slice(0, 8)}
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <span className="text-white font-medium truncate">{order.customerName}</span>
                                    </div>

                                    <div className="text-zinc-400 text-sm truncate">
                                        {order.items && order.items.length > 0 
                                            ? `${order.items[0].name} ${order.items.length > 1 ? `+${order.items.length - 1} más` : ''}`
                                            : 'Sin detalles'
                                        }
                                    </div>

                                    <div className="text-zinc-500 text-sm">
                                        {new Date(order.date).toLocaleDateString()}
                                    </div>

                                    <div className="text-right font-bold text-white">
                                        S/ {order.total.toFixed(2)}
                                    </div>

                                    <div className="text-center">
                                        <span className={`inline-block text-xs px-2.5 py-1 rounded-md font-medium border ${
                                            order.status === 'Entregado' ? 'bg-lime-400/10 text-lime-400 border-lime-400/20' : 
                                            order.status === 'Cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  const RenderProductEditor = () => {
      if (!editingProduct) return null;

      return (
          <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col h-full w-full" data-lenis-prevent>
              {/* Header - Fixed */}
              <div className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950 flex-shrink-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setIsProductEditMode(false)} className="text-zinc-400 hover:text-white flex items-center gap-2">
                          <ArrowLeft size={20} /> <span className="hidden md:inline">Volver</span>
                      </button>
                      <h2 className="text-lg font-bold text-white">
                          {editingProduct.id === 0 ? 'Nuevo Producto' : 'Editar Producto'}
                      </h2>
                  </div>
                  <button onClick={saveProductEdit} className="bg-lime-400 text-zinc-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-lime-300">
                      <Save size={16} /> Guardar
                  </button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden h-full bg-zinc-900" data-lenis-prevent>
                  
                  {/* Editor Form */}
                  <div className="w-full lg:w-1/3 p-6 h-auto lg:h-full lg:overflow-y-auto border-r border-zinc-900 bg-zinc-900/50 custom-scrollbar shrink-0" data-lenis-prevent>
                      <h3 className="text-zinc-400 uppercase text-xs font-bold tracking-wider mb-6 sticky top-0 bg-zinc-900/95 backdrop-blur py-2 z-10">Contenido del Producto</h3>
                      
                      <div className="space-y-6 pb-10">
                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Nombre</label>
                              <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-medium text-zinc-500 mb-2">Precio (S/)</label>
                                  <input type="number" step="0.01" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                              </div>
                              <div>
                                  <label className="block text-xs font-medium text-zinc-500 mb-2">Categoría</label>
                                  <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                      <option>Verduras</option>
                                      <option>Frutas</option>
                                      <option>Hierbas</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Imagen Principal</label>
                              <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                      <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none text-xs" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} placeholder="URL o subir local" />
                                  </div>
                                  <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                      <Upload size={14} /> Subir Imagen Local
                                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                  </label>
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Descripción (Pestaña 1)</label>
                              <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none resize-none" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="Descripción detallada del producto..." />
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Información Nutricional (Pestaña 2)</label>
                              <textarea rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none resize-none" value={editingProduct.nutritionInfo || ''} onChange={e => setEditingProduct({...editingProduct, nutritionInfo: e.target.value})} placeholder="Calorías, vitaminas, etc..." />
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Información de Envíos (Pestaña 3)</label>
                              <textarea rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none resize-none" value={editingProduct.shippingInfo || ''} onChange={e => setEditingProduct({...editingProduct, shippingInfo: e.target.value})} placeholder="Tiempos de entrega..." />
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-2">Productos Relacionados (Selección Manual)</label>
                              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 max-h-40 overflow-y-auto" data-lenis-prevent>
                                  {products.filter(p => p.id !== editingProduct.id).map(p => (
                                      <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            className="accent-lime-400"
                                            checked={editingProduct.relatedProductIds?.includes(p.id)}
                                            onChange={(e) => {
                                                const current = editingProduct.relatedProductIds || [];
                                                if (e.target.checked) {
                                                    setEditingProduct({...editingProduct, relatedProductIds: [...current, p.id]});
                                                } else {
                                                    setEditingProduct({...editingProduct, relatedProductIds: current.filter(id => id !== p.id)});
                                                }
                                            }}
                                          />
                                          <img src={p.image} className="w-6 h-6 rounded object-cover" />
                                          <span className="text-sm text-zinc-300">{p.name}</span>
                                      </label>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Live Preview */}
                  <div className="w-full lg:w-2/3 bg-white relative h-auto lg:h-full lg:overflow-y-auto block shrink-0 border-t lg:border-t-0 lg:border-l border-zinc-800" data-lenis-prevent>
                      <div className="absolute top-4 right-4 bg-lime-400 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                          VISTA PREVIA EN VIVO
                      </div>
                      <div className="min-h-full">
                        <ProductDetail 
                            product={editingProduct} 
                            onNavigate={() => {}} 
                            onProductSelect={() => {}} 
                            onOpenCart={() => {}}
                            previewMode={true}
                        />
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  const RenderDashboard = () => {
    // DIAGNOSIS: STATIC CHART DATA to guarantee rendering
    const DEBUG_CHART_DATA = [
        { label: '00h', value: 50 },
        { label: '04h', value: 120 },
        { label: '08h', value: 450 },
        { label: '12h', value: 890 },
        { label: '16h', value: 600 },
        { label: '20h', value: 320 },
        { label: '23h', value: 100 },
    ];
    const MAX_VAL = 1000;

    return (
        <div className="p-4 md:p-8 space-y-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-zinc-950" data-lenis-prevent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">Resumen Comercial</h2>
                <div className="flex flex-wrap gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-full md:w-auto">
                    {(['daily', 'weekly', 'monthly', 'annual'] as const).map(range => (
                        <button 
                            key={range}
                            onClick={() => setSalesTimeRange(range)}
                            className={`flex-1 md:flex-none px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                salesTimeRange === range ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            {range === 'daily' ? 'Diario' : range === 'weekly' ? 'Semanal' : range === 'monthly' ? 'Mensual' : 'Anual'}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 flex-shrink-0">
                <StatsCard 
                    title="Ingresos Totales" 
                    value={`S/ ${analytics.totalRevenue.toFixed(2)}`} 
                    trend="+12.5%" 
                    icon={<DollarSign className="text-zinc-950" size={24} />} 
                    color="bg-lime-400"
                />
                <StatsCard 
                    title="Pedidos Totales" 
                    value={analytics.totalOrders.toString()} 
                    trend="+8.2%" 
                    icon={<ShoppingBag className="text-white" size={24} />} 
                    color="bg-zinc-800"
                    textColor="text-white"
                />
                <StatsCard 
                    title="Ticket Promedio" 
                    value={`S/ ${analytics.averageOrderValue.toFixed(2)}`} 
                    trend="-2.1%" 
                    icon={<TrendingUp className="text-white" size={24} />} 
                    color="bg-zinc-800"
                    textColor="text-white"
                />
                <StatsCard 
                    title="Producto Top" 
                    value={analytics.topSellingProduct?.sales.toString() || '0'} 
                    subtext={analytics.topSellingProduct?.name || 'N/A'}
                    icon={<CheckCircle className="text-white" size={24} />} 
                    color="bg-zinc-800"
                    textColor="text-white"
                />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-96 flex-shrink-0">
                <div className="lg:col-span-2 bg-zinc-900 rounded-3xl p-6 border border-zinc-800 flex flex-col min-h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TrendingUp size={16} className="text-lime-400"/> 
                            Análisis de Ventas
                        </h3>
                        <div className="text-xs text-zinc-500 font-medium px-3 py-1 bg-zinc-950 rounded border border-zinc-800 hidden sm:block">
                            Distribución Horaria
                        </div>
                    </div>
                    
                    {/* Chart Container: Force explicit pixel height and debug data */}
                    <div className="flex-1 w-full h-[300px] flex items-end justify-between gap-4 pb-2 px-4" data-lenis-prevent>
                        {DEBUG_CHART_DATA.map((item, i) => {
                            const heightPct = Math.max((item.value / MAX_VAL) * 100, 5); // Min 5% height
                            return (
                                <div key={i} className="flex-1 h-full flex flex-col justify-end gap-2 group">
                                    <div className="w-full bg-lime-900/20 rounded-t-md relative h-full flex items-end">
                                        <div 
                                            className="w-full bg-lime-400 rounded-t-md hover:bg-lime-300 transition-all duration-300 relative"
                                            style={{ height: `${heightPct}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-zinc-900 text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none">
                                                {item.value} ventas
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-zinc-500 text-center font-mono">{item.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                    <h3 className="font-bold text-white mb-6">Categorías Populares</h3>
                    <div className="space-y-6">
                        <CategoryBar label="Verduras" percent={65} color="bg-lime-400" />
                        <CategoryBar label="Frutas" percent={25} color="bg-yellow-400" />
                        <CategoryBar label="Hierbas" percent={10} color="bg-green-600" />
                    </div>
                    <div className="mt-8 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 mb-2 text-lime-400">
                            <Clock size={14} /> <span className="text-xs font-bold uppercase">Insight</span>
                        </div>
                        <p className="text-xs text-zinc-400">
                            Las ventas de verduras aumentaron un <strong>15%</strong> esta semana. Considera aumentar el stock de espinaca y brócoli.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const RenderCustomers = () => {
    const customers = Array.from(new Set(orders.map(o => o.email))).map(email => {
        const customerOrders = orders.filter(o => o.email === email);
        const lastOrder = customerOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
        return {
            name: lastOrder.customerName,
            email: email,
            totalOrders: customerOrders.length,
            totalSpent: totalSpent,
            lastActive: lastOrder.date,
            orders: customerOrders
        };
    });

    return (
        <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-8 flex-shrink-0">Clientes ({customers.length})</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase bg-zinc-950/50 sticky top-0 z-10">
                            <div>Cliente</div>
                            <div>Email</div>
                            <div>Pedidos</div>
                            <div>Total Gastado</div>
                            <div>Última Actividad</div>
                            <div className="text-right">Detalles</div>
                        </div>
                        <div className="">
                            {customers.map((customer, idx) => (
                                <div key={idx} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center text-xs font-bold text-lime-400">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-white truncate">{customer.name}</span>
                                    </div>
                                    <div className="text-zinc-400 text-sm truncate">{customer.email}</div>
                                    <div className="text-white font-medium">{customer.totalOrders}</div>
                                    <div className="text-lime-400 font-medium">S/ {customer.totalSpent.toFixed(2)}</div>
                                    <div className="text-zinc-500 text-xs">{new Date(customer.lastActive).toLocaleDateString()}</div>
                                    <div className="text-right">
                                        <button 
                                            onClick={() => setViewingCustomer(customer)}
                                            className="p-2 text-zinc-400 hover:text-lime-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                            title="Ver Detalles"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Detail Modal */}
            {viewingCustomer && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-xl font-bold text-zinc-900">
                                    {viewingCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{viewingCustomer.name}</h2>
                                    <p className="text-sm text-zinc-500">{viewingCustomer.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingCustomer(null)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                                <X className="text-zinc-500 hover:text-white" />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-xs text-zinc-500 uppercase">Total Gastado</p>
                                    <p className="text-xl font-bold text-lime-400">S/ {viewingCustomer.totalSpent.toFixed(2)}</p>
                                </div>
                                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-xs text-zinc-500 uppercase">Pedidos</p>
                                    <p className="text-xl font-bold text-white">{viewingCustomer.totalOrders}</p>
                                </div>
                                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 text-center">
                                    <p className="text-xs text-zinc-500 uppercase">Última Compra</p>
                                    <p className="text-sm font-bold text-white mt-1">{new Date(viewingCustomer.lastActive).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Historial de Pedidos</h3>
                            <div className="space-y-3">
                                {viewingCustomer.orders.map((order: any) => (
                                    <div key={order.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-mono text-zinc-300">#{order.id.slice(0,8)}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${order.status === 'Entregado' ? 'text-lime-400 border-lime-400/30' : 'text-blue-400 border-blue-400/30'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-500">{new Date(order.date).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">S/ {order.total.toFixed(2)}</p>
                                            <p className="text-xs text-zinc-500">{order.items.length} items</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  };

  const RenderPayments = () => (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-8 flex-shrink-0">Pagos & Transacciones</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase bg-zinc-950/50 sticky top-0 z-10">
                        <div>ID Pedido</div>
                        <div>Cliente</div>
                        <div>Fecha</div>
                        <div>Monto</div>
                        <div>Estado</div>
                    </div>
                    <div>
                        {orders.map((order) => (
                            <div key={order.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                <div className="font-mono text-zinc-400 text-sm">{order.id.slice(0,8)}...</div>
                                <div className="text-white font-medium truncate">{order.customerName}</div>
                                <div className="text-zinc-500 text-xs">{new Date(order.date).toLocaleDateString()}</div>
                                <div className="text-white font-medium">S/ {order.total.toFixed(2)}</div>
                                <div>
                                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                                        order.paymentStatus === 'Pagado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                        order.paymentStatus === 'Reembolsado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const RenderProductsCMS = () => (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">Gestión de Productos</h2>
            <button 
                onClick={() => startEditingProduct()}
                className="bg-lime-400 hover:bg-lime-300 text-zinc-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
                <Plus size={18} /> <span className="hidden sm:inline">Nuevo Producto</span>
            </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase bg-zinc-950/50 sticky top-0 z-10">
                        <div className="w-12">Imagen</div>
                        <div>Nombre</div>
                        <div>Categoría</div>
                        <div>Precio</div>
                        <div>Ventas</div>
                        <div className="text-right">Acciones</div>
                    </div>
                    
                    <div>
                        {products.map(product => (
                            <div key={product.id} className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="font-medium text-white truncate">{product.name}</div>
                                <div className="text-zinc-400 text-sm">
                                    <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700">{product.category}</span>
                                </div>
                                <div className="text-lime-400 font-medium">S/ {product.price.toFixed(2)}</div>
                                <div className="text-zinc-300">{product.sales} un.</div>
                                <div className="text-right flex justify-end gap-2">
                                    <button 
                                        onClick={() => startEditingProduct(product)}
                                        className="p-2 hover:bg-blue-500/10 text-zinc-500 hover:text-blue-400 rounded-lg transition-colors"
                                        title="Editar Completo"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => deleteProduct(product.id)}
                                        className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const RenderOrders = () => {
    // Functional Filtering Logic
    const filteredOrders = orders.filter(order => {
        if (statusFilter !== 'All' && order.status !== statusFilter) return false;
        if (paymentFilter !== 'All' && order.paymentStatus !== paymentFilter) return false;
        return true;
    });

    return (
    <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Order List */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar ${selectedOrder ? 'hidden md:block' : 'block'}`} data-lenis-prevent>
           {/* Functional Filters */}
           <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-2 text-zinc-300 hover:text-white text-xs font-medium focus:border-lime-400 outline-none cursor-pointer"
                  >
                      <option value="All">Status: All</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregado">Entregado</option>
                      <option value="Cancelado">Cancelado</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>

              <div className="relative">
                  <select 
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="appearance-none bg-zinc-900 border border-zinc-800 rounded-lg pl-4 pr-10 py-2 text-zinc-300 hover:text-white text-xs font-medium focus:border-lime-400 outline-none cursor-pointer"
                  >
                      <option value="All">Payment: All</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Reembolsado">Reembolsado</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-white hover:border-lime-400 transition-colors">
                <Filter size={14} /> Filtros
              </button>
           </div>

           {/* Mobile Card View for Orders */}
           <div className="md:hidden space-y-4">
               {filteredOrders.map(order => (
                   <div 
                     key={order.id}
                     onClick={() => setSelectedOrder(order)}
                     className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl active:bg-zinc-800"
                   >
                       <div className="flex justify-between items-start mb-2">
                           <span className="text-lime-400 font-mono text-xs">#{order.id.slice(0,6)}</span>
                           <span className={`text-xs px-2 py-0.5 rounded border ${order.status === 'Entregado' ? 'text-lime-400 border-lime-400/30' : 'text-blue-400 border-blue-400/30'}`}>{order.status}</span>
                       </div>
                       <h3 className="text-white font-medium">{order.customerName}</h3>
                       <div className="flex justify-between items-end mt-2">
                           <p className="text-zinc-500 text-xs">{new Date(order.date).toLocaleDateString()}</p>
                           <p className="text-white font-bold">S/ {order.total.toFixed(2)}</p>
                       </div>
                   </div>
               ))}
           </div>

           {/* Desktop Table View */}
           <div className="hidden md:block h-full flex flex-col">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 flex flex-col min-w-0">
                   <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                       <div className="min-w-[700px]">
                           <div className="grid grid-cols-[auto_1fr_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs font-medium text-zinc-500 uppercase border-b border-zinc-800/50 bg-zinc-950/30 sticky top-0 z-10">
                             <input type="checkbox" className="rounded bg-zinc-900 border-zinc-800" />
                             <div>Nº Orden</div>
                             <div>Cliente</div>
                             <div>Pago</div>
                             <div className="text-right">Total</div>
                             <div>Estado</div>
                             <div></div>
                           </div>

                           <div className="space-y-1 mt-2">
                             {filteredOrders.map((order) => (
                               <div 
                                 key={order.id} 
                                 onClick={() => setSelectedOrder(order)}
                                 className={`grid grid-cols-[auto_1fr_2fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-4 rounded-xl cursor-pointer transition-colors border border-transparent ${
                                   selectedOrder?.id === order.id ? 'bg-zinc-900 border-zinc-800' : 'hover:bg-zinc-900/50 hover:border-zinc-800/50'
                                 }`}
                               >
                                  <input type="checkbox" className="rounded bg-zinc-900 border-zinc-800 accent-lime-400" />
                                  <div className="font-medium text-white">{order.id.slice(0, 8)}...</div>
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                        {order.customerName.charAt(0)}
                                     </div>
                                     <span className="text-zinc-300 truncate">{order.customerName}</span>
                                  </div>
                                  <div className={`text-sm ${order.paymentStatus === 'Pagado' ? 'text-green-400' : 'text-zinc-400'}`}>
                                     ● {order.paymentStatus}
                                  </div>
                                  <div className="text-right font-medium text-white">
                                    S/ {order.total.toFixed(2)}
                                  </div>
                                  <div>
                                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                                         order.status === 'Entregado' ? 'bg-lime-400/10 text-lime-400 border-lime-400/20' : 
                                         order.status === 'Cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                         'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <button className="text-zinc-500 hover:text-white p-1">
                                    <MoreHorizontal size={16} />
                                  </button>
                               </div>
                             ))}
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Details Panel */}
        {selectedOrder && (
          <div className={`w-full md:w-96 border-l border-zinc-900 bg-zinc-950 flex flex-col overflow-y-auto custom-scrollbar shadow-2xl z-10 fixed md:relative inset-0 md:inset-auto ${selectedOrder ? 'block' : 'hidden'}`} data-lenis-prevent>
            <div className="p-6 border-b border-zinc-900 flex justify-between items-start sticky top-0 bg-zinc-950 z-20">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  Orden #{selectedOrder.id.slice(0, 6)}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Realizado el {new Date(selectedOrder.date).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-md font-medium border bg-zinc-800 text-white">
                  {selectedOrder.status}
                </span>
                <div className="flex gap-2">
                   <ActionIcon icon={<Truck size={16}/>} onClick={() => updateOrderStatus(selectedOrder.id, 'Enviado')} title="Marcar Enviado" />
                   <ActionIcon icon={<CheckCircle size={16}/>} onClick={() => updateOrderStatus(selectedOrder.id, 'Entregado')} title="Marcar Entregado" />
                   <ActionIcon icon={<Ban size={16}/>} onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelado')} title="Cancelar Pedido" />
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Cliente</h3>
                <div className="flex items-center gap-4">
                   <img src={`https://ui-avatars.com/api/?name=${selectedOrder.customerName}&background=a3e635&color=18181b`} className="w-12 h-12 rounded-full" />
                   <div>
                     <p className="font-bold text-white">{selectedOrder.customerName}</p>
                     <p className="text-sm text-zinc-500">{selectedOrder.email}</p>
                   </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-4">Items del Pedido</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-zinc-900" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white leading-tight">{item.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">S/ {item.price} x {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-white">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-zinc-900">
                  <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>S/ {selectedOrder.total.toFixed(2)}</span>
                  </div>
              </div>
            </div>
          </div>
        )}
    </div>
    );
  };

  if (isProductEditMode) {
      return <RenderProductEditor />;
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden relative">
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 border-r border-zinc-900 flex flex-col flex-shrink-0 bg-zinc-950 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
           <Logo className="h-8 w-auto" variant="light" />
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-500">
               <X size={24} />
           </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto" data-lenis-prevent>
          <p className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 mt-2">General</p>
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<ListOrdered size={18}/>} label="Pedidos" active={activeTab === 'orders'} onClick={() => {setActiveTab('orders'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<Users size={18}/>} label="Clientes" active={activeTab === 'customers'} onClick={() => {setActiveTab('customers'); setIsSidebarOpen(false);}} />
          
          <p className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 mt-6">Inventario</p>
          <SidebarItem icon={<ShoppingBag size={18}/>} label="Productos" active={activeTab === 'products'} onClick={() => {setActiveTab('products'); setIsSidebarOpen(false);}} />
          
          <p className="px-3 text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-2 mt-6">Finanzas</p>
          <SidebarItem icon={<CreditCard size={18}/>} label="Pagos" active={activeTab === 'payments'} onClick={() => {setActiveTab('payments'); setIsSidebarOpen(false);}} />
          <SidebarItem icon={<FileText size={18}/>} label="Historial" active={activeTab === 'history'} onClick={() => {setActiveTab('history'); setIsSidebarOpen(false);}} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-zinc-950">
        <header className="h-16 md:h-20 border-b border-zinc-900 flex items-center justify-between px-4 md:px-8 flex-shrink-0 bg-zinc-950">
           <div className="flex items-center gap-4">
               <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white">
                   <Menu size={24} />
               </button>
               {/* Hide Title on Mobile for clean look as requested */}
               <h1 className="text-xl md:text-2xl font-bold text-white capitalize hidden md:block">
                 {activeTab === 'dashboard' ? 'Resumen Comercial' : 
                  activeTab === 'orders' ? 'Pedidos' : 
                  activeTab === 'customers' ? 'Clientes' : 
                  activeTab === 'payments' ? 'Pagos' :
                  activeTab === 'history' ? 'Historial de Ventas' :
                  'Productos'}
               </h1>
           </div>
           
           <div className="flex items-center gap-4">
              
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-zinc-800 transition-colors"
                >
                    <Bell size={20} className="text-zinc-400 hover:text-white" />
                    {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-zinc-800 font-semibold text-white">Notificaciones</div>
                        <div className="max-h-64 overflow-y-auto" data-lenis-prevent>
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-zinc-500 text-sm">No hay notificaciones nuevas.</div>
                            ) : (
                                notifications.map((notif, i) => (
                                    <div key={i} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 flex gap-3">
                                        <div className="mt-1">{notif.icon}</div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{notif.title}</p>
                                            <p className="text-xs text-zinc-400">{notif.msg}</p>
                                            <p className="text-[10px] text-zinc-600 mt-1">{notif.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>
              
              <div className="h-8 w-[1px] bg-zinc-800 mx-2"></div>
              
              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                  <div 
                     className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-zinc-900 transition-colors"
                     onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                     <div className="text-right hidden md:block leading-tight">
                        <p className="text-sm font-bold text-white">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-zinc-500">Super Usuario</p>
                     </div>
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-lime-400 flex items-center justify-center text-zinc-900 font-bold shadow-lg shadow-lime-400/20">
                         {user?.name?.charAt(0).toUpperCase() || 'A'}
                     </div>
                     <ChevronDown size={14} className="text-zinc-500 hidden md:block"/>
                  </div>
                  
                  {showProfileMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                          <button onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2">
                              <Settings size={16}/> Configuración de Perfil
                          </button>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 flex items-center gap-2 border-t border-zinc-800">
                              <LogOut size={16}/> Cerrar Sesión
                          </button>
                      </div>
                  )}
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-hidden bg-zinc-950">
            {activeTab === 'dashboard' && <RenderDashboard />}
            {activeTab === 'products' && <RenderProductsCMS />}
            {activeTab === 'orders' && <RenderOrders />}
            {activeTab === 'customers' && <RenderCustomers />}
            {activeTab === 'payments' && <RenderPayments />}
            {activeTab === 'history' && <RenderSalesHistory />}
        </div>
        
        {/* Settings Modal */}
        {showSettingsModal && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20} className="text-lime-400"/> Perfil Admin</h2>
                        <button onClick={() => setShowSettingsModal(false)}><X className="text-zinc-500 hover:text-white" /></button>
                    </div>
                    
                    <form onSubmit={handleSaveSettings} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-lime-400 flex items-center justify-center text-3xl font-bold text-zinc-900">
                                {settingsForm.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-zinc-500 w-4 h-4" />
                                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-white focus:border-lime-400 outline-none" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Teléfono</label>
                            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-lime-400 outline-none" value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} />
                        </div>
                        
                        <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between gap-3 items-center">
                             <button 
                                type="button" 
                                onClick={handleGenerateData} 
                                disabled={isGenerating}
                                className="text-xs text-lime-400 underline hover:text-lime-300 disabled:opacity-50 flex items-center gap-1 w-full sm:w-auto justify-center"
                             >
                                 {isGenerating && <Loader2 size={10} className="animate-spin" />}
                                 Generar Datos Históricos
                             </button>
                             <div className="flex gap-2 w-full sm:w-auto">
                                <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 sm:flex-none px-4 py-2 text-zinc-400 hover:text-white font-medium text-sm bg-zinc-800/50 rounded-lg sm:bg-transparent">Cancelar</button>
                                <button type="submit" className="flex-1 sm:flex-none bg-lime-400 text-zinc-900 px-6 py-2 rounded-lg font-bold hover:bg-lime-300 text-sm flex items-center justify-center gap-2">
                                    <Save size={16}/> Guardar
                                </button>
                             </div>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

// UI Components for Dashboard
const StatsCard = ({ title, value, trend, icon, color, subtext, textColor = 'text-zinc-900' }: any) => (
    <div className={`${color} p-6 rounded-3xl flex flex-col justify-between h-40 border border-white/5`}>
        <div className="flex justify-between items-start">
            <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-md`}>
                {icon}
            </div>
            {trend && <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/20 ${textColor}`}>{trend}</span>}
        </div>
        <div>
            <p className={`text-sm font-medium opacity-80 ${textColor}`}>{title}</p>
            <h3 className={`text-3xl font-bold ${textColor}`}>{value}</h3>
            {subtext && <p className={`text-xs mt-1 ${textColor} opacity-70 truncate`}>{subtext}</p>}
        </div>
    </div>
);

const CategoryBar = ({ label, percent, color }: any) => (
    <div>
        <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-zinc-300">{label}</span>
            <span className="text-zinc-500">{percent}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
            <div className={`${color} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'text-white bg-zinc-900 border-l-2 border-lime-400 shadow-lg shadow-black/20' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
    }`}
  >
    <span className={active ? 'text-lime-400' : ''}>{icon}</span>
    {label}
  </button>
);

const ActionIcon = ({ icon, onClick, title }: any) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
    {icon}
  </button>
);

export default AdminDashboard;
