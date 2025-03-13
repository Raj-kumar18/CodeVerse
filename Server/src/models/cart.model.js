import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Required User
        books: [
            {
                book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // ✅ Book ID
                quantity: { type: Number, required: true, min: 1 }, // ✅ Individual Quantity
            }
        ]
    },
    { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);