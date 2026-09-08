# OxYda2 — Design Context

Ruta: `/oxyda2/DESIGN.md`

## Overview

Creative North Star: **Dark Instrument Panel**.

OxYda2 debe sentirse como una herramienta cognitiva adulta: precisa, sobria, táctil y ligeramente técnica, pero no futurista.

La interfaz usa oscuridad sólida, jerarquía tipográfica fuerte, números muy legibles y un acento cálido que recuerda sutilmente al óxido sin convertir la marca en una metáfora literal.

Evitar estética escolar, infantil, gaming, cyberpunk o dashboard SaaS genérico.

Impeccable debe leer `PRODUCT.md` y este archivo antes de proponer nuevas superficies.

## Colors

Paleta canónica:

- Background / Surface: `#0b0b0f`
- Ink: `#e6e6e6`
- Accent: `#f9b98c`
- Success / Diff added: `#40c977`
- Error / Diff removed: `#fa423e`
- Skill / Information: `#479ffa`

Superficies auxiliares permitidas:

- Surface raised: `#121218`
- Surface strong: `#191920`
- Border: `#2b2b34`
- Muted text: `#9898a3`

Reglas:

- colores sólidos;
- sin gradientes;
- sin glassmorphism;
- no usar transparencia como recurso decorativo dominante;
- success, error y skill son semánticos, no decorativos;
- no usar color como única señal de estado;
- el accent principal se reserva para acción, foco y elementos de identidad;
- mantener contraste alto sobre `#0b0b0f`.

Tema origen:

- accent `#f9b98c`
- ink `#e6e6e6`
- surface `#0b0b0f`
- contrast 60
- opaque windows true
- semantic diff added `#40c977`
- semantic diff removed `#fa423e`
- semantic skill `#479ffa`

## Typography

Objetivo: legibilidad adulta, claridad numérica y contraste entre interfaz y contenido matemático.

Dirección:

- Sans variable moderna para UI y titulares.
- Monoespaciada legible para fórmulas, relaciones, valores comparados y bloques de debug.
- No usar fuentes display decorativas.

La implementación puede seleccionar una pareja open-source estable, localizable vía paquete, siempre que:

- no requiera requests a Google Fonts en runtime;
- tenga números claramente distinguibles;
- soporte español;
- mantenga buena lectura móvil;
- quede documentada aquí después de implementarla.

Jerarquía:

Pareja implementada en v0.1: **Inter Variable** para interfaz y titulares, y
**JetBrains Mono Variable** para fórmulas y valores. Se sirven localmente desde
los paquetes `@fontsource-variable/inter` y `@fontsource-variable/jetbrains-mono`,
sin solicitudes de fuentes externas durante el uso.

- H1 corto y contundente.
- H2 funcional.
- Texto de explicación entre 16 y 18px en móvil cuando corresponda.
- Los números relevantes pueden crecer más que el texto, pero no convertirse en "metric cards" decorativas.
- Fórmulas siempre con respiración suficiente.

## Elevation

Flat by default.

Jerarquía mediante:

- cambio de superficie;
- borde;
- espacio;
- contraste;
- escala tipográfica.

No usar sombras ambientales grandes.

Una sombra muy contenida solo es aceptable si comunica estado flotante real, como diálogo o popover.

Radio:

- radio moderado, máximo aproximado de 10px en superficies;
- evitar cards infladas y pills para todo;
- pills solo para estados pequeños cuando sean semánticamente adecuadas.

## Components

### Brand

Nombre textual: `OxYda2`.

Marca secundaria posible: `O × Y = 2`.

La marca secundaria nunca debe ser el único nombre accesible.

### Action card

Bloque navegable para Inicio.

Debe contener:

- título;
- descripción breve;
- Lucide Animated icon;
- affordance clara.

Interacción:

- al hacer hover o `focus-within` sobre toda la card, se activa la animación del icono;
- no exigir hover para entender el componente;
- respetar reduced motion.

### Challenge surface

El problema es el protagonista.

Prioridades visuales:

1. contexto;
2. pregunta actual;
3. opciones/input;
4. acción;
5. feedback.

No mostrar simultáneamente todas las etapas del desafío.

### Choice

- área táctil amplia;
- selección evidente;
- correcto/incorrecto con texto + icono + color;
- no mover el layout bruscamente al responder.

### Numeric input

- `inputMode` adecuado;
- etiqueta visible;
- aceptar coma o punto decimal cuando corresponda;
- no depender de `type="number"` si rompe entrada localizada.

### Feedback

Feedback corto primero.

Explicación ampliada solo cuando sea útil.

Usar `aria-live` para el mensaje que aparece después de evaluar.

### Skill status

Debe mostrar texto:

- Sólido
- Disponible
- En desarrollo
- Para refrescar
- Sin explorar

Puede acompañarse con color y barra, nunca solo con color.

### Debug block

Código/cálculo incorrecto dentro de superficie monoespaciada.

Debe parecer una pieza que se inspecciona, no una terminal hacker.

### Navigation

Desktop: navegación lateral o superior sobria según lo que mejor resuelva la composición final.

Mobile: navegación compacta que preserve acceso a:

- Inicio
- Aprender
- Recordar
- Poneme a prueba
- Mi mapa

No usar más de una navegación primaria simultánea.

### Motion

Movimiento funcional:

- iconos;
- focus/hover;
- feedback;
- transición entre pasos.

Duración orientativa:

- 140–220ms para microinteracciones.

Evitar:

- scroll effects;
- parallax;
- loops ornamentales;
- grandes entradas cinematográficas.

## Do's and Don'ts

### Do

- privilegiar claridad sobre decoración;
- dejar espacio alrededor de problemas;
- usar el accent cálido con moderación;
- usar tipografía y alineación para enseñar;
- hacer que números y unidades sean fáciles de comparar;
- diseñar mobile-first;
- usar iconografía Lucide Animated solo donde aporte orientación;
- activar la animación desde la superficie padre cuando corresponda;
- usar Impeccable para `shape`, `critique`, `audit` y `polish` una vez exista una superficie real;
- mantener PRODUCT.md y DESIGN.md como fuente de verdad.

### Don't

- no gradients;
- no glassmorphism;
- no fondos con ruido decorativo;
- no brillos neon;
- no tarjetas dentro de tarjetas sin necesidad;
- no emojis como sistema de iconografía;
- no mascota;
- no trofeos;
- no gamificación infantil;
- no paneles de métricas por llenar espacio;
- no copiar visualmente otra aplicación;
- no usar una web externa como referencia de diseño durante la primera implementación.
