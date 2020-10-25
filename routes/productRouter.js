let express = require('express'),
   router = express.Router(),
   multerConf = require('../middleware/multer-config'),
   productCtrl = require('../controllers/productController');

// ROUTE 3
router.get("/", productCtrl.getProducts);
router.get("/:id", productCtrl.getProductById);
//router.post('/insert', multerConf, productCtrl.insertProduct);
//router.put('/update/:id', multerConf, productCtrl.updateProductById);
//router.delete("/:id", productCtrl.deleteProduct);

router.post("/getproductspost", productCtrl.getProductsPost);

module.exports = router
