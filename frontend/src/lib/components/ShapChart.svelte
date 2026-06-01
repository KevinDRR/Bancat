<script lang="ts">
    type Props = {
        explicacion: Record<string, number>;
        class?: string;
    };

    let { explicacion, class: className = '' }: Props = $props();

    const NOMBRES_LEGIBLES: Record<string, string> = {
        edad: 'Edad',
        ingresos: 'Ingresos',
        estado_civil: 'Estado civil',
        deudas_existentes: 'Deudas existentes',
        relacion_deuda_ingreso: 'Relación deuda/ingreso',
        saldo_cuentas: 'Saldo en cuentas',
        historial_pagos: 'Historial de pagos',
        tiempo_empleo: 'Antigüedad laboral',
        tipo_empleo: 'Tipo de empleo',
        patrimonio: 'Patrimonio'
    };

    let entradas = $derived(
        Object.entries(explicacion).sort(
            ([, a], [, b]) => Math.abs(b) - Math.abs(a)
        )
    );

    let maxAbs = $derived(
        entradas.reduce((m, [, v]) => Math.max(m, Math.abs(v)), 0.0001)
    );
</script>

<div class="flex flex-col gap-2 {className}">
    <div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span class="flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-success"></span>
            Baja riesgo
        </span>
        <span class="flex items-center gap-1.5">
            Sube riesgo
            <span class="h-2 w-2 rounded-full bg-danger"></span>
        </span>
    </div>

    {#each entradas as [feature, valor]}
        {@const ancho = (Math.abs(valor) / maxAbs) * 50}
        {@const positivo = valor > 0}
        <div class="flex items-center gap-3" title="{feature}: {valor.toFixed(4)}">
            <div class="w-32 shrink-0 text-right text-xs font-medium text-foreground">
                {NOMBRES_LEGIBLES[feature] ?? feature}
            </div>
            <div class="flex-1 relative h-6 flex items-center">
                <div class="absolute left-1/2 top-0 bottom-0 w-px bg-border"></div>
                {#if positivo}
                    <div
                        class="absolute left-1/2 h-4 rounded-r bg-danger/85 transition-all duration-500"
                        style="width: {ancho}%"
                    ></div>
                {:else}
                    <div
                        class="absolute right-1/2 h-4 rounded-l bg-success/85 transition-all duration-500"
                        style="width: {ancho}%"
                    ></div>
                {/if}
            </div>
            <div
                class="w-16 shrink-0 text-xs tabular text-right font-mono {positivo
                    ? 'text-danger'
                    : 'text-success'}"
            >
                {positivo ? '+' : ''}{valor.toFixed(3)}
            </div>
        </div>
    {/each}
</div>
