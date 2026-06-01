<script lang="ts" module>
    import { writable } from 'svelte/store';

    export type ToastTone = 'success' | 'danger' | 'info' | 'warning';
    export type ToastItem = {
        id: number;
        mensaje: string;
        tone: ToastTone;
    };

    const store = writable<ToastItem[]>([]);
    let nextId = 1;

    export const toasts = {
        subscribe: store.subscribe,
        push: (mensaje: string, tone: ToastTone = 'info', duracion = 3500) => {
            const id = nextId++;
            store.update((arr) => [...arr, { id, mensaje, tone }]);
            setTimeout(() => {
                store.update((arr) => arr.filter((t) => t.id !== id));
            }, duracion);
        },
        success: (m: string) => toasts.push(m, 'success'),
        danger: (m: string) => toasts.push(m, 'danger'),
        info: (m: string) => toasts.push(m, 'info'),
        warning: (m: string) => toasts.push(m, 'warning')
    };
</script>

<script lang="ts">
    import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-svelte';

    const ICONS = {
        success: CircleCheck,
        danger: CircleX,
        info: Info,
        warning: TriangleAlert
    };

    const TONES: Record<ToastTone, string> = {
        success: 'border-success/30 bg-card text-success',
        danger: 'border-danger/30 bg-card text-danger',
        info: 'border-info/30 bg-card text-info',
        warning: 'border-warning/30 bg-card text-warning'
    };
</script>

<div
    class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    role="region"
    aria-label="Notificaciones"
    aria-live="polite"
>
    {#each $toasts as toast (toast.id)}
        {@const Icon = ICONS[toast.tone]}
        <div
            class="pointer-events-auto flex items-start gap-3 rounded-md border bg-card p-3.5 shadow-lg animate-(--animate-slide-up) {TONES[
                toast.tone
            ]}"
        >
            <Icon size={18} class="shrink-0 mt-0.5" />
            <p class="text-sm text-foreground flex-1">{toast.mensaje}</p>
        </div>
    {/each}
</div>
