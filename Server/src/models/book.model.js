import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 10 }, // Kitne available hain
    description: { type: String },
    images: [{ type: String }], // Book ke multiple images ho sakti hain
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);
