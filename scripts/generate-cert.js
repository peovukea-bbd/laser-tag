const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create certificates directory
const certDir = path.join(__dirname, '..', 'certificates');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

console.log('Generating self-signed certificate for HTTPS development...');

try {
  // Generate private key
  execSync(`openssl genrsa -out ${certDir}/key.pem 2048`, { stdio: 'inherit' });
  
  // Generate certificate
  execSync(`openssl req -new -x509 -key ${certDir}/key.pem -out ${certDir}/cert.pem -days 365 -subj "/C=US/ST=Dev/L=Dev/O=Dev/CN=localhost"`, { stdio: 'inherit' });
  
  console.log('✅ Certificates generated successfully!');
  console.log('📁 Location:', certDir);
  console.log('🔐 Files: cert.pem, key.pem');
  console.log('');
  console.log('To use HTTPS:');
  console.log('1. npm run dev:https');
  console.log('2. Accept the security warning in your browser');
  console.log('3. Access https://YOUR_IP:3000 on mobile');
  
} catch (error) {
  console.error('❌ Failed to generate certificates.');
  console.error('This might be because OpenSSL is not installed.');
  console.error('');
  console.error('Alternative solutions:');
  console.error('1. Use ngrok: npm install -g ngrok && ngrok http 3000');
  console.error('2. Deploy to Vercel for HTTPS');
  console.error('3. Use a different device/browser that supports HTTP camera access');
}
