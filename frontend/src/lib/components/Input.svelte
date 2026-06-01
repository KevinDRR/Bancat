<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type Props = {
        value?: string | number;
        invalid?: boolean;
        class?: string;
    } & Omit<HTMLInputAttributes, 'value' | 'class'>;

    let {
        value = $bindable(),
        invalid = false,
        class: className = '',
        type = 'text',
        ...rest
    }: Props = $props();

    const base =
        'h-11 w-full rounded-md border bg-card px-3.5 text-sm ' +
        'placeholder:text-muted-foreground/70 ' +
        'transition-[border-color,box-shadow] duration-150 ' +
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ' +
        'disabled:opacity-50 disabled:cursor-not-allowed';

    const borderClass = invalid ? 'border-danger' : 'border-input';
</script>

{#if type === 'number'}
    <input
        type="number"
        bind:value
        class="{base} {borderClass} {className}"
        aria-invalid={invalid}
        {...rest}
    />
{:else if type === 'email'}
    <input
        type="email"
        bind:value
        class="{base} {borderClass} {className}"
        aria-invalid={invalid}
        {...rest}
    />
{:else if type === 'password'}
    <input
        type="password"
        bind:value
        class="{base} {borderClass} {className}"
        aria-invalid={invalid}
        {...rest}
    />
{:else}
    <input
        type="text"
        bind:value
        class="{base} {borderClass} {className}"
        aria-invalid={invalid}
        {...rest}
    />
{/if}
