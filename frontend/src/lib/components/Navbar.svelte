<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { Banknote, BarChart3, LogIn, LogOut, ShieldCheck, Users } from 'lucide-svelte';
    import { sesion, cerrarSesion } from '$lib/session';
    import { toasts } from './Toast.svelte';

    type Link = { href: string; label: string; admin?: boolean };

    const links: Link[] = [
        { href: '/', label: 'Inicio' },
        { href: '/credito', label: 'Solicitar crédito' },
        { href: '/clientes', label: 'Clientes', admin: true },
        { href: '/metricas', label: 'Dashboard', admin: true }
    ];

    async function handleLogout() {
        await cerrarSesion();
        toasts.success('Sesión cerrada');
        await goto('/');
    }

    let pathname = $derived($page.url.pathname);
    let esAdmin = $derived($sesion.admin);
</script>

<nav
    class="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md backdrop-saturate-150"
>
    <div class="container-page flex h-16 items-center justify-between">
        <a
            href="/"
            class="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
        >
            <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                <Banknote size={18} strokeWidth={2.5} />
            </span>
            Bancat
        </a>

        <div class="flex items-center gap-1">
            {#each links as link}
                {#if !link.admin || esAdmin}
                    {@const activo =
                        link.href === '/'
                            ? pathname === '/'
                            : pathname.startsWith(link.href)}
                    <a
                        href={link.href}
                        class="flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium transition-colors {activo
                            ? 'text-primary bg-primary-soft'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
                    >
                        {#if link.href === '/clientes'}
                            <Users size={15} />
                        {:else if link.admin}
                            <BarChart3 size={15} />
                        {/if}
                        {link.label}
                    </a>
                {/if}
            {/each}

            <div class="ml-2 h-6 w-px bg-border"></div>

            {#if $sesion.cargando}
                <div class="h-9 w-24 skeleton ml-2"></div>
            {:else if esAdmin}
                <span
                    class="ml-2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-primary-soft text-accent-foreground text-xs font-semibold"
                >
                    <ShieldCheck size={12} />
                    Admin
                </span>
                <button
                    onclick={handleLogout}
                    class="flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors"
                >
                    <LogOut size={15} />
                    Cerrar sesión
                </button>
            {:else}
                <a
                    href="/login"
                    class="flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <LogIn size={15} />
                    Acceso admin
                </a>
            {/if}
        </div>
    </div>
</nav>
