import { Route, Routes } from "react-router-dom"
import "./App.css"
import ProductList from "./ProductList"
import Header from "./Header"
import WishListProvider from "./context/WishList"
import WishListPage from "./context/WishListPage"
import AuthPage from "./auth/AuthPage"
import CartProvider from "./context/CartProvider"
import CartPage from "./context/CartPage"
import Checkout from "./context/Checkout"
import OrderHistory from "./context/OrderHistory"
import AuthProvider, { useAuth } from "./context/AuthContext"
import ProductShow from "./ProductShow"
import { useState } from "react"

export default function App() {
  return (
    <AuthProvider>
      <Content />
    </AuthProvider>
  );
}

function Content() {
  const { loading } = useAuth();
  const [search,setSearch]=useState("")
  return (
    <>
      <CartProvider>
        <WishListProvider>
          <Header setSearch={setSearch}/>
          <Routes>
            <Route path="/" element={<ProductList search={search}/>} />
            <Route path="/wishlist" element={<WishListPage />} />
            <Route path="/product/:id" element={<ProductShow />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/auth" element={loading ? null : <AuthPage />} />
          </Routes>
        </WishListProvider>
      </CartProvider>
    </>
  );
}
