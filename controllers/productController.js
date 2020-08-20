const fs = require('fs')

let Product = require('../models/productModel');
const { stringify } = require('querystring');


exports.insertProduct = (req, res, next) => {
    console.log('reqBody.....', req.body)
    console.log('reqFiles.....', req.files)

    const reqFiles = [];
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)
    }

    const product = new Product({
        ...req.body,
        imgCollection: reqFiles
    });

    product.save().then(result => {
        res.status(201).json({
            message: "Done upload!",
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


    if (req.files.length > 0) {     // Si new image depuis React on rentre
        console.log('DIFF')

        // Créer un tab pour blouclé sur le JSON de req.body.copyCollection
        const urls = []     
        const pathFiles = req.body.copyCollection
        urls.push(pathFiles)

        urls.forEach(url => {           // Pour chaque ulrs ds urls[]
            if (url.length <= 6) {      // Si plusieurs [url] on rentre 
                for (let i = 0; i < url.length; i++) {
                    let decoup = url[i].split('/')
                    // console.log('decoup', decoup[4])
                    fs.unlinkSync(`./public/${decoup[4]}`)
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
            reqFiles.push(`${req.protocol}://${req.get('host')}/public/${req.files[i].filename}`)
        }
    }
    
    const newObj = req.files.length > 0  ?
    {
        ...req.body,
        imgCollection: reqFiles
    } : { ...req.body}

    Product.updateOne({ _id: req.params.id }, { ...newObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Update Done !"} ))
        .catch(error => res.status(400).json({ error: error }))
}




exports.getProducts = (req, res, next) => {
    Product.find().then(data => {
        return res.status(200).json({
            message: "Product list retrieved successfully!",
            products: data      // Lien => apiCall/Products_Api
        });
    }).catch(err => console.log('ERR..find()..... ', err))
}

exports.getProductById = (req, res) => {
    Product.findOne({ _id: req.params.id }, (err, product) => {
        if (err) { return err => console.log("ERR..findOne().....", err) }
        return res.status(200).json({ 
            message: "Product : ", 
            data: product })        // Lien => apiCall/Products_Api
    }).catch(err => res.status(400).json({ success: false, error: err }))
}

exports.deleteProduct = (req, res) => {
    Product.findOneAndDelete({ _id: req.params.id }, (err, product) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' })
        }
        return res.status(200).json({ success: true, data: product })
    }).catch(err => console.log('Delete raté : ', err))
}