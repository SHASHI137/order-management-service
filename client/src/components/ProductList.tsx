import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { Plus, ShoppingCart, Loader2 } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    version: number;
}

export default function ProductList({ addToCart }: { addToCart: (p: Product) => void }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const data = await apiRequest<Product[]>('/products');
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        const interval = setInterval(fetchProducts, 5000); // Poll for stock updates
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Discover Products</h1>
                    <p className="text-gray-500 mt-1">Premium quality items, delivered fast.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group">
                        <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
                            <span className="text-6xl text-indigo-200 font-black opacity-50">{product.name.charAt(0).toUpperCase()}</span>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-2xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                                <span className={`text-sm px-2 py-1 rounded-full font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                            className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
