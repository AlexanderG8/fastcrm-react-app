# FastCRM - Aplicación de Gestión de Contactos

FastCRM es una aplicación web para la gestión de contactos, empresas y comunicaciones, diseñada para facilitar el seguimiento de interacciones con clientes y prospectos.

## Tecnologías Utilizadas

- **React 19**: Framework de JavaScript para la construcción de interfaces de usuario
- **Vite 7**: Herramienta de construcción que proporciona un entorno de desarrollo más rápido
- **React Router 7**: Biblioteca para la navegación entre páginas en aplicaciones React
- **Tailwind CSS 4**: Framework de CSS utilitario para diseño rápido y responsivo
- **React Toastify 11**: Biblioteca para mostrar notificaciones elegantes
- **PropTypes**: Validación de tipos para las props de los componentes

## Instrucciones de Instalación Local

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd fastcrm-react-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`
   - Configurar la URL de la API y otras variables necesarias

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   - Abrir el navegador en `http://localhost:5173`

## Funcionalidades Implementadas

### Gestión de Contactos
- Listado, creación, edición y eliminación de contactos
- Búsqueda y filtrado de contactos
- Asociación de contactos con empresas

### Gestión de Empresas
- Registro y administración de empresas
- Visualización de contactos asociados a cada empresa

### Plantillas de Mensajes
- Creación y gestión de plantillas para comunicaciones
- Categorización por tipo de mensaje
- Vista previa de plantillas

### Registro de Comunicaciones
- Registro de interacciones con contactos
- Selección de plantillas para comunicaciones
- Historial completo de comunicaciones con filtrado por fecha
- Integración directa desde la vista de contactos

### Interfaz de Usuario
- Diseño responsivo con Tailwind CSS
- Navegación intuitiva entre secciones
- Notificaciones para acciones del usuario
- Modales para formularios y confirmaciones

## Decisiones Técnicas Clave

1. **Arquitectura de Componentes**
   - Separación clara entre páginas y componentes reutilizables
   - Componentes de formulario independientes para facilitar mantenimiento

2. **Gestión de Estado**
   - Estado local con React Hooks para componentes individuales
   - Servicios centralizados para operaciones de API

3. **Manejo de Errores**
   - Sistema centralizado de manejo de errores
   - Notificaciones visuales para errores y operaciones exitosas

4. **Experiencia de Usuario**
   - Formularios modales para mantener el contexto del usuario
   - Confirmaciones para acciones destructivas
   - Integración fluida entre diferentes funcionalidades (contactos, plantillas, comunicaciones)

5. **Optimización de Rendimiento**
   - Carga bajo demanda de datos
   - Filtrado en cliente para respuesta inmediata

## Enlaces

- **Repositorio**: [GitHub](https://github.com/usuario/fastcrm-react-app)
- **Demo en vivo**: [https://fastcrm-demo.netlify.app](https://fastcrm-demo.netlify.app)

