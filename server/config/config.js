import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'estimation_calculator',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    dialect: 'mysql'
  },

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:8080/admin',
    credentials: true
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expire: process.env.JWT_EXPIRE || '30d'
  },

  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@estimation.com'
  }
};

export default config;
