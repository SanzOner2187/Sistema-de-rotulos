# Sistema de Rótulos - Alcaldía Municipal de Palermo

Sistema web para la gestión y generación de rótulos de archivo (cajas y carpetas) con generación automática de PDFs según los formatos FOR-GF-19 y FOR-GP-18.

## Descripción

Aplicación desarrollada para la Alcaldía Municipal de Palermo que permite crear, editar y gestionar rótulos de archivo tanto para cajas como para carpetas. El sistema mantiene un consecutivo automático, almacena los datos localmente y genera PDFs listos para imprimir según los estándares documentales.

## Características Principales

### Home/Dashboard
- Vista general con estadísticas de ambos tipos de rótulos
- Visualización de consecutivos actuales (Caja y Carpeta)
- Contador de rótulos creados para cada tipo
- Opciones para limpiar datos y restablecer consecutivos
- Navegación rápida a los formularios correspondientes

### Rótulo de Caja (FOR-GF-19)
- Gestión de múltiples contenidos por caja (máx. 20)
- Campos: Código Serie/Subserie, Nombre Serie/Subserie
- Seguimiento de fechas extremas generales
- Numeración automática de caja (consecutivo)
- Límite: 20 rótulos de caja simultáneos

### Rótulo de Carpeta (FOR-GP-18)
- Gestión de múltiples carpetas por rótulo (máx. 20)
- Campos: Nombre Serie, Nombre Subserie, Asunto, No. Folios, No. Carpeta, Fechas Extremas, No. Caja
- Ubicación automática de carpeta (consecutivo)
- Límite: 20 rótulos de carpeta simultáneos

## Funcionalidades

### Acciones Generales
- **Guardar Rótulo**: Almacena el rótulo en localStorage
- **Limpiar Formulario**: Resetea todos los campos (deshabilitado en modo edición)
- **Descargar PDF**: Genera y descarga el PDF del rótulo actual
- **Imprimir**: Abre el cuadro de diálogo de impresión con el PDF
- **Descargar Todos**: Genera PDFs de todos los rótulos guardados y limpia el almacenamiento

### Modo Edición
- **Editar**: Carga un rótulo guardado para modificarlo
- **Cancelar Edición**: Sale del modo edición y limpia el formulario
- **Actualizar Rótulo**: Guarda los cambios realizados

### Gestión de Rótulos Guardados
- **Ver/Ocultar Lista**: Muestra u oculta los rótulos guardados
- **Editar**: Modifica un rótulo existente
- **Imprimir**: Imprime directamente un rótulo guardado
- **Descargar PDF**: Descarga el PDF de un rótulo específico
- **Eliminar**: Borra permanentemente un rótulo (con confirmación)

## Almacenamiento Local

El sistema utiliza localStorage para persistir los datos:

```javascript
// Rótulos guardados
const rotulosCarpeta = JSON.parse(localStorage.getItem("rotulosCarpeta")) || [];
const rotulosCaja = JSON.parse(localStorage.getItem("rotulosCaja")) || [];

// Consecutivos
const consecutivoCarpeta = localStorage.getItem("consecutivoCarpeta") || 0;
const consecutivoCaja = localStorage.getItem("consecutivoCaja") || 0;
```

## Tecnologías Utilizadas

### Core
- **React 19.1.1** - Biblioteca principal
- **React Router DOM 7.9.3** - Enrutamiento
- **Vite 7.1.7** - Build tool y dev server

### Generación de PDFs
- **jsPDF 3.0.3** - Generación de documentos PDF
- **html2canvas 1.4.1** - Captura de componentes HTML
- **jspdf-autotable 5.0.2** - Tablas en PDF

### UI/UX
- **SweetAlert2 11.23.0** - Alertas y modales elegantes
- **sweetalert2-react-content 5.1.0** - Integración con React
- **Lucide React 0.544.0** - Iconos SVG
- **React Toastify 11.0.5** - Notificaciones toast

### Formularios y Validación
- **React Hook Form 7.63.0** - Manejo de formularios
- **React Datepicker 8.7.0** - Selector de fechas

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/SanzOner2187/Sistema-de-rotulos
cd sistema-rotulos
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
```

5. Previsualizar build de producción:
```bash
npm run preview
```

## Scripts Disponibles

```json
{
  "dev": "vite",           // Inicia servidor de desarrollo
  "build": "vite build",   // Construye para producción
  "lint": "eslint .",      // Ejecuta el linter
  "preview": "vite preview" // Previsualiza el build
}
```

## Estructura del Proyecto

```
sistema-rotulos/
├── node_modules/
├── public/
│   ├── Alcaldia_palermo_logo.png
│   └── folder.webp
├── src/
│   ├── components/
│   │   ├── Caja/
│   │   │   ├── RotuloCaja.js
│   │   │   ├── RotuloCaja.jsx
│   │   │   └── RotuloCajaPdf.jsx
│   │   └── Carpeta/
│   │       ├── RotuloCarpeta.js
│   │       ├── RotuloCarpeta.jsx
│   │       └── RotuloCarpetaPdf.jsx
│   ├── Home.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

## Validaciones

### Rótulo de Caja
- Fecha requerida
- Sección y Subsección requeridas
- Al menos un contenido con Código y Nombre de Serie
- Fechas extremas requeridas y válidas (inicial ≤ final)

### Rótulo de Carpeta
- Fecha requerida
- Al menos una carpeta con todos sus campos completos
- Nombre Serie, Subserie y Asunto requeridos
- Números de Folios y Carpeta mayores a 0
- Fechas extremas válidas por carpeta
- Número de Caja requerido

## Límites del Sistema

- Máximo 20 contenidos por rótulo de caja
- Máximo 20 carpetas por rótulo de carpeta
- Máximo 20 rótulos guardados por tipo
- Los datos se almacenan en localStorage (límite del navegador ~5-10MB)

## Notas Importantes

1. **Consecutivos**: Los consecutivos se mantienen incluso después de eliminar rótulos individuales. Solo se reinician al usar "Descargar Todos" o "Limpiar Datos".

2. **Modo Edición**: Al editar un rótulo, no se puede crear uno nuevo ni limpiar el formulario hasta cancelar o guardar los cambios.

3. **PDFs**: Los PDFs se generan con el logo de la alcaldía.

4. **Navegadores**: Funciona mejor en navegadores modernos (Chrome, Firefox, Edge, Safari).

---

**Versión**: 1.0  
**Última actualización**: 2025

---
| Desarrollador | GitHub | LinkedIn |
|--------------|---------|----------|
| Santiago Sanchez | [@Sanz](https://github.com/SanzOner2187) | [Perfil](www.linkedin.com/in/santigo-sanchez) |