const express = require('express');
const app = express();

const climaRoutes = require('./routes/climaRouters');

// Middleware
app.use(express.json());

// Rutas
app.use('/api', climaRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});
module.exports = app;
