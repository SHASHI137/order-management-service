import React, { useState } from 'react';
import { apiRequest } from '../api';
import { Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartProps {
    cart: { product: any, quantity: number }[];
    setCart: React.Dispatch<React.SetStateAction<{ product: any, quantity: number }[]>>;
    clearCart: () => void;
}

export default function Cart({ cart, setCart, clearCart }: CartProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [lastOrder, setLastOrder] = useState<any>(null);

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const updateQuantity = (productId: number, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.product.id === productId) {
                return { ...p, quantity: Math.max(1, p.quantity + delta) };
            }
            return p;
        }));
    };

    const remove = (productId: number) => {
        setCart(prev => prev.filter(p => p.product.id !== productId));
    };

    const checkout = async () => {
        setStatus('processing');
        setErrorMsg('');
        try {
            const payload = {
                items: cart.map(i => ({
                    productId: i.product.id,
                    quantity: i.quantity
                })),
                idempotencyKey: crypto.randomUUID() // Bonus: Idempotency
            };

            const order = await apiRequest('/orders', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            setLastOrder(order);
            setStatus('success');
            clearCart();
        } catch (e: any) {
            setStatus('error');
            setErrorMsg(e.message || 'Checkout failed');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center py-20 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
                <p className="text-gray-500 mt-2">Your order has been confirmed.</p>
                <div className="mt-8 flex gap-4">
                    <Link to="/" onClick={() => setStatus('idle')} className="text-indigo-600 font-medium hover:underline">Continue Shopping</Link>
                    <Link to="/history" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">View History</Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-gray-400">
                <ShoppingBagIcon size={64} className="mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-gray-600">Your cart is empty</h2>
                <Link to="/" className="mt-4 text-indigo-600 font-medium hover:underline">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {cart.map((item) => (
                    <div key={item.product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                            <p className="text-gray-500">${item.product.price} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">-</button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200" disabled={item.quantity >= item.product.stock}>+</button>
                        </div>
                        <button onClick={() => remove(item.product.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-4">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 text-xl font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button
                    onClick={checkout}
                    disabled={status === 'processing'}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                    {status === 'processing' ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <>Checkout <ArrowRight size={20} /></>}
                </button>
            </div>
        </div>
    );
}

function ShoppingBagIcon({ size, className }: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
