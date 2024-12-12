# Serverless Express API with MongoDB Atlas

A serverless CRUD API implementation using AWS Lambda, Express.js, and MongoDB Atlas, with infrastructure managed through Terraform.

## Quick Start
```bash
# Clone repository
git clone https://github.com/CaringalML/API-Gateway-Lambda-Express-Node-js-CRUD.git
cd API-Gateway-Lambda-Express-Node-js-CRUD

# Install dependencies
npm install

# Create environment file
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Start development server
npm run dev
```

Test your setup:
```bash
# Test health endpoint
curl http://localhost:3000/health

# Create a test item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test Description"}'
```

Deploy to AWS:
```bash
# Create deployment package
zip -r lambda.zip . -x "*.terraform/*" "*.git/*" "node_modules/*"
npm install
zip -r lambda.zip node_modules/

# Deploy with Terraform
cd terraform
terraform init
terraform apply
```

## Table of Contents
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Development Environment](#development-environment)
- [Testing with Postman](#testing-with-postman)
- [How Express Runs in Lambda](#how-express-runs-in-lambda)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Monitoring](#monitoring)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Issues](#issues)
  - [Reporting Issues](#reporting-issues)
  - [Common Issues and Solutions](#common-issues-and-solutions)
  - [Debugging Tips](#debugging-tips)
- [Repository Information](#repository-information)
- [Contributing](#contributing)
- [Support](#support)

## Project Structure
```
project-root/
├── src/
│   ├── app.js                 # Main Express application (Lambda handler)
│   ├── models/
│   │   └── Item.js           # Mongoose model definition
│   ├── routes/
│   │   └── items.js          # CRUD route handlers
│   └── config/
│       └── database.js       # MongoDB connection configuration
├── terraform/
│   ├── main.tf               # Main Terraform configuration
│   ├── variables.tf          # Terraform variables
│   ├── outputs.tf            # Terraform outputs
│   ├── vpc.tf                # VPC configuration
│   ├── lambda.tf             # Lambda configuration
│   ├── api_gateway.tf        # API Gateway configuration
│   └── dns.tf                # Route53 and ACM configuration
├── server.js                 # Local development server
├── package.json             # Node.js dependencies and scripts
├── .env                     # Environment variables (not in git)
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Prerequisites
- Node.js and npm installed
- AWS CLI configured
- Terraform installed
- MongoDB Atlas account
- Route53 domain setup

## Environment Setup

1. Clone the repository
```bash
git clone https://github.com/CaringalML/API-Gateway-Lambda-Express-Node-js-CRUD.git
```

2. Install dependencies:
```bash
npm install express mongoose cors serverless-http
npm install nodemon dotenv --save-dev
```

3. Create `.env` file in root directory:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Create `terraform.tfvars` in terraform directory (not in git):
```hcl
mongodb_uri = "your_mongodb_connection_string"
```

## Development Environment

1. Start local development server:
```bash
npm run dev
```

2. Test local endpoints:
```bash
# Health check
curl http://localhost:3000/health

# Create item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "Test Description"}'

# Get all items
curl http://localhost:3000/items

# Get single item
curl http://localhost:3000/items/{id}

# Update item
curl -X PUT http://localhost:3000/items/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "description": "Updated Description"}'

# Delete item
curl -X DELETE http://localhost:3000/items/{id}
```

## Testing with Postman

### Base URLs
- Development: `http://localhost:3000`
- Production: `https://serverless.martincaringal.co.nz`

### Endpoints Configuration

1. **Health Check**
```
Method: GET 
URL: {{base_url}}/health
```
Expected Response:
```json
{
    "status": "healthy"
}
```

2. **Create Item (POST)**
```
Method: POST
URL: {{base_url}}/items
Headers: 
    Content-Type: application/json
Body (raw JSON):
{
    "name": "Test Item",
    "description": "This is a test item description"
}
```

3. **Get All Items (GET)**
```
Method: GET
URL: {{base_url}}/items
```

4. **Get Single Item (GET)**
```
Method: GET
URL: {{base_url}}/items/{id}
```

5. **Update Item (PUT)**
```
Method: PUT
URL: {{base_url}}/items/{id}
Headers: 
    Content-Type: application/json
Body (raw JSON):
{
    "name": "Updated Item",
    "description": "Updated description"
}
```

6. **Delete Item (DELETE)**
```
Method: DELETE
URL: {{base_url}}/items/{id}
```

### Common Status Codes
- 200: Successful GET, PUT, DELETE
- 201: Successful POST
- 400: Bad Request
- 404: Item Not Found
- 500: Server Error

## How Express Runs in Lambda

### Request Flow
```
Client Request → API Gateway → Lambda → serverless-http → Express → Route Handler → Response
```

### Traditional vs Serverless Express
```javascript
// Traditional Express Server
const app = express();
app.listen(3000);

// Lambda Express
const app = express();
module.exports.handler = serverless(app);
```

### Key Differences
1. **Stateless Execution**
   - Each request gets new context
   - No memory persistence between requests

2. **Lifecycle**
   ```
   Cold Start:
   Lambda Start → Module Load → Express Init → Request Handle → Response

   Warm Start:
   Request Handle → Response
   ```

3. **Limitations**
   - Maximum execution time (15 minutes)
   - Limited by Lambda timeout (default 30s)
   - No WebSocket support (in basic setup)
   - Cold start latency

## Deployment

1. Create Lambda deployment package:
```bash
# Create initial zip
zip -r lambda.zip . -x "*.terraform/*" "*.git/*" "node_modules/*"

# Install production dependencies
npm install

# Add node_modules to zip
zip -r lambda.zip node_modules/
```

2. Deploy infrastructure:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Architecture
- AWS Lambda - Runs Express.js application
- API Gateway - HTTP endpoint
- MongoDB Atlas - Database
- Route53 - Custom domain
- VPC with NAT Gateway - Secure database access

## Monitoring

### CloudWatch Logs
- Lambda logs: `/aws/lambda/crud-api-lambda-prod`
- API Gateway logs: Configured in Terraform

### Request Logging
```javascript
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
```

## Security

### Environment Variables
- Sensitive data in .env (development)
- Lambda environment variables (production)
- Never commit secrets to git

### Network Security
- API uses HTTPS
- Database access through VPC
- Limited MongoDB access through IP whitelist

### Files Not in Git
```
.env
terraform.tfvars
node_modules/
.terraform/
```

### Best Practices
1. Always test locally first
2. Use proper error handling
3. Implement request validation
4. Keep dependencies updated
5. Regular security audits

## Troubleshooting

### Common Issues
1. Cold Start Latency
   - Increase Lambda memory
   - Use Provisioned Concurrency

2. Database Connection
   - Check MongoDB connection string
   - Verify IP whitelist
   - Check VPC configuration

3. Deployment Issues
   - Verify ZIP package contents
   - Check Lambda logs
   - Verify IAM permissions

### Debug Logging
```javascript
// Add to routes for debugging
console.log('Request:', {
  method: req.method,
  path: req.path,
  body: req.body,
  query: req.query
});
```

## Repository Information

- Repository: [CaringalML/API-Gateway-Lambda-Express-Node-js-CRUD](https://github.com/CaringalML/API-Gateway-Lambda-Express-Node-js-CRUD)
- Author: Martin Caringal
- License: MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- Star this repo if you find it useful
- Create issues for any bugs or feature requests
- Visit the [issues page](https://github.com/CaringalML/API-Gateway-Lambda-Express-Node-js-CRUD/issues) for support


## Issues

### Reporting Issues

If you encounter any problems or have suggestions, please submit an issue with the following information:

```javascript
// In your code, add debug logs when encountering issues:
console.log('Error Details:', {
  endpoint: '/items',
  error: error.message,
  timestamp: new Date().toISOString()
});
```

When reporting issues, include:
1. Error logs from CloudWatch or local development
2. Steps to reproduce the problem
3. Environment details (Node.js version, AWS region)
4. Relevant code snippets

### Common Issues and Solutions

1. **MongoDB Connection Fails**
```javascript
// Check your connection string in .env
MONGODB_URI=mongodb+srv://user:password@cluster...

// Verify database.js logs
[Timestamp] 🔄 Attempting to connect to MongoDB...
[Timestamp] ❌ MongoDB connection error
```

2. **Lambda Deployment Issues**
```bash
# Common zip issues - verify your package
unzip -l lambda.zip   # Check contents
```

3. **API Gateway 5XX Errors**
```javascript
// Add error handling in your routes
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err.message });
});
```

4. **VPC/Network Issues**
- Check NAT Gateway status
- Verify security group rules
- Test MongoDB access

### Debugging Tips

```javascript
// Add to your routes for debugging
app.use((req, res, next) => {
  console.log('Request:', {
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});
```



# Step-by-Step Project Creation from scratch

## 1. Initial Setup
```bash
# Create project directory
mkdir crud-api-lambda
cd crud-api-lambda

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose cors serverless-http
npm install nodemon dotenv --save-dev

# Create project structure
mkdir src
mkdir src/config
mkdir src/models
mkdir src/routes
mkdir terraform
```

## 2. Create Configuration Files
```bash
# Create .gitignore
echo "node_modules/
.env
terraform.tfvars
.terraform
*.zip" > .gitignore

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string" > .env

# Create main application file
touch src/app.js

# Create other necessary files
touch src/config/database.js
touch src/models/Item.js
touch src/routes/items.js
touch server.js
```

## 3. Update package.json
```bash
# Add this to package.json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon server.js"
  }
}
```

## 4. Create Files Content Step by Step

### 4.1 First, create database configuration
```bash
# Edit src/config/database.js
code src/config/database.js
```
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4.2 Create the Item model
```bash
# Edit src/models/Item.js
code src/models/Item.js
```
```javascript
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);
```

### 4.3 Create routes
```bash
# Edit src/routes/items.js
code src/routes/items.js
```
```javascript
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Add CRUD routes...
router.post('/', async (req, res) => {
  // Create item implementation
});

// Export router
module.exports = router;
```

### 4.4 Create main application file
```bash
# Edit src/app.js
code src/app.js
```
```javascript
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/items');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/items', itemRoutes);

// Export the serverless handler
module.exports.handler = serverless(app);
```

### 4.5 Create development server
```bash
# Edit server.js
code server.js
```
```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const itemRoutes = require('./src/routes/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Rest of development server code...
```

## 5. Create Terraform Directory Structure
```bash
cd terraform
touch main.tf variables.tf outputs.tf lambda.tf api_gateway.tf vpc.tf dns.tf
```

## 6. Test Local Development
```bash
# Run development server
npm run dev

# Test endpoint
curl http://localhost:3000/health
```

## 7. Create Lambda Deployment Package
```bash
# Create initial zip
zip -r lambda.zip . -x "*.terraform/*" "*.git/*" "node_modules/*"

# Install production dependencies
npm install

# Add node_modules to zip
zip -r lambda.zip node_modules/
```

## 8. Deploy with Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## Directory Structure After Setup
```
project-root/
├── src/
│   ├── app.js
│   ├── models/
│   │   └── Item.js
│   ├── routes/
│   │   └── items.js
│   └── config/
│       └── database.js
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── vpc.tf
│   ├── lambda.tf
│   ├── api_gateway.tf
│   └── dns.tf
├── server.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Verify Setup
1. Check local development:
```bash
npm run dev
# Should start server on port 3000
```

2. Test local endpoints:
```bash
curl http://localhost:3000/health
# Should return {"status":"healthy"}
```

3. Check MongoDB connection:
```bash
# Monitor logs for successful connection
```

