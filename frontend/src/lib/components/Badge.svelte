<script lang="ts">
    import type { Snippet } from 'svelte';

    type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

    type Props = {
        tone?: Tone;
        class?: string;
        children: Snippet;
    };

    let { tone = 'neutral', class: className = '', children }: Props = $props();

    const TONES: Record<Tone, string> = {
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-danger-soft text-danger',
        info: 'bg-info-soft text-info',
        primary: 'bg-primary-soft text-accent-foreground',
        neutral: 'bg-muted text-muted-foreground'
    };
</script>

<span
    class="inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-xs font-medium {TONES[
        tone
    ]} {className}"
>
    {@render children()}
</span>
