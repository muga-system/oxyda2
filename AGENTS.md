# OxYda2 — reglas para agentes

Ruta: `/oxyda2/AGENTS.md`

## Fuente de verdad

Antes de modificar código, leer en este orden:

1. `PRODUCT.md`
2. `DESIGN.md`
3. `docs/00-architecture.md`
4. `docs/01-v1.md`
5. `AGENTS.md`

Las decisiones documentadas están cerradas para v0.1. No rediseñar producto, arquitectura, pedagogía o identidad salvo contradicción técnica real.

## Stack obligatorio

- Astro.
- TypeScript en modo `strict` o `strictest`.
- Tailwind CSS v4 mediante `@tailwindcss/vite`.
- `pnpm` exclusivamente. No usar npm ni yarn.
- React únicamente para islas interactivas que realmente lo necesiten.
- `@astrojs/react` para hidratación React.
- Lucide Animated para la iconografía animada indicada en `DESIGN.md`.
- Motion únicamente como dependencia necesaria de la iconografía/animaciones aprobadas.
- Impeccable como contexto y control de diseño.
- Sin backend.
- Sin autenticación.
- Sin base de datos.
- Persistencia local en navegador.

## Reglas de implementación

- Arquitectura modular y feature-first.
- SOLID pragmático: abstraer donde exista una frontera real, no crear interfaces ceremoniales.
- El dominio no conoce Astro, React, DOM, `window` ni `localStorage`.
- Ningún componente accede directamente a `localStorage`.
- La persistencia entra mediante repositorios/adaptadores.
- Contenido matemático tipado en TypeScript.
- No usar `eval`, `Function`, parsers de expresiones arbitrarias ni ejecución dinámica de fórmulas.
- No introducir estado global si una isla puede resolver su estado localmente.
- No crear un Context de React gigante.
- No leer/parsear `localStorage` en cada render.
- Evitar cascadas de renderizado y referencias inestables.
- Evitar roundtrips o loops costosos repetidos. Aunque v0.1 no tenga base de datos, conservar esta regla arquitectónica.
- No incorporar dependencias que puedan resolverse con código pequeño y claro.
- No introducir shadcn/ui como sistema de componentes. Si Lucide Animated usa el registry de shadcn para copiar iconos, usarlo solo para esos iconos.
- Sin gradients, glassmorphism, neón decorativo ni "AI slop".
- No inventar gamificación: no XP, monedas, rankings, streaks, cofres, confeti ni avatares.
- No medir ni premiar velocidad de respuesta.
- Respetar `prefers-reduced-motion`.
- No comunicar estados únicamente mediante color.

## Trabajo con navegador

Durante la implementación inicial:

- No navegar por Internet para investigar referencias visuales.
- La documentación del repo es la fuente de verdad.
- No hacer ciclos continuos de cambio → navegador → captura → cambio.
- Verificar primero con herramientas locales.
- Hacer una revisión visual consolidada al final de la primera implementación.

Si una API de una dependencia instalada es incierta, consultar documentación oficial solo cuando sea estrictamente necesario.

## Verificación mínima antes de cerrar

Deben pasar:

- `pnpm check`
- `pnpm test`
- `pnpm format:check`
- `pnpm build`

Si se agrega lint, también `pnpm lint`.

No afirmar que algo funciona si alguno de estos comandos falla.

## Git

Usar Conventional Commits con descripción en español.

Ejemplos:

- `chore: inicializar base de OxYda2`
- `feat: implementar motor de desafíos`
- `feat: persistir progreso local`
- `style: definir sistema visual oscuro`
- `test: cubrir evaluación de respuestas`
- `docs: documentar alcance de la v0.1`

No hacer commits por microcambios sin valor. Agrupar cambios en unidades lógicas.

## Criterio de cierre v0.1

La versión es válida cuando una persona puede:

1. entrar por primera vez;
2. resolver el desafío guiado;
3. explorar las cinco familias matemáticas;
4. consultar una referencia rápida;
5. completar una prueba diagnóstica;
6. ver su mapa personal;
7. cerrar y volver a abrir el navegador conservando el progreso.
