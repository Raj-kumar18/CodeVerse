import mongoose,{Schema} from "mongoose";

const couponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // ✅ Unique Coupon Code
    discountType: { type: String, enum: ["percentage", "fixed"], required: true }, // ✅ Flat or Percentage
    discountValue: { type: Number, required: true }, // ✅ Discount Amount (₹ or %)
    minAmount: { type: Number, default: 0 }, // ✅ Minimum cart value required
    maxDiscount: { type: Number }, // ✅ Max discount limit (for % discount)
    expiresAt: { type: Date, required: true }, // ✅ Expiry Date
    usageLimit: { type: Number, default: 1 }, // ✅ How many times it can be used
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }] // ✅ Users who have used it
}, { timestamps: true });

export const Coupon = mongoose.model("Coupon", couponSchema);