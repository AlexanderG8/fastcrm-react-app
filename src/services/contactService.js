/**
 * Servicio para manejar las operaciones CRUD de contactos
 */

import { API_URL, ENDPOINTS, DEFAULT_HEADERS } from '../config/api';

/**
 * Obtiene todos los contactos
 * @param {string} searchQuery - Término de búsqueda opcional
 * @returns {Promise<Array>} - Lista de contactos
 */
export const getContacts = async (searchQuery) => {
  try {
    let url = `${API_URL}${ENDPOINTS.CONTACTS}`;
    if (searchQuery) {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    // La API devuelve un objeto con una propiedad 'contacs' que contiene el array
    if (data && data.contacs && Array.isArray(data.contacs)) {
      return data.contacs;
    }
    // Fallback por si la estructura cambia
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return [];
  }
};

/**
 * Obtiene un contacto específico por ID
 * @param {number} id - ID del contacto
 * @returns {Promise<Object>} - Datos del contacto
 */
export const getContactById = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACTS}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Crea un nuevo contacto
 * @param {Object} contactData - Datos del contacto a crear
 * @returns {Promise<Object>} - Contacto creado
 */
export const createContact = async (contactData) => {
  contactData.companyId = parseInt(contactData.companyId, 10);
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACTS}`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Actualiza un contacto existente
 * @param {number} id - ID del contacto a actualizar
 * @param {Object} contactData - Nuevos datos del contacto
 * @returns {Promise<Object>} - Contacto actualizado
 */
export const updateContact = async (id, contactData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACTS}/${id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Elimina un contacto
 * @param {number} id - ID del contacto a eliminar
 * @returns {Promise<void>}
 */
export const deleteContact = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACTS}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};