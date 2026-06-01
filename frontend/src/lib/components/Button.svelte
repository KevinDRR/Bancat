<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

    type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    type Size = 'sm' | 'md' | 'lg';

    type Props = {
        variant?: Variant;
        size?: Size;
        href?: string;
        loading?: boolean;
        children: Snippet;
    } & Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'children'>;

    let {
        variant = 'primary',
        size = 'md',
        href,
        loading = false,
        disabled,
        class: className = '',
        children,
        ...rest
    }: Props = $props();

    const VARIANTS: Record<Variant, string> = {
        primary:
            'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm',
        secondary:
            'bg-card text-foreground border border-border hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        outline:
            'border border-primary text-primary hover:bg-primary-soft',
        danger: 'bg-danger text-white hover:opacity-90'
    };

    const SIZES: Record<Size, string> = {
        sm: 'h-9 px-3.5 text-sm rounded-sm gap-1.5',
        md: 'h-11 px-5 text-sm rounded-md gap-2',
        lg: 'h-12 px-6 text-base rounded-md gap-2'
    };

    const base =
        'inline-flex items-center justify-center font-medium transition-all duration-200 ' +
        'disabled:opacity-50 disabled:cursor-not-allowed select-none ' +
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ' +
        'active:scale-[0.98]';

    const classes = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
</script>

{#if href}
    <a {href} class={classes} {...rest}>
        {@render children()}
    </a>
{:else}
    <button
        class={classes}
        disabled={disabled || loading}
        {...rest}
    >
        {#if loading}
            <span
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
            ></span>
        {/if}
        {@render children()}
    </button>
{/if}
