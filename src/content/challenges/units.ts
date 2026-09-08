import type { Challenge } from '../../shared/domain/types';
import { choice, numeric, option as o } from './steps';

export const unitsChallenges = [
  {
    id: 'units-recipe-volume',
    familyId: 'units',
    title: 'Una botella, tres preparaciones',
    scenario:
      'Cada preparación necesita 250 ml de leche. Vas a hacer tres y tenés una botella de 1 litro.',
    skillIds: ['units.volume', 'proportion.scale'],
    takeaway:
      'Tres porciones de 250 ml suman 750 ml, es decir, 0,75 l. Comparar en la misma unidad permite ver que sobran 250 ml.',
    steps: [
      numeric({
        id: 'total-milliliters',
        kind: 'calculate',
        difficulty: 'foundation',
        prompt: '¿Cuántos mililitros necesitás en total?',
        skillIds: ['units.volume', 'proportion.scale'],
        expected: 750,
        unit: 'ml',
        errors: [
          {
            value: 253,
            kind: 'operation-selection',
            feedback:
              'Sumar tres al volumen no calcula tres preparaciones. Multiplicá la cantidad de cada una por tres.',
          },
          {
            value: 0.75,
            kind: 'unit',
            feedback:
              '0,75 es el volumen en litros. La pregunta pide mililitros.',
          },
        ],
        hint: 'Son tres grupos iguales de 250 ml.',
        success: 'Necesitás 750 ml.',
        explanation:
          '250 × 3 = 750 ml. La cantidad crece en la misma proporción que las preparaciones.',
      }),
      choice({
        id: 'liters-conversion',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué cantidad es equivalente a 750 ml?',
        skillIds: ['units.volume'],
        correct: '075',
        options: [
          o('075', '0,75 litros'),
          o(
            '75',
            '7,5 litros',
            'unit',
            'Un litro tiene 1.000 ml. 7,5 litros serían 7.500 ml, diez veces más.',
          ),
          o(
            '750',
            '750 litros',
            'magnitude',
            'Cambiar el nombre de la unidad sin convertir cambia la cantidad mil veces.',
          ),
        ],
        hint: 'Dividí los mililitros por 1.000 para pasar a litros.',
        success: '750 ml equivalen a 0,75 litros.',
        explanation:
          '750 ÷ 1.000 = 0,75. Una unidad más grande necesita un número más pequeño para expresar el mismo volumen.',
      }),
      choice({
        id: 'enough-milk',
        kind: 'decide',
        difficulty: 'application',
        prompt: '¿Alcanza la botella de 1 litro?',
        skillIds: ['units.volume'],
        correct: 'yes',
        options: [
          o('yes', 'Sí, sobran 250 ml'),
          o(
            'no',
            'No, porque 750 es mayor que 1',
            'unit',
            '750 está en mililitros y 1 en litros. La botella contiene 1.000 ml.',
          ),
          o(
            'exact',
            'Alcanza justo, no sobra nada',
            'calculation',
            'La botella tiene 1.000 ml y necesitás 750 ml. Restá ambas cantidades.',
          ),
        ],
        hint: 'Expresá la botella como 1.000 ml antes de comparar.',
        success: 'La botella alcanza y queda una preparación más.',
        explanation:
          '1.000 − 750 = 250 ml. La diferencia equivale a otra porción.',
      }),
    ],
  },
  {
    id: 'units-commute-distance',
    familyId: 'units',
    title: 'Dos tramos, una distancia',
    scenario:
      'Caminás 850 m hasta una estación y luego recorrés 1,2 km hasta tu destino. Querés saber la distancia total.',
    skillIds: ['units.length', 'estimation.reasonableness'],
    takeaway:
      'Antes de sumar, convertí a una misma unidad: 850 m + 1.200 m = 2.050 m = 2,05 km.',
    steps: [
      choice({
        id: 'kilometers-to-meters',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Cuántos metros son 1,2 km?',
        skillIds: ['units.length'],
        correct: '1200',
        options: [
          o(
            '120',
            '120 m',
            'unit',
            'Un kilómetro contiene 1.000 metros. 1,2 km debe superar 1.000 m.',
          ),
          o('1200', '1.200 m'),
          o(
            '12000',
            '12.000 m',
            'magnitude',
            '12.000 m son 12 km, diez veces la distancia dada.',
          ),
        ],
        hint: '1 km son 1.000 m y 0,2 km son 200 m.',
        success: '1,2 km equivalen a 1.200 m.',
        explanation:
          '1,2 × 1.000 = 1.200. Ahora ambos tramos se pueden sumar en metros.',
      }),
      choice({
        id: 'commute-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt: '¿Qué total aproximado tiene sentido?',
        skillIds: ['estimation.reasonableness', 'units.length'],
        correct: 'two',
        options: [
          o('two', 'Un poco más de 2 km'),
          o(
            '850',
            'Más de 850 km',
            'unit',
            'El tramo de 850 está expresado en metros: es menos de un kilómetro.',
          ),
          o(
            'one',
            'Menos de 1 km',
            'magnitude',
            'El segundo tramo solo ya mide 1,2 km; el total debe ser mayor.',
          ),
        ],
        hint: '850 m están cerca de 0,8 km; al sumar 1,2 km te acercás a 2 km.',
        success: 'La suma está apenas por encima de 2 km.',
        explanation:
          '0,85 + 1,2 = 2,05 km. La estimación permite descartar resultados enormes o menores a un tramo.',
      }),
      numeric({
        id: 'commute-total',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuál es la distancia total en kilómetros?',
        skillIds: ['units.length'],
        expected: 2.05,
        unit: 'km',
        tolerance: 0.001,
        errors: [
          {
            value: 2050,
            kind: 'unit',
            feedback:
              '2.050 es el total en metros. Dividí por 1.000 para expresarlo en kilómetros.',
          },
          {
            value: 851.2,
            kind: 'unit',
            feedback:
              'Sumaste números con unidades distintas. Convertí 850 m a 0,85 km primero.',
          },
        ],
        hint: 'Sumá 0,85 km y 1,2 km. Podés escribir con coma o punto decimal.',
        success: 'La distancia total es 2,05 km.',
        explanation:
          '850 + 1.200 = 2.050 m. Al dividir por 1.000 obtenés 2,05 km.',
      }),
    ],
  },
  {
    id: 'units-schedule-time',
    familyId: 'units',
    title: 'Llegar con margen',
    scenario:
      'Salís a las 8:10. Caminás 18 minutos, viajás 42 minutos y necesitás otros 15 minutos para un trámite. Tu cita es a las 9:30. No hay otras esperas.',
    skillIds: ['units.time', 'estimation.reasonableness'],
    takeaway:
      'Las duraciones suman 75 minutos: una hora y cuarto. Si salís 8:10 terminás 9:25, con 5 minutos de margen.',
    steps: [
      choice({
        id: 'schedule-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt: '¿Cuánto demandan aproximadamente los tres tramos?',
        skillIds: ['units.time'],
        correct: 'quarter',
        options: [
          o('quarter', 'Una hora y cuarto'),
          o(
            'half',
            'Media hora',
            'magnitude',
            'El tramo de 42 minutos ya supera media hora.',
          ),
          o(
            '175',
            'Una hora y 75 minutos',
            'unit',
            '75 minutos son el total, no minutos extra después de otra hora.',
          ),
        ],
        hint: '18 + 42 completa una hora. Todavía faltan los 15 minutos del trámite.',
        success: 'Una hora más 15 minutos son una hora y cuarto.',
        explanation:
          '18 + 42 + 15 = 75 minutos. Como una hora tiene 60, sobran 15 minutos.',
      }),
      numeric({
        id: 'total-duration',
        kind: 'calculate',
        difficulty: 'foundation',
        prompt: '¿Cuántos minutos suman exactamente los tres tramos?',
        skillIds: ['units.time'],
        expected: 75,
        unit: 'min',
        errors: [
          {
            value: 1.15,
            kind: 'unit',
            feedback:
              'Una hora y 15 minutos no se escribe 1,15 horas. Acá se piden todos los minutos: 60 + 15.',
          },
          {
            value: 60,
            kind: 'calculation',
            feedback:
              '18 + 42 da 60, pero falta sumar el trámite de 15 minutos.',
          },
        ],
        hint: 'Agrupá los dos primeros tramos: 18 + 42 = 60.',
        success: 'La duración total es 75 minutos.',
        explanation: '60 + 15 = 75 minutos, equivalentes a 1,25 horas.',
      }),
      choice({
        id: 'arrival-decision',
        kind: 'decide',
        difficulty: 'application',
        prompt: 'Con los tiempos indicados, ¿llegás a la cita de las 9:30?',
        skillIds: ['units.time', 'estimation.reasonableness'],
        correct: 'margin',
        options: [
          o('margin', 'Sí, terminás a las 9:25 y quedan 5 minutos'),
          o(
            'late',
            'No, terminás a las 9:85',
            'unit',
            'Los minutos del reloj se agrupan de 60 en 60. 8:10 más 75 minutos es 9:25.',
          ),
          o(
            'plenty',
            'Sí, queda más de media hora',
            'calculation',
            'Entre 9:25 y 9:30 solo hay 5 minutos.',
          ),
        ],
        hint: 'A las 8:10 sumale una hora y luego 15 minutos.',
        success: 'Llegás, aunque con un margen de solo 5 minutos.',
        explanation:
          '8:10 + 1 h 15 min = 9:25. La conclusión depende de que no aparezcan otras esperas, como indica el escenario.',
      }),
    ],
  },
  {
    id: 'units-weight-price',
    familyId: 'units',
    title: 'Gramos en el mostrador',
    scenario:
      'Un alimento cuesta $8.000 por kilo a granel. También hay un paquete de 250 g por $2.300. Querés comprar exactamente 250 g.',
    skillIds: ['units.mass', 'proportion.unit-rate'],
    comparison: [
      { label: 'A granel', value: '$8.000', detail: 'por kilo' },
      { label: 'En paquete', value: '$2.300', detail: 'por 250 g' },
    ],
    takeaway:
      '250 g es un cuarto de kilo. A granel cuesta un cuarto de $8.000: $2.000. Para la misma cantidad, ahorrás $300.',
    steps: [
      choice({
        id: 'grams-to-kilo',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué parte de un kilo son 250 g?',
        skillIds: ['units.mass'],
        correct: 'quarter',
        options: [
          o('quarter', 'Un cuarto: 0,25 kg'),
          o(
            'half',
            'La mitad: 0,5 kg',
            'unit',
            'Medio kilo son 500 g. 250 g es la mitad de medio kilo.',
          ),
          o(
            'twohalf',
            'Dos kilos y medio: 2,5 kg',
            'magnitude',
            '2,5 kg son 2.500 g, diez veces la cantidad pedida.',
          ),
        ],
        hint: 'Cuatro porciones de 250 g suman 1.000 g.',
        success: '250 g equivalen a un cuarto de kilo.',
        explanation:
          '250 ÷ 1.000 = 0,25 kg. La proporción es 1 de 4 partes iguales.',
      }),
      numeric({
        id: 'quarter-kilo-price',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos pesos cuestan 250 g a granel?',
        skillIds: ['units.mass', 'proportion.unit-rate'],
        expected: 2000,
        unit: '$',
        errors: [
          {
            value: 32000,
            kind: 'direction',
            feedback:
              'Multiplicar por cuatro calcula cuatro kilos. Para un cuarto de kilo, dividí el precio por cuatro.',
          },
          {
            value: 200,
            kind: 'magnitude',
            feedback:
              'Revisá la escala: cuatro veces el precio de 250 g debe recuperar los $8.000 del kilo.',
          },
        ],
        hint: 'Dividí los $8.000 del kilo en cuatro partes iguales.',
        success: 'Los 250 g a granel cuestan $2.000.',
        explanation: '8.000 × 0,25 = 2.000, equivalente a 8.000 ÷ 4.',
      }),
      choice({
        id: 'weight-price-compare',
        kind: 'compare',
        difficulty: 'application',
        prompt: 'Para comprar 250 g, ¿qué opción tiene menor costo?',
        skillIds: ['proportion.unit-rate'],
        correct: 'loose',
        options: [
          o('loose', 'A granel: $2.000, ahorrás $300'),
          o(
            'package',
            'El paquete: $2.300 es menos que $8.000',
            'unit',
            'Los $8.000 corresponden a un kilo. Compará el costo de 250 g en ambas opciones.',
          ),
          o(
            'same',
            'Cuestan lo mismo por tener el mismo peso',
            'concept',
            'El mismo peso permite comparar, pero no obliga a que ambos vendedores cobren igual.',
          ),
        ],
        hint: 'Ya calculaste cuánto cuesta la misma cantidad a granel.',
        success: 'A granel es $300 más barato para esa cantidad.',
        explanation:
          '2.300 − 2.000 = 300. La comparación es válida porque usa 250 g en ambos casos.',
      }),
    ],
  },
] satisfies Challenge[];
