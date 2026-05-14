// CAPA 2 — CONTROLLER
// Responsabilidad: recibir la petición HTTP, validar entrada,
// llamar al Service y devolver la respuesta JSON.
// NO contiene lógica de negocio ni acceso a datos.
const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son obligatorios'
      });
    }

    const resultado = await authService.login(email, password);
    res.json({ success: true, data: resultado });

  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y password son obligatorios'
      });
    }

    const resultado = await authService.register(nombre, email, password);
    res.json({ success: true, data: resultado });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.recover = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es obligatorio para recuperar la contraseña'
      });
    }

    const resultado = await authService.recoverPassword(email);
    res.json({ success: true, message: resultado.message });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await authService.logout();
    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    const usuario = await authService.getUsuarioActual(token);
    res.json({ success: true, data: usuario });

  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
