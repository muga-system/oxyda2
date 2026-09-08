import type { Challenge } from '../../shared/domain/types';
import { choice, numeric, option as o } from './steps';

export const percentageChallenges = [
  {
    id: 'percentage-discount-compare',
    familyId: 'percentage',
    title: 'Dos descuentos, una campera',
    scenario:
      'Una campera cuesta $80.000 en las dos tiendas. La tienda A ofrece 25% de descuento. La tienda B ofrece $18.000 de descuento. ¿Cuál conviene?',
    skillIds: [
      'percentage.part-of-total',
      'percentage.change',
      'estimation.reasonableness',
    ],
    comparison: [
      { label: 'Tienda A', value: '25%', detail: 'de descuento' },
      { label: 'Tienda B', value: '$18.000', detail: 'de descuento' },
    ],
    takeaway:
      'Antes de comparar un porcentaje con una cantidad, llevalos a la misma unidad. El 25% de $80.000 es $20.000: A descuenta $2.000 más.',
    steps: [
      choice({
        id: 'same-unit',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué necesitamos comparar para elegir?',
        skillIds: ['percentage.change'],
        correct: 'pesos',
        options: [
          o(
            'numbers',
            '25 contra 18.000, directamente',
            'unit',
            '25 es un porcentaje y 18.000 es dinero: esos números todavía no miden lo mismo.',
          ),
          o('pesos', 'Cuánto dinero descuenta cada tienda'),
          o(
            'subtract',
            'Restar 25 al precio original',
            'concept',
            'El 25% no significa $25. Representa una parte de los $80.000.',
          ),
        ],
        hint: 'Una oferta está en porcentaje y la otra en pesos. Buscá una medida común.',
        success: 'La comparación necesita la misma unidad.',
        explanation:
          'Podemos expresar ambos descuentos en pesos, o comparar los dos precios finales. Así las cantidades sí representan lo mismo.',
      }),
      choice({
        id: 'quarter-estimate',
        kind: 'estimate',
        difficulty: 'foundation',
        prompt: 'Sin hacer una cuenta larga, ¿cuánto ronda el 25% de $80.000?',
        skillIds: ['percentage.part-of-total', 'estimation.reasonableness'],
        correct: '20000',
        options: [
          o(
            '2000',
            '$2.000',
            'magnitude',
            '$2.000 es una parte muy pequeña: cuatro veces esa cantidad apenas da $8.000.',
          ),
          o('20000', '$20.000'),
          o(
            '60000',
            '$60.000',
            'interpretation',
            '$60.000 sería lo que queda después del descuento, no lo que se descuenta.',
          ),
        ],
        hint: '25% es la cuarta parte. Pensá en repartir $80.000 en cuatro partes iguales.',
        success: 'Una cuarta parte ronda $20.000.',
        explanation:
          'Cuatro partes de $20.000 forman los $80.000 completos. La estimación ya permite anticipar que A descuenta más.',
      }),
      numeric({
        id: 'discount-amount',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos pesos descuenta exactamente la tienda A?',
        skillIds: ['percentage.part-of-total', 'percentage.change'],
        expected: 20000,
        unit: '$',
        errors: [
          {
            value: 60000,
            kind: 'interpretation',
            feedback:
              '$60.000 es el precio final. La pregunta pide el dinero descontado.',
          },
          {
            value: 79975,
            kind: 'concept',
            feedback:
              'Restar $25 confunde un porcentaje con una cantidad fija. Calculá la cuarta parte de $80.000.',
          },
          {
            value: 2000,
            kind: 'magnitude',
            feedback:
              'Falta un factor de diez. Compará el resultado con la cuarta parte estimada.',
          },
        ],
        hint: 'Podés hacer 80.000 ÷ 4, porque 25% es un cuarto.',
        success: 'El descuento es de $20.000.',
        explanation:
          '80.000 × 25 ÷ 100 = 20.000. El precio final de A es $60.000.',
      }),
      choice({
        id: 'choose-store',
        kind: 'decide',
        difficulty: 'application',
        prompt:
          'Con el mismo producto y las mismas condiciones, ¿cuál conviene?',
        skillIds: ['percentage.change'],
        correct: 'a',
        options: [
          o('a', 'Tienda A: pagás $60.000'),
          o(
            'b',
            'Tienda B: pagás $62.000',
            'direction',
            'Al comprar conviene el menor precio final: $60.000 es menos que $62.000.',
          ),
          o(
            'same',
            'Las dos terminan en el mismo precio',
            'calculation',
            'A descuenta $20.000 y B descuenta $18.000. Hay $2.000 de diferencia.',
          ),
        ],
        hint: 'Restá cada descuento al mismo precio de $80.000.',
        success: 'A permite ahorrar $2.000 más.',
        explanation:
          'En A: 80.000 − 20.000 = 60.000. En B: 80.000 − 18.000 = 62.000.',
      }),
      choice({
        id: 'verify-discount',
        kind: 'recognize',
        label: 'Verificar',
        difficulty: 'relation',
        prompt: '¿Qué comprobación confirma que $20.000 tiene sentido?',
        skillIds: ['percentage.part-of-total', 'estimation.reasonableness'],
        correct: 'four',
        options: [
          o('four', 'Cuatro descuentos de $20.000 suman el precio de $80.000'),
          o(
            'bigger',
            'El descuento debería superar el precio original',
            'magnitude',
            'Un 25% es una parte del total; no puede superar al 100%.',
          ),
          o(
            'equal',
            '25% siempre equivale a $20.000',
            'concept',
            'El dinero que representa un porcentaje cambia cuando cambia el precio original.',
          ),
        ],
        hint: 'Verificá la relación entre una cuarta parte y el total.',
        success: 'El resultado coincide con una cuarta parte del precio.',
        explanation:
          '20.000 × 4 = 80.000. El descuento es menor que el total y coincide con la estimación previa.',
      }),
    ],
  },
  {
    id: 'percentage-reverse-price',
    familyId: 'percentage',
    title: 'Antes del descuento',
    scenario:
      'Un abrigo cuesta $64.000 después de un descuento del 20%. Querés recuperar el precio original.',
    skillIds: ['percentage.inverse', 'percentage.change'],
    takeaway:
      'El precio rebajado representa el 80% del original. Para volver al total, dividí por 0,80; sumar 20% al precio nuevo usa otra base.',
    steps: [
      choice({
        id: 'remaining-share',
        kind: 'reverse',
        difficulty: 'relation',
        prompt: '¿Qué parte del precio original representan los $64.000?',
        skillIds: ['percentage.inverse'],
        correct: '80',
        options: [
          o(
            '20',
            'El 20%',
            'interpretation',
            'El 20% es la parte descontada; $64.000 es lo que queda.',
          ),
          o('80', 'El 80%'),
          o(
            '120',
            'El 120%',
            'direction',
            'El precio bajó: lo que queda debe ser menos del 100% original.',
          ),
        ],
        hint: 'Al 100% del precio restale el porcentaje de descuento.',
        success: 'Quedó el 80% del precio original.',
        explanation:
          '100% − 20% = 80%. Por eso 0,80 × precio original = 64.000.',
      }),
      numeric({
        id: 'original-price',
        kind: 'calculate',
        difficulty: 'relation',
        prompt: '¿Cuál era el precio original, en pesos?',
        skillIds: ['percentage.inverse'],
        expected: 80000,
        unit: '$',
        errors: [
          {
            value: 76800,
            kind: 'direction',
            feedback:
              'Sumar 20% a $64.000 toma el precio nuevo como base. Necesitás deshacer la multiplicación por 0,80.',
          },
          {
            value: 51200,
            kind: 'direction',
            feedback:
              'Aplicaste otro descuento. El precio original debe ser mayor que $64.000.',
          },
        ],
        hint: 'Si $64.000 es 8 partes de 10, cada parte vale $8.000.',
        success: 'El precio original era $80.000.',
        explanation: '64.000 ÷ 0,80 = 80.000. El 20% del original era $16.000.',
      }),
      choice({
        id: 'verify-original',
        kind: 'recognize',
        label: 'Verificar',
        difficulty: 'application',
        prompt: '¿Qué cuenta comprueba el precio reconstruido?',
        skillIds: ['percentage.inverse', 'percentage.change'],
        correct: 'forward',
        options: [
          o('forward', '$80.000 − $16.000 = $64.000'),
          o(
            'add',
            '$64.000 + $12.800 = $76.800',
            'concept',
            '$12.800 es el 20% del precio nuevo, no del original.',
          ),
          o(
            'subtract',
            '$80.000 − $20 = $79.980',
            'unit',
            '20 representa un porcentaje, no un descuento fijo de $20.',
          ),
        ],
        hint: 'Volvé a aplicar el descuento al precio original que encontraste.',
        success: 'La comprobación vuelve al precio rebajado.',
        explanation:
          'El 20% de $80.000 es $16.000; al restarlo quedan los $64.000 del escenario.',
      }),
    ],
  },
  {
    id: 'percentage-successive-change',
    familyId: 'percentage',
    title: 'Sube 25%, baja 25%',
    scenario:
      'Un servicio cuesta $40.000. Primero aumenta 25% y después recibe una rebaja del 25% sobre el nuevo precio.',
    skillIds: ['percentage.successive', 'percentage.change'],
    takeaway:
      'Porcentajes iguales en direcciones opuestas no se anulan si usan bases distintas. El resultado es $37.500, menor al original.',
    steps: [
      choice({
        id: 'changing-base',
        kind: 'debug',
        difficulty: 'relation',
        prompt: 'Una explicación dice que los cambios se anulan. ¿Qué omite?',
        debug: '25% − 25% = 0% → vuelve a $40.000',
        skillIds: ['percentage.successive'],
        correct: 'base',
        options: [
          o('base', 'La rebaja usa un precio mayor como base'),
          o(
            'always',
            'Los descuentos nunca se pueden calcular',
            'concept',
            'Sí se pueden calcular: hace falta aplicar cada porcentaje a su base.',
          ),
          o(
            'rounding',
            'Solo falta redondear el precio final',
            'calculation',
            'La diferencia no nace del redondeo: cambia la cantidad sobre la que se calcula el segundo 25%.',
          ),
        ],
        hint: 'Después de aumentar, el precio ya no es $40.000.',
        success: 'La base cambia entre las dos operaciones.',
        explanation:
          'El aumento es $10.000, y el precio pasa a $50.000. El descuento siguiente se calcula sobre esos $50.000.',
      }),
      choice({
        id: 'compare-changes',
        kind: 'compare',
        difficulty: 'relation',
        prompt: '¿Qué comparación es correcta?',
        skillIds: ['percentage.successive', 'percentage.change'],
        correct: 'larger-drop',
        options: [
          o(
            'same',
            'Se suman y se restan $10.000',
            'concept',
            'El segundo 25% se calcula sobre $50.000: equivale a $12.500.',
          ),
          o('larger-drop', 'Sube $10.000 y luego baja $12.500'),
          o(
            'smaller-drop',
            'Sube $12.500 y luego baja $10.000',
            'direction',
            'El primer cambio usa $40.000 como base; el segundo usa $50.000.',
          ),
        ],
        hint: 'Calculá un cuarto del precio antes de cada cambio.',
        success: 'La rebaja es mayor que el aumento en pesos.',
        explanation: '25% de $40.000 = $10.000. 25% de $50.000 = $12.500.',
      }),
      choice({
        id: 'final-price',
        kind: 'decide',
        difficulty: 'transfer',
        prompt: '¿Cómo queda el precio respecto de los $40.000 originales?',
        skillIds: ['percentage.successive'],
        correct: 'lower',
        options: [
          o(
            'same',
            'Igual: $40.000',
            'concept',
            'Los cambios actúan sobre bases distintas y no se cancelan.',
          ),
          o('lower', 'Menor: $37.500'),
          o(
            'higher',
            'Mayor: $42.500',
            'direction',
            'Se rebajaron $12.500 después de sumar $10.000. El cambio neto es una reducción.',
          ),
        ],
        hint: 'Partí de $50.000 y restá su cuarta parte.',
        success: 'Termina $2.500 por debajo del original.',
        explanation:
          '40.000 × 1,25 × 0,75 = 37.500. Los factores se multiplican; no se restan los porcentajes.',
      }),
    ],
  },
  {
    id: 'percentage-headline',
    familyId: 'percentage',
    title: 'Un titular con otra base',
    scenario:
      'Un taller redujo sus devoluciones de 20 a 10 sobre 200 pedidos en cada mes. El titular dice: «Las devoluciones bajaron 50 puntos porcentuales».',
    skillIds: ['percentage.part-of-total', 'percentage.change'],
    takeaway:
      'La tasa pasó de 10% a 5%: bajó 5 puntos porcentuales y, en relación con el valor anterior, un 50%. No son la misma medida.',
    steps: [
      choice({
        id: 'headline-base',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt:
          'Para conocer la tasa de devoluciones de cada mes, ¿cuál es el total que representa el 100%?',
        skillIds: ['percentage.part-of-total'],
        correct: 'orders',
        options: [
          o('orders', 'Los 200 pedidos de ese mes'),
          o(
            'returns',
            'Las 10 devoluciones del mes actual',
            'interpretation',
            'Las devoluciones son la parte que querés comparar con todos los pedidos.',
          ),
          o(
            'previous',
            'Las 20 devoluciones del mes anterior',
            'concept',
            'Ese valor sirve para comparar la reducción de devoluciones entre meses, pero no para calcular la tasa sobre los pedidos.',
          ),
        ],
        hint: 'Una tasa de devoluciones compara devoluciones con todos los pedidos del mismo período.',
        success: 'La base de cada tasa son los 200 pedidos.',
        explanation:
          'Con la misma base en ambos meses, podemos comparar la tasa anterior de 20 sobre 200 con la actual de 10 sobre 200.',
      }),
      numeric({
        id: 'current-share',
        kind: 'calculate',
        difficulty: 'relation',
        prompt: '¿Qué porcentaje representan 10 devoluciones de 200 pedidos?',
        skillIds: ['percentage.part-of-total'],
        expected: 5,
        unit: '%',
        errors: [
          {
            value: 10,
            kind: 'interpretation',
            feedback:
              '10 es la cantidad de devoluciones. El porcentaje necesita comparar esa cantidad con los 200 pedidos.',
          },
          {
            value: 0.05,
            kind: 'calculation',
            feedback:
              '0,05 es la proporción decimal. Para expresarla como porcentaje, multiplicá por 100.',
          },
        ],
        hint: '10 ÷ 200 = 0,05. Expresá esa proporción por cada cien.',
        success: 'Representan el 5% de los pedidos.',
        explanation: '10 ÷ 200 × 100 = 5%. Antes, 20 ÷ 200 × 100 = 10%.',
      }),
      choice({
        id: 'headline-error',
        kind: 'debug',
        difficulty: 'transfer',
        prompt: '¿Qué confunde el titular?',
        debug: 'De 10% a 5% → baja de 50 puntos porcentuales',
        skillIds: ['percentage.change'],
        correct: 'points',
        options: [
          o('points', 'Porcentaje de reducción con puntos porcentuales'),
          o(
            'more',
            'Una reducción con un aumento',
            'direction',
            'Las devoluciones sí se redujeron. El problema es cómo se expresa el tamaño del cambio.',
          ),
          o(
            'total',
            'Los pedidos cambiaron de 200 a 100',
            'interpretation',
            'El escenario indica 200 pedidos en cada mes; el total no cambió.',
          ),
        ],
        hint: 'La diferencia entre tasas es 10 − 5. La reducción relativa compara 5 con el 10 anterior.',
        success: 'El 50% y los 5 puntos describen relaciones distintas.',
        explanation:
          'Los puntos porcentuales son la resta de tasas: 10 − 5 = 5. La reducción relativa es 5 ÷ 10 = 50%.',
      }),
      choice({
        id: 'accurate-headline',
        kind: 'decide',
        difficulty: 'transfer',
        prompt: '¿Qué titular coincide con los datos?',
        skillIds: ['percentage.change', 'percentage.part-of-total'],
        correct: 'half',
        options: [
          o(
            'half',
            'La tasa de devoluciones se redujo a la mitad: de 10% a 5%',
          ),
          o(
            '50points',
            'La tasa cayó 50 puntos porcentuales',
            'concept',
            'Solo hay 5 puntos entre 10% y 5%.',
          ),
          o(
            'zero',
            'Ya casi no hay devoluciones: la tasa es 0,05%',
            'magnitude',
            '0,05 es la proporción decimal, equivalente a 5%; no a 0,05%.',
          ),
        ],
        hint: 'Elegí una afirmación que incluya las dos tasas para conservar el contexto.',
        success: 'El titular conserva el dato y su base de comparación.',
        explanation:
          'La cantidad pasó de 20 a 10 con igual total de pedidos. Tanto la cantidad como la tasa se redujeron a la mitad.',
      }),
    ],
  },
] satisfies Challenge[];
