# 🛍️ Vallena Products API

## 📝 Description

API RESTful pour la gestion des produits et commentaires de Vallena Couture. Cette API permet de gérer le catalogue de produits, les commentaires clients et les filtres associés.

## 🚀 Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install
```

## ⚡ Démarrage

```bash
# Développement
nodemon server

# Production
node server
```

## ⚙️ Configuration

Le serveur tourne par défaut sur le port 8800. Vous pouvez le modifier dans `server.js`.

## 🔌 Routes API

### 📦 Produits

- `GET /api/shop` - Récupérer tous les produits
  - Query params: 
    - `page`: numéro de page (défaut: 1)
    - `limit`: nombre d'éléments par page (défaut: 3)
    - `category`: filtre par catégorie
    - `matter`: filtre par matière
    - `color`: filtre par couleur
    - `minPrice`: prix minimum
    - `maxPrice`: prix maximum
    - `promotion`: filtre les promotions
    - `novelty`: filtre les nouveautés
    - `search`: recherche textuelle

- `GET /api/shop/:id` - Récupérer un produit par son ID
- `POST /api/shop/insert` - Créer un nouveau produit
- `PUT /api/shop/update/:id` - Mettre à jour un produit
- `DELETE /api/shop/:id` - Supprimer un produit

### 💬 Commentaires

- `GET /api/comment` - Récupérer tous les commentaires
- `POST /api/comment/comment` - Créer un nouveau commentaire
- `PUT /api/comment/comment/:id` - Mettre à jour un commentaire
- `DELETE /api/comment/:id` - Supprimer un commentaire
- `POST /api/comment/commentsfilter` - Filtrer les commentaires par statut

### 🔍 Filtres

- `GET /api/shop/categories` - Récupérer toutes les catégories
- `GET /api/shop/matters` - Récupérer toutes les matières
- `GET /api/shop/colors` - Récupérer toutes les couleurs

## 📊 Format des données

### 📦 Produit
```json
{
  "titleProduct": "string",
  "descriptionProduct": "string",
  "priceProduct": "number",
  "categoryProduct": "string",
  "matter": "string",
  "color": "string",
  "imgCollection": ["string"],
  "promotionProduct": "boolean",
  "novelty": "boolean"
}
```

### 💬 Commentaire
```json
{
  "orderNumber": "string",
  "idProduct": "string",
  "by": "string",
  "messageTitle": "string",
  "message": "string",
  "note": "number",
  "dateBuy": "date",
  "datePost": "date",
  "status": "boolean"
}
```

## 🔒 Sécurité

- L'API utilise Helmet pour la sécurité
- CORS est activé pour les requêtes cross-origin
- Les fichiers sont gérés via Multer

## 📦 Dépendances principales

- Express.js
- MongoDB avec Mongoose
- Multer pour la gestion des fichiers
- Helmet pour la sécurité
- CORS pour les requêtes cross-origin

## 💻 Environnement de développement

- Node.js
- MongoDB
- Nodemon (pour le développement)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request









