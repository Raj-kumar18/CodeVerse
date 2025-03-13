import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Required User
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // ✅ Book ID
    rating: { type: Number, required: true, min: 1, max: 5 }, // ✅ Rating
    review: { type: String, required: true }, // ✅ Review
},
    { timestamps: true }
)

export const Review = mongoose.model("Review", reviewSchema);