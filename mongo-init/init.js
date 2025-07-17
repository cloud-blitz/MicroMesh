// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to admin database
db = db.getSiblingDB('admin');

// Create databases for each service
db = db.getSiblingDB('auth_service_db');
db.createCollection('users');

db = db.getSiblingDB('product_service_db');
db.createCollection('products');

db = db.getSiblingDB('order_service_db');
db.createCollection('orders');

// Create indexes for better performance
db = db.getSiblingDB('auth_service_db');
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });

db = db.getSiblingDB('product_service_db');
db.products.createIndex({ "name": 1 });
db.products.createIndex({ "category": 1 });

db = db.getSiblingDB('order_service_db');
db.orders.createIndex({ "customerEmail": 1 });
db.orders.createIndex({ "status": 1 });

print('MongoDB initialization completed successfully!');
print('Created databases: auth_service_db, product_service_db, order_service_db'); 