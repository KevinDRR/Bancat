<script lang="ts">
    import { goto } from '$app/navigation';
    import { Lock, ShieldCheck, User } from 'lucide-svelte';
    import { api, ApiError } from '$lib/api';
    import { sesion } from '$lib/session';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import Field from '$lib/components/Field.svelte';
    import Input from '$lib/components/Input.svelte';
    import { toasts } from '$lib/components/Toast.svelte';

    let usuario = $state('');
    let password = $state('');
    let cargando = $state(false);
    let error = $state('');

    async function submit(e: Event) {
        e.preventDefault();
        error = '';
        cargando = true;
        try {
            await api.login({ usuario, password });
            sesion.set({ admin: true, cargando: false });
            toasts.success('Bienvenido, admin');
            await goto('/metricas');
        } catch (err) {
            if (err instanceof ApiError) {
                error = err.message;
            } else {
                error = 'No se pudo iniciar sesión';
            }
        } finally {
            cargando = false;
        }
    }
</script>

<svelte:head>
    <title>Acceso admin — Bancat</title>
</svelte:head>

<section class="container-page py-16 md:py-24">
    <div class="max-w-md mx-auto">
        <div class="text-center mb-8">
            <div
                class="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground mb-4 shadow-md"
            >
                <ShieldCheck size={24} />
            </div>
            <h1 class="text-2xl font-semibold">Acceso administrador</h1>
            <p class="text-sm text-muted-foreground mt-2">
                Solo el administrador puede ver las métricas internas del modelo.
            </p>
        </div>

        <Card elevated>
            <form onsubmit={submit} class="flex flex-col gap-5">
                <Field label="Usuario" for="usuario" required>
                    <div class="relative">
                        <User
                            size={16}
                            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                            id="usuario"
                            bind:value={usuario}
                            placeholder="admin"
                            autocomplete="username"
                            required
                            class="pl-10"
                        />
                    </div>
                </Field>

                <Field label="Contraseña" for="password" required>
                    <div class="relative">
                        <Lock
                            size={16}
                            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                            id="password"
                            type="password"
                            bind:value={password}
                            placeholder="••••••••"
                            autocomplete="current-password"
                            required
                            class="pl-10"
                        />
                    </div>
                </Field>

                {#if error}
                    <div
                        class="rounded-sm border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                {/if}

                <Button type="submit" loading={cargando} size="lg">
                    {cargando ? 'Verificando...' : 'Iniciar sesión'}
                </Button>
            </form>
        </Card>

        <p class="text-center text-xs text-muted-foreground mt-6 font-mono">
            Credenciales demo: admin / admin123
        </p>
    </div>
</section>
