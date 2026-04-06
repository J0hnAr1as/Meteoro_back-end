const express = require('express');
const router = express.Router();

const { guardarClima } = require('../controllers/clima.Controller');

// 📡 Ruta ESP32
router.post('/clima', guardarClima);

module.exports = router;