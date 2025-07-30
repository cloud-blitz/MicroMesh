const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

// Configuration
const SERVICES = [
  {
    name: 'Auth Service',
    key: 'auth',
    url: 'http://localhost:8081/health',
    description: 'Handles user authentication, registration, and JWT issuance.'
  },
  {
    name: 'Product Service',
    key: 'product',
    url: 'http://localhost:8082/health',
    description: 'Manages product catalog and CRUD operations.'
  },
  {
    name: 'Order Service',
    key: 'order',
    url: 'http://localhost:8083/health',
    description: 'Processes and tracks customer orders.'
  }
];

async function buildStatic() {
  try {
    console.log('🚀 Starting static build for CloudFront deployment...');
    
    // Create dist directory
    const distDir = path.join(__dirname, 'dist');
    await fs.ensureDir(distDir);
    console.log('✅ Created dist directory');
    
    // Copy static assets
    const publicDir = path.join(__dirname, 'public');
    const distPublicDir = path.join(distDir, 'public');
    await fs.copy(publicDir, distPublicDir);
    console.log('✅ Copied static assets');
    
    // Read the EJS template
    const templatePath = path.join(__dirname, 'views', 'dashboard.ejs');
    const template = await fs.readFile(templatePath, 'utf8');
    
    // Render the template with mock data for static version
    const mockServices = SERVICES.map(svc => ({
      ...svc,
      status: 'active', // Default to active for static demo
      details: {
        status: 'UP',
        timestamp: new Date().toISOString()
      }
    }));
    
    const html = ejs.render(template, { 
      services: mockServices 
    }, {
      filename: templatePath
    });
    
    // Write the static HTML file
    const indexPath = path.join(distDir, 'index.html');
    await fs.writeFile(indexPath, html);
    console.log('✅ Generated static HTML');
    
    // Create a simple API endpoint simulation for static version
    const apiScript = `
// Static API simulation for CloudFront deployment
window.staticAPI = {
  async fetchServiceStatus() {
    // Simulate API calls for static deployment
    return ${JSON.stringify(mockServices, null, 2)};
  },
  
  async updateMetrics() {
    return {
      totalRequests: Math.floor(Math.random() * 1000) + 500,
      activeServices: ${mockServices.length},
      avgResponse: Math.floor(Math.random() * 100) + 50,
      dbConnections: ${mockServices.length} * 3
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
`;
    
    const apiScriptPath = path.join(distDir, 'public', 'js', 'static-api.js');
    await fs.ensureDir(path.dirname(apiScriptPath));
    await fs.writeFile(apiScriptPath, apiScript);
    console.log('✅ Created static API simulation');
    
    // Create a simple configuration file
    const config = {
      deployment: 'static',
      services: SERVICES.map(svc => ({
        name: svc.name,
        key: svc.key,
        description: svc.description
      })),
      buildTime: new Date().toISOString()
    };
    
    const configPath = path.join(distDir, 'config.json');
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Created configuration file');
    
    // Create a simple README for the dist folder
    const readme = `# Static Dashboard Build

This folder contains the static build of the Microservices Dashboard for CloudFront deployment.

## Files:
- \`index.html\` - Main dashboard page
- \`public/\` - Static assets (CSS, JS, images)
- \`config.json\` - Build configuration
- \`public/js/static-api.js\` - API simulation for static deployment

## Deployment:
Upload the contents of this folder to your CloudFront distribution's S3 bucket.

## Notes:
- This is a static build that simulates API calls
- For real-time data, you'll need to configure API endpoints
- The dashboard will show mock data in static mode

Build time: ${new Date().toISOString()}
`;
    
    const readmePath = path.join(distDir, 'README.md');
    await fs.writeFile(readmePath, readme);
    console.log('✅ Created README');
    
    console.log('\n🎉 Static build completed successfully!');
    console.log('📁 Output directory: dist/');
    console.log('🌐 Ready for CloudFront deployment');
    console.log('\nTo deploy:');
    console.log('1. Upload contents of dist/ to your S3 bucket');
    console.log('2. Configure CloudFront distribution');
    console.log('3. Set index.html as default root object');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildStatic(); 