import { useState, useEffect } from 'react';
import { getCompanies } from '../services/companyService';

/**
 * Componente de formulario para crear o editar contactos
 * @param {Object} props - Propiedades del componente
 * @param {Object|null} props.contactToEdit - Contacto a editar (null si es creación)
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 */
const ContactForm = ({ contactToEdit, onSubmit, onCancel }) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    whatsapp: '',
    companyId: ''
  });
  
  // Estado para almacenar la lista de empresas
  const [companies, setCompanies] = useState([]);

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        id: contactToEdit.id || '',
        name: contactToEdit.name || '',
        whatsapp: contactToEdit.whatsapp || '',
        companyId: contactToEdit.companyId || ''
      });
    }
  }, [contactToEdit]);
  
  // Cargar la lista de empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error al cargar las empresas:', error);
      }
    };
    
    fetchCompanies();
  }, []);

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
    
    // Validar WhatsApp (requerido y formato)
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es obligatorio';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Ingrese un número de WhatsApp válido';
    }
    
    // Validar empresa (requerido)
    if (!formData.companyId) {
      newErrors.companyId = 'Debe seleccionar una empresa';
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
      if (!contactToEdit) {
        setFormData({
          name: '',
          whatsapp: '',
          companyId: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        {contactToEdit ? 'Editar Contacto' : 'Nuevo Contacto'}
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
          placeholder="Nombre completo"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="whatsapp" className="block text-gray-700 text-sm font-bold mb-2">
          WhatsApp
        </label>
        <input
          type="text"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.whatsapp ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Ej: 987654321"
        />
        {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="companyId" className="block text-gray-700 text-sm font-bold mb-2">
          Empresa
        </label>
        <select
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.companyId ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
        >
          <option value="">Seleccione una empresa</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId && <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>}
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
          {contactToEdit ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;