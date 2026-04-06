// controllers/usuarios.controller.js
const { db, admin } = require("../config/firebase");
const bcrypt = require("bcryptjs");

// CREATE - Crear usuario
exports.createUsuario = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const { user, password, role, estado } = req.body;

    if (!user || !password || !role || !estado) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuarioRef = await db
      .collection("Usuarios")
      .doc(sedeId)
      .collection("usuarios")
      .add({
        user,
        passwordHash,
        role,
        estado,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(201).json({ id: usuarioRef.id, message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear usuario" });
  }
};

// READ - Listar usuarios de una sede
exports.getUsuarios = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const snapshot = await db
      .collection("Usuarios")
      .doc(sedeId)
      .collection("usuarios")
      .get();

    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ usuarios });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// UPDATE - Actualizar usuario
exports.updateUsuario = async (req, res) => {
  try {
    const { sedeId, usuarioId } = req.params;
    const data = req.body;

    // Si se envía nueva contraseña, encriptarla
    if (data.password) {
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    await db
      .collection("Usuarios")
      .doc(sedeId)
      .collection("usuarios")
      .doc(usuarioId)
      .update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// DELETE - Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const { sedeId, usuarioId } = req.params;

    await db
      .collection("Usuarios")
      .doc(sedeId)
      .collection("usuarios")
      .doc(usuarioId)
      .delete();

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// DESACTIVAR - Cambiar estado de usuario a Inactivo
exports.desactivarUsuario = async (req, res) => {
  try {
    const { sedeId, usuarioId } = req.params;

    const usuarioRef = db.collection("Usuarios").doc(sedeId).collection("usuarios").doc(usuarioId);
    const usuarioDoc = await usuarioRef.get();

    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuarioRef.update({
      estado: "Inactivo",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al desactivar usuario" });
  }
};

