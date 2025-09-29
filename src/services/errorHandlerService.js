/**
 * Servicio para manejar errores de la API de forma centralizada
 */

/**
 * Maneja los errores de las peticiones a la API
 * @param {Error} error - Error capturado
 * @param {string} operacion - Descripción de la operación que falló
 * @returns {Object} - Objeto con mensaje de error y detalles
 */
export const handleApiError = (error, operacion) => {
  console.error(`Error en ${operacion}:`, error);
  
  // Si el error tiene una respuesta de la API
  if (error.response) {
    return {
      mensaje: `Error ${error.response.status}: ${error.response.statusText}`,
      detalles: error.response.data?.error || error.response.data?.details || null,
      codigo: error.response.status
    };
  }
  
  // Si es un error de red o de otro tipo
  return {
    mensaje: error.message || 'Error desconocido',
    detalles: null,
    codigo: 500
  };
};

/**
 * Formatea los mensajes de error para mostrarlos al usuario
 * @param {Object} error - Objeto de error procesado por handleApiError
 * @returns {string} - Mensaje formateado para el usuario
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'Ha ocurrido un error desconocido';
  
  let mensaje = error.mensaje || 'Ha ocurrido un error';
  
  if (error.detalles) {
    mensaje += `: ${error.detalles}`;
  }
  
  return mensaje;
};

/**
 * Determina si un error es un error de validación (400)
 * @param {Object} error - Objeto de error procesado por handleApiError
 * @returns {boolean} - True si es un error de validación
 */
export const isValidationError = (error) => {
  return error && error.codigo === 400;
};

/**
 * Determina si un error es un error de no encontrado (404)
 * @param {Object} error - Objeto de error procesado por handleApiError
 * @returns {boolean} - True si es un error de no encontrado
 */
export const isNotFoundError = (error) => {
  return error && error.codigo === 404;
};

/**
 * Determina si un error es un error del servidor (500)
 * @param {Object} error - Objeto de error procesado por handleApiError
 * @returns {boolean} - True si es un error del servidor
 */
export const isServerError = (error) => {
  return error && error.codigo >= 500;
};