# FastCRM React App

## Descripción

FastCRM React App es una aplicación web desarrollada con React y Vite que permite gestionar plantillas de forma eficiente. La aplicación ofrece una interfaz de usuario moderna y responsive utilizando Tailwind CSS.

## Características

### Gestión de Plantillas
- **Crear plantillas**: Formulario intuitivo para crear nuevas plantillas con título y contenido.
- **Listar plantillas**: Visualización de todas las plantillas en una tabla ordenada.
- **Actualizar plantillas**: Edición de plantillas existentes mediante un formulario pre-rellenado.
- **Eliminar plantillas**: Eliminación de plantillas no deseadas con confirmación visual.

### Experiencia de Usuario Mejorada
- **Notificaciones Toast**: Implementación de react-toastify para proporcionar feedback visual inmediato en todas las operaciones CRUD:
  - Confirmación de creación exitosa
  - Confirmación de actualización exitosa
  - Confirmación de eliminación exitosa
  - Notificaciones de error en caso de fallos

- **Búsqueda de Plantillas**: 
  - Campo de búsqueda que permite filtrar plantillas por palabras clave en su contenido
  - Filtrado por tipo de mensaje (bienvenida, notificación, recordatorio, seguimiento, etc.)
  - Combinación de ambos filtros para búsquedas más precisas

## Tecnologías Utilizadas

- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **Vite**: Herramienta de compilación que proporciona un entorno de desarrollo más rápido
- **Tailwind CSS**: Framework CSS para diseño rápido y responsive
- **React Router**: Navegación entre páginas de la aplicación
- **React Toastify**: Sistema de notificaciones elegante y personalizable

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd fastcrm-react-app
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

## Estructura del Proyecto

```
├── public/              # Archivos estáticos
├── src/                 # Código fuente
│   ├── components/      # Componentes reutilizables
│   │   └── TemplateForm.jsx  # Formulario para crear/editar plantillas
│   ├── pages/           # Páginas de la aplicación
│   │   └── Templates.jsx     # Página principal de gestión de plantillas
│   ├── App.jsx          # Componente principal y configuración de rutas
│   ├── main.jsx         # Punto de entrada de la aplicación
│   └── index.css        # Estilos globales y configuración de Tailwind
├── .env                 # Variables de entorno
├── package.json         # Dependencias y scripts
└── vite.config.js       # Configuración de Vite
```

## Uso

### Gestión de Plantillas

1. **Crear una nueva plantilla**:
   - Haz clic en el botón "Nueva Plantilla"
   - Completa el formulario con título y contenido
   - Haz clic en "Guardar"
   - Recibirás una notificación de éxito

2. **Editar una plantilla existente**:
   - Haz clic en el botón de edición (ícono de lápiz) junto a la plantilla
   - Modifica los campos necesarios
   - Haz clic en "Actualizar"
   - Recibirás una notificación de éxito

3. **Eliminar una plantilla**:
   - Haz clic en el botón de eliminación (ícono de papelera) junto a la plantilla
   - Recibirás una notificación de éxito tras la eliminación

4. **Buscar plantillas**:
   - Utiliza el campo de búsqueda ubicado encima de la tabla de plantillas
   - Escribe el texto que deseas encontrar en el contenido de las plantillas
   - Selecciona un tipo de mensaje específico en el selector de tipo
   - La tabla se filtrará automáticamente mostrando solo las plantillas que coincidan con ambos criterios
   - Los filtros se aplican en tiempo real al API mediante los endpoints:
     - `/api/templates?q=palabra` para búsqueda por palabra clave
     - `/api/templates?type=welcome` para filtrado por tipo
     - `/api/templates?q=palabra&type=welcome` para combinar ambos filtros

## Desarrollo

### Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción localmente

### Extensión de Funcionalidades

Para añadir nuevas características a la aplicación, se recomienda seguir la estructura de componentes existente y utilizar las notificaciones toast para proporcionar feedback al usuario.

