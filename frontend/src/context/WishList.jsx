import { createContext, useEffect, useState } from "react";
import FetchProductId from "../api/FetchProductId";
import { useAuth } from "./AuthContext";


export const wishListContext = createContext();

export default function WishListProvider({ children }) {
    const { user } = useAuth();
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);
    const [product, setProduct] = useState([])
    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleSize)
        return () => {
            window.removeEventListener("resize", handleSize)
        }
    }, [])
    useEffect(() => {
        async function loadProducts() {
            const products = await Promise.all(
                list.map((id) => FetchProductId(id))
            );
            setProduct(products);
        }
        loadProducts();
    }, [list])

    useEffect(() => {
        async function fetchWishlist() {
            if (!user || !navigator.onLine) return;
            try {
                const res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/wishlistData", {
                    method: "GET"
                });
                const data = await res.json();
                if (data.success) {
                    setList(data.wishlist || []);
                    setCount(data.wishlist?.length || 0);
                }
            } catch (error) {
                console.log("fetch wishlist error", error);
            }
        }
        fetchWishlist();
    }, [user]);

    useEffect(() => {
        async function syncWishlist() {
            if (!user || !navigator.onLine) return;
            try {
                let res = await fetch("https://ecommerce-store-f5y1.vercel.app/api/wishlistData", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        wishlist: list
                    })
                });
                res=await res.json();
                if(!res.success){
                    console.log(res.message)
                }
            } catch (error) {
                console.log("error", error);
            }
        }

        syncWishlist();
    }, [list]);
    function AddList(value) {
        if (!list.includes(value)) {
            setCount(count + 1);
            setList(prev => [...prev, value])
        }
        else {
            setCount(count - 1)
            setList(prev => prev.filter((item) => item !== value))
        }
    }
    return (
        <wishListContext.Provider value={{ count, AddList, list, width, product }}>
            {children}
        </wishListContext.Provider>
    );
}