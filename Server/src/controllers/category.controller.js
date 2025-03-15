// Desc: Category controller to handle all category related operations
import { Category } from '../models/category.models.js';
import { Book } from '../models/book.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

// ✅ **1️⃣ Create a new Category**

const createCategory = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    if (!name || !description) {
        return next(new ApiError(400, 'Name and Description are required'));
    }
    const existCategory = await Category.findOne({ name })
    if (existCategory) {
        throw new ApiError(400, 'Category already exists');
    }
    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'You are not authorized to create a category'));
    }
    const category = await Category.create({ name, description });
    if (!category) {
        return next(new ApiError(400, 'Category could not be created'));
    }
    return res.status(201).json(new ApiResponse(true, 'Category created successfully', category));
})


// ✅ **2️⃣ Get all categories**

const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    return res.status(200).json(new ApiResponse(true, 'Categories fetched successfully', categories));
})


// ✅ **3️⃣ update a category**

const updateCategory = asyncHandler(async (req, res, next) => {
    const { categoryid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryid)) {
        return next(new ApiError(400, 'Invalid Category ID'));
    }

    const { name, description } = req.body;
    if (!name || !description) {
        return next(new ApiError(400, 'Name and Description are required'));
    }
    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'You are not authorized to update a category'));
    }

    const category = await Category.findByIdAndUpdate(categoryid, { name, description }, { new: true });
    if (!category) {
        return next(new ApiError(400, 'Category could not be updated'));
    }
    return res.status(200).json(new ApiResponse(true, 'Category updated successfully', category));
})

// ✅ **4️⃣ delete a category**

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { deletecategoryid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(deletecategoryid)) {
        return next(new ApiError(400, 'Invalid Category ID'));
    }
    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'You are not authorized to delete a category'));
    }
    const category = await Category.findByIdAndDelete(deletecategoryid);
    if (!category) {
        return next(new ApiError(400, 'Category could not be deleted'));
    }
    return res.status(200).json(new ApiResponse(true, 'Category deleted successfully', category));
})


export { createCategory, getAllCategories, updateCategory, deleteCategory };