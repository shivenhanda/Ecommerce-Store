import mongoose from "mongoose";
import "dotenv/config";
const connectDB = async () => {
    try {
        console.log("URI exists:", !!process.env.MongoDB_URI);
        await mongoose.connect(process.env.MongoDB_URI)
    } catch (error) {
        console.log(error)
    }
}
connectDB();

const NewUserSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const WishListSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    wishlist: [{
        type: Number,
        default: []
    }]
})
const CartListSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        required: true
    },
    cartlist: [{
        id: Number,
        qty: { type: Number, default: 1 }
    }]
})
const NewUser = mongoose.model("NewUser", NewUserSchema);
const WishListData = mongoose.model("WishList", WishListSchema);
const CartListData = mongoose.model("CartList", CartListSchema);

const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    name: String,
    price: Number,
    stock: { type: Number, default: 0 }
});

const OrderSchema = new mongoose.Schema({
    user: { type: String, required: true },
    items: [{
        productId: Number,
        qty: Number,
        price: Number
    }],
    total: Number,
    status: { type: String, default: 'pending' },
    address: String,
    date: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);

export { NewUser, WishListData, CartListData, Product, Order };
