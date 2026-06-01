// Tipos del dominio Bancat — espejan lo que devuelve el backend FastAPI.

export type ProductoClave = 'hipoteca' | 'prestamo' | 'credito' | 'debito';
export type NivelRiesgo = 'Bajo' | 'Moderado' | 'Alto' | 'Muy alto';

export interface ProductoRecomendado {
    clave: ProductoClave;
    nombre: string;
    razon: string;
}

export interface ProductoSolicitadoEvaluacion {
    clave: ProductoClave;
    nombre: string;
    aplica: boolean;
    razon: string;
    monto_aprobado?: number;
    tasa_aplicada?: number | null;
}

export interface Cliente {
    id: number;
    nombre: string;
    correo: string;
    edad: number;
    ingresos: number;
    estado_civil: number;
    deudas_existentes: number;
    saldo_cuentas: number;
    historial_pagos: number;
    tiempo_empleo: number;
    tipo_empleo: number;
    patrimonio: number;
    producto_solicitado: ProductoClave | null;
    archivado: boolean;
    productos: unknown[];
    probabilidad_riesgo: number;
    credito_aprobado: boolean;
    nivel_riesgo: NivelRiesgo;
    riesgo_porcentaje: number;
    monto_maximo: number;
    tasa_sugerida: number | null;
    capacidad_pago_mensual?: number;
    producto_recomendado: ProductoRecomendado;
    producto_solicitado_evaluacion: ProductoSolicitadoEvaluacion | null;
    explicacion: Record<string, number> | null;
}

export interface EvaluarPayload {
    edad: number;
    ingresos: number;
    estado_civil: number;
    deudas_existentes: number;
    saldo_cuentas: number;
    historial_pagos: number;
    tiempo_empleo: number;
    tipo_empleo: number;
    patrimonio: number;
    producto_solicitado?: ProductoClave | null;
}

export interface ClientePayload extends EvaluarPayload {
    nombre: string;
    correo: string;
}

export interface EvaluarResponse {
    probabilidad_riesgo: number;
    credito_aprobado: boolean;
    decision: 'APROBADO' | 'RECHAZADO';
    nivel_riesgo: NivelRiesgo;
    riesgo_porcentaje: number;
    monto_maximo: number;
    tasa_sugerida: number | null;
    capacidad_pago_mensual?: number;
    producto_recomendado: ProductoRecomendado;
    producto_solicitado_evaluacion: ProductoSolicitadoEvaluacion | null;
    explicacion: Record<string, number> | null;
}

export interface QueMejorarSugerencia {
    campo: string;
    accion: string;
    valor_propuesto: number;
    nueva_probabilidad: number;
}

export interface QueMejorarResponse {
    probabilidad_actual: number;
    decision_actual: 'APROBADO' | 'RECHAZADO';
    sugerencias: QueMejorarSugerencia[];
    mensaje?: string;
}

export interface MetricasModelo {
    auc_roc: number;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    matriz_confusion: number[][]; // [[TN, FP], [FN, TP]]
    mejor_epoca?: number;
    epocas_entrenadas?: number;
    muestras_entrenamiento?: number;
    muestras_validacion?: number;
    historial_loss?: {
        train: number[];
        val?: number[];
    };
    [k: string]: unknown;
}

export interface InfoModelo {
    n_features: number;
    nombres_features: string[];
    shap_disponible: boolean;
    umbral_decision: number;
    niveles_riesgo: NivelRiesgo[];
}

export interface EstadisticasClientes {
    total_clientes: number;
    aprobados: number;
    rechazados: number;
    archivados: number;
    tasa_aprobacion: number;
    riesgo_promedio: number;
    ingreso_promedio: number;
    ingreso_mediano: number;
    edad_promedio: number;
    patrimonio_promedio: number;
    deuda_promedio: number;
    monto_total_aprobado: number;
    distribucion_riesgo: Record<string, number>;
    distribucion_tipo_empleo: Record<string, number>;
    distribucion_estado_civil: Record<string, number>;
    distribucion_producto_solicitado: Record<string, number>;
    productos_bancarios_por_tipo: Record<string, number>;
    ingreso_promedio_por_empleo: Record<string, number>;
}
