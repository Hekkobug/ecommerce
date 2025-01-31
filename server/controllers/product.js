const { query, response } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const makeSKU = require('uniqid')

const createProduct = asyncHandler(async (req, res) => {
  const { title, price, description, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map((el) => el.path);
  if (!(title && price && description && brand && category && color))
    throw new Error("Missing inputs");
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Created!" : "Falsed!",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstname lastname avatar",
    },
  });
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot get product",
  });
});
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  let colorQueryObject = {};
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: `i` };
  if (queries?.category)
    formatedQueries.category = { $regex: queries.category, $options: `i` };
  if (queries?.brand)
    formatedQueries.brand = { $regex: queries.brand, $options: `i` };
  if (queries?.color) {
    delete formatedQueries.color;
    const colorArr = queries.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    colorQueryObject = { $or: colorQuery };
  }
  let queryObject ={}
  if(queries?.q){
    delete formatedQueries.q
    queryObject = {$or:[
      { color: { $regex: queries.q, $options: "i" } },
      { title: { $regex: queries.q, $options: "i" } },
      { category: { $regex: queries.q, $options: "i" } },
      { brand: { $regex: queries.q, $options: "i" } },
      { description: { $regex: queries.q, $options: "i" } },
    ]}
  }
  const qr = { ...colorQueryObject, ...formatedQueries,...queryObject };
  let queryCommand = Product.find(qr);

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }

  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  try {
    const response = await queryCommand.exec();
    const counts = await Product.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Cannot get products",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files
  if(files?.thumb) req.body.thumb = files?.thumb[0]?.path
  if(files?.images) req.body.images = files?.images.map(el => el.path)
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    mes: updatedProduct ? 'Updated!' : "Cannot update product",
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct ? 'Deleted!' : "Cannot delete product",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = await ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    );
  }

  const updateProduct = await Product.findById(pid);
  const ratingCount = updateProduct.ratings.length;
  const sumRatings = updateProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updateProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;

  await updateProduct.save();

  return res.status(200).json({
    success: true,
    updateProduct,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(pid, {
    $push: { images: { $each: req.files.map((el) => el.path) } },
  },{new: true});
  return res.status(200).json({
    success: response ? true : false,
    updateProduct: response ? response : "Cannot upload image product",
  });
});
const addVarriant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req?.files?.images?.map(el => el.path);
  if (!(title && price && color))
    throw new Error("Missing inputs");
  if (!req.files) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(pid, {
    $push: { varriants: { color,price,title,thumb,images,sku:makeSKU().toUpperCase() } },
  },{new: true});
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? 'Added varriant!' : "Cannot upload image product",
  });
});

const apiUpdateProductQuantities = asyncHandler(async (req, res) => {
  const { products } = req.body;
  const updatedProducts = [];

  try {
    for (const product of products) {
      const { product: productDetails, quantity } = product; 
      const existingProduct = await Product.findById(productDetails._id); 

      if (existingProduct) {
        const updatedProduct = await Product.findByIdAndUpdate(
          productDetails._id, 
          {
            $inc: {
              quantity: -quantity, // Trừ đi số lượng đã đặt hàng
              sold: quantity // Tăng số lượng đã bán
            }
          },
          { new: true } // Trả về tài liệu đã cập nhật
        );
       updatedProducts.push(updatedProduct);
      }
    }
   

    return res.status(200).json({
      success: true,
      message: 'Product quantities updated successfully',
      data: updatedProducts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImageProduct,
  addVarriant,
  apiUpdateProductQuantities
};
