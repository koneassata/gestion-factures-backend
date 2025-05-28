const jwt = require('jsonwebtoken');
require('dotenv').config(); // Pour charger les variables d'environnement

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Le jeton expirera après 1 heure
  });
};

module.exports = generateToken;