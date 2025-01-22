import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';

dotenv.config();
const app = express();

app.use(express.json()); //allow us to accept JSON data in the req.body

/* 
FONCTION SYNCRHONE
Dans une fonction synchrone, le code est exécuté ligne par ligne, 
dans l'ordre où il est écrit. Chaque ligne de code doit être exécutée avant de passer à la suivante.
*/

app.get("/api/products", async (req, res) =>{
    try {
        const products = await Product.find({});
        res.status(200).json({success:true, data:products});
    } catch (error) {
        
        res.status(500).json({success:false, message:"Server error"});
    }
})

app.post("/api/products", async (req, res) =>{
    const product = req.body; //user will send this data

    if (!product.name || !product.price || !product.image){
        return res.status(400).json({succes:false, message:"Please provide all fields"});
    }

    const newProduct = new Product(product);
    
    try {
        await newProduct.save();
        res.status(201).json({succes:true, data: newProduct})
    } catch (error) {
        console.error("Error in Create product:", error.message);
        res.status(500).json({succes:false, message:"Server error"});
    }
})

app.delete("/api/products/:id", async (req, res) => {
    const {id} = req.params;
    console.log("id:", id)
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true, message:"Product deleted"});
    } catch (error) {
        console.log("error in deleting product", error.message);
        res.status(404).json({success:false, message:"Product not found"});
    }
});

app.put("/api/products/:id", async (req, res)=>{
    const {id} = req.params;

    const product = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false, message:"Invalid product Id"});
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
        res.status(200).json({success:true, data:updatedProduct});
    } catch (error) {
        res.status(500).json({success:false, message:"Server error"});
    }
})

app.listen(5000, () => {
    connectDB();
    console.log('Server started at http://localhost:5000');
});