/**
 * Servicio para manejar las operaciones CRUD de plantillas
 */

import { API_URL, ENDPOINTS, DEFAULT_HEADERS } from '../config/api';

/**
 * Obtiene todas las plantillas
 * @param {string} searchQuery - Término de búsqueda opcional
 * @param {string} type - Filtro por tipo de plantilla
 * @returns {Promise<Array>} - Lista de plantillas
 */
export const getTemplates = async (searchQuery, type) => {
  try {
    let url = `${API_URL}${ENDPOINTS.TEMPLATES}`;
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    
    if (type) {
      params.append('type', type);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener plantillas:', error);
    return [];
  }
};

/**
 * Obtiene una plantilla específica por ID
 * @param {string} id - ID de la plantilla
 * @returns {Promise<Object>} - Datos de la plantilla
 */
export const getTemplateById = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.TEMPLATES}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Crea una nueva plantilla
 * @param {Object} templateData - Datos de la plantilla a crear
 * @returns {Promise<Object>} - Plantilla creada
 */
export const createTemplate = async (templateData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.TEMPLATES}`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(templateData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Actualiza una plantilla existente
 * @param {string} id - ID de la plantilla a actualizar
 * @param {Object} templateData - Nuevos datos de la plantilla
 * @returns {Promise<Object>} - Plantilla actualizada
 */
export const updateTemplate = async (id, templateData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.TEMPLATES}/${id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(templateData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Elimina una plantilla
 * @param {string} id - ID de la plantilla a eliminar
 * @returns {Promise<Object>} - Mensaje de confirmación
 */
export const deleteTemplate = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.TEMPLATES}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};