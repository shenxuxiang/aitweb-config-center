const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({ target: 'https://localhost', changeOrigin: true, secure: false }));
app.listen(9999);
