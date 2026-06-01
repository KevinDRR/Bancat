// Cliente HTTP delgado para la API FastAPI.
// En desarrollo, Vite hace proxy de /api → http://127.0.0.1:8000.

import type {
    Cliente,
    ClientePayload,
    EstadisticasClientes,
    EvaluarPayload,
    EvaluarResponse,
    InfoModelo,
    MetricasModelo,
    ProductoClave,
    QueMejorarResponse
} from './types';

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public detalle?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(
    method: string,
    url: string,
    body?: unknown,
    init: RequestInit = {}
): Promise<T> {
    const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        ...init
    });

    if (!res.ok) {
        let detalle: unknown = null;
        try {
            detalle = await res.json();
        } catch {
            // ignore
        }
        const detail =
            detalle && typeof detalle === 'object' && 'detail' in detalle
                ? (detalle as { detail: unknown }).detail
                : null;
        const msg =
            typeof detail === 'string' ? detail : `Error ${res.status}: ${res.statusText}`;
        throw new ApiError(msg, res.status, detalle);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}

export const api = {
    buscarCliente: (datos: { nombre: string; correo: string }) =>
        request<{ encontrado: boolean; cliente?: Cliente }>(
            'POST',
            '/api/buscar-cliente',
            datos
        ),

    solicitarCredito: (cliente: ClientePayload) =>
        request<{ cliente: Cliente }>('POST', '/api/solicitar-credito', cliente),

    solicitarCreditoExistente: (datos: {
        nombre: string;
        correo: string;
        producto_solicitado?: ProductoClave | null;
    }) =>
        request<{ cliente: Cliente }>(
            'POST',
            '/api/solicitar-credito-existente',
            datos
        ),

    evaluar: (datos: EvaluarPayload) =>
        request<EvaluarResponse>('POST', '/api/evaluar', datos),

    queMejorar: (datos: EvaluarPayload) =>
        request<QueMejorarResponse>('POST', '/api/que-mejorar', datos),

    listarClientes: (incluirArchivados = false) =>
        request<Cliente[]>(
            'GET',
            `/api/clientes${incluirArchivados ? '?incluir_archivados=true' : ''}`
        ),

    estadisticasClientes: () =>
        request<EstadisticasClientes>('GET', '/api/clientes/estadisticas'),

    obtenerCliente: (id: number) => request<Cliente>('GET', `/api/clientes/${id}`),

    actualizarCliente: (id: number, datos: ClientePayload & { productos?: unknown[] }) =>
        request<{ cliente: Cliente }>('PUT', `/api/clientes/${id}`, datos),

    // Eliminación en dos fases: 1er intento archiva, 2do borra definitivo + reindexa ids.
    eliminarCliente: (id: number) =>
        request<{ accion: 'archivado' | 'eliminado'; mensaje: string }>(
            'DELETE',
            `/api/clientes/${id}`
        ),

    restaurarCliente: (id: number) =>
        request<{ cliente: Cliente }>('POST', `/api/clientes/${id}/restaurar`),

    metricas: () => request<MetricasModelo>('GET', '/api/modelo/metricas'),
    infoModelo: () => request<InfoModelo>('GET', '/api/modelo/info'),

    login: (datos: { usuario: string; password: string }) =>
        request<{ ok: boolean; admin: boolean }>('POST', '/api/login', datos),

    logout: () => request<{ ok: boolean }>('POST', '/api/logout'),

    sesion: () => request<{ admin: boolean }>('GET', '/api/sesion')
};
