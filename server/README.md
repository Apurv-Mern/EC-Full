# Estimation Calculator Server

This is the backend API server for the Estimation Calculator application built with Node.js, Express, MySQL, and Sequelize ORM.

## Features

- RESTful API for software cost estimations
- Contact form submissions handling
- MySQL database with Sequelize ORM
- CORS enabled for cross-origin requests
- Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a MySQL database:
```sql
CREATE DATABASE estimation_calculator;
```

3. Configure your environment variables:
   - Copy `.env` file and update with your MySQL credentials
   - Update the database connection details

## Environment Variables

Update the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=estimation_calculator
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Estimations

- `GET /api/estimations/static-data` - Get all static data (industries, features, etc.)
- `GET /api/estimations` - Get all estimations
- `GET /api/estimations/:id` - Get single estimation
- `POST /api/estimations` - Create new estimation
- `PUT /api/estimations/:id` - Update estimation status
- `DELETE /api/estimations/:id` - Delete estimation

### Contacts

- `GET /api/contacts` - Get all contact submissions
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact submission
- `PUT /api/contacts/:id` - Update contact status
- `DELETE /api/contacts/:id` - Delete contact

## API Request Examples

### Create Estimation
```json
POST /api/estimations
{
  "industries": ["Healthcare", "Fintech"],
  "softwareType": "Web App",
  "techStack": {
    "backend": "Node.js",
    "frontend": "React",
    "mobile": ""
  },
  "timeline": "3-6 months",
  "timelineMultiplier": 1.0,
  "features": ["User Login/Registration", "Payment Gateway"],
  "currency": "USD",
  "contactName": "John Doe",
  "contactEmail": "john@example.com",
  "contactCompany": "Example Corp"
}
```

### Create Contact
```json
POST /api/contacts
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "projectType": "Web App",
  "message": "I need a web application for my business..."
}
```

## Database Models

### Estimation Model
- Industries (JSON array)
- Software type and pricing
- Tech stack selection
- Timeline and multiplier
- Selected features
- Currency and pricing calculations
- Contact information
- Status tracking

### Contact Model
- Name, email, company
- Project type
- Message
- Status tracking
- Response timestamp

## Security Notes

In production, you should:
- Add authentication middleware for admin routes
- Implement rate limiting
- Use HTTPS
- Validate and sanitize all inputs
- Add proper logging
- Set up email notifications

## Troubleshooting

1. **Database connection error**: 
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Make sure the database exists

2. **Port already in use**:
   - Change the PORT in `.env` file
   - Or kill the process using the port

3. **CORS issues**:
   - Update CLIENT_URL in `.env` to match your frontend URL
