import React, { useEffect, useState } from 'react';
import { createContext } from 'react';
import FetchProductId from '../api/FetchProductId';
import { useAuth } from './AuthContext';

export const CartListContext = createContext();

export default function CartProvider({ children }) {
    const { user } = useAuth();
    const [cartList, setCartList] = useState([]);
    const [product, setProduct] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);

    function addToCart(productId, qty = 1) {
        setCartList(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing) {
                return prev.map(item => item.id === productId ? { ...item, qty: item.qty + qty } : item);
            }
            return [...prev, { id: productId, qty }];
        });
    }

    function removeFromCart(productId) {
        setCartList(prev => prev.filter(item => item.id !== productId));
    }

    function updateQty(productId, qty) {
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartList(prev => prev.map(item => item.id === productId ? { ...item, qty } : item));
    }

    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleSize)
        return () => {
            window.removeEventListener("resize", handleSize)
        }
    }, []);

    useEffect(() => {
        async function loadProducts() {
            const products = await Promise.all(
                cartList.map((item) => FetchProductId(item.id))
            );
            setProduct(products);
        }
        loadProducts();
    }, [cartList]);

    useEffect(() => {
        async function fetchCart() {
            if (!user || !navigator.onLine) return;
            try {
                const res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/cartData", {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (data.success) {
                    console.log("data.cartlist",data.cartlist)
                    setCartList(data.cartlist || []);
                }
            } catch (error) {
                console.log("fetch cart error", error);
            }
        }
        fetchCart();
    }, [user]);

    useEffect(() => {
        async function syncCart() {
            if (!user || !navigator.onLine) return;
            console.log("sync cart", user)
            console.log("cardlist",cartList)
            try {
                let res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/cartData", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cartlist: cartList
                    })
                });
                res = await res.json();
                if (!res.success) {
                    console.log(res.message)
                }
                console.log(res.success, res.message)
            } catch (error) {
                console.log("error", error);
            }
        }
        syncCart();
    }, [cartList]);

    return (
        <CartListContext.Provider value={{ cartList, addToCart, removeFromCart, updateQty, width, product }}>
            {children}
        </CartListContext.Provider>
    )
}
