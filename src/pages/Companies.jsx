import { useState, useEffect } from 'react';
import CompanyForm from '../components/CompanyForm';
import { toast } from 'react-toastify';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../services/companyService';

/**
 * Página principal para la gestión de empresas
 */
const Companies = () => {
  // Estado para almacenar todas las empresas (sin filtrar)
  const [allCompanies, setAllCompanies] = useState([]);
  
  // Estado para almacenar la lista de empresas filtradas que se mostrarán
  const [companies, setCompanies] = useState([]);
  
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  
  // Estado para manejar errores
  const [error, setError] = useState(null);
  
  // Estado para controlar el modo de edición
  const [editMode, setEditMode] = useState(false);
  
  // Estado para almacenar la empresa que se está editando
  const [currentCompany, setCurrentCompany] = useState(null);
  
  // Estado para controlar la visibilidad del formulario
  const [showForm, setShowForm] = useState(false);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener todas las empresas desde la API
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getCompanies();
      setAllCompanies(data);
      setCompanies(data); // Inicialmente mostramos todas las empresas
      setError(null);
    } catch (err) {
      toast.error('Error al cargar las empresas. Por favor, intenta de nuevo.');
      console.error('Error fetching companies:', err);
      setError('No se pudieron cargar las empresas');
      setAllCompanies([]);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar empresas localmente
  const filterCompanies = (companiesToFilter = allCompanies, term = searchTerm) => {
    if (!term.trim()) {
      // Si no hay término de búsqueda, mostrar todas las empresas
      setCompanies(companiesToFilter);
      return;
    }
    
    // Filtrar empresas que contengan el término de búsqueda en el nombre o RUC
    const filtered = companiesToFilter.filter(company => 
      company.name.toLowerCase().includes(term.toLowerCase()) || 
      (company.ruc && company.ruc.includes(term))
    );
    
    setCompanies(filtered);
  };

  // Cargar empresas al montar el componente
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  // Filtrar empresas cuando cambie el término de búsqueda o la lista de empresas
  useEffect(() => {
    filterCompanies();
  }, [searchTerm, allCompanies]);

  // Función para crear una nueva empresa
  const handleCreateCompany = async (companyData) => {
    try {
      const newCompany = await createCompany(companyData);
      // Actualizar ambos estados
      const updatedCompanies = [...allCompanies, newCompany.company];
      setAllCompanies(updatedCompanies);
      // Aplicar el filtro actual a la lista actualizada
      filterCompanies(updatedCompanies);
      
      setShowForm(false);
      toast.success('Empresa creada exitosamente');
    } catch (err) {
      toast.error('Error al crear la empresa. Por favor, intenta de nuevo.');
      console.error('Error creating company:', err);
    }
  };

  // Función para actualizar una empresa existente
  const handleUpdateCompany = async (companyData) => {
    try {
      const updatedCompany = await updateCompany(companyData.id, companyData);
      
      // Actualizar la empresa en ambos estados
      const updatedAllCompanies = allCompanies.map(company => 
        company.id === updatedCompany.company.id ? updatedCompany.company : company
      );
      
      setAllCompanies(updatedAllCompanies);
      // Aplicar el filtro actual a la lista actualizada
      filterCompanies(updatedAllCompanies);
      
      setShowForm(false);
      setEditMode(false);
      setCurrentCompany(null);
      toast.success('Empresa actualizada exitosamente');
    } catch (err) {
      toast.error('Error al actualizar la empresa. Por favor, intenta de nuevo.');
      console.error('Error updating company:', err);
    }
  };

  // Función para eliminar una empresa
  const handleDeleteCompany = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        const response = await deleteCompany(id);
        
        // Verificar si hay un error en la respuesta
        if (response.error) {
          toast.error(response.error);
          return;
        }
        
        // Eliminar la empresa de ambos estados
        const updatedAllCompanies = allCompanies.filter(company => company.id !== id);
        setAllCompanies(updatedAllCompanies);
        // Aplicar el filtro actual a la lista actualizada
        filterCompanies(updatedAllCompanies);
        
        toast.success('Empresa eliminada exitosamente');
      } catch (err) {
        toast.error('Error al eliminar la empresa. Por favor, intenta de nuevo.');
        console.error('Error deleting company:', err);
      }
    }
  };

  // Función para iniciar la edición de una empresa
  const handleEditCompany = (company) => {
    setCurrentCompany(company);
    setEditMode(true);
    setShowForm(true);
  };
  
  // Función para manejar el envío del formulario
  const handleFormSubmit = (formData) => {
    if (editMode) {
      handleUpdateCompany(formData);
    } else {
      handleCreateCompany(formData);
    }
  };

  // Función para cancelar la edición o creación
  const handleCancel = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentCompany(null);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Empresas</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nueva Empresa
          </button>
        )}
      </div>

      {/* Formulario para crear/editar empresas */}
      {showForm && (
        <CompanyForm
          companyToEdit={editMode ? currentCompany : null}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar empresa..."
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

      {/* Tabla de empresas */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">No hay empresas disponibles. ¡Crea una nueva!</span>
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
                  RUC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{company.ruc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(company.createAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {company.contacts ? company.contacts.length : 0} contactos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
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
                    No hay empresas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Companies;