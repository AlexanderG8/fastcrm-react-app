# Documentación para Frontend - FastCRM API

Esta documentación proporciona información detallada sobre los modelos y endpoints disponibles en la API de FastCRM para su consumo desde el frontend.

## URL Base

```
http://localhost:3000
```

## Modelos de Datos

### Modelo: Contact

```typescript
interface Contact {
  id: number;
  name: string;
  whatsapp: string;
  createAt: string; // Formato ISO Date
  companyId: number | null;
  company?: Company;
  logs?: ContactLog[];
}
```

### Modelo: Company

```typescript
interface Company {
  id: number;
  name: string;
  ruc: string;
  createAt: string; // Formato ISO Date
  contacts?: Contact[];
}
```

### Modelo: ContactLog

```typescript
interface ContactLog {
  id: number;
  date: string; // Formato ISO Date
  templateUsed: string;
  notes: string | null;
  contactId: number;
  contact?: Contact;
}
```

### Modelo: Template

```typescript
interface Template {
  _id: string;
  name: string;
  content: string;
  type: 'welcome' | 'seguimiento' | 'bienvenida' | 'cierre' | 'notificaciones';
  createdAt: string; // Formato ISO Date
}
```

## Endpoints API

### Contactos

| Método | Endpoint | Descripción | Parámetros | Cuerpo de la Solicitud | Respuesta |
|--------|----------|-------------|------------|------------------------|-----------|
| GET | `/api/contacts` | Obtener todos los contactos | - | - | `{ contacs: Contact[] }` |
| GET | `/api/contacts/:id` | Obtener un contacto por ID | `id`: ID del contacto | - | `Contact` |
| POST | `/api/contacts` | Crear un nuevo contacto | - | `{ name: string, whatsapp: string, companyId?: number }` | `{ message: string, contact: Contact }` |
| PUT | `/api/contacts/:id` | Actualizar un contacto | `id`: ID del contacto | `{ name?: string, whatsapp?: string, companyId?: number }` | `{ message: string, contact: Contact }` |
| DELETE | `/api/contacts/:id` | Eliminar un contacto | `id`: ID del contacto | - | `{ message: string }` |

### Empresas

| Método | Endpoint | Descripción | Parámetros | Cuerpo de la Solicitud | Respuesta |
|--------|----------|-------------|------------|------------------------|-----------|
| GET | `/api/companies` | Obtener todas las empresas | - | - | `{ companies: Company[] }` |
| GET | `/api/companies/:id` | Obtener una empresa por ID | `id`: ID de la empresa | - | `Company` |
| POST | `/api/companies` | Crear una nueva empresa | - | `{ name: string, ruc: string }` | `{ message: string, company: Company }` |
| PUT | `/api/companies/:id` | Actualizar una empresa | `id`: ID de la empresa | `{ name?: string, ruc?: string }` | `{ message: string, company: Company }` |
| DELETE | `/api/companies/:id` | Eliminar una empresa | `id`: ID de la empresa | - | `{ message: string }` |

### Plantillas

| Método | Endpoint | Descripción | Parámetros | Cuerpo de la Solicitud | Respuesta |
|--------|----------|-------------|------------|------------------------|-----------|
| GET | `/api/templates` | Obtener todas las plantillas | `q?`: Búsqueda por contenido<br>`type?`: Filtro por tipo | - | `Template[]` |
| GET | `/api/templates/:id` | Obtener una plantilla por ID | `id`: ID de la plantilla | - | `Template` |
| POST | `/api/templates` | Crear una nueva plantilla | - | `{ name: string, content: string, type?: string }` | `Template` |
| PUT | `/api/templates/:id` | Actualizar una plantilla | `id`: ID de la plantilla | `{ name?: string, content?: string, type?: string }` | `Template` |
| DELETE | `/api/templates/:id` | Eliminar una plantilla | `id`: ID de la plantilla | - | `{ message: string }` |

### Registros de Contacto

| Método | Endpoint | Descripción | Parámetros | Cuerpo de la Solicitud | Respuesta |
|--------|----------|-------------|------------|------------------------|-----------|
| GET | `/api/contactlogs` | Obtener todos los registros | - | - | `ContactLog[]` |
| GET | `/api/contactlogs/:id` | Obtener un registro por ID | `id`: ID del registro | - | `ContactLog` |
| POST | `/api/contactlogs` | Crear un nuevo registro | - | `{ contactId: number, templateUsed: string, notes?: string }` | `ContactLog` |
| PUT | `/api/contactlogs/:id` | Actualizar un registro | `id`: ID del registro | `{ templateUsed?: string, notes?: string }` | `ContactLog` |
| DELETE | `/api/contactlogs/:id` | Eliminar un registro | `id`: ID del registro | - | `{ message: string }` |
| GET | `/api/contacts/:contactId/logs` | Obtener registros por contacto | `contactId`: ID del contacto | - | `ContactLog[]` |

## Ejemplos de Uso

### Obtener todos los contactos

```javascript
// Usando fetch
fetch('http://localhost:3000/api/contacts')
  .then(response => response.json())
  .then(data => console.log(data.contacs))
  .catch(error => console.error('Error:', error));

// Usando axios
axios.get('http://localhost:3000/api/contacts')
  .then(response => console.log(response.data.contacs))
  .catch(error => console.error('Error:', error));
```

### Crear un nuevo contacto

```javascript
// Usando fetch
fetch('http://localhost:3000/api/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Juan Pérez',
    whatsapp: '+51987654321',
    companyId: 1
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Usando axios
axios.post('http://localhost:3000/api/contacts', {
  name: 'Juan Pérez',
  whatsapp: '+51987654321',
  companyId: 1
})
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

### Obtener registros de contacto por contactId

```javascript
// Usando fetch
fetch('http://localhost:3000/api/contacts/1/logs')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Usando axios
axios.get('http://localhost:3000/api/contacts/1/logs')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
```

## Manejo de Errores

La API devuelve códigos de estado HTTP estándar:

- `200 OK`: La solicitud se completó con éxito
- `201 Created`: El recurso se creó correctamente
- `400 Bad Request`: Error en los datos enviados
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

Los errores incluyen un objeto JSON con detalles:

```json
{
  "error": "Mensaje de error",
  "details": "Información adicional sobre el error (opcional)"
}
```

## Documentación Interactiva

Para una documentación interactiva completa, visite:

```
http://localhost:3000/api-docs
```

Esta interfaz Swagger permite probar todos los endpoints directamente desde el navegador.