const asyncHandler = require('express-async-handler');
const Invoice = require('../models/Invoice');

// @desc    Get all invoices for authenticated user
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  // S'assure de récupérer seulement les factures de l'utilisateur connecté
  const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(invoices);
});

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });

  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404);
    throw new Error('Facture non trouvée ou non autorisée');
  }
});

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
  const { clientName, clientAddress, invoiceDate, dueDate, items, status } = req.body;

  if (!clientName || !clientAddress || !invoiceDate || !dueDate || !items || items.length === 0) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs obligatoires, y compris les articles.');
  }

  const invoice = new Invoice({
    user: req.user._id, // Assigner la facture à l'utilisateur authentifié
    clientName,
    clientAddress,
    invoiceDate,
    dueDate,
    items,
    status,
  });

  const createdInvoice = await invoice.save();
  res.status(201).json(createdInvoice);
});

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = asyncHandler(async (req, res) => {
  const { clientName, clientAddress, invoiceDate, dueDate, items, status } = req.body;

  const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });

  if (invoice) {
    invoice.clientName = clientName || invoice.clientName;
    invoice.clientAddress = clientAddress || invoice.clientAddress;
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.items = items || invoice.items;
    invoice.status = status || invoice.status;

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } else {
    res.status(404);
    throw new Error('Facture non trouvée ou non autorisée');
  }
});

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });

  if (invoice) {
    await Invoice.deleteOne({ _id: invoice._id }); // Utilisez deleteOne pour supprimer
    res.json({ message: 'Facture supprimée' });
  } else {
    res.status(404);
    throw new Error('Facture non trouvée ou non autorisée');
  }
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};