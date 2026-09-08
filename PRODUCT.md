# OxYda2 — Product Context

Ruta: `/oxyda2/PRODUCT.md`

## Plataforma

Aplicación web estática, responsive y local-first.

Idioma de v0.1: español.

No requiere cuenta ni conexión permanente una vez cargados los recursos de la aplicación.

## Producto

OxYda2 es una aplicación para aprender, recuperar y mantener disponibles conocimientos matemáticos útiles.

No se organiza alrededor de "hacer cuentas" como fin principal. La unidad fundamental es una situación que obliga a reconocer qué matemática hay presente, estimar qué resultado esperar, resolver cuando haga falta, verificar si el resultado tiene sentido y decidir qué significa.

Posicionamiento:

> Matemática para pensar, no solamente para calcular.

La hipótesis principal de v0.1 es:

> Resolver situaciones contextualizadas, detectar errores y estimar antes de calcular puede resultar más útil y atractivo que practicar operaciones aisladas.

## Nombre

Nombre canónico: `OxYda2`.

Juego conceptual:

- remite a conocimientos "oxidados" por falta de uso;
- permite una lectura visual secundaria como `O × Y = 2`.

`O × Y = 2` es un recurso gráfico secundario, no debe reemplazar el nombre textual accesible `OxYda2`.

No explicar el juego de palabras constantemente dentro de la interfaz.

## Usuario principal

Personas jóvenes y adultas que:

- estudiaron matemática pero olvidaron parte de lo aprendido;
- quieren recuperar agilidad sin volver a un curso escolar completo;
- quieren comprender conceptos que alguna vez memorizaron sin entender;
- necesitan consultar rápidamente una operación o relación;
- quieren entrenar razonamiento matemático cotidiano.

OxYda2 no se diseña específicamente para niños ni como producto escolar infantil.

## Principios pedagógicos

Modelo cognitivo base:

1. Reconocer.
2. Estimar.
3. Resolver.
4. Verificar.
5. Decidir.

No todos los desafíos deben usar las cinco etapas ni respetar siempre el mismo orden.

Tipos transversales de desafío:

- `recognize`
- `estimate`
- `calculate`
- `debug`
- `compare`
- `reverse`
- `decide`

`debug` es una mecánica transversal, no una sección separada.

Ejemplo:

Una resolución dice:

`500 - 20 = 480`

para un producto de $500 con 20% de descuento.

El objetivo no es solo marcar "incorrecto", sino identificar el error conceptual:

> 20 representa un porcentaje, no $20.

## Cinco familias matemáticas de v0.1

### Porcentajes

- parte de un total;
- aumentos y descuentos;
- porcentaje que representa una cantidad;
- valor original;
- cambios sucesivos.

### Proporciones

- razones;
- precio por unidad;
- escalado;
- recetas;
- relaciones entre magnitudes.

### Estimación

- redondeo;
- orden de magnitud;
- aproximación;
- suficiencia;
- razonabilidad de un resultado.

### Unidades

- tiempo;
- distancia;
- masa;
- volumen;
- conversiones cotidianas.

### Datos

- promedio;
- mediana;
- lectura de gráficos;
- muestras;
- afirmaciones estadísticas simples.

## Dificultad conceptual

No usar etiquetas de dificultad "fácil / normal / difícil" como eje principal.

Usar:

1. `foundation` — fundamento.
2. `application` — aplicación.
3. `relation` — relación.
4. `transfer` — transferencia.

Ejemplo con porcentajes:

- fundamento: calcular 20% de 150;
- aplicación: aplicar 20% de descuento;
- relación: descubrir qué porcentaje representa 30 de 150;
- transferencia: comparar dos promociones expresadas de forma diferente.

## Áreas del producto

### Desafío

Situación contextual que puede mezclar habilidades.

### Aprender

Ruta progresiva por conceptos breves. No presentar grandes "unidades escolares".

### Recordar

Consulta inmediata de una relación o procedimiento, con explicación breve y ejercicio opcional.

### Poneme a prueba

Sesión diagnóstica breve y variada. No se presenta como examen ni devuelve una nota global.

### Mi mapa

Representación multidimensional del estado de las habilidades.

Nunca mostrar una puntuación matemática global como "74/100".

## Dominio vs. oxidación

OxYda2 distingue dos ideas:

### Dominio

Qué tan bien está comprendida una habilidad.

Estados:

- `unexplored`
- `developing`
- `available`
- `solid`

### Frescura

Qué tan recientemente esa habilidad pudo utilizarse con éxito.

Estados:

- `fresh`
- `cooling`
- `oxidized`

Una habilidad puede seguir siendo conceptualmente `solid` y, al mismo tiempo, estar `oxidized`.

La interfaz compone ambos e informa:

- Sin explorar.
- En desarrollo.
- Disponible.
- Sólido.
- Para refrescar.

La oxidación nunca borra aprendizaje histórico.

## Errores como evidencia

No registrar solamente correcto/incorrecto.

Tipos de error:

- `operation-selection`
- `direction`
- `calculation`
- `unit`
- `magnitude`
- `interpretation`
- `concept`

Esto permite detectar patrones como:

> Podés calcular porcentajes directos, pero todavía se complica reconocer la dirección de la relación.

## Primera experiencia

La primera apertura no debe pedir perfil, edad, nivel ni objetivos.

Debe ofrecer inmediatamente:

> Matemática para pensar, no solamente para calcular.

CTA:

> Resolver mi primer desafío.

El primer desafío debe demostrar:

- reconocimiento;
- estimación;
- cálculo;
- decisión;
- verificación.

Después del desafío se presentan las áreas del sistema.

## Voz

- clara;
- adulta;
- breve;
- no escolarizante;
- no condescendiente;
- no competitiva;
- sin exageración;
- sin jerga innecesaria.

Evitar:

- "¡Genial!"
- "¡Sos un crack!"
- "Nivel superado"
- "Racha"
- lenguaje de examen o castigo.

Preferir:

- "Tiene sentido."
- "Llevemos ambas ofertas a la misma medida."
- "El cálculo es correcto, pero revisemos qué representa el número."
- "Esta habilidad conviene refrescarla."

## Accesibilidad

- teclado completo;
- foco visible;
- feedback compatible con lector de pantalla;
- estados no dependientes solo del color;
- animaciones reducibles;
- texto y números con contraste suficiente;
- objetivos táctiles adecuados;
- ninguna interacción esencial depende exclusivamente de hover.

## No entra en v0.1

- backend;
- autenticación;
- sincronización en nube;
- IA generativa;
- contenido generado en runtime;
- multiplayer;
- rankings;
- amigos;
- avatares;
- XP;
- monedas;
- tienda;
- suscripciones;
- notificaciones;
- PWA;
- internacionalización;
- editor de desafíos;
- panel administrativo;
- cientos de ejercicios;
- cronómetros como mecánica de puntuación.
