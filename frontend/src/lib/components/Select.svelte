<script lang="ts">
    import type { HTMLSelectAttributes } from 'svelte/elements';
    import type { Snippet } from 'svelte';

    type Props = {
        value?: string | number | null;
        invalid?: boolean;
        class?: string;
        children: Snippet;
    } & Omit<HTMLSelectAttributes, 'value' | 'class' | 'children'>;

    let {
        value = $bindable(),
        invalid = false,
        class: className = '',
        children,
        ...rest
    }: Props = $props();

    const base =
        'h-11 w-full rounded-md border bg-card px-3.5 text-sm ' +
        'transition-[border-color,box-shadow] duration-150 ' +
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
        'disabled:opacity-50 disabled:cursor-not-allowed appearance-none ' +
        'bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%235b6b62%27><path d=%27M5.25 7.5L10 12.25 14.75 7.5z%27/></svg>")] ' +
        'bg-no-repeat bg-[right_0.75rem_center] pr-10';

    const borderClass = invalid ? 'border-danger' : 'border-input';
</script>

<select
    bind:value
    class="{base} {borderClass} {className}"
    aria-invalid={invalid}
    {...rest}
>
    {@render children()}
</select>
