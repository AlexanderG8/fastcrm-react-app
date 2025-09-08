import { useState, useEffect } from 'react';

/**
 * Componente de formulario para crear o editar empresas
 * @param {Object} props - Propiedades del componente
 * @param {Object|null} props.companyToEdit - Empresa a editar (null si es creación)
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 */
const CompanyForm = ({ companyToEdit, onSubmit, onCancel }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    ruc: ''
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        id: companyToEdit.id || '',
        name: companyToEdit.name || '',
        ruc: companyToEdit.ruc || ''
      });
    }
  }, [companyToEdit]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre (requerido)
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    // Validar RUC (requerido y formato)
    if (!formData.ruc.trim()) {
      newErrors.ruc = 'El RUC es obligatorio';
    } else if (!/^[0-9]{11}$/.test(formData.ruc.trim())) {
      newErrors.ruc = 'Ingrese un RUC válido de 11 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // Resetear el formulario después de enviar si no es edición
      if (!companyToEdit) {
        setFormData({
          name: '',
          ruc: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {companyToEdit ? 'Editar Empresa' : 'Nueva Empresa'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Nombre de la empresa"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="ruc" className="block text-gray-700 text-sm font-bold mb-2">
          RUC
        </label>
        <input
          type="text"
          id="ruc"
          name="ruc"
          value={formData.ruc}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.ruc ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Ej: 20123456789"
        />
        {errors.ruc && <p className="text-red-500 text-xs mt-1">{errors.ruc}</p>}
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
          {companyToEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;