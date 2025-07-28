import { Estimation } from '../models/index.js';
import { sendSuccessResponse, sendErrorResponse, sendListResponse } from '../utils/apiResponse.js';
import {
  Industry,
  SoftwareType,
  TechStack,
  Timeline,
  Feature,
  Currency,
} from '../models/index.js';
// Static data (matching the client)
// const softwareTypes = [
//   { name: "Web App", basePrice: { USD: 15000, INR: 1200000, AUD: 22000, GBP: 12000 } },
//   { name: "Mobile App", basePrice: { USD: 25000, INR: 2000000, AUD: 36000, GBP: 20000 } },
//   { name: "SaaS Platform", basePrice: { USD: 50000, INR: 4000000, AUD: 72000, GBP: 40000 } },
//   { name: "ERP System", basePrice: { USD: 80000, INR: 6400000, AUD: 115000, GBP: 64000 } },
//   { name: "Marketplace", basePrice: { USD: 60000, INR: 4800000, AUD: 86000, GBP: 48000 } },
//   { name: "CRM System", basePrice: { USD: 35000, INR: 2800000, AUD: 50000, GBP: 28000 } }
// ];

// const features = [
//   { name: "User Login/Registration", price: { USD: 2000, INR: 160000, AUD: 2900, GBP: 1600 } },
//   { name: "Payment Gateway", price: { USD: 5000, INR: 400000, AUD: 7200, GBP: 4000 } },
//   { name: "Push Notifications", price: { USD: 3000, INR: 240000, AUD: 4300, GBP: 2400 } },
//   { name: "Admin Panel", price: { USD: 8000, INR: 640000, AUD: 11500, GBP: 6400 } },
//   { name: "Analytics Dashboard", price: { USD: 6000, INR: 480000, AUD: 8600, GBP: 4800 } },
//   { name: "Multilingual Support", price: { USD: 4000, INR: 320000, AUD: 5700, GBP: 3200 } },
//   { name: "AI Integration", price: { USD: 12000, INR: 960000, AUD: 17200, GBP: 9600 } },
//   { name: "API Integrations", price: { USD: 5000, INR: 400000, AUD: 7200, GBP: 4000 } },
//   { name: "Chat Support", price: { USD: 3500, INR: 280000, AUD: 5000, GBP: 2800 } },
//   { name: "File Upload & Storage", price: { USD: 2500, INR: 200000, AUD: 3600, GBP: 2000 } }
// ];

// @desc    Create new estimation
// @route   POST /api/estimations
// @access  Public
const createEstimation = async (req, res, next) => {
  try {
    const {
      industries,
      softwareType,
      techStack,
      timeline,
      timelineMultiplier,
      features: selectedFeatures,
      currency,
      contactName,
      contactEmail,
      contactCompany
    } = req.body;

    // Find software type base price
    const selectedSoftware = softwareTypes.find(st => st.name === softwareType);
    if (!selectedSoftware) {
      return sendErrorResponse(res, 'Invalid software type', 400);
    }

    // Calculate base price
    const basePrice = selectedSoftware.basePrice[currency];

    // Calculate features price
    let featuresPrice = 0;
    selectedFeatures.forEach(featureName => {
      const feature = features.find(f => f.name === featureName);
      if (feature) {
        featuresPrice += feature.price[currency];
      }
    });

    // Calculate total price
    const totalPrice = (basePrice + featuresPrice) * timelineMultiplier;

    // Create estimation
    const estimation = await Estimation.create({
      industries,
      softwareType,
      softwareTypeBasePrice: selectedSoftware.basePrice,
      techStack,
      timeline,
      timelineMultiplier,
      features: selectedFeatures,
      currency,
      basePrice,
      featuresPrice,
      totalPrice,
      contactName,
      contactEmail,
      contactCompany,
      status: contactEmail ? 'sent' : 'draft'
    });

    return sendSuccessResponse(res, estimation, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all estimations
// @route   GET /api/estimations
// @access  Public (should be protected in production)
const getEstimations = async (req, res, next) => {
  try {
    const estimations = await Estimation.findAll({
      order: [['createdAt', 'DESC']]
    });

    return sendListResponse(res, estimations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single estimation
// @route   GET /api/estimations/:id
// @access  Public
const getEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.findByPk(req.params.id);

    if (!estimation) {
      return sendErrorResponse(res, 'Estimation not found', 404);
    }

    return sendSuccessResponse(res, estimation);
  } catch (error) {
    next(error);
  }
};

// @desc    Update estimation status
// @route   PUT /api/estimations/:id
// @access  Public (should be protected in production)
const updateEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.findByPk(req.params.id);

    if (!estimation) {
      return sendErrorResponse(res, 'Estimation not found', 404);
    }

    const { status } = req.body;
    await estimation.update({ status });

    return sendSuccessResponse(res, estimation);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete estimation
// @route   DELETE /api/estimations/:id
// @access  Public (should be protected in production)
const deleteEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.findByPk(req.params.id);

    if (!estimation) {
      return sendErrorResponse(res, 'Estimation not found', 404);
    }

    await estimation.destroy();

    return sendSuccessResponse(res, {});
  } catch (error) {
    next(error);
  }
};

// @desc    Get static data (industries, software types, features, etc.)
// @route   GET /api/estimations/static-data
// @access  Public
const getAllDataForEstimation = async (req, res, next) => {
  try {
    const [
      industries,
      softwareTypes,
      techStacks,
      timelines,
      features,
      currencies
    ] = await Promise.all([
      Industry.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'slug', 'description'],
        order: [['name', 'ASC']]
      }),
      SoftwareType.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'category', 'basePrice', 'complexity', 'description'],
        order: [['name', 'ASC']]
      }),
      TechStack.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'category', 'difficultyLevel', 'hourlyRateMultiplier', 'description'],
        order: [['category', 'ASC'], ['name', 'ASC']]
      }),
      Timeline.findAll({
        where: { isActive: true },
        attributes: ['id', 'label', 'durationInMonths', 'multiplier', 'description'],
        order: [['durationInMonths', 'ASC']]
      }),
      Feature.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'category', 'estimatedHours', 'complexity', 'basePrice', 'description'],
        order: [['category', 'ASC'], ['name', 'ASC']]
      }),
      Currency.findAll({
        where: { isActive: true },
        attributes: ['id', 'code', 'name', 'symbol', 'flag', 'exchangeRate'],
        order: [['code', 'ASC']]
      })
    ]);

    // Transform and group data
    const data = {
      industries: industries.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description
      })),

      softwareTypes: softwareTypes.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        basePrice: parseFloat(item.basePrice) || 0,
        complexity: item.complexity,
        description: item.description
      })),

      techStacks: techStacks.reduce((acc, tech) => {
        if (!acc[tech.category]) acc[tech.category] = [];
        acc[tech.category].push({
          id: tech.id,
          name: tech.name,
          difficultyLevel: tech.difficultyLevel,
          hourlyRateMultiplier: parseFloat(tech.hourlyRateMultiplier) || 1.0,
          description: tech.description
        });
        return acc;
      }, {}),

      timelines: timelines.map(item => ({
        id: item.id,
        label: item.label,
        durationInMonths: item.durationInMonths,
        multiplier: parseFloat(item.multiplier) || 1.0,
        description: item.description
      })),

      features: features.reduce((acc, feature) => {
        if (!acc[feature.category]) acc[feature.category] = [];
        acc[feature.category].push({
          id: feature.id,
          name: feature.name,
          estimatedHours: feature.estimatedHours,
          complexity: feature.complexity,
          basePrice: parseFloat(feature.basePrice) || 0,
          description: feature.description
        });
        return acc;
      }, {}),

      currencies: currencies.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        symbol: item.symbol,
        flag: item.flag,
        exchangeRate: parseFloat(item.exchangeRate) || 1.0
      }))
    };

    return sendSuccessResponse(res, data);
  } catch (error) {
    console.error('Error fetching static data:', error);
    return sendErrorResponse(res, 'Failed to fetch static data', 500);
  }
};

// Export all controller functions
export {
  createEstimation,
  getEstimations,
  getEstimation,
  updateEstimation,
  deleteEstimation,
  getAllDataForEstimation
};
