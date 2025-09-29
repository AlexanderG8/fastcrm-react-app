/**
 * Servicio para manejar las operaciones CRUD de registros de contacto
 */

import { API_URL, ENDPOINTS, DEFAULT_HEADERS } from '../config/api';

/**
 * Obtiene todos los registros de contacto
 * @returns {Promise<Array>} - Lista de registros de contacto
 */
export const getContactLogs = async () => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.CONTACT_LOGS}`);
    
    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error al obtener registros de contacto:', error);
    return [];
  }
};

/**
 * Obtiene un registro de contacto específico por ID
 * @param {number} id - ID del registro de contacto
 * @returns {Promise<Object>} - Datos del registro de contacto
 */
export const getContactLogById = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACT_LOGS}/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Crea un nuevo registro de contacto
 * @param {Object} contactLogData - Datos del registro de contacto a crear
 * @returns {Promise<Object>} - Registro de contacto creado
 */
export const createContactLog = async (contactLogData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACT_LOGS}`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(contactLogData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Actualiza un registro de contacto existente
 * @param {number} id - ID del registro de contacto a actualizar
 * @param {Object} contactLogData - Nuevos datos del registro de contacto
 * @returns {Promise<Object>} - Registro de contacto actualizado
 */
export const updateContactLog = async (id, contactLogData) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACT_LOGS}/${id}`, {
    method: 'PUT',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(contactLogData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Elimina un registro de contacto
 * @param {number} id - ID del registro de contacto a eliminar
 * @returns {Promise<Object>} - Mensaje de confirmación
 */
export const deleteContactLog = async (id) => {
  const response = await fetch(`${API_URL}${ENDPOINTS.CONTACT_LOGS}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

/**
 * Obtiene todos los registros de contacto para un contacto específico
 * @param {number} contactId - ID del contacto
 * @returns {Promise<Array>} - Lista de registros de contacto
 */
export const getContactLogsByContactId = async (contactId) => {
  try {
    const response = await fetch(`${API_URL}${ENDPOINTS.CONTACTS}/${contactId}/logs`);
    
    if (!response.ok) {
      console.error(`Error en la respuesta: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error al obtener registros para el contacto ${contactId}:`, error);
    return [];
  }
};