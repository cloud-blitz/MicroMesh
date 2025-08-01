const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../shared/.env') });

// Helper function to get service URL based on environment
function getServiceUrl(serviceType, endpoint = '') {
  const useALB = process.env.USE_ALB_ROUTING === 'true';
  const environment = process.env.ENVIRONMENT || 'development';
  
  if (useALB || environment === 'production') {
    // Use ALB URLs for production
    const albUrls = {
      auth: process.env.AUTH_SERVICE_ALB_URL || 'https://api.micromesh.com/auth',
      product: process.env.PRODUCT_SERVICE_ALB_URL || 'https://api.micromesh.com/products',
      order: process.env.ORDER_SERVICE_ALB_URL || 'https://api.micromesh.com/orders'
    };
    return `${albUrls[serviceType]}${endpoint}`;
  } else {
    // Use local URLs for development
    const localUrls = {
      auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
      product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:8082',
      order: process.env.ORDER_SERVICE_URL || 'http://localhost:8083'
    };
    return `${localUrls[serviceType]}${endpoint}`;
  }
}

const SERVICES = {
  auth: getServiceUrl('auth'),
  product: getServiceUrl('product'),
  order: getServiceUrl('order')
};

async function testService(serviceName, baseUrl) {
  console.log(`\n🧪 Testing ${serviceName} service at ${baseUrl}`);
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`);
    if (healthResponse.ok) {
      console.log(`✅ ${serviceName} service is healthy`);
    } else {
      console.log(`❌ ${serviceName} service health check failed`);
      return false;
    }

    // Test specific endpoints based on service
    switch (serviceName) {
      case 'auth':
        await testAuthService(baseUrl);
        break;
      case 'product':
        await testProductService(baseUrl);
        break;
      case 'order':
        await testOrderService(baseUrl);
        break;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${serviceName} service error: ${error.message}`);
    return false;
  }
}

async function testAuthService(baseUrl) {
  console.log('  🔐 Testing Auth Service endpoints...');
  
  // Test registration
  try {
    const registerResponse = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (registerResponse.ok) {
      console.log('  ✅ User registration works');
    } else {
      console.log('  ❌ User registration failed');
    }
  } catch (error) {
    console.log(`  ❌ Registration error: ${error.message}`);
  }

  // Test login
  try {
    const loginResponse = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      console.log('  ✅ User login works');
    } else {
      console.log('  ❌ User login failed');
    }
  } catch (error) {
    console.log(`  ❌ Login error: ${error.message}`);
  }
}

async function testProductService(baseUrl) {
  console.log('  📦 Testing Product Service endpoints...');
  
  // Test get products
  try {
    const productsResponse = await fetch(`${baseUrl}`);
    if (productsResponse.ok) {
      console.log('  ✅ Get products works');
    } else {
      console.log('  ❌ Get products failed');
    }
  } catch (error) {
    console.log(`  ❌ Get products error: ${error.message}`);
  }

  // Test add product
  try {
    const addProductResponse = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        stockQuantity: 100
      })
    });
    
    if (addProductResponse.ok) {
      console.log('  ✅ Add product works');
    } else {
      console.log('  ❌ Add product failed');
    }
  } catch (error) {
    console.log(`  ❌ Add product error: ${error.message}`);
  }
}

async function testOrderService(baseUrl) {
  console.log('  🛒 Testing Order Service endpoints...');
  
  // Test get orders
  try {
    const ordersResponse = await fetch(`${baseUrl}`);
    if (ordersResponse.ok) {
      console.log('  ✅ Get orders works');
    } else {
      console.log('  ❌ Get orders failed');
    }
  } catch (error) {
    console.log(`  ❌ Get orders error: ${error.message}`);
  }

  // Test create order
  try {
    const createOrderResponse = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Test Customer',
        productId: 'test-product-id',
        quantity: 2,
        shippingAddress: '123 Test St, Test City'
      })
    });
    
    if (createOrderResponse.ok) {
      console.log('  ✅ Create order works');
    } else {
      console.log('  ❌ Create order failed');
    }
  } catch (error) {
    console.log(`  ❌ Create order error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting Microservices Testing...\n');
  
  const environment = process.env.ENVIRONMENT || 'development';
  const useALB = process.env.USE_ALB_ROUTING === 'true';
  
  console.log(`Environment: ${environment}`);
  console.log(`ALB Routing: ${useALB ? 'Enabled' : 'Disabled'}\n`);
  
  const results = {};
  
  for (const [serviceName, baseUrl] of Object.entries(SERVICES)) {
    results[serviceName] = await testService(serviceName, baseUrl);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  for (const [serviceName, isWorking] of Object.entries(results)) {
    const status = isWorking ? '✅ WORKING' : '❌ FAILED';
    console.log(`${serviceName.toUpperCase()} SERVICE: ${status}`);
  }
  
  const allWorking = Object.values(results).every(result => result);
  
  if (allWorking) {
    console.log('\n🎉 All services are working! You can now use the dashboard.');
    console.log('🌐 Open http://localhost:3000 to access the testing dashboard');
  } else {
    console.log('\n⚠️  Some services are not working. Please check your backend services.');
    console.log('💡 Make sure all services are running with: docker-compose up');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testService, runTests }; 