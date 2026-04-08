const express = require('express');
const router = express.Router();

const { guardarClima } = require('../controllers/clima.Controller');

// 📡 Ruta ESP32
router.post('/clima', guardarClima);
router.get('/clima', (req, res) => {
  res.send('Ruta clima funcionando');
});

module.exports = router;