import { useState, useEffect } from 'react';
import TemplateForm from '../components/TemplateForm';
import { toast } from 'react-toastify';

/**
 * Página principal para la gestión de plantillas
 */
const Templates = () => {
  // Estado para almacenar la lista de plantillas
  const [templates, setTemplates] = useState([]);
  
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Estado para controlar el modo de edición
  const [editMode, setEditMode] = useState(false);
  
  // Estado para almacenar la plantilla que se está editando
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // Estado para controlar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para el filtro de tipo
  const [typeFilter, setTypeFilter] = useState('');

  // Función para obtener todas las plantillas
  const fetchTemplates = async (searchQuery = '', typeFilter = '') => {
    setLoading(true);
    try {
      // Construir la URL con los parámetros de búsqueda y filtro
      let url = 'http://localhost:3000/api/templates';
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      
      if (typeFilter) {
        params.append('type', typeFilter);
      }
      
      // Añadir los parámetros a la URL si existen
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setTemplates(data);
      setError(null);
    } catch (err) {
      toast.error('Error al cargar las plantillas. Por favor, intenta de nuevo.');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar plantillas al montar el componente o cuando cambien los filtros
  useEffect(() => {
    fetchTemplates(searchTerm, typeFilter);
  }, [searchTerm, typeFilter]);

  // Función para crear una nueva plantilla
  const createTemplate = async (templateData) => {
    try {
      const response = await fetch('http://localhost:3000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newTemplate = await response.json();
      setTemplates([...templates, newTemplate]);
      setShowForm(false);
      fetchTemplates();
      toast.success('Plantilla creada exitosamente');
    } catch (err) {
      toast.error('Error al crear la plantilla. Por favor, intenta de nuevo.');
      console.error('Error creating template:', err);
    }
  };

  // Función para actualizar una plantilla existente
  const updateTemplate = async (templateData) => {
    try {
      const response = await fetch(`http://localhost:3000/api/templates/${currentTemplate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const updatedTemplate = await response.json();
      
      // Actualizar la lista de plantillas
      setTemplates(templates.map(template => 
        template._id === currentTemplate._id ? updatedTemplate : template
      ));
      
      // Resetear el estado de edición
      setEditMode(false);
      setCurrentTemplate(null);
      setShowForm(false);
      fetchTemplates();
      toast.success('Plantilla actualizada exitosamente');
    } catch (err) {
      toast.error('Error al actualizar la plantilla. Por favor, intenta de nuevo.');
      console.error('Error updating template:', err);
    }
  };

  // Función para eliminar una plantilla
  const deleteTemplate = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Eliminar la plantilla de la lista
      setTemplates(templates.filter(template => template._id !== id));
      toast.success('Plantilla eliminada exitosamente');
    } catch (err) {
      toast.error('Error al eliminar la plantilla. Por favor, intenta de nuevo.');
      console.error('Error deleting template:', err);
    }
  };

  // Función para iniciar la edición de una plantilla
  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setEditMode(true);
    setShowForm(true);
  };

  // Función para manejar el envío del formulario
  const handleFormSubmit = (formData) => {
    if (editMode) {
      updateTemplate(formData);
    } else {
      createTemplate(formData);
    }
  };

  // Función para cancelar la edición o creación
  const handleCancel = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentTemplate(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Plantillas</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nueva Plantilla
          </button>
        )}
      </div>

      {/* Los errores ahora se muestran con toast */}

      {/* Formulario para crear/editar plantillas */}
      {showForm && (
        <TemplateForm
          templateToEdit={editMode ? currentTemplate : null}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Filtros de búsqueda */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de búsqueda por palabra clave */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por contenido..."
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
        
        {/* Filtro por tipo de mensaje */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="welcome">Bienvenida</option>
            <option value="notificaciones">Notificación</option>
            <option value="recordatorios">Recordatorio</option>
            <option value="seguimiento">Seguimiento</option>
            <option value="otros">Otro</option>
          </select>
        </div>
      </div>

      {/* Listado de plantillas en formato de tarjetas */}
      {loading ? (
        <div className="p-4 text-center text-gray-500">Cargando plantillas...</div>
      ) : templates.length === 0 ? (
        <div className="p-4 text-center text-gray-500 bg-white shadow-md rounded-lg">
          No hay plantillas disponibles. ¡Crea una nueva!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5">
                {/* Encabezado de la tarjeta */}
                <div className="flex justify-between items-center mb-3">
                  <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {template.type}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Nombre de la plantilla */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.name}</h3>
                
                {/* Contenido de la plantilla */}
                <div className="text-gray-600 mb-4 h-24 overflow-hidden">
                  {template.content}
                </div>
                
                {/* Etiquetas */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.labels && template.labels.length > 0 ? (
                    template.labels.map((labelObj, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {labelObj.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Sin etiquetas</span>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(template)}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => deleteTemplate(template._id)}
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

export default Templates;