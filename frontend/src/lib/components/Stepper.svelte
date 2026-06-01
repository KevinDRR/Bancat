<script lang="ts">
    import { Check } from 'lucide-svelte';

    type Step = { titulo: string; descripcion?: string };

    type Props = {
        pasos: Step[];
        actual: number; // 0-indexed
        class?: string;
    };

    let { pasos, actual, class: className = '' }: Props = $props();
</script>

<div class="flex items-start gap-2 {className}" aria-label="Progreso del flujo">
    {#each pasos as paso, i}
        {@const completado = i < actual}
        {@const activo = i === actual}
        <div class="flex flex-1 flex-col items-center min-w-0">
            <div class="flex items-center w-full">
                {#if i > 0}
                    <div
                        class="h-0.5 flex-1 transition-colors duration-300 {completado || activo
                            ? 'bg-primary'
                            : 'bg-border'}"
                    ></div>
                {:else}
                    <div class="flex-1"></div>
                {/if}

                <div
                    class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 {completado
                        ? 'bg-primary text-primary-foreground'
                        : activo
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/15'
                          : 'bg-muted text-muted-foreground'}"
                    aria-current={activo ? 'step' : undefined}
                >
                    {#if completado}
                        <Check size={16} strokeWidth={3} />
                    {:else}
                        {i + 1}
                    {/if}
                </div>

                {#if i < pasos.length - 1}
                    <div
                        class="h-0.5 flex-1 transition-colors duration-300 {completado
                            ? 'bg-primary'
                            : 'bg-border'}"
                    ></div>
                {:else}
                    <div class="flex-1"></div>
                {/if}
            </div>
            <div class="mt-2 text-center">
                <p
                    class="text-xs font-semibold {activo || completado
                        ? 'text-foreground'
                        : 'text-muted-foreground'}"
                >
                    {paso.titulo}
                </p>
                {#if paso.descripcion}
                    <p class="hidden sm:block text-[11px] text-muted-foreground mt-0.5">
                        {paso.descripcion}
                    </p>
                {/if}
            </div>
        </div>
    {/each}
</div>
