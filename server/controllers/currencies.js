// Add CRUD operations for currencies
import Currency from '../models/Currency.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/apiResponse.js';

const getAllCurrencies = async (req, res, next) => {
  try {
    const currencies = await Currency.findAll({
      order: [['code', 'ASC']]
    });
    res.status(200).json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    next(error);
  }
};

const getCurrencyById = async (req, res, next) => {
  try {
    const currency = await Currency.findByPk(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    next(error);
  }
};

const createCurrency = async (req, res, next) => {
  try {
    const { code, name, symbol, flag, exchangeRate, isBaseCurrency, isActive } = req.body;
    
    // If setting as base currency, update others to not be base
    if (isBaseCurrency) {
      await Currency.update({ isBaseCurrency: false }, { where: {} });
    }
    
    const currency = await Currency.create({
      code: code.toUpperCase(),
      name,
      symbol,
      flag,
      exchangeRate: exchangeRate || 1.0,
      isBaseCurrency: isBaseCurrency || false,
      isActive: isActive !== undefined ? isActive : true
    });
    
    res.status(201).json(currency);
  } catch (error) {
    next(error);
  }
};

const updateCurrency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, symbol, flag, exchangeRate, isBaseCurrency, isActive } = req.body;
    
    const currency = await Currency.findByPk(id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }

    // If setting as base currency, update others to not be base
    if (isBaseCurrency && !currency.isBaseCurrency) {
      await Currency.update({ isBaseCurrency: false }, { where: {} });
    }

    // Update fields
    currency.code = code ? code.toUpperCase() : currency.code;
    currency.name = name || currency.name;
    currency.symbol = symbol || currency.symbol;
    currency.flag = flag !== undefined ? flag : currency.flag;
    currency.exchangeRate = exchangeRate !== undefined ? exchangeRate : currency.exchangeRate;
    currency.isBaseCurrency = isBaseCurrency !== undefined ? isBaseCurrency : currency.isBaseCurrency;
    currency.isActive = isActive !== undefined ? isActive : currency.isActive;

    await currency.save();
    res.json(currency);
  } catch (error) {
    next(error);
  }
};

const deleteCurrency = async (req, res, next) => {
  try {
    const currency = await Currency.findByPk(req.params.id);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    
    // Prevent deletion of base currency
    if (currency.isBaseCurrency) {
      return res.status(400).json({ message: 'Cannot delete base currency' });
    }
    
    await currency.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency
};
