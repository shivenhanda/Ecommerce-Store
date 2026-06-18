import express from 'express'
import path from 'path'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { NewUser, WishListData, CartListData, Product, Order } from './Model.js'

const connectDB = async () => {
    if(mongoose.connection.readyState===1){
        return;
    }
    try {
        console.log("URI exists:", !!process.env.MongoDB_URI);
        await mongoose.connect(process.env.MongoDB_URI)
    } catch (error) {
        console.log(error)
    }
}

const app = express()

app.use(cors({
  origin: "https://ecommerce-store-tmzs.vercel.app",
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(process.cwd(), "..", "frontend", "dist")))
app.use(checkcookie)

function checkcookie(req,res,next){
    try{if(req.cookies.token){
        let decoded=jwt.verify(req.cookies.token,"secret")
        req.user=decoded;
    }}catch(error){
        req.user=null
    }
    next()
}

app.get("/api/profile", async (req, res) => {
    if(req.user){
        return res.json({success:true,user:req.user})
    }
    return res.json({success:false,user:null})
})

app.post("/api/SignUp", async (req, res) => {
    try {
        const { user, email, password } = req.body
        await connectDB()
        console.log("BODY:", req.body);
        console.log("Mongo:", mongoose.connection.readyState);
        let existingUser = await NewUser.findOne({
            $or: [{ user }, { email }]
        })
        if (existingUser) {
            return res.json({ success: false, message: "Something is wrong" })
        }
        let salt = await bcrypt.genSalt(10)
        let hashpassword = await bcrypt.hash(password, salt)
        await NewUser.create({
            user,
            email,
            password: hashpassword
        })
        let token = jwt.sign({ user }, "secret")
        res.cookie("token", token, {
            httpOnly: true
        })
        req.user=user
        console.log("created User",user)
        return res.json({ success: true, message: "Signup Successfully",user:user })
    }
    catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Signup Not Completed" })
    }
})
app.post("/api/Login", async (req, res) => {
    try {
        const { user, password } = req.body
        await connectDB()
        let existingUser = await NewUser.findOne({ user })
        if (!existingUser) {
            return res.json({ success: false, message: "Something is wrong" })
        }
        let match=await bcrypt.compare(password,existingUser.password)
        if(!match){
            return res.json({ success: false, message: "Something is wrong" })
        }
        let token=jwt.sign({user},"secret")
        res.cookie("token",token,{
            httpOnly:true
        })
        req.user=user
        return res.json({success:true,message:"Login Successfully",user:user})
    }
    catch (error) {
        return res.json({ success: false, message: "Login Not Completed" })
    }
})

app.post("/api/logout", (req, res) => {
    res.clearCookie("token");
    res.json({success: true});
});

app.get("/api/wishlistData", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) {
            return res.json({ success: false, message: "no user" });
        }
        const data = await WishListData.findOne({ user });
        const wishlist = data?.wishlist || [];
        return res.json({ success: true, wishlist:wishlist });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

app.post("/api/wishlistData", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) {
            return res.json({ success: false, message: "no user" });
        }
        const { wishlist } = req.body;
        const data = await WishListData.findOneAndUpdate(
            { user },
            { wishlist },
            { upsert: true }
        );
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});
app.get("/api/cartData", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) {
            return res.json({ success: false, message: "no user" });
        }
        const data = await CartListData.findOne({ user });
        const cartlist = data?.cartlist || [];
        return res.json({ success: true, cartlist:cartlist });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

app.post("/api/cartData", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) {
            return res.json({ success: false, message: "no user" });
        }
        const { cartlist } = req.body;
        const data = await CartListData.findOneAndUpdate(
            { user },
            { cartlist }
        );
        return res.json({ success: true ,message:data});
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        await connectDB()
        let products = await Product.find({});
        if (products.length === 0) {
            const mockData = [
                { id: 1, name: "iPhone", price: 999, stock: 10 },
                { id: 2, name: "Laptop", price: 1299, stock: 5 },
                { id: 3, name: "Headphones", price: 199, stock: 20 }
            ];
            await Product.insertMany(mockData);
            products = mockData;
        }
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.post("/api/checkout", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) return res.json({ success: false, message: "no user" });
        const { address } = req.body;
        const cartData = await CartListData.findOne({ user });
        const cartlist = cartData?.cartlist || [];
        if (cartlist.length === 0) return res.json({ success: false, message: "empty cart" });
    
        const items = [];
        let total = 0;
        for (const item of cartlist) {
            const prodRes = await fetch(`https://dummyjson.com/products/${item.id}`);
            const product = await prodRes.json();
            items.push({ productId: item.id, qty: item.qty, price: product.price });
            total += product.price * item.qty;
        }
        
        const newOrder = await Order.create({ user, items, total, address });
        // Clear cart
        await CartListData.findOneAndUpdate({ user }, { cartlist: [] });
        
        res.json({ success: true, orderId: newOrder._id, total });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.get("/api/orders", async (req, res) => {
    try {
        const user = req.user?.user;
        await connectDB()
        if (!user) return res.json({ success: false, message: "no user" });
        const orders = await Order.find({ user }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(process.cwd(), "..", "frontend", "dist", "index.html"));
});

export default app;