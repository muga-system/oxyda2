# OxYda2

**Matemática para pensar, no solamente para calcular.**

OxYda2 es una aplicación web estática, responsive y local-first para recuperar
conocimientos matemáticos útiles a través de situaciones cotidianas. La
aplicación guía al usuario para reconocer una relación, estimar un resultado,
resolver cuando hace falta, verificarlo y decidir qué significa.

## Qué incluye

- Primera visita con un desafío guiado de comparación de descuentos.
- Cinco familias para aprender: porcentajes, proporciones, estimación, unidades
  y datos.
- 20 desafíos tipados con pasos de reconocimiento, estimación, cálculo,
  depuración, comparación, inversión y decisión.
- 10 fichas de consulta rápida en **Recordar**.
- Diagnóstico inicial de 8 situaciones breves en **Poneme a prueba**.
- **Mi mapa**, con dominio, frescura y errores recurrentes por habilidad.
- Progreso persistido en el navegador mediante `oxyda2:state:v1`.
- Navegación en español y transiciones de vista de Astro sin convertir la
  aplicación en una SPA.

La aplicación no requiere cuenta, backend, base de datos, APIs externas ni
conexión permanente después de cargar sus recursos. El progreso queda en el
navegador donde se utiliza.

## Rutas

| Ruta                | Propósito                                               |
| ------------------- | ------------------------------------------------------- |
| `/`                 | Primera visita, desafío destacado y accesos principales |
| `/aprender`         | Índice de las cinco familias matemáticas                |
| `/aprender/[skill]` | Conceptos, estados y desafíos de una familia            |
| `/recordar`         | Búsqueda y consulta rápida de relaciones matemáticas    |
| `/prueba`           | Diagnóstico inicial de ocho situaciones                 |
| `/mapa`             | Estado personal de las habilidades practicadas          |
| `/desafio/[slug]`   | Resolución guiada de un desafío                         |

## Stack

- [Astro](https://astro.build/) para páginas, layout y contenido estático.
- TypeScript estricto.
- React únicamente en islas con interacción real.
- Tailwind CSS v4 mediante `@tailwindcss/vite`.
- Motion para controlar las animaciones de los iconos de Lucide Animated.
- Inter Variable y JetBrains Mono Variable servidas localmente.
- Vitest para las pruebas de dominio y aplicación.

## Arquitectura

El dominio contiene tipos, evaluación, scoring, dominio, frescura y composición
del estado. La capa de aplicación registra evidencia y coordina los casos de
uso. La infraestructura implementa el repositorio versionado de
`localStorage`. La interfaz combina páginas Astro con islas React pequeñas.

El dominio no conoce Astro, React, el DOM ni `localStorage`. La persistencia se
lee una vez por operación del repositorio, valida `schemaVersion` y conserva
datos incompatibles sin reemplazarlos silenciosamente.

La navegación usa `ClientRouter` de `astro:transitions` desde el layout común.
Esto mantiene las transiciones suaves entre páginas estáticas y preserva el
acceso directo a cada ruta.

## Desarrollo local

Requiere `pnpm`.

```bash
pnpm install
pnpm dev
```

Para comprobar el estado del proyecto:

```bash
pnpm check
pnpm test
pnpm format:check
pnpm build
```

El build genera una salida estática en `dist/`.

## Despliegue en Hostinger

El dominio de producción configurado es `https://oxydados.muga.dev`. Para
publicar la aplicación:

1. Creá el subdominio en Hostinger y asignale su document root.
2. Ejecutá `pnpm build` en este repositorio.
3. Subí **el contenido de `dist/`** al document root del subdominio, incluidos
   `404.html`, `favicon.svg`, `robots.txt`, las carpetas de cada ruta y
   `_astro/`.
4. No subas `src/`, `node_modules/` ni el repositorio completo al document root.

La salida incluye `index.html` dentro de cada ruta, de modo que las páginas
funcionan como archivos estáticos independientes y se pueden abrir directamente
desde sus URLs públicas.

## Diseño e iconografía

La dirección visual es **Dark Instrument Panel**: superficies oscuras sólidas,
jerarquía tipográfica fuerte, números legibles, bordes sobrios y un acento
cálido. No se usan gradientes, glassmorphism ni gamificación.

Los iconos animados se basan en el registry de
[Lucide Animated](https://lucide-animated.com/) y se adaptan a las necesidades
de las islas React de OxYda2. La atribución y licencia MIT están disponibles en
[`public/licenses/lucide-animated.txt`](public/licenses/lucide-animated.txt).

## Documentación del proyecto

- [`PRODUCT.md`](PRODUCT.md): producto, pedagogía, voz y límites de v0.1.
- [`DESIGN.md`](DESIGN.md): sistema visual, componentes, accesibilidad y
  movimiento.
- [`docs/00-architecture.md`](docs/00-architecture.md): límites de capas,
  persistencia y decisiones técnicas.
- [`docs/01-v1.md`](docs/01-v1.md): alcance funcional y catálogo inicial.
- [`AGENTS.md`](AGENTS.md): reglas para mantener el proyecto.
- [`CHANGELOG.md`](CHANGELOG.md): cambios relevantes por versión.

## Alcance deliberado

OxYda2 v0.1 no incluye autenticación, sincronización en la nube, IA en runtime,
editor de desafíos, panel administrativo, rankings, XP, monedas, streaks ni
otras mecánicas de gamificación. El contenido es estático, tipado y revisable
en el repositorio.
