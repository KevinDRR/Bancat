<script lang="ts">
    type Props = {
        class?: string;
        height?: string;
        width?: string;
    };

    let { class: className = '', height = 'h-4', width = 'w-full' }: Props = $props();
</script>

<div class="skeleton {height} {width} {className}" aria-hidden="true"></div>
