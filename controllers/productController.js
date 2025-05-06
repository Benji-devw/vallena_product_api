const fs = require("fs");
const Product = require("../models/productModel");
// var Buffer = require('buffer/').Buffer

// Helper function to build search query
const buildSearchQuery = (query) => {
    const findArgs = {};

    // Category filter
    if (query.category && query.category !== "all" && query.category !== "") {
        findArgs.categoryProduct = query.category;
    }

    // Matter filter
    if (query.matter && query.matter !== "all" && query.matter !== "") {
        findArgs.matter = query.matter;
    }

    // Color filter
    if (query.color && query.color !== "all" && query.color !== "") {
        findArgs.color = query.color;
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
        findArgs.priceProduct = {};
        if (query.minPrice) findArgs.priceProduct.$gte = Number(query.minPrice);
        if (query.maxPrice) findArgs.priceProduct.$lte = Number(query.maxPrice);
    }

    // Promotion filter
    if (query.promotion === "true") {
        findArgs.promotionProduct = true;
    }

    // Novelty filter
    if (query.novelty === "true") {
        findArgs.novelty = true;
    }

    // Search filter
    if (query.search) {
        findArgs.$or = [
            { titleProduct: { $regex: query.search, $options: "i" } },
            { descriptionProduct: { $regex: query.search, $options: "i" } },
            { categoryProduct: { $regex: query.search, $options: "i" } },
        ];
    }

    return findArgs;
};

// Get all products with filters
exports.getProducts = async (req, res) => {
    console.log("getProducts", req.query);
    try {
        const query = req.query;
        const findArgs = buildSearchQuery(query);

        // Limit
        const limit = parseInt(query.limit) || 6;

        // Execute query
        const products = await Product.find(findArgs)
            .limit(limit)
            .lean();

        // Return products
        return res.status(200).json({
            success: true,
            message: "Product list retrieved successfully",
            products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Products Not Found",
            error: error.message,
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: "Error retrieving product",
            error: error.message
        });
    }
};

// Create new product
exports.insertProduct = async (req, res) => {
    try {
        const reqFiles = req.files.map(file => 
            `https://vallena.fr/public/${file.filename}`
        );

        const product = new Product({
            ...req.body,
            imgCollection: reqFiles,
        });

        const result = await product.save();
        
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            productCreated: {
                _id: result._id,
                imgCollection: result.imgCollection,
            },
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
};

// Update product
exports.updateProductById = async (req, res) => {
    try {
        // Handle file deletion if new files are uploaded
        if (req.files.length > 0 && req.body.copyCollection) {
            const urls = Array.isArray(req.body.copyCollection) 
                ? req.body.copyCollection 
                : [req.body.copyCollection];

            urls.forEach(url => {
                const filename = url.split("/").pop();
                if (filename) {
                    fs.unlinkSync(`./public/${filename}`);
                }
            });
        }

        // Prepare new files array
        const reqFiles = req.files.map(file => 
            `https://vallena.fr/public/${file.filename}`
        );

        // Prepare update object
        const updateObj = req.files.length > 0
            ? { ...req.body, imgCollection: reqFiles }
            : req.body;

        const result = await Product.updateOne(
            { _id: req.params.id },
            { ...updateObj, _id: req.params.id }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete associated files
        product.imgCollection.forEach(url => {
            const filename = url.split("/").pop();
            if (filename) {
                fs.unlinkSync(`./public/${filename}`);
            }
        });

        await Product.findOneAndDelete({ _id: req.params.id });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message
        });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("categoryProduct");
        const formattedCategories = categories
            .filter(category => category)
            .map(category => ({
                id: category,
                name: category,
            }));

        return res.status(200).json(formattedCategories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

// Get all matters
exports.getMatters = async (req, res) => {
    try {
        const matters = await Product.distinct("matter");
        const formattedMatters = matters
            .filter(matter => matter)
            .map(matter => ({
                id: matter,
                name: matter,
            }));

        return res.status(200).json(formattedMatters);
    } catch (error) {
        console.error("Error fetching matters:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching matters",
            error: error.message
        });
    }
};

// Get all colors
exports.getColors = async (req, res) => {
    try {
        const colors = await Product.distinct("color");
        const processedColors = colors
            .filter(color => color)
            .flatMap(color => 
                color.split(',')
                    .map(c => c.trim().toLowerCase())
                    .filter(c => c)
            )
            .filter((color, index, self) => 
                index === self.findIndex(c => c === color)
            )
            .sort((a, b) => a.localeCompare(b))
            .map(color => ({
                id: color,
                name: color.charAt(0).toUpperCase() + color.slice(1)
            }));

        return res.status(200).json(processedColors);
    } catch (error) {
        console.error("Error fetching colors:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching colors",
            error: error.message
        });
    }
};
