
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Templates from './pages/Templates';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Componente principal de la aplicación
 * Configura las rutas y la navegación
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Barra de navegación */}
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="font-bold text-xl">FastCRM</div>
            <div className="space-x-4">
              <Link to="/templates" className="hover:text-blue-200 transition-colors">Plantillas</Link>
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main>
          <Routes>
            <Route path="/" element={<div className="container mx-auto p-4 text-center">
              <h1 className="text-3xl font-bold mb-4">Bienvenido a FastCRM</h1>
              <p className="mb-4">Sistema de gestión de relaciones con clientes</p>
              <Link to="/templates" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Gestionar Plantillas
              </Link>
            </div>} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </main>
        {/* Configuración de Toast */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
