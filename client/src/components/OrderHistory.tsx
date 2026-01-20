import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Package, Clock } from 'lucide-react';

export default function OrderHistory() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        apiRequest('/orders').then(setOrders).catch(console.error);
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold mb-6">Order History</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No orders placed yet.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Order #{order.id}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                                {order.status}
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.product.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Total Amount</span>
                                <span className="text-xl font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
