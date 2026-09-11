# Changelog

Cambios relevantes de OxYda2. El formato sigue una versión simplificada de
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y usa versiones
SemVer.

## [Unreleased]

Todavía no hay cambios publicados para la próxima versión.

## [0.1.4] - 2026-09-11

### Interfaz y navegación

- Acceso directo al catálogo completo de desafíos desde la home y las rutas
  relacionadas.
- Encabezados compartidos para las secciones internas, con una geometría
  consistente entre páginas.
- Familias de desafíos desplegables, con todos los ejercicios disponibles y
  sin scrolls internos que oculten contenido.
- Acciones de respuesta y pistas con etiquetas visibles para mejorar su
  descubrimiento y uso con teclado.
- Estados de progreso y diagnóstico unificados bajo el estado «Sin explorar».

### Identidad y recursos visuales

- Reemplazo de las ilustraciones del sitio por la nueva serie de imágenes del
  producto.
- Incorporación de la ilustración de Unidades en su página de familia.
- Actualización del monograma, favicon y Apple Touch Icon con variantes
  optimizadas para cada tamaño.
- Generación de variantes responsive de 320 y 640 píxeles para las
  ilustraciones.

## [0.1.1] - 2026-09-09

### Interfaz

- Unificación del shell, los anchos de contenido y las superficies principales.
- Ajustes de líneas, cajas discontinuas, continuidad y diagnóstico para
  mantener la composición editorial del producto.
- Navegación con transiciones de vista de Astro.
- Corrección de iconos animados basada en el registry oficial de Lucide
  Animated, incluyendo flechas y el icono de inicio.
- Corrección del layout de los desafíos relacionados en las páginas de familia.

### Documentación

- Creación del README con instalación, rutas, arquitectura y alcance real.
- Creación de este changelog.
- Retiro de documentación interna de ejecución que no describe el producto
  público.
- Sincronización de la ruta de desafío y de las transiciones de navegación en
  la documentación de arquitectura.
- Instrucciones de despliegue estático para Hostinger y el subdominio de
  producción.

### Despliegue

- Configuración de `https://oxydados.muga.dev` como URL de producción de Astro.
- Canonical por página y `robots.txt` básico para la salida estática.

## [0.1.0] - 2026-09-08

### Añadido

- Primera versión funcional de OxYda2 como aplicación estática y local-first.
- Primera apertura con desafío guiado de comparación de descuentos.
- Cinco familias de aprendizaje y 20 desafíos semilla tipados.
- Diez fichas de consulta rápida en Recordar.
- Diagnóstico de ocho situaciones en Poneme a prueba.
- Mapa de progreso con dominio, frescura y evidencia de errores.
- Persistencia versionada en `localStorage` mediante `oxyda2:state:v1`.
- Tests de dominio, aplicación, diagnóstico, catálogo y persistencia.
- Sistema visual oscuro con fuentes locales e iconografía animada.

[Unreleased]: https://github.com/muga-system/oxyda2/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/muga-system/oxyda2/releases/tag/v0.1.4
[0.1.0]: https://github.com/muga-system/oxyda2/releases/tag/v0.1.0
