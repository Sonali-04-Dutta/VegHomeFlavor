import foodModel from "../models/foodModel.js";

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

//const food item

const addFood = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }
    
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image:image_filename,
    })

    try {
        await food.save();
        res.json({ success: true, message: "food added" })
    } catch(error){
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}

//all add food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error)
         res.json({ success: false, message:"error"});
    }
}

//remove food items 
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        fs.unlink(path.join(uploadDir, food.image), () => { })
        
        await foodModel.findByIdAndDelete(req.body.id);
         res.json({ success: true, message:"food removed"});
    } catch (error) {
         console.log(error)
         res.json({ success: false, message:"error"});
    }
}

export {addFood, listFood, removeFood}
