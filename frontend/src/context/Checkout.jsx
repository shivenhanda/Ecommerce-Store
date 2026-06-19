import React from 'react';
import { useContext } from 'react';
import { CartListContext } from './CartProvider';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { product, cartList } = useContext(CartListContext);
    const navigate = useNavigate();
    const total = product.reduce((sum, item, index) => sum + (item.price * cartList[index]?.qty || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const address = formData.get('address');
        try {
            const res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/checkout", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Order placed successfully! ID: ${data.orderId}`);
                navigate('/orders');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Checkout failed");
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Delivery Address</label>
                    <textarea name="address" required className="w-full border rounded p-2" rows="3" placeholder="Enter your address"></textarea>
                </div>
                <div className="text-xl font-bold text-right">Total: ${total.toFixed(2)}</div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold">Place Order</button>
            </form>
        </div>
    );
}
