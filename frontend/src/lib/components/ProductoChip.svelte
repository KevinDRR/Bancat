<script lang="ts">
    import { Banknote, CreditCard, Home, Wallet, Check } from 'lucide-svelte';
    import type { ProductoCatalogo } from '$lib/productos';

    type Props = {
        producto: ProductoCatalogo;
        seleccionado?: boolean;
        recomendado?: boolean;
        onselect?: () => void;
        compact?: boolean;
    };

    let {
        producto,
        seleccionado = false,
        recomendado = false,
        onselect,
        compact = false
    }: Props = $props();

    const ICONOS = {
        home: Home,
        banknote: Banknote,
        'credit-card': CreditCard,
        wallet: Wallet
    };

    let Icono = $derived(ICONOS[producto.icono]);
</script>

<button
    type="button"
    onclick={onselect}
    aria-pressed={seleccionado}
    class="group relative h-full flex flex-col items-start text-left rounded-lg border-2 transition-all duration-200 cursor-pointer {seleccionado
        ? 'border-primary bg-primary-soft/40 shadow-md'
        : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'} {compact
        ? 'p-3.5 gap-2'
        : 'p-5 gap-3'}"
>
    {#if recomendado}
        <span
            class="absolute -top-2 right-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider"
        >
            Recomendado
        </span>
    {/if}

    <div class="flex items-center gap-2 w-full">
        <span
            class="flex items-center justify-center rounded-md transition-colors {seleccionado
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground group-hover:bg-primary-soft group-hover:text-primary'} {compact
                ? 'h-8 w-8'
                : 'h-10 w-10'}"
        >
            <Icono size={compact ? 16 : 20} />
        </span>
        <span class="font-semibold {compact ? 'text-sm' : 'text-base'}">
            {producto.nombre}
        </span>
        {#if seleccionado}
            <span
                class="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
                <Check size={12} strokeWidth={3} />
            </span>
        {/if}
    </div>

    {#if !compact}
        <p class="text-xs text-muted-foreground leading-relaxed">
            {producto.descripcion}
        </p>
        <p class="text-[11px] text-muted-foreground/80 font-mono">
            {producto.requisito}
        </p>
    {/if}
</button>
