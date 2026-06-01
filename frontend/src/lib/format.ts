// Formateo localizado (es-CO) para los componentes.

const formatterCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
});

const formatterNumero = new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
});

const formatterPorcentaje = new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

export const formatCOP = (n: number) => formatterCOP.format(Math.round(n));
export const formatNumero = (n: number) => formatterNumero.format(n);
export const formatPct = (n: number) => formatterPorcentaje.format(n);

const NIVEL_COLOR: Record<string, string> = {
    Bajo: 'success',
    Moderado: 'info',
    Alto: 'warning',
    'Muy alto': 'danger'
};

export const colorPorNivel = (nivel: string) => NIVEL_COLOR[nivel] ?? 'info';

export const tipoEmpleo: Record<number, string> = {
    0: 'Informal',
    1: 'Empleado',
    2: 'Independiente',
    3: 'Pensionado'
};

export const estadoCivil: Record<number, string> = {
    0: 'Soltero',
    1: 'Casado'
};
