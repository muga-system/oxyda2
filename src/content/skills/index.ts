import type { Family, Skill } from '../../shared/domain/types';

export const families: Family[] = [
  {
    id: 'percentage',
    slug: 'porcentajes',
    title: 'Porcentajes',
    description: 'Partes, cambios y ofertas: entender de qué total hablamos.',
    question: '¿Un porcentaje de qué?',
  },
  {
    id: 'proportion',
    slug: 'proporciones',
    title: 'Proporciones',
    description:
      'Llevar cantidades a una misma medida para comparar y escalar.',
    question: '¿Qué relación se mantiene?',
  },
  {
    id: 'estimation',
    slug: 'estimacion',
    title: 'Estimación',
    description: 'Anticipar un resultado y saber cuándo alcanza con aproximar.',
    question: '¿En qué orden debería estar?',
  },
  {
    id: 'units',
    slug: 'unidades',
    title: 'Unidades',
    description: 'Conectar medidas de tiempo, distancia, masa y volumen.',
    question: '¿Qué está midiendo este número?',
  },
  {
    id: 'data',
    slug: 'datos',
    title: 'Datos',
    description: 'Leer valores, gráficos y afirmaciones con contexto.',
    question: '¿Qué permiten afirmar estos datos?',
  },
] satisfies Family[];

export const skills: Skill[] = [
  {
    id: 'percentage.part-of-total',
    familyId: 'percentage',
    title: 'Parte de un total',
    description: 'Encontrar una parte o el porcentaje que representa.',
    idea: 'Un porcentaje expresa una cantidad por cada cien. Primero identificá el total que representa el 100%.',
    example:
      'El 25% de $80.000 es $20.000. En sentido inverso, $20.000 de $80.000 representa 20.000 ÷ 80.000 × 100 = 25%.',
  },
  {
    id: 'percentage.change',
    familyId: 'percentage',
    title: 'Aumentos y descuentos',
    description: 'Distinguir cuánto cambia de cuánto queda.',
    idea: 'El descuento es una parte del precio. Para encontrar el precio final, restá esa parte al original; para un aumento, sumala.',
    example:
      'Una campera de $80.000 con 25% de descuento rebaja $20.000 y termina en $60.000.',
  },
  {
    id: 'percentage.inverse',
    familyId: 'percentage',
    title: 'Volver al valor original',
    description: 'Reconstruir el total a partir de una parte conocida.',
    idea: 'Después de un descuento del 20% queda el 80% del original. Dividí lo que queda por 0,80: sumar un 20% al nuevo precio usa otra base.',
    example:
      'Si el precio rebajado es $64.000, el original es 64.000 ÷ 0,80 = $80.000.',
  },
  {
    id: 'percentage.successive',
    familyId: 'percentage',
    title: 'Cambios sucesivos',
    description: 'Reconocer que el segundo cambio actúa sobre una base nueva.',
    idea: 'Los porcentajes sucesivos no se suman directamente: cada cambio usa el valor que dejó el anterior.',
    example:
      '$40.000 aumenta 25% hasta $50.000. Al bajar luego 25%, se restan $12.500 y quedan $37.500.',
  },
  {
    id: 'proportion.ratio',
    familyId: 'proportion',
    title: 'Relaciones entre cantidades',
    description: 'Reconocer qué operación conecta dos magnitudes.',
    idea: 'Una razón compara dos cantidades. Mirá sus unidades para interpretar qué cuenta: kilómetros por hora conecta distancia con tiempo.',
    example:
      'A una velocidad promedio de 60 km/h, recorrer 150 km demanda 150 ÷ 60 = 2,5 horas.',
  },
  {
    id: 'proportion.unit-rate',
    familyId: 'proportion',
    title: 'Precio por unidad',
    description: 'Comparar cantidades distintas sobre una misma base.',
    idea: 'Dividí precio por cantidad, expresada en la misma unidad. El menor precio de un paquete no garantiza el menor precio por kilo.',
    example:
      '750 g por $3.600 equivalen a $4.800 por kilo. 1 kg por $4.600 tiene menor precio por kilo.',
  },
  {
    id: 'proportion.scale',
    familyId: 'proportion',
    title: 'Escalar sin perder la relación',
    description: 'Ampliar o reducir todas las cantidades con el mismo factor.',
    idea: 'Calculá el factor como cantidad nueva ÷ cantidad original y multiplicá por él. No sumes la diferencia de personas a los ingredientes.',
    example:
      'Para pasar una receta de 6 a 14 personas, el factor es 14 ÷ 6. Si usaba 300 g de arroz, ahora necesita 700 g.',
  },
  {
    id: 'estimation.rounding',
    familyId: 'estimation',
    title: 'Redondear con intención',
    description: 'Cambiar cifras por otras cercanas y fáciles de usar.',
    idea: 'Elegí un redondeo acorde a la decisión. Un presupuesto al límite necesita más precisión que una primera idea del gasto.',
    example:
      '$1.980 + $3.050 + $4.020 se aproxima a $2.000 + $3.000 + $4.000 = $9.000. El total exacto es $9.050.',
  },
  {
    id: 'estimation.order-of-magnitude',
    familyId: 'estimation',
    title: 'Orden de magnitud',
    description: 'Detectar resultados diez o cien veces fuera de escala.',
    idea: 'Antes de calcular, ubicá el resultado: ¿decenas, miles, minutos u horas? Una conversión olvidada puede cambiar toda la escala.',
    example:
      'Un archivo de 600 MB a 10 MB por segundo requiere alrededor de 60 segundos, no 6.000.',
  },
  {
    id: 'estimation.reasonableness',
    familyId: 'estimation',
    title: 'Comprobar si tiene sentido',
    description: 'Usar límites y contexto para verificar y decidir.',
    idea: 'Compará el resultado con algo que ya sabés. A veces un límite superior o inferior permite decidir sin terminar la cuenta.',
    example:
      'Con 12 filas de 20 asientos hay 240 lugares. Para 218 personas sobran lugares; si una aproximación queda muy cerca del límite, conviene contar exactamente.',
  },
  {
    id: 'units.time',
    familyId: 'units',
    title: 'Tiempo',
    description: 'Sumar duraciones e interpretar horas decimales.',
    idea: 'Una hora contiene 60 minutos. La parte decimal de una hora se multiplica por 60; no representa directamente minutos.',
    example:
      '2,5 horas son 2 horas y 30 minutos. Una caminata de 18 minutos y un viaje de 42 minutos suman una hora.',
  },
  {
    id: 'units.length',
    familyId: 'units',
    title: 'Distancia',
    description: 'Relacionar metros, kilómetros y escalas.',
    idea: '1 km equivale a 1.000 m. Pasar a una unidad más grande reduce el número, sin cambiar la distancia real.',
    example: '850 m + 1,2 km = 850 m + 1.200 m = 2.050 m = 2,05 km.',
  },
  {
    id: 'units.mass',
    familyId: 'units',
    title: 'Masa',
    description: 'Conectar gramos y kilos antes de comparar.',
    idea: '1 kg equivale a 1.000 g. Una fracción de kilo debe costar la misma fracción del precio por kilo cuando el precio es proporcional.',
    example:
      '250 g son 0,25 kg. A $8.000 por kilo, esa cantidad cuesta $2.000.',
  },
  {
    id: 'units.volume',
    familyId: 'units',
    title: 'Volumen',
    description: 'Pasar de mililitros a litros y escalar cantidades.',
    idea: '1 litro equivale a 1.000 mililitros. Convertí a la misma unidad antes de sumar o decidir si alcanza.',
    example:
      'Tres preparaciones de 250 ml necesitan 750 ml, equivalentes a 0,75 l. Una botella de 1 l alcanza.',
  },
  {
    id: 'data.mean',
    familyId: 'data',
    title: 'Promedio',
    description:
      'Repartir un total e identificar el efecto de valores extremos.',
    idea: 'Sumá todos los valores y dividí por cuántos hay. El promedio utiliza cada valor y puede alejarse de lo habitual si aparece un extremo.',
    example:
      'Tiempos de 10, 10, 10, 10 y 60 minutos suman 100; el promedio es 20 minutos, aunque cuatro de cinco duraron 10.',
  },
  {
    id: 'data.median',
    familyId: 'data',
    title: 'Mediana',
    description: 'Encontrar el centro de los datos ordenados.',
    idea: 'Ordená los valores. La mediana deja la mitad a cada lado; si hay dos valores centrales, promedialos.',
    example:
      'En $600.000, $650.000, $700.000, $750.000 y $3.300.000, la mediana es $700.000. El sueldo más alto no mueve el centro de la lista.',
  },
  {
    id: 'data.graph-reading',
    familyId: 'data',
    title: 'Leer un gráfico',
    description:
      'Mirar escala, eje y valores antes de interpretar una diferencia.',
    idea: 'La longitud visible de las barras depende de dónde empieza el eje de cantidades. Leé los valores y la unidad antes de inferir cuánto cambió algo.',
    example:
      'Pasar de 95 a 100 pedidos es sumar 5, cerca de un 5,3%. Con un eje que empieza en 90, una barra puede parecer el doble de la otra.',
  },
  {
    id: 'data.sample',
    familyId: 'data',
    title: 'Muestras y afirmaciones',
    description: 'Distinguir lo observado de lo que se puede generalizar.',
    idea: 'Una proporción describe a quienes participaron. Para extenderla, importan tanto el tamaño como la forma de elegir la muestra.',
    example:
      'Si 9 de 10 voluntarios recomiendan un servicio, el 90% describe a esos 10. No alcanza para afirmar que el 90% de toda la población lo recomienda.',
  },
] satisfies Skill[];
