import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FetchProductId from "./api/FetchProductId";
import { wishListContext } from "./context/WishList";
import { CartListContext } from "./context/CartProvider";
import FetchProducts from "./api/FetchProducts";

export default function ProductShow() {
    const { id } = useParams();
    const [liked, setLiked] = useState(false)
    const [product, setProduct] = useState(null)
    const { AddList, list } = useContext(wishListContext)
    const { addToCart } = useContext(CartListContext)
    const [Product, setProducts] = useState([])
    const [selectedImage, setSelectedImage] = useState("")
    useEffect(() => {
        async function getProducts() {
            const data = await FetchProducts()
            setProducts(data)
        }
        getProducts();
    }, [])
    const navigate = useNavigate();
    useEffect(() => {
        async function getProduct() {
            let data = await FetchProductId(id);
            setLiked(list.includes(data.id))
            setProduct(data)
            setSelectedImage(
                data.thumbnail ||
                data.images?.[0] ||
                ""
            );
        }
        getProduct()
    }, [id])
    if (!product) return <p className="text-center">Loading...</p>;
    function capitalizeFirstLetter(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function AddToWishList(product) {
        setLiked(!liked)
        AddList(product.id)
    }
    function AddToCart(productId) {
        addToCart(productId, 1)
    }
    const avgRating =
        product?.reviews?.length > 0
            ? (
                product.reviews.reduce(
                    (acc, review) => acc + review.rating,
                    0
                ) / product.reviews.length
            ).toFixed(1)
            : 0;
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
            >
                <i className="fa-solid fa-arrow-left"></i>
                Back
            </button>

            {/* Product Section */}
            <div className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-lg p-6">

                {/* Left Side */}
                <div>
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <img
                            src={selectedImage}
                            alt={product.title}
                            className="w-full h-[400px] object-contain transition-all duration-300"
                        />
                    </div>

                    {/* Gallery */}
                    {product.images?.length > 0 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt=""
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 rounded-lg border-2 object-cover cursor-pointer transition
        ${selectedImage === img
                                            ? "border-black"
                                            : "border-gray-200"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <div className="space-y-5">

                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.title}
                        </h1>

                        <button
                            onClick={() => AddToWishList(product)}
                            className="text-3xl"
                        >
                            <i
                                className={`fa-solid fa-heart ${liked ? "text-red-500" : "text-gray-300"
                                    }`}
                            ></i>
                        </button>
                    </div>

                    <div className="flex gap-3 items-center">
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                            ⭐ {product.rating}
                        </span>

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {capitalizeFirstLetter(product.category)}
                        </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                        {product.description}
                    </p>
                    <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl font-bold">
                                ${product.price}
                            </h2>

                            <span className="bg-red-500 px-3 py-1 rounded-full text-sm">
                                {product.discountPercentage}% OFF
                            </span>
                        </div>

                        <p className="text-gray-300 mt-2">
                            Inclusive of all taxes
                        </p>
                    </div>
                    <div>
                        <span className="font-semibold">Brand:</span>{" "}
                        {product.brand}
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`w-3 h-3 rounded-full ${product.availabilityStatus === "In Stock"
                                ? "bg-green-500"
                                : "bg-orange-500"
                                }`}
                        ></span>

                        <span className="font-medium">
                            {product.availabilityStatus}
                        </span>

                        <span className="text-gray-500">
                            ({product.stock} items left)
                        </span>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => AddToCart(product.id)}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition"
                        >
                            <i className="fa-solid fa-cart-shopping mr-2"></i>
                            Add to Cart
                        </button>

                        <button
                            onClick={() => AddToCart(product.id)}
                            className="flex-1 bg-yellow-400 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="fa-solid fa-star text-yellow-500 text-2xl"></i>
                    <p className="font-bold mt-2">{product.rating}</p>
                    <p className="text-sm text-gray-500">
                        Product Rating
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="fa-solid fa-box text-green-500 text-2xl"></i>
                    <p className="font-bold mt-2">{product.stock}</p>
                    <p className="text-sm text-gray-500">
                        Stock Available
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="fa-solid fa-truck text-blue-500 text-2xl"></i>
                    <p className="font-bold mt-2 text-sm">
                        {product.shippingInformation}
                    </p>
                    <p className="text-sm text-gray-500">
                        Shipping
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4 text-center">
                    <i className="fa-solid fa-shield text-purple-500 text-2xl"></i>
                    <p className="font-bold mt-2 text-sm">
                        {product.warrantyInformation}
                    </p>
                    <p className="text-sm text-gray-500">
                        Warranty
                    </p>
                </div>
            </div>
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">
                    Product Tags
                </h2>

                <div className="flex flex-wrap gap-2">
                    {product.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 mt-10">
                <h2 className="text-2xl font-bold mb-6">
                    Specifications
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <strong>Brand:</strong> {product.brand}
                    </div>

                    <div>
                        <strong>SKU:</strong> {product.sku}
                    </div>

                    <div>
                        <strong>Weight:</strong> {product.weight} kg
                    </div>

                    <div>
                        <strong>Minimum Order:</strong>{" "}
                        {product.minimumOrderQuantity}
                    </div>

                    <div>
                        <strong>Return Policy:</strong>{" "}
                        {product.returnPolicy}
                    </div>

                    <div>
                        <strong>Category:</strong>{" "}
                        {capitalizeFirstLetter(product.category)}
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 mt-12">
                <h2 className="text-2xl font-bold mb-4">
                    Review Summary
                </h2>

                <div className="flex items-center gap-5">
                    <div className="text-5xl font-bold">
                        {avgRating}
                    </div>

                    <div>
                        <div className="text-yellow-500 text-xl">
                            ⭐⭐⭐⭐⭐
                        </div>

                        <p className="text-gray-500">
                            Based on {product.reviews.length} reviews
                        </p>
                    </div>
                </div>
            </div>
            {/* Reviews */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                    Customer Reviews
                </h2>

                <div className="grid gap-4">
                    {product.reviews?.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm border p-5"
                        >
                            <div className="flex justify-between">
                                <h3 className="font-semibold">
                                    {review.reviewerName}
                                </h3>

                                <span className="text-yellow-500">
                                    ⭐ {review.rating}
                                </span>
                            </div>

                            <p className="text-gray-600 mt-2">
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <div className="grid md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                    <i className="fa-solid fa-truck-fast text-3xl"></i>
                    <p className="mt-2">Fast Delivery</p>
                </div>

                <div className="text-center">
                    <i className="fa-solid fa-rotate-left text-3xl"></i>
                    <p className="mt-2">
                        {product.returnPolicy}
                    </p>
                </div>

                <div className="text-center">
                    <i className="fa-solid fa-lock text-3xl"></i>
                    <p className="mt-2">Secure Payment</p>
                </div>

                <div className="text-center">
                    <i className="fa-solid fa-award text-3xl"></i>
                    <p className="mt-2">Quality Assured</p>
                </div>
            </div>
            {/* Similar Products */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                    Similar Products
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Product.filter(
                        (item) =>
                            item.category === product.category &&
                            item.id !== product.id
                    ).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="h-52 bg-gray-50 p-4 flex items-center justify-center">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="h-full object-contain"
                                />
                            </div>

                            <div className="p-4">
                                <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                    ⭐ {item.rating}
                                </span>

                                <h3 className="mt-3 font-medium text-gray-800 line-clamp-2">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}