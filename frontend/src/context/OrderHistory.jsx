import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://ecommerce-store-f5y1.vercel.app/api/orders", {
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setOrders(data.orders);
            }
        })
        .catch(err => console.log(err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Order History</h1>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders yet. <button onClick={() => navigate('/')} className="text-blue-500 underline">Continue shopping</button></p>
            ) : (
                orders.map(order => (
                    <div key={order._id} className="bg-white p-6 rounded-lg shadow mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold">Order #{order._id.slice(-6)}</h2>
                            <span className="text-lg font-semibold">${order.total.toFixed(2)}</span>
                        </div>
                        <p className="mb-2"><strong>Status:</strong> {order.status}</p>
                        <p className="mb-4"><strong>Address:</strong> {order.address}</p>
                        <p className="mb-4"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        <h3 className="font-bold mb-2">Items:</h3>
                        <ul className="space-y-1">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.qty}x Product ID {item.productId} @ ${item.price} = ${(item.qty * item.price).toFixed(2)}</li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}
