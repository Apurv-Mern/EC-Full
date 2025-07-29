import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config.js';

// Import routes
import estimationRoutes from './routes/estimationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import softwareTypeRoutes from './routes/softwareTypeRoutes.js';
import techStackRoutes from './routes/techStackRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';

// Import database
import { sequelize } from './models/index.js';

// Initialize express app
const app = express();

// Apply middleware
app.use(cors(config.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/estimations', estimationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/software-types', softwareTypeRoutes);
app.use('/api/tech-stacks', techStackRoutes);
app.use('/api/timelines', timelineRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync({ alter: false });
    console.log('Database models synced successfully.');
    // Start listening
    app.listen(config.port, () => {
      console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
