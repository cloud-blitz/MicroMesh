const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config({ path: path.join(__dirname, '../shared/.env') });

const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;

// EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Service endpoints from env
const SERVICES = [
  {
    name: 'Auth Service',
    key: 'auth',
    url: (process.env.AUTH_SERVICE_URL || 'http://localhost:8081') + '/health',
    description: 'Handles user authentication, registration, and JWT issuance.'
  },
  {
    name: 'Product Service',
    key: 'product',
    url: (process.env.PRODUCT_SERVICE_URL || 'http://localhost:8082') + '/health',
    description: 'Manages product catalog and CRUD operations.'
  },
  {
    name: 'Order Service',
    key: 'order',
    url: (process.env.ORDER_SERVICE_URL || 'http://localhost:8083') + '/health',
    description: 'Processes and tracks customer orders.'
  }
];

// Dashboard route
app.get('/', async (req, res) => {
  try {
    const statuses = await Promise.all(
      SERVICES.map(async (svc) => {
        try {
          const resp = await fetch(svc.url, { timeout: 2000 });
          if (!resp.ok) throw new Error('Down');
          const data = await resp.json();
          return { ...svc, status: 'active', details: data };
        } catch (e) {
          return { ...svc, status: 'inactive', details: null };
        }
      })
    );
    res.render('dashboard', { services: statuses });
  } catch (error) {
    console.error('Dashboard error:', error);
    // Fallback with default services if there's an error
    const fallbackServices = SERVICES.map(svc => ({
      ...svc,
      status: 'inactive',
      details: null
    }));
    res.render('dashboard', { services: fallbackServices });
  }
});

// Auth Service API endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8081';
    const response = await fetch(`${authUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8081';
    const response = await fetch(`${authUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product Service API endpoints
app.post('/api/products', async (req, res) => {
  try {
    const productUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8082';
    const response = await fetch(`${productUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const productUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8082';
    const response = await fetch(`${productUrl}/products`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Service API endpoints
app.post('/api/orders', async (req, res) => {
  try {
    const orderUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:8083';
    const response = await fetch(`${orderUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orderUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:8083';
    const response = await fetch(`${orderUrl}/orders`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Frontend dashboard running on http://localhost:${PORT}`);
}); 