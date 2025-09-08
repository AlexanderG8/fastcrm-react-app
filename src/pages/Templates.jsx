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

      {/* Listado de plantillas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Cargando plantillas...</div>
          ) : templates.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay plantillas disponibles. ¡Crea una nueva!
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contenido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etiquetas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{template.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{template.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {template.labels && template.labels.length > 0 ? (
                          template.labels.map((labelObj, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {labelObj.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">Sin etiquetas</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{template.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(template)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteTemplate(template._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Templates;