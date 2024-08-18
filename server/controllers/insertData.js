const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const data = require('../../data/ecommerce.json');
const slugify = require('slugify');
const categoryData = require('../../data/cate_brand')
const ProductCategory = require('../models/productCategory');

const fn = async (product) => {
    try {
        const slug = slugify(product?.name || 'default-name') + Math.round(Math.random() * 100) + '';

        await Product.create({
            title: product?.name || 'No Name',
            slug: slug,
            description: product?.description,
            brand: product?.brand || 'Unknown Brand',
            price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
            category: product?.category ? product?.category[1] || 'Uncategorized' : 'Uncategorized',
            quantity: Math.round(Math.random() * 1000),
            sold: Math.round(Math.random() * 100),
            images: product?.images || [],
            color: product?.variants?.find(el => el.label === 'Color')?.variants[0] || 'Unknown Color',
            thumb: product?.thumb,
            totalRatings: 0
        });
    } catch (error) {
        console.error('Error creating product:', error);
    }
};

const insertProduct = asyncHandler(async (req, res) => {
    if (!Array.isArray(data)) {
        return res.status(400).json({ success: false, message: "Dữ liệu không phải là mảng" });
    }

    const promises = data.map(product => fn(product));

    try {
        await Promise.all(promises);
        return res.json({ success: true, message: "Done" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi thêm dữ liệu", error: error.message });
    }
});

const fn2 = async (cate) => {
    try {
        await ProductCategory.create({
            title: cate?.cate || 'No Category',
            brand: cate?.brand || [], 
            image: cate?.image || '' 
        });
    } catch (error) {
        console.error('Error creating category:', error);
    }
};

const insertCategory = asyncHandler(async (req, res) => {
    if (!Array.isArray(categoryData)) {
        return res.status(400).json({ success: false, message: "Dữ liệu không phải là mảng" });
    }

    const promises = categoryData.map(cate => fn2(cate));

    try {
        await Promise.all(promises);
        return res.json({ success: true, message: "Done" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi thêm dữ liệu", error: error.message });
    }
});

module.exports = {
    insertProduct,
    insertCategory,
};
