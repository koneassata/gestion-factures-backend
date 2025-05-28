const asyncHandler = require('express-async-handler');
const Currency = require('../models/Currency');

// @desc    Get all currencies
// @route   GET /api/currencies
// @access  Private
const getCurrencies = asyncHandler(async (req, res) => {
  const currencies = await Currency.find({});
  res.json(currencies);
});

// @desc    Get single currency by ID
// @route   GET /api/currencies/:id
// @access  Private
const getCurrencyById = asyncHandler(async (req, res) => {
  const currency = await Currency.findById(req.params.id);

  if (currency) {
    res.json(currency);
  } else {
    res.status(404);
    throw new Error('Devise non trouvée');
  }
});

// @desc    Create a new currency
// @route   POST /api/currencies
// @access  Private (Admin only in a real app, but for now, anyone authenticated)
const createCurrency = asyncHandler(async (req, res) => {
  const { name, symbol, rate } = req.body;

  const currencyExists = await Currency.findOne({ name });

  if (currencyExists) {
    res.status(400);
    throw new Error('Cette devise existe déjà');
  }

  const currency = new Currency({
    name,
    symbol,
    rate,
  });

  const createdCurrency = await currency.save();
  res.status(201).json(createdCurrency);
});

// @desc    Update a currency
// @route   PUT /api/currencies/:id
// @access  Private (Admin only)
const updateCurrency = asyncHandler(async (req, res) => {
  const { name, symbol, rate } = req.body;

  const currency = await Currency.findById(req.params.id);

  if (currency) {
    currency.name = name || currency.name;
    currency.symbol = symbol || currency.symbol;
    currency.rate = rate || currency.rate;

    const updatedCurrency = await currency.save();
    res.json(updatedCurrency);
  } else {
    res.status(404);
    throw new Error('Devise non trouvée');
  }
});

// @desc    Delete a currency
// @route   DELETE /api/currencies/:id
// @access  Private (Admin only)
const deleteCurrency = asyncHandler(async (req, res) => {
  const currency = await Currency.findById(req.params.id);

  if (currency) {
    await Currency.deleteOne({ _id: currency._id }); // Utilisez deleteOne pour supprimer
    res.json({ message: 'Devise supprimée' });
  } else {
    res.status(404);
    throw new Error('Devise non trouvée');
  }
});

module.exports = {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
};