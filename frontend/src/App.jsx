import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [mode, setMode] = useState('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setMessage(`Bienvenido de nuevo, ${data.data.nombre}`);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => localStorage.removeItem('token'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    let endpoint = '/login';
    let payload = { email, password };

    if (mode === 'register') {
      endpoint = '/register';
      payload = { nombre, email, password };
    }

    if (mode === 'recover') {
      endpoint = '/recover';
      payload = { email };
    }

    try {
      const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Error al procesar la solicitud');
        setLoading(false);
        return;
      }

      if (mode === 'recover') {
        setMessage(result.message || 'Revisa tu correo para recuperar la contraseña');
        setLoading(false);
        return;
      }

      setUser(result.data.usuario);
      if (result.data.token) {
        localStorage.setItem('token', result.data.token);
      }

      setMessage(`Bienvenido, ${result.data.usuario.nombre}`);
      setPassword('');
    } catch (error) {
      setMessage('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
    } catch (error) {
      // Ignorar errores de logout en backend
    }

    localStorage.removeItem('token');
    setUser(null);
    setNombre('');
    setEmail('');
    setPassword('');
    setMessage('Sesión cerrada correctamente');
  };

  const getButtonLabel = () => {
    if (mode === 'register') return 'Crear cuenta';
    if (mode === 'recover') return 'Enviar recuperación';
    return 'Iniciar sesión';
  };

  return (
    <div className="page-shell">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge">Inicio de sesión</div>
          <h1>Bienvenido a tu Banca Digital</h1>
          <p>Ingresa con tus credenciales para continuar.</p>
        </div>

        {message && <div className="message">{message}</div>}

        {user ? (
          <div className="profile-box">
            <p className="profile-label">Usuario conectado:</p>
            <strong>{user.nombre}</strong>
            <span>{user.email}</span>
            <button className="btn secondary" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label>
                Nombre completo
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                />
              </label>
            )}

            <label>
              Correo electrónico
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@cajapiura.pe"
                required
              />
            </label>

            {mode !== 'recover' && (
              <label>
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </label>
            )}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Procesando...' : getButtonLabel()}
            </button>
          </form>
        )}

        <div className="mode-buttons">
          <button
            type="button"
            className={`mode-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`mode-button ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Registro
          </button>
          <button
            type="button"
            className={`mode-button ${mode === 'recover' ? 'active' : ''}`}
            onClick={() => setMode('recover')}
          >
            Recuperar
          </button>
        </div>

        <p className="note">
          Si aún no tienes cuenta, regístrate. Si olvidaste tu contraseña, usa recuperar.
        </p>
      </div>
    </div>
  );
}

export default App;
