/**
 * Servicio para manejar las operaciones CRUD de empresas
 */

import { API_URL, ENDPOINTS, DEFAULT_HEADERS } from '../config/api';

/**
 * Obtiene todas las empresas
 * @param {string} searchQuery - Término de búsqueda opcional
 * @returns {Promise<Array>} - Lista de empresas
 */
export const getCompanies = async (searchQuery) => {
  try {
    let url = `${API_URL}${ENDPOINTS.COMPANIES}`;
    if (searchQuery) {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    // La API devuelve un objeto con una propiedad 'companies' que contiene el array
    if (data && data.companies && Array.isArray(data.companies)) {
      return data.companies;
    }
    // Fallback por si la estructura cambia
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return [];
  }
};

/**
 * Obtiene una empresa específica por ID
 * @param {number} id - ID de la empresa
 * @returns {Promise<Object>} - Datos de la empresa
 */
export const getCompanyById = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.COMPANIES}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Crea una nueva empresa
 * @param {Object} companyData - Datos de la empresa a crear
 * @returns {Promise<Object>} - Empresa creada
 */
export const createCompany = async (companyData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.COMPANIES}`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Actualiza una empresa existente
 * @param {number} id - ID de la empresa a actualizar
 * @param {Object} companyData - Nuevos datos de la empresa
 * @returns {Promise<Object>} - Empresa actualizada
 */
export const updateCompany = async (id, companyData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.COMPANIES}/${id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(companyData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Elimina una empresa
 * @param {number} id - ID de la empresa a eliminar
 * @returns {Promise<void>}
 */
export const deleteCompany = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.COMPANIES}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};