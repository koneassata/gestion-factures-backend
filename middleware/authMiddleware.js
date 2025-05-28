const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtenir le jeton du header
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le jeton
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attacher l'utilisateur au req (sans le mot de passe)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Non autorisé, jeton invalide' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorisé, pas de jeton' });
  }
});

module.exports = { protect };