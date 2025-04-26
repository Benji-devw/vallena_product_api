let express = require("express"),
    router = express.Router(),
    multerConf = require("../middleware/multer-config"),
    productCtrl = require("../controllers/productController");

// Route principale des produits
router.get("/", productCtrl.getProducts);

// Route pour récupérer les catégories
router.get("/categories", productCtrl.getCategories);

// Routes spécifiques
router.get("/:id", productCtrl.getProductById);
router.post("/insert", multerConf, productCtrl.insertProduct);
router.put("/update/:id", multerConf, productCtrl.updateProductById);
router.delete("/:id", productCtrl.deleteProduct);

module.exports = router;
