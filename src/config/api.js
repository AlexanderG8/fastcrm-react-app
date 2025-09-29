/**
 * Configuración de la API
 */

// URL base de la API
export const API_URL ="https://fastcrm-express-api-f791.onrender.com";

// Endpoints de la API
export const ENDPOINTS = {
  TEMPLATES: '/api/templates',
  CONTACTS: '/api/contacts',
  COMPANIES: '/api/companies',
  CONTACT_LOGS: '/api/contactlogs'
};

// Configuración para las peticiones fetch
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};