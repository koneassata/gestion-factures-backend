const express = require('express');
const dotenv = require('dotenv'); // Gardez cette ligne pour require
const cors = require('cors');
const connectDB = require('./config/db'); // Assurez-vous que ce fichier utilise process.env.MONGODB_URI
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

// --- MODIFICATION ESSENTIELLE POUR LE DÉPLOIEMENT ---
// Charger les variables d'environnement conditionnellement.
// 'dotenv.config()' ne doit être appelé que si nous ne sommes PAS en production.
// Render définit automatiquement 'process.env.NODE_ENV' sur 'production'.
if (process.env.NODE_ENV !== 'production') {
    dotenv.config(); // Charge les variables du fichier .env pour le développement local
}
// ----------------------------------------------------

const app = express();

// Middleware
app.use(express.json()); // Permet de parser le corps des requêtes en JSON
app.use(cors());         // Permet les requêtes cross-origin du frontend

// Connecter à la base de données.
// Rappel : le fichier './config/db.js' DOIT utiliser process.env.MONGODB_URI
// et DOIT afficher l'erreur détaillée en cas d'échec de connexion, puis faire un process.exit(1).
connectDB();

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/currencies', currencyRoutes);

// Route de test
app.get('/', (req, res) => {
    res.send('API de gestion des factures est en cours d\'exécution...');
});

// --- GESTIONNAIRES D'ERREURS (FORTEMENT RECOMMANDÉS POUR LA PRODUCTION) ---
// Décommentez ces blocs pour une gestion robuste des erreurs.

// Gestion des erreurs 404 (route non trouvée)
app.use((req, res, next) => {
    const error = new Error(`Non trouvée - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passe l'erreur au middleware suivant
});

// Middleware de gestion des erreurs génériques (doit être le dernier middleware)
app.use((err, req, res, next) => {
    // Si le statut de la réponse est 200 (OK) mais qu'une erreur est survenue,
    // on le passe à 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // En production, ne pas exposer la stack trace pour des raisons de sécurité
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});
// ---------------------------------------------------------------------

// Le port doit toujours lire process.env.PORT d'abord, Render le fournit.
// Utilise 9000 comme fallback pour le développement local.
const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`L'API est accessible via l'URL de Render (si configurée) ou localement.`);
});