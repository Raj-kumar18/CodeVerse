import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    books: [
        {
            book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
            quantity: { type: Number, required: true, min: 1 },
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true, enum: ["pending", "completed", "cancelled"], default: "pending" },
    paymentType: { type: String, required: true, enum: ["cod", "card"], default: "cod" },
    deliveryStatus: { type: String, required: true, enum: ["pending", "delivered", "cancelled"], default: "pending" },
    deliveryAddress: { type: String, required: true },
}, { timestamps: true });


export const Order = mongoose.model("Order", orderSchema);