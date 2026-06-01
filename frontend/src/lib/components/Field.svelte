<script lang="ts">
    import type { Snippet } from 'svelte';

    type Props = {
        label: string;
        hint?: string;
        error?: string;
        required?: boolean;
        for?: string;
        class?: string;
        children: Snippet;
    };

    let {
        label,
        hint,
        error,
        required = false,
        for: forId,
        class: className = '',
        children
    }: Props = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
    <label
        for={forId}
        class="text-sm font-medium text-foreground"
    >
        {label}
        {#if required}<span class="text-danger ml-0.5" aria-hidden="true">*</span>{/if}
    </label>
    {@render children()}
    {#if error}
        <p class="text-xs text-danger flex items-center gap-1.5 mt-0.5" role="alert">
            <span aria-hidden="true">!</span>
            {error}
        </p>
    {:else if hint}
        <p class="text-xs text-muted-foreground">{hint}</p>
    {/if}
</div>
