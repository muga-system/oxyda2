import type { Challenge } from '../../shared/domain/types';
import { choice, numeric, option as o } from './steps';

export const proportionChallenges = [
  {
    id: 'proportion-unit-price',
    familyId: 'proportion',
    title: 'El precio de un kilo',
    scenario:
      'El mismo arroz se vende en dos paquetes: 750 g por $3.600 y 1 kg por $4.600. Necesitás comparar el precio por cantidad.',
    skillIds: [
      'proportion.unit-rate',
      'units.mass',
      'estimation.reasonableness',
    ],
    comparison: [
      { label: 'Paquete A', value: '750 g', detail: '$3.600' },
      { label: 'Paquete B', value: '1 kg', detail: '$4.600' },
    ],
    takeaway:
      'Compará precios sobre la misma cantidad: A cuesta $4.800 por kilo y B $4.600. El paquete más barato no siempre tiene el menor precio por unidad.',
    steps: [
      choice({
        id: 'unit-price-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt:
          'Si 750 g cuestan $3.600, ¿cómo será el precio equivalente de 1 kg?',
        skillIds: ['proportion.unit-rate', 'estimation.reasonableness'],
        correct: 'more',
        options: [
          o(
            'less',
            'Menor que $3.600',
            'direction',
            'Un kilo contiene más arroz que 750 g; a igual precio por cantidad, debe costar más.',
          ),
          o('more', 'Mayor que $3.600, pero menor que $7.200'),
          o(
            'double',
            'Exactamente $7.200',
            'concept',
            'Un kilo no es el doble de 750 g: el doble serían 1.500 g.',
          ),
        ],
        hint: '1.000 g es más que 750 g, pero menos que el doble.',
        success: 'La estimación ubica el precio entre esos límites.',
        explanation:
          'El precio proporcional aumenta con la cantidad. Un kilo es 4/3 de 750 g, así que cuesta un tercio más.',
      }),
      numeric({
        id: 'price-per-kilo',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos pesos cuesta 1 kg al precio del paquete de 750 g?',
        skillIds: ['proportion.unit-rate', 'units.mass'],
        expected: 4800,
        unit: '$',
        errors: [
          {
            value: 4.8,
            kind: 'unit',
            feedback:
              '$4,80 es el precio por gramo. La pregunta pide el precio de 1.000 gramos.',
          },
          {
            value: 2700,
            kind: 'direction',
            feedback:
              'Multiplicar por 0,75 reduce la cantidad. Para pasar de 0,75 kg a 1 kg, dividí el precio por 0,75.',
          },
        ],
        hint: '750 g son tres porciones de 250 g. Encontrá el precio de una y multiplicá por cuatro.',
        success: 'El equivalente es $4.800 por kilo.',
        explanation: '3.600 ÷ 3 × 4 = 4.800, o bien 3.600 ÷ 0,75 = 4.800.',
      }),
      choice({
        id: 'compare-packages',
        kind: 'compare',
        difficulty: 'transfer',
        prompt:
          'Si vas a usar todo el arroz, ¿qué paquete ofrece menor precio por kilo?',
        skillIds: ['proportion.unit-rate'],
        correct: 'b',
        options: [
          o(
            'a',
            'El de 750 g, porque pagás $3.600',
            'interpretation',
            'Ese paquete cuesta menos en total porque contiene menos. Su kilo equivalente cuesta $4.800.',
          ),
          o('b', 'El de 1 kg por $4.600'),
          o(
            'same',
            'Cuestan lo mismo por kilo',
            'calculation',
            'A cuesta $4.800 por kilo y B $4.600: hay $200 de diferencia por kilo.',
          ),
        ],
        hint: 'Compará $4.800 por kilo con $4.600 por kilo.',
        success: 'El paquete de 1 kg tiene menor precio por unidad.',
        explanation:
          'B ahorra $200 por cada kilo frente a A. La decisión usa la misma medida en ambas ofertas.',
      }),
    ],
  },
  {
    id: 'proportion-recipe-scale',
    familyId: 'proportion',
    title: 'De seis a catorce',
    scenario:
      'Una receta para 6 personas lleva 300 g de arroz. Querés preparar las mismas porciones para 14 personas.',
    skillIds: ['proportion.scale', 'units.mass'],
    takeaway:
      'Para conservar las porciones, multiplicá por 14 ÷ 6. También podés calcular 50 g por persona y multiplicar por 14.',
    steps: [
      choice({
        id: 'recipe-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt: '¿Entre qué cantidades debería estar el arroz necesario?',
        skillIds: ['proportion.scale'],
        correct: 'range',
        options: [
          o(
            'less',
            'Menos de 300 g',
            'direction',
            'Hay más personas y las porciones se mantienen: hace falta más arroz.',
          ),
          o('range', 'Entre 600 g y 900 g'),
          o(
            'same',
            'Exactamente 600 g',
            'concept',
            '600 g alcanza para el doble de 6: 12 personas. Acá son 14.',
          ),
        ],
        hint: 'El doble de la receta sirve a 12; el triple, a 18.',
        success: 'Catorce está entre el doble y el triple de seis.',
        explanation:
          'La cantidad buscada debe superar 600 g y ser menor que 900 g.',
      }),
      numeric({
        id: 'scaled-rice',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos gramos necesitás para 14 personas?',
        skillIds: ['proportion.scale'],
        expected: 700,
        unit: 'g',
        errors: [
          {
            value: 308,
            kind: 'operation-selection',
            feedback:
              'Sumar las 8 personas extra a los gramos mezcla unidades. Cada persona necesita su porción de arroz.',
          },
          {
            value: 600,
            kind: 'concept',
            feedback:
              'Duplicar alcanza para 12 personas. Faltan las porciones de otras dos.',
          },
        ],
        hint: '300 ÷ 6 da los gramos por persona. Multiplicá ese valor por 14.',
        success: 'Necesitás 700 g de arroz.',
        explanation: '300 ÷ 6 = 50 g por persona. 50 × 14 = 700 g.',
      }),
      choice({
        id: 'scale-everything',
        kind: 'decide',
        difficulty: 'transfer',
        prompt:
          'Si la receta también lleva 900 ml de caldo, ¿cómo conservás la proporción?',
        skillIds: ['proportion.scale'],
        correct: 'same-factor',
        options: [
          o(
            'same-factor',
            'Usás 2.100 ml: multiplicás también el caldo por 14 ÷ 6',
          ),
          o(
            'same-amount',
            'Sumás 400 ml: el mismo aumento numérico que en el arroz',
            'unit',
            'Gramos de arroz y mililitros de caldo no se escalan sumando el mismo número. Conservá el factor.',
          ),
          o(
            'unchanged',
            'Dejás 900 ml porque solo cambia el arroz',
            'concept',
            'Para mantener la receta deben crecer proporcionalmente arroz y caldo.',
          ),
        ],
        hint: 'El caldo original es tres veces la cantidad numérica de arroz. La relación debe mantenerse.',
        success: 'Todos los ingredientes se escalan con el mismo factor.',
        explanation:
          '900 ÷ 6 × 14 = 2.100 ml. Así cada persona recibe la misma proporción que antes.',
      }),
    ],
  },
  {
    id: 'proportion-travel-time',
    familyId: 'proportion',
    title: 'Cuánto dura el viaje',
    scenario:
      'Un recorrido tiene 150 km. La velocidad promedio para todo el viaje, incluyendo las paradas, es de 60 km/h.',
    skillIds: ['proportion.ratio', 'units.time'],
    takeaway:
      'Tiempo = distancia ÷ velocidad. El resultado de 2,5 horas equivale a 150 minutos, porque media hora son 30 minutos.',
    steps: [
      choice({
        id: 'choose-operation',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué operación permite calcular la duración del viaje?',
        skillIds: ['proportion.ratio'],
        correct: 'divide',
        options: [
          o(
            'multiply',
            '150 × 60',
            'operation-selection',
            'Multiplicar distancia por velocidad no da tiempo. Preguntate cuántos tramos de 60 km caben en 150 km.',
          ),
          o('divide', '150 ÷ 60'),
          o(
            'subtract',
            '150 − 60',
            'unit',
            'Restar kilómetros y kilómetros por hora mezcla magnitudes distintas.',
          ),
        ],
        hint: 'En una hora se recorren 60 km. Buscá cuántas veces entra esa distancia en 150 km.',
        success: 'Dividir la distancia por la velocidad da el tiempo.',
        explanation:
          'La unidad km se cancela al dividir km entre km/h; quedan horas.',
      }),
      choice({
        id: 'travel-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt: '¿Entre qué duraciones estará el recorrido?',
        skillIds: ['proportion.ratio', 'units.time'],
        correct: '2-3',
        options: [
          o(
            'under1',
            'Menos de una hora',
            'magnitude',
            'En una hora se recorren solo 60 km, menos de los 150 km del viaje.',
          ),
          o('2-3', 'Entre 2 y 3 horas'),
          o(
            'over10',
            'Más de 10 horas',
            'magnitude',
            'En 10 horas se recorrerían 600 km, mucho más que lo necesario.',
          ),
        ],
        hint: 'En 2 horas recorrés 120 km; en 3, 180 km.',
        success: '150 km está entre los recorridos de 2 y 3 horas.',
        explanation:
          'La duración exacta debe estar entre 2 y 3 horas, coherente con la distancia y la velocidad dadas.',
      }),
      numeric({
        id: 'travel-minutes',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos minutos dura el viaje?',
        skillIds: ['proportion.ratio', 'units.time'],
        expected: 150,
        unit: 'min',
        errors: [
          {
            value: 2.5,
            kind: 'unit',
            feedback:
              '2,5 es la duración en horas. Convertí esas horas a minutos.',
          },
          {
            value: 125,
            kind: 'unit',
            feedback:
              '0,5 horas son 30 minutos, no 5. Convertí multiplicando por 60.',
          },
        ],
        hint: '150 ÷ 60 = 2,5 horas. Cada hora tiene 60 minutos.',
        success: 'El recorrido dura 150 minutos.',
        explanation: '2,5 × 60 = 150 minutos: 2 horas y 30 minutos.',
      }),
    ],
  },
  {
    id: 'proportion-map-scale',
    familyId: 'proportion',
    title: 'Del mapa al camino',
    scenario:
      'En un mapa de escala 1:50.000, un camino mide 6 cm. La escala relaciona centímetros del mapa con centímetros reales.',
    skillIds: ['proportion.scale', 'units.length'],
    takeaway:
      'La escala conserva la relación entre la misma unidad. 6 cm × 50.000 = 300.000 cm = 3 km.',
    steps: [
      choice({
        id: 'read-scale',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué significa la escala 1:50.000?',
        skillIds: ['proportion.scale'],
        correct: 'same-unit',
        options: [
          o('same-unit', '1 cm del mapa representa 50.000 cm reales'),
          o(
            'kilometers',
            '1 cm del mapa representa 50.000 km',
            'unit',
            'La escala compara las mismas unidades; el segundo número también está en centímetros.',
          ),
          o(
            'reverse',
            '50.000 cm del mapa representan 1 cm real',
            'direction',
            'El mapa reduce la realidad: una medida pequeña del mapa representa una medida mayor real.',
          ),
        ],
        hint: 'Una escala es una razón entre longitudes expresadas en la misma unidad.',
        success: 'Ambos números usan la misma unidad.',
        explanation:
          'Cada centímetro del mapa equivale a 50.000 centímetros reales, es decir, 500 metros.',
      }),
      numeric({
        id: 'real-distance',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos kilómetros representa el camino de 6 cm?',
        skillIds: ['proportion.scale', 'units.length'],
        expected: 3,
        unit: 'km',
        errors: [
          {
            value: 3000,
            kind: 'unit',
            feedback:
              '3.000 es la distancia en metros. La respuesta se pide en kilómetros.',
          },
          {
            value: 300000,
            kind: 'unit',
            feedback:
              '300.000 es la distancia en centímetros. Falta convertir a kilómetros.',
          },
          {
            value: 30,
            kind: 'magnitude',
            feedback: 'Revisá los factores: 100 cm = 1 m y 1.000 m = 1 km.',
          },
        ],
        hint: '1 cm del mapa son 500 m reales. Multiplicá por 6 y convertí a kilómetros.',
        success: 'El camino representa 3 km.',
        explanation: '6 × 500 = 3.000 m. Como 1.000 m = 1 km, 3.000 m = 3 km.',
      }),
      choice({
        id: 'check-map-units',
        kind: 'recognize',
        label: 'Verificar',
        difficulty: 'relation',
        prompt: '¿Qué igualdad mantiene la misma distancia real?',
        skillIds: ['units.length'],
        correct: 'equivalent',
        options: [
          o('equivalent', '3 km = 3.000 m = 300.000 cm'),
          o(
            'hundred',
            '3 km = 300 m = 30.000 cm',
            'unit',
            'Un kilómetro contiene 1.000 metros, no 100.',
          ),
          o(
            'million',
            '3 km = 300.000 m',
            'magnitude',
            '300.000 metros son 300 kilómetros: cien veces la distancia del camino.',
          ),
        ],
        hint: 'Para pasar de km a m multiplicás por 1.000; de m a cm, por 100.',
        success: 'La distancia se conserva al cambiar de unidad.',
        explanation:
          'Cambia el número que expresa la medida, pero el camino real sigue midiendo lo mismo.',
      }),
    ],
  },
] satisfies Challenge[];
