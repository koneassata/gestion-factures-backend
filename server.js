const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

dotenv.config(); // Charger les variables d'environnement

const app = express();

// Middleware
app.use(express.json()); // Permet de parser le corps des requêtes en JSON
app.use(cors());         // Permet les requêtes cross-origin du frontend

connectDB();     // Connecter à la base de données

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/currencies', currencyRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('API de gestion des factures est en cours d\'exécution...');
});

// Gestion des erreurs 404 (route non trouvée)
// app.use((req, res, next) => {
//   const error = new Error(`Non trouvée - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// });

// Middleware de gestion des erreurs génériques (doit être le dernier)
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// });

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Serveur démarré sur le port http://localhost:${port}`));