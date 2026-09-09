# OxYda2 — arquitectura v0.1

Ruta: `/oxyda2/docs/00-architecture.md`

## Objetivo

Mantener una arquitectura modular, local-first y testeable sin sobrediseñar una aplicación pequeña.

Astro compone páginas y contenido estático.

React se usa solo en islas con estado interactivo real.

TypeScript contiene el dominio, reglas de evaluación, progreso y persistencia.

## Estructura objetivo

```text
/oxyda2
├── src
│   ├── pages
│   │   ├── index.astro
│   │   ├── aprender
│   │   ├── desafio
│   │   ├── mapa.astro
│   │   ├── prueba.astro
│   │   └── recordar.astro
│   ├── layouts
│   ├── components
│   │   ├── astro
│   │   └── react
│   ├── modules
│   │   ├── challenges
│   │   │   ├── domain
│   │   │   ├── application
│   │   │   ├── infrastructure
│   │   │   └── ui
│   │   ├── progress
│   │   │   ├── domain
│   │   │   ├── application
│   │   │   ├── infrastructure
│   │   │   └── ui
│   │   ├── learning
│   │   ├── recall
│   │   └── diagnostic
│   ├── content
│   │   ├── skills
│   │   ├── challenges
│   │   └── recall
│   ├── shared
│   │   ├── domain
│   │   ├── infrastructure
│   │   ├── ui
│   │   └── utils
│   └── styles
│       └── global.css
├── docs
│   ├── 00-architecture.md
│   └── 01-v1.md
├── AGENTS.md
├── PRODUCT.md
└── DESIGN.md
```

No es necesario crear carpetas vacías. Crear cada módulo cuando exista una responsabilidad concreta.

## Rutas de producto

Rutas visibles en español:

- `/`
- `/desafio/[slug]`
- `/aprender`
- `/aprender/[skill]`
- `/recordar`
- `/prueba`
- `/mapa`

Código interno y nombres de tipos en inglés.

La navegación común usa `ClientRouter` de `astro:transitions` desde
`src/layouts/SiteLayout.astro`. Las páginas siguen siendo entradas estáticas de
Astro; la transición no convierte el proyecto en una SPA.

## Límites

### Domain

Contiene entidades, value objects, tipos y reglas puras.

No puede importar:

- Astro;
- React;
- DOM;
- `window`;
- `localStorage`.

### Application

Casos de uso y servicios.

Ejemplos:

- comenzar un desafío;
- evaluar un paso;
- registrar evidencia;
- calcular dominio;
- calcular frescura;
- seleccionar diagnóstico.

### Infrastructure

Implementaciones externas:

- almacenamiento del navegador;
- serialización;
- migrations;
- clock cuando se necesite aislar tiempo.

### UI

Adaptación a Astro/React.

No contiene reglas de scoring que pertenezcan al dominio.

## Motor de desafíos

Tipos principales orientativos:

```ts
type ChallengeKind =
  | "recognize"
  | "estimate"
  | "calculate"
  | "debug"
  | "compare"
  | "reverse"
  | "decide";

type Difficulty =
  | "foundation"
  | "application"
  | "relation"
  | "transfer";

type ErrorKind =
  | "operation-selection"
  | "direction"
  | "calculation"
  | "unit"
  | "magnitude"
  | "interpretation"
  | "concept";

type AnswerSpec =
  | {
      type: "single-choice";
      correctOptionId: string;
    }
  | {
      type: "numeric";
      expected: number;
      tolerance?: number;
      unit?: string;
    };

interface ChallengeStep {
  id: string;
  kind: ChallengeKind;
  difficulty: Difficulty;
  prompt: string;
  answer: AnswerSpec;
  skillIds: string[];
  hints?: string[];
  successFeedback: string;
  errorFeedback?: Partial<Record<ErrorKind, string>>;
}

interface Challenge {
  id: string;
  title: string;
  scenario: string;
  skillIds: string[];
  steps: ChallengeStep[];
}
```

Los tipos finales pueden mejorar estos nombres sin cambiar el modelo conceptual.

## Evaluación

### Modos normales

- el usuario puede usar pista;
- primer error: feedback específico cuando sea posible y una oportunidad de reintento;
- segundo error: revelar solución y explicación;
- registrar evidencia de independencia.

### Diagnóstico

- una respuesta por paso;
- sin pista previa;
- incluir opción "No sé" cuando tenga sentido;
- no mostrar nota;
- feedback breve;
- la evidencia se marca con `source: diagnostic`.

## Evidencia

Cada respuesta evaluada registra como mínimo:

```ts
interface Evidence {
  id: string;
  skillId: string;
  challengeId: string;
  stepId: string;
  source: "challenge" | "learning" | "diagnostic" | "recall";
  difficulty: Difficulty;
  kind: ChallengeKind;
  correct: boolean;
  usedHint: boolean;
  attempts: number;
  revealed: boolean;
  errorKind?: ErrorKind;
  answeredAt: string;
}
```

No guardar solo agregados. Conservar evidencia suficiente para recalcular progreso.

## Calidad de evidencia

Valor orientativo:

- correcto al primer intento, sin pista: `1.00`
- correcto al primer intento, con pista: `0.75`
- correcto en reintento: `0.60`
- solución revelada: `0.25`
- incorrecto final: `0.00`

La pista reduce independencia, no "castiga" al usuario.

Ponderación orientativa por dificultad:

- foundation `1.00`
- application `1.10`
- relation `1.25`
- transfer `1.40`

No mostrar estos números al usuario.

## Dominio

Estados persistibles o derivables:

- `unexplored`
- `developing`
- `available`
- `solid`

Regla inicial:

### unexplored

Sin evidencia.

### developing

Existe evidencia pero todavía no alcanza el mínimo de disponibilidad.

### available

Como orientación:

- al menos 4 evidencias relevantes;
- calidad ponderada >= 0.65.

### solid

Como orientación:

- al menos 8 evidencias relevantes;
- calidad ponderada >= 0.82;
- al menos 3 `ChallengeKind` distintos;
- al menos una evidencia satisfactoria de `relation` o `transfer`.

Usar una ventana reciente de evidencia razonable, por ejemplo las últimas 12 por habilidad, para que progreso antiguo no domine para siempre.

## Frescura

No modifica el dominio aprendido.

Se deriva desde la última práctica exitosa:

- `fresh`: 0–13 días;
- `cooling`: 14–29 días;
- `oxidized`: 30 días o más.

Los umbrales deben quedar centralizados en una configuración de dominio, no repetidos en componentes.

## Estado mostrado

Composición inicial:

- dominio unexplored → `Sin explorar`
- dominio developing → `En desarrollo`
- dominio available + fresh/cooling → `Disponible`
- dominio solid + fresh/cooling → `Sólido`
- dominio available/solid + oxidized → `Para refrescar`

## Persistencia

Una sola fuente local versionada.

Clave sugerida:

`oxyda2:state:v1`

Snapshot conceptual:

```ts
interface PersistedStateV1 {
  schemaVersion: 1;
  onboardingCompleted: boolean;
  evidences: Evidence[];
  completedChallengeIds: string[];
  preferences: {
    reducedMotionOverride?: boolean;
  };
}
```

No es obligatorio persistir `SkillProgress` si puede derivarse de evidencia.

Ventajas:

- menos inconsistencias;
- algoritmo de progreso puede evolucionar;
- migraciones más claras.

## Repository boundary

Conceptualmente:

```text
ProgressRepository
        ↑
LocalStorageProgressRepository
```

Los casos de uso dependen de la abstracción, no de `localStorage`.

## LocalStorage

- parsear una vez por operación/repository call, no por cada componente;
- manejar JSON corrupto;
- validar `schemaVersion`;
- nunca borrar silenciosamente un snapshot incompatible;
- disponer de migration/fallback explícito;
- centralizar clave y versión.

## Entrada numérica localizada

UI en español.

- mostrar números mediante `Intl.NumberFormat`;
- aceptar coma y punto decimal cuando sea razonable;
- evitar depender ciegamente de `input type="number"`;
- no ejecutar expresiones ingresadas;
- normalizar moneda, espacios y unidades antes de evaluar;
- mantener parser pequeño, testeado y determinista.

## Contenido

Contenido estático y tipado.

Preferir archivos `.ts` con `satisfies` sobre JSON sin tipos.

Ejemplo:

```ts
export const challenges = [
  // ...
] satisfies Challenge[];
```

No generar problemas aleatoriamente en v0.1.

## Islas React sugeridas

Solo donde exista interacción real:

- `FirstRunIsland`
- `ChallengeRunnerIsland`
- `DiagnosticRunnerIsland`
- `RecallSearchIsland`
- `ProgressMapIsland`
- una isla pequeña para action cards animadas si Lucide Animated lo exige

No hidratar páginas completas sin necesidad.

Directivas orientativas:

- runner crítico: `client:load`
- búsqueda/elementos secundarios: `client:idle` o `client:visible` cuando tenga sentido

## Lucide Animated

La librería actual está orientada a React.

Usar componentes concretos, no una capa React global.

Requisito:

- hover/focus sobre la superficie padre debe disparar la animación del icono;
- si el componente ofrece control imperativo (`startAnimation` / `stopAnimation` o equivalente), encapsularlo en un wrapper reutilizable;
- reduced motion debe desactivar animación no esencial.

No introducir shadcn/ui como sistema visual solo porque el registry se use para instalar iconos.

## Tailwind CSS v4

Usar el plugin Vite oficial `@tailwindcss/vite`.

El archivo `src/styles/global.css` debe importar Tailwind v4 y contener tokens globales mínimos.

No crear una configuración Tailwind v3 por costumbre.

## Tests

Usar Vitest para dominio y application.

Cobertura prioritaria:

1. evaluación single-choice;
2. evaluación numeric/tolerance;
3. normalización de entrada;
4. scoring de evidencia;
5. cálculo de dominio;
6. cálculo de frescura;
7. composición del estado;
8. serialización/versionado;
9. selección del diagnóstico.

No agregar E2E pesado en v0.1 salvo necesidad descubierta.

## Calidad

Scripts esperados:

- `pnpm dev`
- `pnpm check`
- `pnpm test`
- `pnpm build`
- `pnpm format`
- `pnpm format:check`

Prettier debe soportar Astro.

## Rendimiento

- contenido estático;
- JS cliente limitado a islas;
- no almacenar derivados gigantes;
- no hacer cálculos de mapa en cada render si la evidencia no cambió;
- memoizar/derivar en el borde apropiado, no por reflejo;
- no introducir stores globales hasta que exista una necesidad real.
