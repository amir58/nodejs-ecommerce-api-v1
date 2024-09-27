const Product = require( "../models/productModel" );
const factory = require( "./handlersFactory" );

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = factory.createOne( Product );


// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll( Product, 'products' );

// @desc    Get specific Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne( Product );
// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne( Product );
// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne( Product );

