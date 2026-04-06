const db = require('../config/firebase');

// 📡 Guardar datos del ESP32
const guardarClima = async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body);

    const { ciudad, temperatura, humedad, presion, descripcion } = req.body;

    // Validación básica
    if (!ciudad || temperatura === undefined) {
      return res.status(400).json({
        error: 'Datos incompletos'
      });
    }

    // 💾 Guardar en Firestore
    const docRef = await db.collection('clima').add({
      ciudad,
      temperatura,
      humedad,
      presion,
      descripcion,
      fecha: new Date()
    });

    console.log('✅ Guardado en Firebase con ID:', docRef.id);

    res.status(200).json({
      mensaje: 'Datos guardados en Firebase',
      id: docRef.id
    });

  } catch (error) {
    console.error('❌ Error:', error);

    res.status(500).json({
      error: 'Error al guardar en Firebase'
    });
  }
};

module.exports = {
  guardarClima
};