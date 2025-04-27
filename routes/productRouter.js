let express = require("express"),
    router = express.Router(),
    multerConf = require("../middleware/multer-config"),
    productCtrl = require("../controllers/productController");

// Routes spécifiques
router.get("/categories", productCtrl.getCategories);
router.get("/matters", productCtrl.getMatters);
router.get("/colors", productCtrl.getColors);

// Route principale des produits
router.get("/", productCtrl.getProducts);

// Routes avec paramètres
router.post("/insert", multerConf, productCtrl.insertProduct);
router.put("/update/:id", multerConf, productCtrl.updateProductById);
router.get("/:id", productCtrl.getProductById);
router.delete("/:id", productCtrl.deleteProduct);

module.exports = router;
