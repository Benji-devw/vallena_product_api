let multer = require('multer'),
   { v4: uuidv4 } = require('uuid');

const DIR = './public/';

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, DIR);
   },
   filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
   }
});

var upload = multer({
   storage: storage,
   fileFilter: (req, file, cb) => {
      // console.log('file........', file)
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
         cb(null, true);
      } else {
         cb(null, false);
         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
   }
});


module.exports = upload.array('imgCollection', 6)


// const MIME_TYPES = {
//    'image/jpg': 'jpg',
//    'image/jpeg': 'jpg',
//    'image/png': 'png',
// }

// const storage = multer.diskStorage({
//    // la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
//    destination: (req, file, callback) => {
//       callback(null, './uploads')
//    },
//    // la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
//    // Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée ;
//    filename: (req, file, callback) => {
//       callback(null, file.fieldname + '-' + Date.now());

//       // const name = file.originalname.split(' ').join('_');
//       // const extension = MIME_TYPES[file.mimetype];
//       // callback(null, name + Date.now() + '.' + extension)   // appel le callback (null = no error, nameFile, date(pr le rendre unique) + . + extension de fichier(jpg, png))
//    }
// })
// module.exports = multer({ storage: storage }).array('file', 20);
// // module.exports = multer({ storage: storage }).single('image')