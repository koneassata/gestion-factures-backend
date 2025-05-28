const express = require('express');
const {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../controllers/currencyController');
const { protect } = require('../middleware/authMiddleware'); // Importe le middleware de protection
const router = express.Router();

// Applique le middleware `protect` à toutes ces routes de devises
router.route('/').get(protect, getCurrencies).post(protect, createCurrency);
router.route('/:id').get(protect, getCurrencyById).put(protect, updateCurrency).delete(protect, deleteCurrency);

module.exports = router;