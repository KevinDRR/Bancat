<script lang="ts">
    import type { Snippet } from 'svelte';

    type Props = {
        class?: string;
        padded?: boolean;
        elevated?: boolean;
        children: Snippet;
    };

    let {
        class: className = '',
        padded = true,
        elevated = false,
        children
    }: Props = $props();

    const base =
        'bg-card text-card-foreground border border-border rounded-lg transition-shadow';
    const elev = elevated ? 'shadow-md' : 'shadow-sm';
    const pad = padded ? 'p-6' : '';
</script>

<div class="{base} {elev} {pad} {className}">
    {@render children()}
</div>
