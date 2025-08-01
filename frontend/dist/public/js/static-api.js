
// Static API simulation for CloudFront deployment
window.staticAPI = {
  async fetchServiceStatus() {
    // Simulate API calls for static deployment
    return [
  {
    "name": "Auth Service",
    "key": "auth",
    "url": "http://localhost:8081/health",
    "description": "Handles user authentication, registration, and JWT issuance.",
    "status": "active",
    "details": {
      "status": "UP",
      "timestamp": "2025-08-01T19:20:05.072Z"
    }
  },
  {
    "name": "Product Service",
    "key": "product",
    "url": "http://localhost:8082/health",
    "description": "Manages product catalog and CRUD operations.",
    "status": "active",
    "details": {
      "status": "UP",
      "timestamp": "2025-08-01T19:20:05.072Z"
    }
  },
  {
    "name": "Order Service",
    "key": "order",
    "url": "http://localhost:8083/health",
    "description": "Processes and tracks customer orders.",
    "status": "active",
    "details": {
      "status": "UP",
      "timestamp": "2025-08-01T19:20:05.072Z"
    }
  }
];
  },
  
  async updateMetrics() {
    return {
      totalRequests: Math.floor(Math.random() * 1000) + 500,
      activeServices: 3,
      avgResponse: Math.floor(Math.random() * 100) + 50,
      dbConnections: 3 * 3
    };
  }
};

// Override fetch to simulate API responses
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (url.includes('/health')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'UP', timestamp: new Date().toISOString() })
    });
  }
  return originalFetch(url, options);
};
