project-root/
├── src/
│   ├── app.js                 # Main Express application
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
│   └── .gitignore           # Terraform specific gitignore
├── package.json             # Node.js dependencies and scripts
├── package-lock.json        # Lock file for dependencies
├── .gitignore              # Git ignore file
└── README.md               # Project documentation



1. Installing dependencies (in root directory):

npm install express mongoose cors serverless-http

2. Creating the Lambda deployment package:

zip -r lambda.zip . -x "*.terraform/*" "*.git/*" "node_modules/*"
npm install
zip -r lambda.zip node_modules/

3. Deploying with Terraform (in /terraform directory):

terraform init
terraform plan
terraform apply




note!
server.js    is just for development environment

npm install nodemon --save-dev

npm run dev

test Dev Environment

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


npm install dotenv

Update .gitignore to include::

.env
terraform.tfvars

cd terraform
terraform apply