# OxYda2 — handoff para Astra

Ruta: `/oxyda2/ASTRA_HANDOFF.md`

Implementá OxYda2 v0.1 a partir de la documentación de este repositorio.

## Antes de escribir código

Leé completamente y en este orden:

1. `PRODUCT.md`
2. `DESIGN.md`
3. `docs/00-architecture.md`
4. `docs/01-v1.md`
5. `AGENTS.md`

Estas decisiones están cerradas para v0.1.

No conviertas la tarea en una fase nueva de discovery.

No generes documentación adicional salvo que una decisión técnica nueva realmente lo requiera.

## Objetivo de esta sesión

Entregar una primera versión funcional y coherente, no un prototipo visual vacío.

Prioridad:

1. scaffold técnico correcto;
2. dominio y motor de desafíos;
3. persistencia local versionada;
4. contenido semilla;
5. experiencia de primera apertura;
6. rutas principales;
7. diagnóstico;
8. mapa;
9. sistema visual;
10. tests y verificación.

## Restricciones

- pnpm únicamente;
- Astro;
- TypeScript strict/strictest;
- Tailwind CSS v4;
- React solo como islas;
- Lucide Animated según DESIGN.md;
- Impeccable según PRODUCT.md + DESIGN.md;
- no backend;
- no auth;
- no API externa;
- no IA runtime;
- no shadcn/ui como sistema de componentes;
- no navegación web para buscar inspiración;
- no copiar otro sitio;
- no modificar el alcance;
- no añadir gamificación.

## Uso de navegador

Durante el grueso de la implementación no uses browser/computer-use para inspeccionar visualmente cada cambio.

Trabajá desde el código y verificaciones locales.

Al final de la primera implementación, realizá una única revisión visual consolidada de las rutas principales y corregí problemas reales.

## Orden técnico recomendado

### 1. Bootstrap

- crear Astro con pnpm;
- configurar TS estricto;
- configurar Tailwind v4 con Vite;
- integrar React;
- configurar Prettier/Astro;
- configurar Vitest;
- preparar Impeccable;
- crear tokens visuales.

### 2. Dominio

Implementar:

- Challenge;
- ChallengeStep;
- AnswerSpec;
- Evidence;
- Skill;
- mastery;
- freshness;
- display state;
- evaluadores;
- normalización numérica.

Cubrir con tests antes de UI compleja.

### 3. Persistence

- repository boundary;
- localStorage adapter;
- `oxyda2:state:v1`;
- parsing seguro;
- schemaVersion;
- fallback/migration.

### 4. Content

Crear catálogo tipado:

- skills;
- 20 desafíos;
- 10 fichas Recall;
- selección de 8 desafíos diagnósticos.

No generar datos al azar.

### 5. UI

Construir las rutas definidas.

Usar Astro para superficies estáticas y React solo para interacción.

### 6. Design

Aplicar DESIGN.md.

Lucide Animated:

- instalar solo iconos necesarios;
- animar icono al hover/focus de la card padre;
- reduced motion.

No convertir la aplicación en una demo de animaciones.

### 7. Review

Ejecutar:

- `pnpm check`
- `pnpm test`
- `pnpm format:check`
- `pnpm build`

Después hacer revisión visual consolidada y corregir.

## Criterio de autonomía

Podés tomar decisiones menores de implementación siempre que:

- respeten los límites de arquitectura;
- no cambien producto;
- no cambien pedagogía;
- no agreguen dependencias grandes;
- no expandan alcance.

Si dos implementaciones son equivalentes, elegí la más simple y testeable.

## Resultado esperado

Al final debe existir una aplicación usable que permita completar de punta a punta:

primera visita → primer desafío → inicio → aprender/recordar/prueba → mi mapa → cerrar/reabrir → progreso conservado.
