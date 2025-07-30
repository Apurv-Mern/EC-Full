import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config.js';

import estimationRoutes from './routes/estimationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import softwareTypeRoutes from './routes/softwareTypeRoutes.js';
import techStackRoutes from './routes/techStackRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import industryRoutes from './routes/industryRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';

import errorHandler from './middleware/errorHandler.js';
import { sequelize } from './models/index.js';

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/estimations', estimationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/software-types', softwareTypeRoutes);
app.use('/api/tech-stacks', techStackRoutes);
app.use('/api/timelines', timelineRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api/currencies', currencyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced.');

    if (config.nodeEnv === 'production') {
      // Start HTTPS in production
      const sslOptions = {
        key: fs.readFileSync('./ssl_25.key'),
        cert: fs.readFileSync('./ssl_25.cert'),
        ca: fs.readFileSync('./ca_25.cert'), // Optional
      };

      https.createServer(sslOptions, app).listen(config.port, () => {
        console.log(`🚀 HTTPS Server running on port ${config.port}`);
      });
    } else {
      // Start HTTP in development
      http.createServer(app).listen(config.port, () => {
        console.log(`🚀 HTTP Server running in ${config.nodeEnv} mode on port ${config.port}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
