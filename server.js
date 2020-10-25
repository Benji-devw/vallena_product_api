// Coder des serveurs Web en Node pur est possible, mais long et laborieux. En effet, cela exige d'analyser manuellement chaque demande entrante. 
// L'utilisation du framework Express simplifie ces tâches, en nous permettant de déployer nos API beaucoup plus rapidement
// Express est fondamentalement une série de fonctions appelées middleware. Chaque élément de middleware reçoit les objets request et response
// https://expressjs.com/fr/
// Middleware(function ds une app express) Express reçoit également la méthode NEXT , qui permet à chaque middleware de passer l'exécution au middleware suivant. 
//intégrée dans Express. Il analyse les demandes entrantes avec des charges utiles JSON et est basé sur un analyseur de corps .

// AXIOS un client HTTP basé sur les Promesses => En lien avec les API et permet de faire des req et res
// CORS signifie « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP d'être effectués entre des serveurs différents, ce qui empêche donc les requêtes malveillantes
// BODY-PARSER : Analise et rend les données du corps de la requête exploitable - analyser les corps de requête entrants dans un middleware avant vos gestionnaires, disponible sous la propriété req.body .
// JSON.stringify()prend un objet JavaScript et le transforme en une chaîne JSON.
// JSON.parse() prend une chaîne JSON et la transforme en un objet JavaScript


const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  helmet = require('helmet'),
  db = require('./db'),
  productRouter = require('./routes/productRouter'),
  app = express(),
  apiPort = 8800

// Helmet
app.use(helmet());

// MongoDB Configuration
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//Body Parser
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

// CORS (système de sécurité) || app.use(cors());
app.use(cors());

app.use('/public', express.static(__dirname + 'public')); 

// ROUTE
app.use('/api', productRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
