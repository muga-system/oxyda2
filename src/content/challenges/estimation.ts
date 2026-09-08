import type { Challenge } from '../../shared/domain/types';
import { choice, numeric, option as o } from './steps';

export const estimationChallenges = [
  {
    id: 'estimation-download-time',
    slug: 'tiempo-de-descarga',
    familyId: 'estimation',
    title: '¿Segundos o una tarde?',
    scenario:
      'Vas a descargar un archivo de 600 MB. La velocidad se mantiene en 10 MB por segundo. Usamos MB en ambos datos, sin conversiones adicionales.',
    skillIds: [
      'estimation.order-of-magnitude',
      'proportion.ratio',
      'units.time',
    ],
    takeaway:
      'Si cada segundo llegan 10 MB, en 60 segundos llegan 600 MB. Ubicar el orden de magnitud ayuda a detectar una división o unidad incorrecta.',
    steps: [
      choice({
        id: 'download-estimate',
        kind: 'estimate',
        difficulty: 'foundation',
        prompt: '¿Qué duración tiene sentido para la descarga?',
        skillIds: ['estimation.order-of-magnitude'],
        correct: 'minute',
        options: [
          o(
            'second',
            'Alrededor de 1 segundo',
            'magnitude',
            'En un segundo llegan 10 MB, muy por debajo de los 600 MB.',
          ),
          o('minute', 'Alrededor de 1 minuto'),
          o(
            'hours',
            'Alrededor de 2 horas',
            'magnitude',
            'En una hora llegarían 36.000 MB a esa velocidad, mucho más que el archivo.',
          ),
        ],
        hint: 'En 10 segundos llegan 100 MB. ¿Cuántos grupos de 100 MB hacen falta?',
        success: 'Un minuto es el orden de magnitud esperado.',
        explanation:
          '600 ÷ 10 = 60 segundos. No hace falta una cuenta larga para distinguir un minuto de varias horas.',
      }),
      numeric({
        id: 'download-seconds',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuántos segundos necesita la descarga?',
        skillIds: ['proportion.ratio', 'units.time'],
        expected: 60,
        unit: 's',
        errors: [
          {
            value: 6000,
            kind: 'operation-selection',
            feedback:
              'Multiplicaste tamaño por velocidad. Para hallar tiempo necesitás dividir el tamaño por lo que llega cada segundo.',
          },
          {
            value: 1,
            kind: 'unit',
            feedback: '1 es la duración en minutos. La pregunta pide segundos.',
          },
        ],
        hint: 'Dividí los 600 MB entre los 10 MB que llegan por segundo.',
        success: 'Necesita 60 segundos.',
        explanation:
          '600 MB ÷ 10 MB/s = 60 s. Las unidades de tamaño se cancelan y queda tiempo.',
      }),
      choice({
        id: 'verify-download',
        kind: 'recognize',
        label: 'Verificar',
        difficulty: 'relation',
        prompt: '¿Qué comprobación recupera el tamaño del archivo?',
        skillIds: ['estimation.order-of-magnitude', 'proportion.ratio'],
        correct: 'multiply',
        options: [
          o('multiply', '10 MB/s × 60 s = 600 MB'),
          o(
            'add',
            '10 + 60 = 70 MB',
            'operation-selection',
            'Sumar velocidad y duración no produce el tamaño descargado.',
          ),
          o(
            'divide',
            '60 ÷ 10 = 6 MB',
            'direction',
            'Para recuperar el tamaño, multiplicás cuánto llega por segundo por la cantidad de segundos.',
          ),
        ],
        hint: 'La comprobación invierte la división que usaste para encontrar el tiempo.',
        success: 'Velocidad por tiempo devuelve los 600 MB.',
        explanation:
          'El resultado vuelve al dato inicial y coincide con la estimación de un minuto.',
      }),
    ],
  },
  {
    id: 'estimation-event-capacity',
    slug: 'capacidad-del-evento',
    familyId: 'estimation',
    title: '¿Alcanzan los lugares?',
    scenario:
      'Un encuentro tiene 218 inscripciones confirmadas. La sala tiene 12 filas de 20 asientos disponibles cada una.',
    skillIds: ['estimation.reasonableness', 'estimation.rounding'],
    takeaway:
      'Una aproximación puede resolver una decisión si deja margen suficiente. Cuando el resultado queda cerca del límite, hace falta verificar el dato exacto.',
    steps: [
      choice({
        id: 'capacity-estimate',
        kind: 'estimate',
        difficulty: 'application',
        prompt: '¿Qué aproximación sirve para una primera comparación?',
        skillIds: ['estimation.rounding'],
        correct: '220',
        options: [
          o(
            '200',
            'Redondear 218 a 200 y asumir que no hay nadie más',
            'interpretation',
            'Redondear no elimina las 18 personas restantes. Esa aproximación necesita margen antes de decidir.',
          ),
          o('220', 'Tomar unas 220 personas y comparar con 240 asientos'),
          o(
            '300',
            'Tomar 300 personas como si fuera el número exacto',
            'magnitude',
            '300 está demasiado lejos de 218 para esta comparación y no es el número exacto.',
          ),
        ],
        hint: 'Redondeá 218 a una decena cercana y calculá 12 × 20.',
        success: '220 y 240 permiten ver el margen rápidamente.',
        explanation:
          '218 está cerca de 220. La sala tiene 240 asientos, así que la estimación deja unos 20 lugares de margen.',
      }),
      choice({
        id: 'enough-seats',
        kind: 'decide',
        difficulty: 'application',
        prompt:
          '¿Hace falta calcular la cantidad exacta de asientos libres para saber si entran las 218 personas?',
        skillIds: ['estimation.reasonableness'],
        correct: 'no',
        options: [
          o('no', 'No: 218 es menor que 240, así que alcanzan'),
          o(
            'yes',
            'Sí: sin saber el sobrante exacto no se puede decidir',
            'concept',
            'Para saber si alcanzan basta comparar la cantidad de personas con la capacidad.',
          ),
          o(
            'not-enough',
            'No alcanzan, porque 218 supera 200',
            'interpretation',
            'La capacidad de la sala es 240, no 200. Compará con los asientos reales.',
          ),
        ],
        hint: 'La pregunta es si alcanzan, no cuántos sobran.',
        success: 'La comparación ya resuelve la decisión.',
        explanation:
          '240 > 218 demuestra que hay suficientes lugares. Los 22 asientos libres son útiles si después necesitás organizar su distribución.',
      }),
      choice({
        id: 'near-capacity',
        kind: 'decide',
        difficulty: 'transfer',
        prompt:
          'En otro encuentro esperan «unas 240 personas» para la misma sala. ¿Qué conviene hacer?',
        skillIds: ['estimation.reasonableness'],
        correct: 'verify',
        options: [
          o(
            'assume',
            'Dar por hecho que entran exactamente',
            'interpretation',
            '«Unas 240» es aproximado y podría superar la capacidad.',
          ),
          o(
            'verify',
            'Confirmar la cantidad exacta o prever lugares adicionales',
          ),
          o(
            'cancel',
            'Cancelar porque una estimación nunca es útil',
            'concept',
            'La estimación fue útil para detectar que el margen es escaso; ahora hace falta precisar.',
          ),
        ],
        hint: 'Cuando la estimación coincide con el límite, ya no hay margen seguro.',
        success: 'Cerca del límite conviene buscar más precisión.',
        explanation:
          'La precisión necesaria depende de la decisión. Un margen amplio permite aproximar; uno escaso exige confirmar.',
      }),
    ],
  },
  {
    id: 'estimation-grocery-total',
    slug: 'total-de-compras',
    familyId: 'estimation',
    title: 'Una cuenta antes de la caja',
    scenario:
      'Llevás tres productos de $1.980, $3.050 y $4.020. Tenés un presupuesto de $10.000.',
    skillIds: ['estimation.rounding', 'estimation.reasonableness'],
    takeaway:
      'Redondear a miles cercanos da una referencia de $9.000. El total exacto es $9.050; el margen de $950 permite concluir que alcanza.',
    steps: [
      choice({
        id: 'round-prices',
        kind: 'recognize',
        difficulty: 'foundation',
        prompt: '¿Qué redondeo conserva una buena idea del gasto?',
        skillIds: ['estimation.rounding'],
        correct: 'nearest',
        options: [
          o('nearest', '$2.000 + $3.000 + $4.000'),
          o(
            'drop',
            '$1.000 + $3.000 + $4.000',
            'calculation',
            '$1.980 está mucho más cerca de $2.000 que de $1.000. Truncar aquí subestima casi mil pesos.',
          ),
          o(
            'decimal',
            '$20 + $30 + $40',
            'magnitude',
            'Ese cambio reduce los precios cien veces y pierde la escala del gasto.',
          ),
        ],
        hint: 'Elegí el millar más cercano para cada precio.',
        success: 'Los tres redondeos quedan cerca de los precios reales.',
        explanation:
          '$1.980 sube $20, $3.050 baja $50 y $4.020 baja $20. La aproximación total queda $50 por debajo del valor real.',
      }),
      numeric({
        id: 'grocery-estimate',
        kind: 'estimate',
        difficulty: 'foundation',
        prompt:
          'Sumando $2.000, $3.000 y $4.000, ¿cuál es el total aproximado en pesos?',
        skillIds: ['estimation.rounding'],
        expected: 9000,
        unit: '$',
        errors: [
          {
            value: 9,
            kind: 'magnitude',
            feedback:
              'La suma da 9 miles. Expresá el resultado completo en pesos.',
          },
          {
            value: 9050,
            kind: 'interpretation',
            feedback:
              '$9.050 es el total exacto. Esta etapa pide la suma de los precios redondeados.',
          },
        ],
        hint: 'Sumá 2 + 3 + 4 y conservá los miles.',
        success: 'El total aproximado es $9.000.',
        explanation:
          '2.000 + 3.000 + 4.000 = 9.000. Es una referencia para comparar con el presupuesto.',
      }),
      choice({
        id: 'grocery-budget',
        kind: 'decide',
        difficulty: 'application',
        prompt: 'El total exacto es $9.050. ¿Qué conclusión está respaldada?',
        skillIds: ['estimation.reasonableness'],
        correct: 'enough',
        options: [
          o('enough', 'El presupuesto alcanza y quedan $950'),
          o(
            'exact',
            'Quedan exactamente $1.000 porque la estimación era $9.000',
            'interpretation',
            'Una aproximación no reemplaza al total exacto cuando querés conocer el dinero restante.',
          ),
          o(
            'short',
            'Faltan $950',
            'direction',
            'El gasto es menor que los $10.000 disponibles: hay un sobrante, no un faltante.',
          ),
        ],
        hint: 'Compará $10.000 disponibles con $9.050 de gasto.',
        success: 'La decisión coincide con la estimación inicial.',
        explanation:
          '10.000 − 9.050 = 950. El redondeo permitió anticipar que el presupuesto alcanzaba.',
      }),
    ],
  },
  {
    id: 'estimation-magnitude-error',
    slug: 'error-de-magnitud',
    familyId: 'estimation',
    title: 'Un cero fuera de lugar',
    scenario:
      'Una caja tiene 24 cuadernos y cada cuaderno cuesta $1.500. En una planilla aparece un total de $360.000.',
    skillIds: ['estimation.order-of-magnitude', 'estimation.reasonableness'],
    takeaway:
      'Veinticuatro artículos de unos mil quinientos pesos suman decenas de miles, no cientos de miles. Verificar la escala permite detectar un cero extra.',
    steps: [
      choice({
        id: 'magnitude-debug',
        kind: 'debug',
        difficulty: 'application',
        prompt: '¿Cuál es el problema más evidente del resultado?',
        debug: '24 × $1.500 = $360.000',
        skillIds: ['estimation.order-of-magnitude'],
        correct: 'tenfold',
        options: [
          o('tenfold', 'El resultado es diez veces mayor que el correcto'),
          o(
            'small',
            'El resultado es diez veces menor',
            'direction',
            '$360.000 está por encima de unas decenas de miles, no por debajo.',
          ),
          o(
            'correct',
            'No hay error: multiplicar siempre produce cientos de miles',
            'concept',
            'La escala depende de los factores. 20 × 1.500 ya permite anticipar unos $30.000.',
          ),
        ],
        hint: '20 × $1.500 = $30.000. Otros cuatro cuadernos no pueden elevar el total a $360.000.',
        success: 'El resultado está un orden de magnitud por encima.',
        explanation: '24 × 1.500 = 36.000. La planilla tiene un cero de más.',
      }),
      numeric({
        id: 'correct-total',
        kind: 'calculate',
        difficulty: 'application',
        prompt: '¿Cuál es el total correcto en pesos?',
        skillIds: ['estimation.reasonableness'],
        expected: 36000,
        unit: '$',
        errors: [
          {
            value: 360000,
            kind: 'magnitude',
            feedback:
              'Ese es el valor que estamos revisando. Separá 20 cuadernos y 4 cuadernos.',
          },
          {
            value: 3600,
            kind: 'magnitude',
            feedback:
              'Solo dos cuadernos ya cuestan $3.000. Veinticuatro deben costar mucho más.',
          },
        ],
        hint: '20 × 1.500 = 30.000 y 4 × 1.500 = 6.000.',
        success: 'Los 24 cuadernos cuestan $36.000.',
        explanation:
          '30.000 + 6.000 = 36.000. El resultado coincide con las decenas de miles estimadas.',
      }),
      choice({
        id: 'verify-total',
        kind: 'recognize',
        label: 'Verificar',
        difficulty: 'relation',
        prompt:
          '¿Qué operación comprueba el total desde el precio por cuaderno?',
        skillIds: ['estimation.reasonableness'],
        correct: 'divide',
        options: [
          o('divide', '$36.000 ÷ 24 = $1.500 por cuaderno'),
          o(
            'subtract',
            '$36.000 − 24 = $35.976 por cuaderno',
            'operation-selection',
            'Para repartir un total entre 24 artículos se divide, no se resta la cantidad de artículos.',
          ),
          o(
            'multiply',
            '$36.000 × 24 = precio de un cuaderno',
            'direction',
            'Multiplicar el total por la cantidad vuelve a agrandar la suma. Necesitás recuperar un solo cuaderno.',
          ),
        ],
        hint: 'Dividí el costo total en 24 partes iguales.',
        success: 'El precio unitario recuperado coincide con el dato inicial.',
        explanation:
          'La operación inversa devuelve $1.500 por cuaderno, una verificación independiente del total.',
      }),
    ],
  },
] satisfies Challenge[];
