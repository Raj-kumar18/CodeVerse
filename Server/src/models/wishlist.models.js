import mongoose,{Schema} from "mongoose";

const wishlistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Required User
    books: [
        {
            book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // ✅ Book ID
        }
    ]
},
{ timestamps: true }
)

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);