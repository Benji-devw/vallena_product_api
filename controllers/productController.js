const fs = require("fs");
let Product = require("../models/productModel");
// var Buffer = require('buffer/').Buffer

exports.getProducts = async (req, res) => {
    try {
        console.log("🔍 req.query", req.query);

        // Critères de recherche
        const findArgs = {};
        const query = req.query;

        // Filtre par catégorie
        if (
            query.category &&
            query.category !== "all" &&
            query.category !== ""
        ) {
            findArgs.categoryProduct = query.category;
        }

        // Filtre par prix
        if (query.minPrice) {
            findArgs.priceProduct = { $gte: Number(query.minPrice) };
        }
        if (query.maxPrice) {
            findArgs.priceProduct = {
                ...findArgs.priceProduct,
                $lte: Number(query.maxPrice),
            };
        }

        // Filtre par promotion
        if (query.promotion === "true") {
            findArgs.promotionProduct = true;
        }

        // Filtre par nouveauté
        if (query.novelty === "true") {
            findArgs.novelty = true;
        }

        // Filtre par recherche
        if (query.search) {
            findArgs.$or = [
                { titleProduct: { $regex: query.search, $options: "i" } },
                { descriptionProduct: { $regex: query.search, $options: "i" } },
                { categoryProduct: { $regex: query.search, $options: "i" } },
            ];
        }

        // Configuration du tri
        let sortConfig = {};
        if (query.promotion === "true") {
            sortConfig = { promotionProduct: -1, priceProduct: 1 };
        } else if (query.novelty === "true") {
            sortConfig = { novelty: -1, createdAt: -1 };
        } else if (query.sort === "price") {
            sortConfig = { priceProduct: query.order === "desc" ? -1 : 1 };
        } else {
            sortConfig = { createdAt: -1 }; // Par défaut
        }

        // Pagination
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 12;
        const skip = (page - 1) * limit;

        // Exécution de la requête
        const products = await Product.find(findArgs)
            .sort(sortConfig)
            .skip(skip)
            .limit(limit)
            .lean();

        // Compte total pour la pagination
        const total = await Product.countDocuments(findArgs);

        console.log("✅ Product list returned !");
        return res.status(200).json({
            success: true,
            message: "Product list retrieved successfully",
            products,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Products Not Found",
            error: error.message,
        });
    }
};

exports.getProductById = (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            return (err) => console.log("Get product error :", err);
        }
        return res.status(200).json({
            message: "Get product Done !",
            data: product,
        }); // Lien => apiCall/Products_Api
    }).catch((err) => res.status(400).json({ success: false, error: err }));
};

exports.insertProduct = (req, res, next) => {
    // console.log('reqBody.....', req.body)
    // console.log('reqFiles.....', req.files)

    const reqFiles = [];
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(`https://vallena.fr/public/${req.files[i].filename}`);
    }
    // reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)

    const product = new Product({
        ...req.body,
        imgCollection: reqFiles,
    });

    product
        .save()
        .then((result) => {
            console.log("✅ Product inserted !");
            res.status(201).json({
                message: "Insert product Done !",
                productCreated: {
                    _id: result._id,
                    imgCollection: result.imgCollection,
                },
            });
        })
        .catch((err) => res.status(500).json({ success: false, error: err }));
};

exports.updateProductById = (req, res, next) => {
    if (req.files.length > 0) {
        const urls = [];
        const pathFiles = req.body.copyCollection;
        urls.push(pathFiles);

        urls.forEach((url) => {
            if (url.length <= 6) {
                for (let i = 0; i < url.length; i++) {
                    let decoup = url[i].split("/");
                    // console.log('decoup', decoup[4])
                    fs.unlinkSync(`./public/${decoup[4]}`);
                }
            } else {
                // sinon une url et donc url.length = entre 0 et 30 carac
                let decoup = url.split("/");
                // console.log('decoup', decoup[4])
                fs.unlinkSync(`./public/${decoup[4]}`);
            }
        });
    }

    const reqFiles = [];
    if (req.files.length > 0) {
        for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(`https://vallena.fr/public/${req.files[i].filename}`);
        }
        // reqFiles.push(`http://ec2-15-236-41-246.eu-west-3.compute.amazonaws.com/public/${req.files[i].filename}`)
        // For Local
        // reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)
    }

    const newObj =
        req.files.length > 0
            ? {
                  ...req.body,
                  imgCollection: reqFiles,
              }
            : { ...req.body };

    Product.updateOne({ _id: req.params.id }, { ...newObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Update product Done !" }))
        .catch((error) => res.status(400).json({ error: error }));
};

exports.deleteProduct = (req, res) => {
    // console.log('req', req.params.id)

    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) {
            return (err) => console.log("Get product error :", err);
        }
        product.imgCollection.forEach((url) => {
            let decoup = url.split("/");
            console.log("decoup", decoup[4]);
            fs.unlinkSync(`./public/${decoup[4]}`);
        });
        Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            if (!product) {
                return res
                    .status(404)
                    .json({ success: false, error: "Delete echec !" });
            }
            return res
                .status(200)
                .json({ success: true, message: "Delete OK !" });
        }).catch((err) => console.log("Delete product error:", err));
    });
};

exports.getCategories = async (req, res) => {
    try {
        // Récupérer les catégories uniques
        const categories = await Product.distinct('categoryProduct');
        
        // Formater les catégories pour correspondre à l'interface attendue
        const formattedCategories = categories
            .filter(category => category) // Filtrer les valeurs null/undefined/empty
            .map(category => ({
                id: category,
                name: category
            }));

        console.log("✅ Categories list returned !");
        return res.status(200).json(formattedCategories);
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            message: "Categories Not Found",
            error: error.message
        });
    }
};
