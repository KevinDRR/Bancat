import type { ProductoClave } from './types';

export interface ProductoCatalogo {
    clave: ProductoClave;
    nombre: string;
    descripcion: string;
    requisito: string;
    icono: 'home' | 'banknote' | 'credit-card' | 'wallet';
}

export const PRODUCTOS_CATALOGO: ProductoCatalogo[] = [
    {
        clave: 'hipoteca',
        nombre: 'Hipoteca',
        descripcion: 'Crédito hipotecario para vivienda con plazo largo',
        requisito: 'Riesgo Bajo · ingresos ≥ $4M · ratio deuda ≤ 30%',
        icono: 'home'
    },
    {
        clave: 'prestamo',
        nombre: 'Préstamo',
        descripcion: 'Préstamo de libre inversión con cuotas mensuales',
        requisito: 'Riesgo ≤ Moderado · ingresos ≥ $1.5M',
        icono: 'banknote'
    },
    {
        clave: 'credito',
        nombre: 'Tarjeta de Crédito',
        descripcion: 'Tarjeta de crédito rotativo con cupo y tasa anual',
        requisito: 'Riesgo ≤ Alto · historial ≥ 0.70',
        icono: 'credit-card'
    },
    {
        clave: 'debito',
        nombre: 'Cuenta de Débito',
        descripcion: 'Cuenta de ahorro y disponibilidad inmediata',
        requisito: 'Disponible para todos los perfiles',
        icono: 'wallet'
    }
];

export const PRODUCTO_POR_CLAVE = Object.fromEntries(
    PRODUCTOS_CATALOGO.map((p) => [p.clave, p])
) as Record<ProductoClave, ProductoCatalogo>;
