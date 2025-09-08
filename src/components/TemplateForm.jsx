import { useState, useEffect } from 'react';

/**
 * Componente de formulario para crear o editar plantillas
 * @param {Object} props - Propiedades del componente
 * @param {Object|null} props.templateToEdit - Plantilla a editar (null si es creación)
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 */
const TemplateForm = ({ templateToEdit, onSubmit, onCancel }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    _id: '',
    type: 'welcome',
    content: '',
    labels: [],
    author: '',
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para manejar la etiqueta actual que se está escribiendo
  const [currentLabel, setCurrentLabel] = useState('');

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (templateToEdit) {
      setFormData({
        _id: templateToEdit._id || '',
        type: templateToEdit.type || 'welcome',
        content: templateToEdit.content || '',
        labels: templateToEdit.labels || [],
        author: templateToEdit.author || '',
      });
    }
  }, [templateToEdit]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Manejar cambios en el campo de etiqueta actual
  const handleLabelChange = (e) => {
    setCurrentLabel(e.target.value);
  };
  
  // Agregar una nueva etiqueta
  const addLabel = () => {
    if (currentLabel.trim()) {
      setFormData(prevData => ({
        ...prevData,
        labels: [...prevData.labels, { label: currentLabel.trim() }]
      }));
      setCurrentLabel('');
    }
  };
  
  // Eliminar una etiqueta
  const removeLabel = (index) => {
    setFormData(prevData => ({
      ...prevData,
      labels: prevData.labels.filter((_, i) => i !== index)
    }));
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'El autor es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Resetear el formulario después de enviar
      if (!templateToEdit) {
        setFormData({
          type: 'welcome',
          content: '',
          labels: [],
          author: ''
        });
        setCurrentLabel('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {templateToEdit ? 'Editar Plantilla' : 'Nueva Plantilla'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
          Tipo de Plantilla
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="welcome">Bienvenida</option>
          <option value="notificaciones">Notificación</option>
          <option value="recordatorios">Recordatorio</option>
          <option value="otros">Otro</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Contenido
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="5"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.content ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Escribe el contenido de tu plantilla aquí..."
        ></textarea>
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="labels" className="block text-gray-700 text-sm font-bold mb-2">
          Etiquetas
        </label>
        <div className="flex">
          <input
            type="text"
            id="currentLabel"
            value={currentLabel}
            onChange={handleLabelChange}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Añadir etiqueta..."
          />
          <button
            type="button"
            onClick={addLabel}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Añadir
          </button>
        </div>
        
        {formData.labels.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.labels.map((labelObj, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                <span>{labelObj.label}</span>
                <button
                  type="button"
                  onClick={() => removeLabel(index)}
                  className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">
          Autor
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.author ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Nombre del autor"
        />
        {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {templateToEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default TemplateForm;