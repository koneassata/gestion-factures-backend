const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  rate: { // Taux par rapport à une devise de base (ex: 1.00 pour l'Euro si c'est la base)
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;