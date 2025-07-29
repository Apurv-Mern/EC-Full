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
      softwareType, // This is an array of software type names
      techStack,
      timeline,
      timelineMultiplier,
      features: selectedFeatureIds, // Array of feature IDs
      currency,
      contactName,
      contactEmail,
      contactCompany
    } = req.body;

    console.log({ softwareType, selectedFeatureIds });

    // Validate required fields
    if (!softwareType || !Array.isArray(softwareType) || softwareType.length === 0) {
      return sendErrorResponse(res, 'Software type is required and must be an array', 400);
    }

    if (!timeline) {
      return sendErrorResponse(res, 'Timeline is required', 400);
    }

    if (!currency) {
      return sendErrorResponse(res, 'Currency is required', 400);
    }

    // Get currency details for exchange rate
    const selectedCurrency = await Currency.findOne({
      where: { code: currency, isActive: true }
    });

    if (!selectedCurrency) {
      return sendErrorResponse(res, 'Invalid currency', 400);
    }

    // Get timeline details
    const selectedTimeline = await Timeline.findOne({
      where: { label: timeline, isActive: true }
    });

    if (!selectedTimeline) {
      return sendErrorResponse(res, 'Invalid timeline', 400);
    }

    // Find all selected software types
    const selectedSoftwareTypes = await SoftwareType.findAll({
      where: {
        name: softwareType,
        isActive: true
      }
    });

    if (selectedSoftwareTypes.length !== softwareType.length) {
      return sendErrorResponse(res, 'One or more invalid software types', 400);
    }

    // Calculate base price (sum of all selected software types)
    const basePrice = selectedSoftwareTypes.reduce((total, st) => {
      return total + (parseFloat(st.basePrice) * selectedCurrency.exchangeRate);
    }, 0);

    // Find all selected features
    let featuresPrice = 0;
    let selectedFeatures = [];

    if (selectedFeatureIds && Array.isArray(selectedFeatureIds) && selectedFeatureIds.length > 0) {
      selectedFeatures = await Feature.findAll({
        where: {
          id: selectedFeatureIds,
          isActive: true
        }
      });

      // Calculate features price
      featuresPrice = selectedFeatures.reduce((total, feature) => {
        return total + (parseFloat(feature.basePrice) * selectedCurrency.exchangeRate);
      }, 0);
    }

    // Calculate total price
    const totalPrice = (basePrice + featuresPrice) * timelineMultiplier;

    // Create estimation
    const estimation = await Estimation.create({
      industries: JSON.stringify(industries), // Store as JSON string
      softwareType: JSON.stringify(softwareType), // Store as JSON array
      softwareTypeBasePrice: basePrice,
      techStack: JSON.stringify(techStack), // Store as JSON object
      timeline,
      timelineMultiplier,
      features: JSON.stringify(selectedFeatureIds), // Store feature IDs as JSON
      currency,
      basePrice,
      featuresPrice,
      totalPrice,
      contactName: contactName || null,
      contactEmail: contactEmail || null,
      contactCompany: contactCompany || null,
      status: contactEmail ? 'sent' : 'draft'
    });

    // If contact info provided, you might want to create a separate contact record
    if (contactEmail && contactName) {
      // Optional: Create a contact record
      // await Contact.create({
      //   name: contactName,
      //   email: contactEmail,
      //   company: contactCompany,
      //   message: `Estimation request for ${softwareType.join(', ')}`,
      //   estimationId: estimation.id
      // });
    }

    // Prepare response with detailed breakdown
    const response = {
      id: estimation.id,
      industries,
      softwareTypes: selectedSoftwareTypes.map(st => ({
        name: st.name,
        basePrice: parseFloat(st.basePrice) * selectedCurrency.exchangeRate
      })),
      features: selectedFeatures.map(f => ({
        id: f.id,
        name: f.name,
        price: parseFloat(f.basePrice) * selectedCurrency.exchangeRate
      })),
      techStack,
      timeline: {
        label: timeline,
        multiplier: timelineMultiplier
      },
      currency: {
        code: currency,
        symbol: selectedCurrency.symbol,
        exchangeRate: selectedCurrency.exchangeRate
      },
      pricing: {
        basePrice: Math.round(basePrice),
        featuresPrice: Math.round(featuresPrice),
        totalPrice: Math.round(totalPrice)
      },
      contact: contactEmail ? {
        name: contactName,
        email: contactEmail,
        company: contactCompany
      } : null,
      status: estimation.status,
      createdAt: estimation.createdAt
    };

    return sendSuccessResponse(res, response, 201);
  } catch (error) {
    console.error('Error creating estimation:', error);
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

    // Transform the data to include proper relationships and parsed JSON
    const transformedEstimations = await Promise.all(
      estimations.map(async (estimation) => {
        // Parse JSON fields
        const industries = Array.isArray(estimation.industries)
          ? estimation.industries
          : JSON.parse(estimation.industries || '[]');

        const softwareTypeNames = Array.isArray(estimation.softwareType)
          ? estimation.softwareType
          : JSON.parse(estimation.softwareType || '[]');

        const techStack = typeof estimation.techStack === 'object'
          ? estimation.techStack
          : JSON.parse(estimation.techStack || '{}');

        const featureIds = Array.isArray(estimation.features)
          ? estimation.features
          : JSON.parse(estimation.features || '[]');

        // Get related data
        const [selectedFeatures, selectedIndustries, selectedCurrency] = await Promise.all([
          Feature.findAll({
            where: { id: featureIds },
          }),
          Industry.findAll({
            where: { name: industries },
          }),
          Currency.findOne({
            where: { code: estimation.currency },
          })
        ]);

        // Calculate industry multiplier
        const industryMultiplier = selectedIndustries.length > 0
          ? selectedIndustries.reduce((acc, industry) => acc * parseFloat(industry.multiplier), 1)
          : 1;

        return {
          id: estimation.id,
          industries: industries,
          softwareType: softwareTypeNames[0] || 'Unknown',
          techStack: Object.values(techStack).filter(Boolean),
          timeline: estimation.timeline,
          timelineMultiplier: estimation.timelineMultiplier,
          features: selectedFeatures.map(feature => ({
            id: feature.id,
            name: feature.name,
            price: parseFloat(feature.basePrice) * (selectedCurrency?.exchangeRate || 1)
          })),
          currency: estimation.currency,
          pricing: {
            basePrice: estimation.basePrice,
            featuresPrice: estimation.featuresPrice,
            totalPrice: estimation.totalPrice,
            industryMultiplier: industryMultiplier
          },
          contactInfo: {
            name: estimation.contactName || '',
            email: estimation.contactEmail || '',
            phone: '',
            company: estimation.contactCompany || ''
          },
          status: estimation.status,
          createdAt: estimation.createdAt,
          updatedAt: estimation.updatedAt
        };
      })
    );

    return sendListResponse(res, transformedEstimations);
  } catch (error) {
    console.error('Error fetching estimations:', error);
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
        attributes: ['id', 'name', 'category', 'basePrice', 'complexity', 'description', "type"],
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
        description: item.description,
        type: item.type
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
