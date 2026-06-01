<script lang="ts">
    import { tick } from 'svelte';
    import type { HTMLInputAttributes } from 'svelte/elements';

    type Props = {
        value?: number;
        invalid?: boolean;
        class?: string;
    } & Omit<HTMLInputAttributes, 'value' | 'class' | 'type' | 'inputmode'>;

    let {
        value = $bindable(0),
        invalid = false,
        class: className = '',
        ...rest
    }: Props = $props();

    // Separa los miles con apóstrofe: 25000000 -> "25'000'000".
    function formatear(n: number): string {
        if (n === null || n === undefined || !isFinite(n)) return '';
        return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }

    function soloDigitos(s: string): number {
        const d = s.replace(/\D/g, '');
        return d === '' ? 0 : parseInt(d, 10);
    }

    // Cuántos dígitos hay en un fragmento de texto (para reposicionar el cursor).
    function contarDigitos(s: string): number {
        return (s.match(/\d/g) ?? []).length;
    }

    // Índice en `texto` justo después de haber recorrido `n` dígitos.
    function posicionParaDigitos(texto: string, n: number): number {
        if (n <= 0) return 0;
        let cuenta = 0;
        for (let i = 0; i < texto.length; i++) {
            if (/\d/.test(texto[i])) cuenta++;
            if (cuenta === n) return i + 1;
        }
        return texto.length;
    }

    let el: HTMLInputElement | undefined = $state();
    let display = $state(value ? formatear(value) : '');

    // Sincroniza el texto mostrado cuando `value` cambia desde fuera
    // (p.ej. al precargar un cliente existente o aplicar un atajo onblur),
    // sin pisar lo que el usuario está escribiendo.
    $effect(() => {
        const numActual = soloDigitos(display);
        if (numActual !== value) {
            display = value ? formatear(value) : '';
        }
    });

    function handleInput(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const cursor = input.selectionStart ?? input.value.length;
        const digitosAntes = contarDigitos(input.value.slice(0, cursor));

        const num = soloDigitos(input.value);
        const digitos = input.value.replace(/\D/g, '');

        value = num;
        display = digitos === '' ? '' : formatear(num);

        // Reposicionar el cursor tras el re-render, contando dígitos
        // (insensible a los apóstrofes insertados/removidos).
        tick().then(() => {
            if (!el) return;
            const pos = posicionParaDigitos(display, digitosAntes);
            el.setSelectionRange(pos, pos);
        });
    }

    const base =
        'h-11 w-full rounded-md border bg-card px-3.5 text-sm tabular ' +
        'placeholder:text-muted-foreground/70 ' +
        'transition-[border-color,box-shadow] duration-150 ' +
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
        'disabled:opacity-50 disabled:cursor-not-allowed';

    const borderClass = invalid ? 'border-danger' : 'border-input';
</script>

<input
    bind:this={el}
    type="text"
    inputmode="numeric"
    value={display}
    oninput={handleInput}
    class="{base} {borderClass} {className}"
    aria-invalid={invalid}
    {...rest}
/>
