# OxYda2 — Design Context

Ruta: `/oxyda2/DESIGN.md`

## Overview

Creative North Star: **Grilla**.

OxYda2 debe sentirse como una herramienta de precisión: negra, estructurada,
tipográfica y calma. La interfaz se ordena sobre una retícula visible de líneas
de 1px; cada sección es una celda con un rótulo monoespaciado. La identidad
propia la aportan las ilustraciones con grecas en tono durazno, que aparecen
sobre un fondo de puntos como piezas exhibidas.

Referencias de calidad (no de copia): herramientas de software sobrias y
precisas. Nada de estética escolar, infantil, gaming, cyberpunk ni dashboard
SaaS genérico.

Aprobado el 2026-10-05 a partir de las maquetas del canvas «OxYda2 — 3
direcciones de diseño» (dirección 3, Grilla). Reemplaza a «Dark Instrument
Panel».

Impeccable debe leer `PRODUCT.md` y este archivo antes de proponer nuevas superficies.

## Colors

Paleta canónica:

- Background: `#000000`
- Surface: `#0a0a0a` (bloques que se inspeccionan: ejemplos, registros, campos)
- Surface active: `#141414` (fila actual, elemento seleccionado)
- Line: `#1f1f1f` (retícula y separadores)
- Line strong: `#333333` (bordes de botones secundarios y controles)
- Ink: `#ededed`
- Ink soft: `#d4d4d4` (texto monoespaciado largo)
- Muted text: `#a1a1a1`
- Muted mark: `#555555` (solo marcas no textuales: ○, puntos vacíos)
- Accent: `#f9b98c` (durazno de las ilustraciones)
- Success: `#4cc38a`
- Error: `#fa423e`

Reglas:

- colores sólidos;
- sin gradientes de color ni glassmorphism;
- la única textura permitida es la retícula de puntos (`#1a1a1a`, paso 20px)
  detrás de ilustraciones y del espacio de trabajo del desafío;
- el accent se reserva para foco, selección, el paso actual y el estado
  «Para refrescar»; las acciones primarias usan Ink sobre negro;
- success y error son semánticos, nunca decorativos;
- no usar color como única señal de estado: siempre texto y/o símbolo
  (✓ ● ○ ↻);
- mantener contraste AA: Muted `#a1a1a1` sobre negro es el gris mínimo para texto.

## Typography

Pareja implementada: **Geist Variable** para interfaz y titulares, y
**Geist Mono Variable** para rótulos, números, fórmulas y registros. Se sirven
localmente desde `@fontsource-variable/geist` y
`@fontsource-variable/geist-mono`, sin solicitudes externas.

Jerarquía:

- H1: 700, tracking `-0.05em`, interlineado 1–1.05, entre 34 y 66px.
- H2 de sección: 700, tracking `-0.04em`, ~30–32px.
- Rótulo de sección: Geist Mono 12px, Muted, con forma `01 — Nombre`.
- Texto base 15–16px; explicaciones 16–18px en móvil cuando corresponda.
- Números relevantes en Geist Mono; pueden crecer (p. ej. `08` del diagnóstico)
  sin convertirse en metric cards decorativas.
- Fórmulas y ejemplos en Geist Mono dentro de un bloque Surface con borde.

## Layout

- Contenedor máximo 1200px con bordes laterales de 1px: la página es una
  columna enmarcada.
- Desde 900px, todas las secciones comparten **una retícula de 5 columnas
  iguales** (`--grid`), para que las líneas verticales coincidan entre
  secciones. Repartos permitidos: introducción 2 + contenido 3, texto 3 +
  ilustración 2, rótulo 1 + 4 celdas, o 5 celdas de 1. No usar anchos fijos
  ni `auto-fit` para dividir una sección.
- Bajo 900px las secciones se apilan en una columna; las grillas de celdas
  (familias, accesos, totales) pasan a 2 columnas.
- Las celdas dibujan sus bordes sin márgenes negativos, para no correr las
  líneas 1px.
- Marcas en cruz (`+`) pueden señalar intersecciones de la retícula en el hero.
- Mobile-first: nada depende de hover ni de anchos fijos.

## Elevation

Plano. Jerarquía mediante línea, cambio de superficie, espacio y escala
tipográfica. Sin sombras, salvo el diálogo modal (estado flotante real).

Radio:

- 8–10px en bloques (ejemplos, campos, registros);
- pill (`999px`) solo para botones y chips de estado;
- la retícula y las celdas no tienen radio.

## Components

### Brand

Nombre textual: `OxYda2`, siempre visible junto al monograma ilustrado.
Marca secundaria posible: `O × Y = 2`. Nunca es el único nombre accesible.

### Illustrations

Las ilustraciones con grecas (`public/hero`, `public/learning`, `public/recall`,
`public/diagnostic`, `public/map`, `public/brand`) son la voz visual. Se
muestran sobre fondo de puntos o junto a títulos; no se recortan, no se
colorean y no se reemplazan por iconos genéricos.

### Buttons

- Primario: pill Ink (`#ededed`) con texto negro, 600.
- Secundario: pill transparente con borde Line strong.
- Texto: enlace Muted que pasa a Ink en hover/foco.
- Altura mínima 44px.

### Status chip

Pill con borde Line, punto de 6px y texto. El punto se llena según el estado;
«Para refrescar» usa Accent en punto y texto. Textos:

- Sólido
- Disponible
- En desarrollo
- Para refrescar
- Sin explorar

### Mastery meter

Tres segmentos de 4px: 0 sin explorar, 1 en desarrollo, 2 disponible,
3 sólido. Acompañado siempre de texto. En «Para refrescar» los segmentos usan Accent.

### Stage log

El desafío se presenta como un registro: ✓ etapa resuelta (Success),
● etapa actual (Accent, fila Surface active), ○ etapa pendiente. Cada fila
lleva el nombre de la etapa y una nota breve.

### Challenge surface

El problema es el protagonista. Columna lateral: situación, datos y registro.
Columna principal (con fondo de puntos): rótulo de etapa, consigna, respuesta,
acción y feedback. No mostrar simultáneamente todas las etapas.

### Choice

Filas amplias con borde, marcador ilustrado A/B/C, estado escrito
(«Elegida», «Correcta», «Para revisar»). Sin saltos de layout al responder.

### Numeric input

Campo grande en Geist Mono con prefijo/sufijo de unidad, `inputMode`
adecuado, etiqueta visible y ayuda sobre separadores.

### Feedback

Diálogo modal con encabezado (punto de estado + título breve) y cuerpo.
Usar `aria-live`/diálogo para anunciarlo. Feedback corto primero; explicación
ampliada solo cuando hace falta.

### Navigation

Encabezado único: marca a la izquierda, enlaces de texto a la derecha con
subrayado de 1px en la página actual. En móvil, un menú desplegable con
Inicio, Aprender, Recordar, Poneme a prueba y Mi mapa. Una sola navegación
primaria a la vez.

### Motion

Movimiento funcional (140–220ms): foco, hover, feedback, transición entre
pasos e iconos Lucide Animated en las tarjetas de acceso. Respetar
`prefers-reduced-motion`. Sin parallax, scroll effects ni loops ornamentales.

## Do's and Don'ts

### Do

- ordenar todo sobre la retícula;
- rotular cada sección con Geist Mono;
- dejar que las ilustraciones sean la única fuente de color de marca;
- usar el accent con moderación;
- hacer que números y unidades sean fáciles de comparar;
- diseñar mobile-first;
- mantener PRODUCT.md y DESIGN.md como fuente de verdad.

### Don't

- no gradientes de color, glassmorphism ni brillos neón;
- no sombras ambientales;
- no tarjetas dentro de tarjetas;
- no emojis como iconografía;
- no mascota, trofeos ni gamificación;
- no paneles de métricas por llenar espacio;
- no copiar visualmente otra aplicación.
