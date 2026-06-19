import React, { useContext, useState } from 'react'
import { CartListContext } from './CartProvider';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
 const { width, product, cartList, removeFromCart, updateQty } = useContext(CartListContext)
 const navigate = useNavigate();
 if (product.length === 0) return <p className="text-center">No Product found</p>;
 const total = product.reduce((sum, item, index) => sum + (item.price * cartList[index]?.qty || 0), 0);

 const handleCheckout = async () => {
    try {
        const res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/checkout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address: "123 Mock Street" }) // Mock address
        });
        const data = await res.json();
        if (data.success) {
            alert(`Order placed! ID: ${data.orderId}, Total: $${data.total}`);
            navigate('/orders');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Checkout failed");
    }
 };

     return (
         <>
            <h1 className="text-3xl font-bold text-center my-4">Shopping Cart</h1>
            <div className="total text-2xl font-bold text-right mr-4 mb-4">Total: ${total.toFixed(2)}</div>
            <button onClick={handleCheckout} className="bg-blue-500 text-white px-8 py-2 rounded mx-auto block mb-8">Checkout</button>
             {
                 product.map((item, index) => {
                     const cartItem = cartList[index];
                     if (!cartItem) return null;
                     return <div key={item.id}>
                         <div className={`w-full flex ${width < 400 ? 'flex-col justify-center items-center' : "justify-between"} p-4 border-b`}>
                             <span className={`w-80 flex justify-end ${width<=400?"":"hidden"}`}>{width<=400?<i className="fa-solid fa-x text-red-500 text-2xl cursor-pointer" onClick={()=>removeFromCart(item.id)}></i>:""}</span>
                             <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover" />
                             <div className="flex flex-col p-2 flex-1">
                                 <h1 className="text-lg md:text-2xl font-bold">{item.title}</h1>
                                 <p className="text-lg font-semibold">Price: ${item.price}</p>
                                 <p className="text-sm text-gray-600">Qty: <input type="number" min="1" value={cartItem.qty} onChange={(e) => updateQty(item.id, parseInt(e.target.value))} className="w-16 border p-1" /> | Subtotal: ${(item.price * cartItem.qty).toFixed(2)}</p>
                             </div>
                             <span className='flex justify-center items-center p-2'>{width>400?<i className="fa-solid fa-x text-red-500 text-2xl cursor-pointer" onClick={()=>removeFromCart(item.id)}></i>:""}</span>
                         </div>
                     </div>
                 })
             }
         </>
     )
}
