import React, { useState } from 'react';
import { apiRequest } from '../api';
import { PlusCircle } from 'lucide-react';

export default function AdminPanel() {
    const [form, setForm] = useState({ name: '', price: '', stock: '' });
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiRequest('/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    price: parseFloat(form.price),
                    stock: parseInt(form.stock)
                })
            });
            setMsg('Product Created!');
            setForm({ name: '', price: '', stock: '' });
            setTimeout(() => setMsg(''), 3000);
        } catch (err: any) {
            setMsg('Error: ' + err.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <PlusCircle className="text-indigo-600" /> Add New Product
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                value={form.stock}
                                onChange={e => setForm({ ...form, stock: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition px-6 mt-4">
                        Create Product
                    </button>

                    {msg && <p className={`text-center font-medium ${msg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
                </form>
            </div>
        </div>
    );
}
