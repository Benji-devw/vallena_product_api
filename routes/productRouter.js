let express = require('express'),
   router = express.Router(),
   multerConf = require('../middleware/multer-config'),
   productCtrl = require('../controllers/productController');

// ROUTE 3
router.post('/upload-images', multerConf, productCtrl.insertProduct);
router.put('/update/:id', multerConf, productCtrl.updateProductById);
router.get("/", productCtrl.getProducts);
router.get("/:id", productCtrl.getProductById);
router.delete("/:id", productCtrl.deleteProduct);

module.exports = router
