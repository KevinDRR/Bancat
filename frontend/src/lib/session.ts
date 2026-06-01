import { writable } from 'svelte/store';
import { api } from './api';

export const sesion = writable<{ admin: boolean; cargando: boolean }>({
    admin: false,
    cargando: true
});

export async function cargarSesion() {
    try {
        const r = await api.sesion();
        sesion.set({ admin: r.admin, cargando: false });
    } catch {
        sesion.set({ admin: false, cargando: false });
    }
}

export async function cerrarSesion() {
    try {
        await api.logout();
    } finally {
        sesion.set({ admin: false, cargando: false });
    }
}
