const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// CORS für alle Anfragen aktivieren
app.use(cors());

// Proxy für n8n Webhook
app.use('/api/n8n', createProxyMiddleware({
  target: 'https://n8n.srv1071286.hstgr.cloud',
  changeOrigin: true,
  pathRewrite: {
    '^/api/n8n': '/webhook/7e5e35cc-ee63-46f6-b110-bbb7b55ebeae'
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', details: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy-Server läuft auf Port ${PORT}`);
  console.log(`n8n Webhook verfügbar unter: http://localhost:${PORT}/api/n8n`);
});
