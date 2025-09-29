import { useState, useEffect } from 'react';
import ContactForm from '../components/ContactForm';
import ContactLogForm from '../components/ContactLogForm';
import { toast } from 'react-toastify';
import { getContacts, createContact, updateContact, deleteContact } from '../services/contactService';

/**
 * Página principal para la gestión de contactos
 */
const Contacts = () => {
  // Estado para almacenar todos los contactos (sin filtrar)
  const [allContacts, setAllContacts] = useState([]);
  
  // Estado para almacenar la lista de contactos filtrados que se mostrarán
  const [contacts, setContacts] = useState([]);
  
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Estado para controlar el modo de edición
  const [editMode, setEditMode] = useState(false);
  
  // Estado para almacenar el contacto que se está editando
  const [currentContact, setCurrentContact] = useState(null);
  
  // Estado para controlar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para controlar el formulario de contacto (ContactLog)
  const [showContactLogForm, setShowContactLogForm] = useState(false);
  const [contactToLog, setContactToLog] = useState(null);

  // Función para obtener todos los contactos desde la API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await getContacts();
      setAllContacts(data);
      setContacts(data); // Inicialmente mostramos todos los contactos
      setError(null);
    } catch (err) {
      toast.error('Error al cargar los contactos. Por favor, intenta de nuevo.');
      console.error('Error fetching contacts:', err);
      setError('No se pudieron cargar los contactos');
      setAllContacts([]);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar contactos localmente
  const filterContacts = (contactsToFilter = allContacts, term = searchTerm) => {
    if (!term.trim()) {
      // Si no hay término de búsqueda, mostrar todos los contactos
      setContacts(contactsToFilter);
      return;
    }
    
    // Filtrar contactos que contengan el término de búsqueda en el nombre o WhatsApp
    const filtered = contactsToFilter.filter(contact => 
      contact.name.toLowerCase().includes(term.toLowerCase()) || 
      (contact.whatsapp && contact.whatsapp.includes(term))
    );
    
    setContacts(filtered);
  };

  // Cargar contactos al montar el componente
  useEffect(() => {
    fetchContacts();
  }, []);
  
  // Filtrar contactos cuando cambie el término de búsqueda o la lista de contactos
  useEffect(() => {
    filterContacts();
  }, [searchTerm, allContacts]);

  // Función para crear un nuevo contacto
  const handleCreateContact = async (contactData) => {
    try {
      const newContact = await createContact(contactData);
      // Actualizar ambos estados
      const updatedContacts = [...allContacts, newContact.contact];
      console.log(newContact);
      console.log(updatedContacts);
      setAllContacts(updatedContacts);
      // Aplicar el filtro actual a la lista actualizada
      filterContacts(updatedContacts);
      
      setShowForm(false);
      toast.success('Contacto creado exitosamente');
    } catch (err) {
      toast.error('Error al crear el contacto. Por favor, intenta de nuevo.');
      console.error('Error creating contact:', err);
    }
  };

  // Función para actualizar un contacto existente
  const handleUpdateContact = async (contactData) => {
    try {
      const updatedContact = await updateContact(contactData.id, contactData);
      
      // Actualizar el contacto en ambos estados
      const updatedAllContacts = allContacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      );
      
      setAllContacts(updatedAllContacts);
      // Aplicar el filtro actual a la lista actualizada
      filterContacts(updatedAllContacts);
      
      setShowForm(false);
      setEditMode(false);
      setCurrentContact(null);
      toast.success('Contacto actualizado exitosamente');
    } catch (err) {
      toast.error('Error al actualizar el contacto. Por favor, intenta de nuevo.');
      console.error('Error updating contact:', err);
    }
  };

  // Función para eliminar un contacto
  const handleDeleteContact = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      try {
        await deleteContact(id);
        
        // Eliminar el contacto de ambos estados
        const updatedAllContacts = allContacts.filter(contact => contact.id !== id);
        setAllContacts(updatedAllContacts);
        // Aplicar el filtro actual a la lista actualizada
        filterContacts(updatedAllContacts);
        
        toast.success('Contacto eliminado exitosamente');
      } catch (err) {
        toast.error('Error al eliminar el contacto. Por favor, intenta de nuevo.');
        console.error('Error deleting contact:', err);
      }
    }
  };

  // Función para iniciar la edición de un contacto
  const handleEditContact = (contact) => {
    setCurrentContact(contact);
    setEditMode(true);
    setShowForm(true);
  };
  

  // Función para manejar el envío del formulario
  const handleFormSubmit = (formData) => {
    if (editMode) {
      handleUpdateContact(formData);
    } else {
      handleCreateContact(formData);
    }
  };

  // Función para cancelar la edición o creación
  const handleCancel = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentContact(null);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Contactos</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nuevo Contacto
          </button>
        )}
      </div>

      {/* Formulario para crear/editar contactos */}
      {showForm && (
        <ContactForm
          contactToEdit={editMode ? currentContact : null}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar contacto..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabla de contactos */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">No hay contactos disponibles. ¡Crea uno nuevo!</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(contacts) && contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{contact.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contact.company ? contact.company.name : 'Sin empresa'}
                      </div>
                      {contact.company && (
                        <div className="text-xs text-gray-500">RUC: {contact.company.ruc}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(contact.createdAt || contact.createAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setContactToLog(contact);
                          setShowContactLogForm(true);
                        }}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Contactar
                      </button>
                      <button
                         onClick={() => handleEditContact(contact)}
                         className="text-indigo-600 hover:text-indigo-900 mr-3"
                       >
                         Editar
                       </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay contactos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para el formulario de ContactLog */}
      {showContactLogForm && contactToLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <ContactLogForm 
              contact={contactToLog}
              onClose={() => {
                setShowContactLogForm(false);
                setContactToLog(null);
              }}
              onSuccess={() => {
                setShowContactLogForm(false);
                setContactToLog(null);
                toast.success('Contacto registrado exitosamente');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;