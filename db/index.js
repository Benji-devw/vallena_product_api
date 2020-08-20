const mongoose = require('mongoose')

mongoose
    // Connect to Cluster on mongodbAtlas
    // .connect('mongodb+srv://<DB_USER>:<DB_PASSWORD>@cluster0-aw6sr.mongodb.net/Cluster0?retryWrites=true&w=majority"', { useNewUrlParser: true, useUnifiedTopology: true })
    .connect('mongodb://localhost:27017/valelena', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(e => {
        console.error('Connection error', e.message)
        // console.log('Connexion à MongoDB échouée !'))
    })

const db = mongoose.connection

module.exports = db