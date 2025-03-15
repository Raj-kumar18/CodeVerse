import { Book } from "../models/book.model.js";
import { Category } from "../models/category.models.js"; // ✅ Fixed import
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../config/cloudinary.js"; // ✅ Import Cloudinary function
import mongoose, { isValidObjectId } from 'mongoose';

const createBook = asyncHandler(async (req, res, next) => {
    let { title, price, description, stock, category } = req.body;

    // 🔹 Validate Required Fields
    if (!title || !price || !description || !stock || !category) {
        return next(new ApiError(400, 'All fields are required'));
    }

    // ✅ Category Find Logic
    let categoryExist;
    if (mongoose.Types.ObjectId.isValid(category)) {
        categoryExist = await Category.findById(category);
    } else {
        categoryExist = await Category.findOne({ name: category });
    }

    if (!categoryExist) {
        return next(new ApiError(400, 'Category does not exist'));
    }

    category = categoryExist._id; // 🔥 Convert category name into ObjectId

    // 🔹 Check If Book with Same Title Exists in the Given Category
    const existBook = await Book.findOne({ title, category });
    if (existBook) {
        return next(new ApiError(400, 'Book with this title already exists in the selected category'));
    }

    // ✅ **Handle Multiple Images**
    if (!req.files || req.files.length === 0) {
        return next(new ApiError(400, 'Please provide at least one image'));
    }

    // 🔹 Cloudinary pe sabhi images upload karo
    const imageUrls = await Promise.all(
        req.files.map(async (file) => {
            const uploadResult = await uploadOnCloudinary(file.path);
            return uploadResult.url;
        })
    );

    // 🔹 Create New Book Entry
    const book = await Book.create({
        title,
        price,
        description,
        stock,
        category,
        owner: req.user._id,
        images: imageUrls // ✅ Array of image URLs
    });

    if (!book) {
        return next(new ApiError(400, 'Book could not be created'));
    }

    // 🔹 Response
    return res.status(201).json(new ApiResponse(201, book, 'Book created successfully'));
});

const getAllBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find().populate('category', 'name').populate('owner', 'userName email');
    return res.status(200).json(new ApiResponse(200, books, 'Books fetched successfully'));
});


const updateBook = asyncHandler(async (req, res, next) => {
    const { bookid } = req.params;

    // ✅ Validate Book ID
    if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return next(new ApiError(400, "Invalid Book ID"));
    }

    // ✅ Find the book to update
    let book = await Book.findById(bookid);
    if (!book) {
        return next(new ApiError(404, "Book not found"));
    }

    let { title, price, description, stock, category } = req.body;

    // ✅ Check if category exists (only if user is updating the category)
    if (category) {
        let categoryExist = mongoose.Types.ObjectId.isValid(category)
            ? await Category.findById(category)
            : await Category.findOne({ name: category });

        if (!categoryExist) {
            return next(new ApiError(400, "Category does not exist"));
        }
        category = categoryExist._id; // Convert category name to ObjectId
    }

    // ✅ Check for duplicate book title in the same category (excluding current book)
    if (title) {
        const existBook = await Book.findOne({ title, category, _id: { $ne: bookid } });
        if (existBook) {
            return next(new ApiError(400, "Book with this title already exists in the selected category"));
        }
    }

    // ✅ Prepare update data (Ignore undefined values)
    const updateData = {};
    if (title) updateData.title = title;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    if (stock) updateData.stock = stock;
    if (category) updateData.category = category;

    // ✅ Update Book Entry
    Object.assign(book, updateData); // ✅ Merge only provided fields
    await book.save({ validateBeforeSave: false }); // ✅ Save with hooks

    // ✅ Response
    return res.status(200).json(new ApiResponse(200, book, "Book updated successfully"));
});


const deleteBook = asyncHandler(async (req, res, next) => {
    const { deletebookid } = req.params;

    // ✅ Validate Book ID
    if (!isValidObjectId(deletebookid)) {
        throw new ApiError(400, "Invalid Book ID");
    }
    const book = await Book.findByIdAndDelete(deletebookid);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // ✅ Response
    return res.status(200).json(new ApiResponse(200, book, "Book deleted successfully"));

})





export { createBook, getAllBooks, updateBook }; // ✅ Export Functions
