
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Templates from './pages/Templates';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import ContactLogs from './pages/ContactLogs';
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
              <Link to="/contacts" className="hover:text-blue-200 transition-colors">Contactos</Link>
              <Link to="/companies" className="hover:text-blue-200 transition-colors">Empresas</Link>
              <Link to="/contactlogs" className="hover:text-blue-200 transition-colors">Historial</Link>
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main>
          <Routes>
            <Route path="/" element={<div className="container mx-auto p-4 text-center">
              <h1 className="text-3xl font-bold mb-4">Bienvenido a FastCRM</h1>
              <p className="mb-4">Sistema de gestión de relaciones con clientes</p>
              <div className="flex justify-center space-x-4">
                <Link to="/templates" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Gestionar Plantillas
                </Link>
                <Link to="/contacts" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Gestionar Contactos
                </Link>
                <Link to="/companies" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Gestionar Empresas
                </Link>
              </div>
            </div>} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/contactlogs" element={<ContactLogs />} />
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
