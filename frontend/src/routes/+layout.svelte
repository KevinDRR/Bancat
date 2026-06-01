<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';
    import { cargarSesion } from '$lib/session';
    import Navbar from '$lib/components/Navbar.svelte';
    import Toast from '$lib/components/Toast.svelte';

    let { children } = $props();

    onMount(() => {
        cargarSesion();
    });
</script>

<div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-1 animate-(--animate-fade-in)">
        {@render children()}
    </main>
    <footer class="border-t border-border bg-card mt-12">
        <div class="container-page py-6 flex items-center justify-between text-xs text-muted-foreground">
            <p>© Bancat — Demo académica de evaluación crediticia con Deep Learning</p>
            <p class="font-mono">FastAPI · PyTorch · SvelteKit</p>
        </div>
    </footer>
</div>
<Toast />
