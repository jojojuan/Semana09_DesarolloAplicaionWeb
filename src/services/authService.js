// CAPA 3 — SERVICE
// Responsabilidad: lógica de negocio (reglas, transformaciones).
// NO sabe cómo se conecta a la base de datos.
// Delega el acceso a datos al Repository.
const authRepository = require('../repositories/authRepository');

exports.login = async (email, password) => {
  const data = await authRepository.signIn(email, password);

  return {
    usuario: {
      id:     data.user.id,
      email:  data.user.email,
      nombre: data.user.user_metadata?.full_name || 'Cliente'
    },
    token: data.session.access_token
  };
};

exports.register = async (nombre, email, password) => {
  const data = await authRepository.signUp(nombre, email, password);

  return {
    usuario: {
      id:     data.user.id,
      email:  data.user.email,
      nombre: data.user.user_metadata?.full_name || nombre
    },
    token: data.session?.access_token || null
  };
};

exports.recoverPassword = async (email) => {
  const result = await authRepository.resetPassword(email);

  return {
    message: result.message || 'Se ha enviado el enlace de recuperación al correo proporcionado.'
  };
};

exports.logout = async () => {
  await authRepository.signOut();
};

exports.getUsuarioActual = async (token) => {
  const data = await authRepository.getUser(token);
  return {
    id:     data.user.id,
    email:  data.user.email,
    nombre: data.user.user_metadata?.full_name || 'Cliente'
  };
};
