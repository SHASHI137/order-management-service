import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, History, Plus } from 'lucide-react';
import { apiRequest } from './api';

// Components (Placeholders for now, will fill in next steps)
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';

function NavBar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50";

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:relative md:border-t-0 md:w-64 md:h-screen md:border-r flex md:flex-col justify-around md:justify-start p-4 md:space-y-2 z-50">
      <div className="hidden md:flex items-center gap-2 px-4 py-6 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="font-bold text-xl text-gray-800">ShopSys</span>
      </div>

      <NavItem to="/" icon={<Package size={20} />} label="Products" isActive={isActive('/')} />
      <NavItem to="/cart" icon={<ShoppingBag size={20} />} label="Cart" isActive={isActive('/cart')} />
      <NavItem to="/history" icon={<History size={20} />} label="Orders" isActive={isActive('/history')} />
      <NavItem to="/admin" icon={<Plus size={20} />} label="Admin" isActive={isActive('/admin')} />
    </nav>
  );
}

function NavItem({ to, icon, label, isActive }: any) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function App() {
  // Global Cart State (Simple Context-like)
  const [cart, setCart] = useState<{ product: any, quantity: number }[]>([]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans text-gray-900">
        <NavBar />
        <main className="flex-1 p-4 pb-24 md:p-8 overflow-y-auto h-screen">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<ProductList addToCart={addToCart} />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} clearCart={clearCart} />} />
              <Route path="/history" element={<OrderHistory />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
