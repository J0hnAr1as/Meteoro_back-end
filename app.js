const express = require('express');
const app = express();

const climaRoutes = require('./routes/climaRouters');

// Middleware
app.use(express.json());

// Rutas
app.use('/api', climaRoutes);

module.exports = app;
