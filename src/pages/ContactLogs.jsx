import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getContactLogs, deleteContactLog } from '../services/contactLogService';
import { getContacts } from '../services/contactService';

/**
 * Página para mostrar el historial de personas contactadas
 */
const ContactLogs = () => {
  // Estado para almacenar la lista de registros de contacto
  const [contactLogs, setContactLogs] = useState([]);
  
  // Estado para almacenar la lista de contactos (para mostrar nombres)
  const [contacts, setContacts] = useState([]);
  
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Estado para el filtro de contacto
  const [contactFilter, setContactFilter] = useState('');

  // Función para obtener todos los registros de contacto
  const fetchContactLogs = async () => {
    setLoading(true);
    try {
      const logs = await getContactLogs();
      setContactLogs(logs);
      setError(null);
    } catch (err) {
      toast.error('Error al cargar el historial de contactos. Por favor, intenta de nuevo.');
      console.error('Error fetching contact logs:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todos los contactos
  const fetchContacts = async () => {
    try {
      const contactsList = await getContacts();
      setContacts(contactsList);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchContactLogs();
    fetchContacts();
  }, []);

  // Función para eliminar un registro de contacto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      return;
    }
    
    try {
      await deleteContactLog(id);
      setContactLogs(contactLogs.filter(log => log.id !== id));
      toast.success('Registro eliminado exitosamente');
    } catch (err) {
      toast.error('Error al eliminar el registro. Por favor, intenta de nuevo.');
      console.error('Error deleting contact log:', err);
    }
  };

  // Función para obtener el nombre del contacto por ID
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Contacto desconocido';
  };

  // Filtrar registros por contacto si se ha seleccionado uno
  const filteredLogs = contactFilter 
    ? contactLogs.filter(log => log.contactId === parseInt(contactFilter))
    : contactLogs;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de Contactos</h1>
      </div>

      {/* Filtro por contacto */}
      <div className="mb-6">
        <label htmlFor="contactFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por contacto:
        </label>
        <select
          id="contactFilter"
          value={contactFilter}
          onChange={(e) => setContactFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los contactos</option>
          {contacts.map(contact => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Listado de registros de contacto */}
      {loading ? (
        <div className="p-4 text-center text-gray-500">Cargando historial...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-white shadow-md rounded-lg">
          No hay registros de contacto disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                {/* Encabezado de la tarjeta */}
                <div className="flex justify-between items-center mb-3">
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Nombre del contacto */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {getContactName(log.contactId)}
                </h3>
                
                {/* Plantilla utilizada */}
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-600">Plantilla:</span>
                  <span className="ml-2 text-sm text-gray-800">{log.templateUsed}</span>
                </div>
                
                {/* Notas */}
                <div className="text-gray-600 mb-4 h-24 overflow-auto">
                  <span className="text-sm font-medium text-gray-600">Notas:</span>
                  <p className="mt-1 text-sm">{log.notes || 'Sin notas'}</p>
                </div>
                
                {/* Botones de acción */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactLogs;