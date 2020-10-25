const fs = require('fs');
let Product = require('../models/productModel');
// const { stringify } = require('querystring');



// class APIfeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString = queryString;
//     }
//     filtering() {
//         console.log('this.query', this.query)
//         // const queryobj = {...this.queryString}
//         // console.log('queryobj', queryobj)
//     }
//     paginating() {
//         const page = this.queryString.page * 1 || 1;
//         const limit = this.queryString.limit * 1 || 4;
//         const skip = (page - 1) * limit;
//         this.query = this.query.skip(skip).limit(limit)
//         return this
//     }
// }
// exports.getProducts = async (req, res) => {
//     const features = new APIfeatures(Product.find(), req.query)
//     // .filtering();
//     // .paginating();
//     const products = await features.query;
//     res.status(200).json({
//         message: "Product list Done !",
//         result: products.length,
//         products: products      // Lien => apiCall/Products_Api
//     });     
// }


exports.getProducts = (req, res, next) => {
    Product.find()
        .then(data => {
            return res.status(200).json({
                message: "Product list from getProducts Done !",
                products: data      // Lien => apiCall/Products_Api
            });
        })
        .catch(err => res.status(500).json({
            message: "Products Not Found",
            error: err
        }))
}


exports.insertProduct = (req, res, next) => {
    // console.log('reqBody.....', req.body)
    // console.log('reqFiles.....', req.files)

    const reqFiles = [];
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(`https://vallena.fr/public/${req.files[i].filename}`)
    }
    // reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)

    const product = new Product({
        ...req.body,
        imgCollection: reqFiles
    });

    product.save().then(result => {
        res.status(201).json({
            message: "Insert product Done !",
            productCreated: {
                _id: result._id,
                imgCollection: result.imgCollection
            }
        })
    }).catch(err => res.status(500).json({ success: false, error: err }))
}

exports.updateProductById = (req, res, next) => {
    // console.log('reqBody.....', req.body)
    // console.log('RB.imgCollection.....', req.body.imgCollection)
    // console.log('reqFiles.....', req.files.length)
    // console.log('RB.copyCollection...', req.body.copyCollection)

    // console.log(req.protocol);
    // console.log(req.get('host'));
    // console.log(req.url);


    if (req.files.length > 0) {     // Si new image depuis React on rentre
        // console.log('req.files TRUE')

        // Créer un tab pour blouclé sur le JSON de req.body.copyCollection
        const urls = []
        const pathFiles = req.body.copyCollection
        urls.push(pathFiles)

        urls.forEach(url => {           // Pour chaque ulrs ds urls[]
            if (url.length <= 6) {      // Si plusieurs [url] on rentre 
                for (let i = 0; i < url.length; i++) {
                    let decoup = url[i].split('/')
                    // console.log('decoup', decoup[4])
                    fs.unlinkSync(`./public/${decoup[4]}`)      // Sync pour supprimer direct sinon besoin d'une callback pour par example renvoyer une réponse
                }
            } else {    // sinon une url et donc url.length = entre 0 et 30 carac
                let decoup = url.split('/')
                // console.log('decoup', decoup[4])
                fs.unlinkSync(`./public/${decoup[4]}`)
            }
        });
    }

    const reqFiles = [];
    if (req.files.length > 0) {
        for (var i = 0; i < req.files.length; i++) {        // Avec FOR on rentre ds req.files et créer les urls
            reqFiles.push(`https://vallena.fr/public/${req.files[i].filename}`)
        }
        // reqFiles.push(`http://ec2-15-236-41-246.eu-west-3.compute.amazonaws.com/public/${req.files[i].filename}`)
        // For Local
        // reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)
    }

    const newObj = req.files.length > 0 ?
        {
            ...req.body,
            imgCollection: reqFiles
        } : { ...req.body }


    Product.updateOne({ _id: req.params.id }, { ...newObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Update product Done !" }))
        .catch(error => res.status(400).json({ error: error }))
}



exports.getProductById = (req, res) => {
    console.log('UP');
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) { return err => console.log("Get product error :", err) }
        return res.status(200).json({
            message: "Get product Done !",
            data: product
        })        // Lien => apiCall/Products_Api
    }).catch(err => res.status(400).json({ success: false, error: err }))
}

exports.deleteProduct = (req, res) => {
    // console.log('req', req.params.id)

    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) { return err => console.log("Get product error :", err) }
        product.imgCollection.forEach(url => {
            let decoup = url.split('/')
            console.log('decoup', decoup[4])
            fs.unlinkSync(`./public/${decoup[4]}`)      // Sync pour supprimer direct sinon besoin d'une callback pour par example renvoyer une réponse
        })
        Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!product) {
                return res.status(404).json({ success: false, error: 'Delete echec !' })
            }
            return res.status(200).json({ success: true, message: "Delete OK !" })
        }).catch(err => console.log('Delete product error:', err))
    })

}




exports.getProductsPost = async (req, res) => {
    // console.log('req.body', req.body.filters)

    let findArgs = {};
    const sortValue = []

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            findArgs[key] = req.body.filters[key];
        }
    }

    if (req.body.filters.promotionProduct === true) {
        sortValue.push('byPromo')
    }
    else if (req.body.filters.novelty === true) {
        sortValue.push('byNovelty')
    }
    else if (req.body.filters.price === true) {
        sortValue.push('byDesc')
    }
    else if (req.body.filters.price === false) {
        sortValue.push('byAsc')
    }

    function sorting() {
        switch (sortValue[0]) {
            case 'byPromo':
                return { promotionProduct: -1 }
                break;
            case 'byNovelty':
                return { novelty: -1 }
                break;
            case 'byDesc':
                return { priceProduct: -1 }
                break;
            case 'byAsc':
                return { priceProduct: 1 }
                break;
            default:
                break;
        }
    }

    // console.log('TESTSESTESTE');
    // console.log('sortValue', sortValue);
    // console.log('findArgs', findArgs)
    Product.find(findArgs)
        .sort(sorting())

        .then(data => {
            return res.status(200).json({
                message: findArgs,
                products: data
            });
        })
        .catch(err => console.log('Get products error :', err))
}





