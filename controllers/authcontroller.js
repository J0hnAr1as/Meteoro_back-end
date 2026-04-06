const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Usuario demo (puedes luego guardarlo en Firestore)
const USER = {
  email: "usuario@ejemplo.com",
  passwordHash: bcrypt.hashSync("123456", 10) // contraseña encriptada
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== USER.email || !bcrypt.compareSync(password, USER.passwordHash)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Generar token JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET || "secreto", { expiresIn: "1h" });

  // Enviar token al correo
  let transporter = nodemailer.createTransport({
    service: "gmail", // o SMTP de tu proveedor
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Tu token de acceso",
    text: `Aquí está tu token: ${token}`
  });

  res.json({ message: "Token enviado al correo" });
};