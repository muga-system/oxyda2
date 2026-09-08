import type { Challenge } from '../../shared/domain/types';
import { choice, numeric, option as o } from './steps';

export const dataChallenges = [
  {
    id: 'data-mean-outlier',
    familyId: 'data',
    title: 'El promedio y la demora',
    scenario:
      'Cinco entregas demoraron 10, 10, 10, 10 y 60 minutos. Querés resumir esos tiempos sin ocultar la entrega excepcional.',
    skillIds: ['data.mean', 'data.median'],
    takeaway:
      'El promedio de 20 minutos es correcto, pero no describe la duración de la mayoría. Conviene acompañarlo con los valores o la mediana de 10 minutos.',
    steps: [
      numeric({
        id: 'mean-time',
        kind: 'calculate',
        difficulty: 'foundation',
        prompt: '¿Cuál es el promedio de duración, en minutos?',
        skillIds: ['data.mean'],
        expected: 20,
        unit: 'min',
        errors: [
          {
            value: 100,
            kind: 'operation-selection',
            feedback:
              '100 es la suma de los tiempos. Para hallar el promedio dividí por las cinco entregas.',
          },
          {
            value: 10,
            kind: 'interpretation',
            feedback:
              '10 es el valor más frecuente y también la mediana, pero el promedio incluye los 60 minutos de la última entrega.',
          },
        ],
        hint: 'Sumá los cinco tiempos y dividí por 5.',
        success: 'El promedio es 20 minutos.',
        explanation: '10 + 10 + 10 + 10 + 60 = 100. 100 ÷ 5 = 20 minutos.',
      }),
      choice({
        id: 'mean-claim-debug',
        kind: 'debug',
        difficulty: 'relation',
        prompt: '¿Qué problema tiene esta interpretación?',
        debug: 'Promedio: 20 min → la mayoría de las entregas duró 20 min',
        skillIds: ['data.mean'],
        correct: 'not-majority',
        options: [
          o('not-majority', 'El promedio no indica cuánto duró la mayoría'),
          o(
            'bad-sum',
            'La suma de los tiempos debería ser 50 minutos',
            'calculation',
            'Cuatro tiempos de 10 y uno de 60 suman 100, no 50.',
          ),
          o(
            'ignore',
            'Todo valor extremo debe borrarse automáticamente',
            'interpretation',
            'Una entrega larga sigue siendo un dato. Hay que entenderla y comunicarla, no descartarla sin motivo.',
          ),
        ],
        hint: 'Mirá cuántas entregas duraron realmente 20 minutos.',
        success: 'Ninguna entrega duró 20 minutos, aunque ese sea el promedio.',
        explanation:
          'El promedio reparte el total por igual; no necesariamente coincide con un valor observado ni con el más frecuente.',
      }),
      choice({
        id: 'describe-deliveries',
        kind: 'decide',
        difficulty: 'transfer',
        prompt: '¿Qué resumen conserva mejor la información?',
        skillIds: ['data.mean', 'data.median'],
        correct: 'context',
        options: [
          o(
            'context',
            'Cuatro entregas duraron 10 min y una 60; el promedio fue 20 min',
          ),
          o(
            'all20',
            'Las cinco entregas duraron unos 20 min',
            'interpretation',
            'Ese resumen oculta tanto los cuatro tiempos de 10 minutos como la demora de 60.',
          ),
          o(
            'all60',
            'Una entrega tardó 60 min, por lo tanto todas fueron lentas',
            'interpretation',
            'Una entrega excepcional no describe a las otras cuatro.',
          ),
        ],
        hint: 'Buscá un resumen que no borre ni la mayoría ni el caso excepcional.',
        success: 'El resumen muestra la mayoría y la excepción.',
        explanation:
          'La mediana es 10 minutos y el promedio 20. La diferencia ayuda a advertir el efecto de la entrega larga.',
      }),
    ],
  },
  {
    id: 'data-median-salaries',
    familyId: 'data',
    title: 'Un sueldo representativo',
    scenario:
      'En un equipo de cinco personas los sueldos mensuales son $600.000, $650.000, $700.000, $750.000 y $3.300.000. El promedio es $1.200.000.',
    skillIds: ['data.median', 'data.mean'],
    takeaway:
      'La mediana es $700.000: el centro de los sueldos ordenados. El promedio de $1.200.000 sube por el valor de $3.300.000; ambos describen aspectos distintos.',
    steps: [
      choice({
        id: 'median-center',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: 'Con los cinco sueldos ya ordenados, ¿cuál es la mediana?',
        skillIds: ['data.median'],
        correct: '700',
        options: [
          o(
            '600',
            '$600.000',
            'concept',
            'Ese es el mínimo, no el valor central de la lista.',
          ),
          o('700', '$700.000'),
          o(
            '1200',
            '$1.200.000',
            'concept',
            'Ese es el promedio informado. La mediana se encuentra en el centro de los datos ordenados.',
          ),
        ],
        hint: 'Con cinco valores, el tercero tiene dos a cada lado.',
        success: 'La mediana es el tercer sueldo: $700.000.',
        explanation:
          'Dos sueldos quedan por debajo y dos por encima. El tamaño del sueldo más alto no cambia cuál ocupa el centro.',
      }),
      choice({
        id: 'mean-vs-median',
        kind: 'compare',
        difficulty: 'relation',
        prompt: '¿Por qué el promedio supera tanto a la mediana?',
        skillIds: ['data.mean', 'data.median'],
        correct: 'outlier',
        options: [
          o(
            'outlier',
            'El sueldo de $3.300.000 empuja el promedio hacia arriba',
          ),
          o(
            'mistake',
            'La mediana siempre debe ser igual al promedio',
            'concept',
            'Son medidas distintas y solo coinciden en algunos conjuntos de datos.',
          ),
          o(
            'count',
            'El promedio cuenta seis personas',
            'interpretation',
            'El equipo tiene cinco personas y el promedio usa esos cinco sueldos.',
          ),
        ],
        hint: 'La suma total incluye cada peso del sueldo más alto.',
        success: 'El promedio responde al tamaño de todos los valores.',
        explanation:
          'La suma de los cinco sueldos es $6.000.000. Dividida por cinco da $1.200.000, aunque cuatro personas ganen menos.',
      }),
      choice({
        id: 'salary-summary',
        kind: 'decide',
        difficulty: 'transfer',
        prompt:
          'Para hablar del centro de los sueldos de este equipo, ¿qué conviene comunicar?',
        skillIds: ['data.median', 'data.mean'],
        correct: 'both',
        options: [
          o(
            'both',
            'La mediana de $700.000, aclarando que el promedio es $1.200.000 por un sueldo alto',
          ),
          o(
            'everyone',
            'Que cada persona gana cerca de $1.200.000',
            'interpretation',
            'Cuatro de cinco ganan entre $600.000 y $750.000; el promedio no es el sueldo de cada persona.',
          ),
          o(
            'erase',
            'Borrar el sueldo alto y presentar el resto como todo el equipo',
            'interpretation',
            'Omitir una persona sin aclararlo cambia el grupo que se está describiendo.',
          ),
        ],
        hint: 'Podés elegir una medida adecuada y mantener el contexto del conjunto.',
        success:
          'La mediana describe el centro sin ocultar la diferencia entre sueldos.',
        explanation:
          'Ninguna medida resume por completo una distribución. Informar ambas ayuda a entender por qué difieren.',
      }),
    ],
  },
  {
    id: 'data-graph-axis',
    familyId: 'data',
    title: 'Cuando el eje amplifica',
    scenario:
      'Un gráfico muestra 95 pedidos en abril y 100 en mayo. El eje horizontal de cantidades empieza en 90 pedidos, de modo que las partes visibles de las barras miden 5 y 10 unidades.',
    skillIds: ['data.graph-reading', 'percentage.change'],
    chart: {
      title: 'Pedidos por mes · eje desde 90',
      values: [
        { label: 'Abril', value: 95 },
        { label: 'Mayo', value: 100 },
      ],
      baseline: 90,
      unit: 'pedidos',
    },
    takeaway:
      'Un eje truncado puede ayudar a ver una diferencia pequeña, pero la longitud visible no representa el total. Los pedidos subieron 5, aproximadamente un 5,3%.',
    steps: [
      choice({
        id: 'read-values',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Cuántos pedidos más hubo en mayo que en abril?',
        skillIds: ['data.graph-reading'],
        correct: '5',
        options: [
          o('5', '5 pedidos más'),
          o(
            '95',
            '95 pedidos más: se duplicaron',
            'interpretation',
            'Las longitudes visibles se duplican porque parten de 90, pero los valores son 95 y 100.',
          ),
          o(
            '100',
            '100 pedidos más',
            'calculation',
            '100 es el total de mayo. El cambio se obtiene restando el total de abril.',
          ),
        ],
        hint: 'Leé los valores escritos y restá mayo menos abril.',
        success: 'La diferencia real es de 5 pedidos.',
        explanation:
          '100 − 95 = 5. Las etiquetas dan los valores; la apariencia de las barras depende del eje.',
      }),
      choice({
        id: 'axis-debug',
        kind: 'debug',
        difficulty: 'relation',
        prompt: '¿Por qué esta conclusión no se sostiene?',
        debug:
          'La barra de mayo es el doble de larga → los pedidos se duplicaron',
        skillIds: ['data.graph-reading'],
        correct: 'baseline',
        options: [
          o(
            'baseline',
            'El eje empieza en 90 y las partes visibles excluyen esos 90 pedidos',
          ),
          o(
            'labels',
            'Los valores 95 y 100 no se pueden restar',
            'concept',
            'Ambos valores miden pedidos y sí se pueden restar.',
          ),
          o(
            'always',
            'Todo gráfico de barras es engañoso',
            'interpretation',
            'El problema es interpretar la escala sin leerla; un gráfico de barras puede representar datos claramente.',
          ),
        ],
        hint: 'Una barra comienza en 90 y llega a 95; la otra llega a 100.',
        success: 'La base truncada amplifica la diferencia visual.',
        explanation:
          'Las partes visibles miden 5 y 10, pero los totales son 95 y 100. Duplicar 95 daría 190, no 100.',
      }),
      choice({
        id: 'graph-decision',
        kind: 'decide',
        difficulty: 'transfer',
        prompt: '¿Qué afirmación describe correctamente el cambio?',
        skillIds: ['data.graph-reading', 'percentage.change'],
        correct: 'small-rise',
        options: [
          o(
            'small-rise',
            'Hubo 5 pedidos más, un aumento de aproximadamente 5,3%',
          ),
          o(
            'double',
            'Los pedidos aumentaron 100%',
            'interpretation',
            'Un aumento del 100% llevaría 95 pedidos a 190.',
          ),
          o(
            'nochange',
            'No hubo cambio porque ambos valores son cercanos',
            'interpretation',
            'La diferencia es pequeña pero existe: cinco pedidos.',
          ),
        ],
        hint: 'Compará los 5 pedidos adicionales con los 95 de abril.',
        success: 'El cambio es pequeño y positivo.',
        explanation:
          '5 ÷ 95 × 100 ≈ 5,3%. La cifra cuantifica el cambio sin depender de la longitud aparente.',
      }),
    ],
  },
  {
    id: 'data-sample-claim',
    familyId: 'data',
    title: 'Nueve de cada diez',
    scenario:
      'Un servicio invita a sus seguidores a responder una encuesta. Contestan 10 personas voluntarias y 9 lo recomiendan. Publica: «El 90% de toda la población nos recomienda».',
    skillIds: ['data.sample', 'percentage.part-of-total'],
    takeaway:
      'El 90% describe a las diez personas que respondieron. Una muestra pequeña y voluntaria de seguidores no permite generalizar ese porcentaje a toda la población.',
    steps: [
      choice({
        id: 'sample-population',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿A qué grupo describe directamente el 90% observado?',
        skillIds: ['data.sample'],
        correct: 'respondents',
        options: [
          o('respondents', 'A las 10 personas que respondieron'),
          o(
            'all',
            'A toda la población',
            'interpretation',
            'No se encuestó a toda la población ni se informó una muestra que la represente.',
          ),
          o(
            'followers',
            'A todos los seguidores del servicio',
            'interpretation',
            'Respondieron solo 10 voluntarios. No conocemos la opinión de los seguidores que no participaron.',
          ),
        ],
        hint: 'Separá las personas observadas del grupo sobre el que habla el titular.',
        success: 'El dato describe a quienes efectivamente respondieron.',
        explanation:
          '9 de 10 equivale a 90%, pero la cuenta no amplía por sí sola el alcance de la muestra.',
      }),
      choice({
        id: 'sample-limit',
        kind: 'debug',
        difficulty: 'relation',
        prompt: '¿Qué limita la generalización de esta encuesta?',
        debug: '9 de 10 voluntarios → 90% de toda la población',
        skillIds: ['data.sample'],
        correct: 'size-selection',
        options: [
          o(
            'size-selection',
            'Son pocos y se seleccionaron entre seguidores que eligieron responder',
          ),
          o(
            'arithmetic',
            '9 de 10 no equivale a 90%',
            'calculation',
            'La conversión es correcta: 9 ÷ 10 × 100 = 90. El problema está en a quiénes representa.',
          ),
          o(
            'certainty',
            'El porcentaje demuestra que todos los demás opinan igual',
            'interpretation',
            'No conocemos las respuestas de quienes no participaron.',
          ),
        ],
        hint: 'Además de cuántas personas respondieron, importa cómo llegaron a la encuesta.',
        success: 'Tamaño y forma de selección importan.',
        explanation:
          'Seguir al servicio y decidir participar puede asociarse con una opinión más favorable. Más respuestas del mismo grupo tampoco garantizan representatividad.',
      }),
      choice({
        id: 'sample-decision',
        kind: 'decide',
        difficulty: 'transfer',
        prompt: '¿Qué publicación es fiel a la evidencia disponible?',
        skillIds: ['data.sample'],
        correct: 'limited',
        options: [
          o(
            'limited',
            '9 de los 10 voluntarios que respondieron recomiendan el servicio',
          ),
          o(
            'population',
            '9 de cada 10 habitantes recomiendan el servicio',
            'interpretation',
            'La encuesta no permite trasladar el resultado a los habitantes en general.',
          ),
          o(
            'useless',
            'Ninguna de las respuestas aporta información',
            'concept',
            'Las respuestas informan sobre quienes participaron, aunque no representen a toda la población.',
          ),
        ],
        hint: 'Un resultado puede ser útil si se comunica el grupo al que pertenece.',
        success: 'La afirmación conserva el límite de la muestra.',
        explanation:
          'Para hablar de toda la población haría falta un diseño de muestreo adecuado y suficiente información sobre la incertidumbre.',
      }),
    ],
  },
] satisfies Challenge[];
