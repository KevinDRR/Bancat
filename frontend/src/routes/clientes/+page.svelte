<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {
        Archive,
        ArchiveRestore,
        Lock,
        Pencil,
        RefreshCw,
        Search,
        Trash2,
        Users,
        X
    } from 'lucide-svelte';

    import { api, ApiError } from '$lib/api';
    import { sesion } from '$lib/session';
    import { formatCOP, colorPorNivel, tipoEmpleo, estadoCivil } from '$lib/format';
    import Card from '$lib/components/Card.svelte';
    import Badge from '$lib/components/Badge.svelte';
    import Button from '$lib/components/Button.svelte';
    import Field from '$lib/components/Field.svelte';
    import Input from '$lib/components/Input.svelte';
    import Select from '$lib/components/Select.svelte';
    import MoneyInput from '$lib/components/MoneyInput.svelte';
    import { toasts } from '$lib/components/Toast.svelte';
    import type { Cliente, ProductoClave } from '$lib/types';

    type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

    let clientes = $state<Cliente[]>([]);
    let cargando = $state(true);
    let incluirArchivados = $state(true);

    // Buscador por id
    let idBuscar = $state<number | undefined>();
    let resaltadoId = $state<number | null>(null);

    // Edición
    let editando = $state<Cliente | null>(null);
    let guardando = $state(false);

    async function refrescar() {
        cargando = true;
        try {
            clientes = await api.listarClientes(incluirArchivados);
        } catch (err) {
            toasts.danger(err instanceof ApiError ? err.message : 'No se pudo cargar la lista');
        } finally {
            cargando = false;
        }
    }

    onMount(refrescar);

    // Re-cargar cuando cambia el toggle de archivados
    let primeraCarga = true;
    $effect(() => {
        incluirArchivados;
        if (primeraCarga) {
            primeraCarga = false;
            return;
        }
        refrescar();
    });

    async function buscarPorId() {
        if (!idBuscar) {
            toasts.info('Escribe un id para buscar');
            return;
        }
        try {
            const c = await api.obtenerCliente(idBuscar);
            // Asegurar que esté en la lista visible y resaltarlo
            if (!clientes.some((x) => x.id === c.id)) {
                if (c.archivado && !incluirArchivados) incluirArchivados = true;
                await refrescar();
            }
            resaltadoId = c.id;
            toasts.success(`Cliente #${c.id}: ${c.nombre}`);
            setTimeout(() => {
                document
                    .getElementById(`cliente-fila-${c.id}`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        } catch (err) {
            resaltadoId = null;
            toasts.danger(err instanceof ApiError ? err.message : `No existe el cliente #${idBuscar}`);
        }
    }

    // ----- Eliminar (archiva / borra definitivo) -----
    async function eliminar(c: Cliente) {
        const mensaje = c.archivado
            ? `Vas a ELIMINAR DEFINITIVAMENTE a ${c.nombre} (#${c.id}). Los ids se reindexarán. ¿Continuar?`
            : `Archivar a ${c.nombre} (#${c.id})? Podrás restaurarlo o eliminarlo definitivamente después.`;
        if (!confirm(mensaje)) return;
        try {
            const r = await api.eliminarCliente(c.id);
            toasts.success(r.mensaje);
            resaltadoId = null;
            await refrescar();
        } catch (err) {
            toasts.danger(err instanceof ApiError ? err.message : 'No se pudo eliminar');
        }
    }

    async function restaurar(c: Cliente) {
        try {
            await api.restaurarCliente(c.id);
            toasts.success(`${c.nombre} restaurado`);
            await refrescar();
        } catch (err) {
            toasts.danger(err instanceof ApiError ? err.message : 'No se pudo restaurar');
        }
    }

    // ----- Edición -----
    function abrirEdicion(c: Cliente) {
        // Copia para no mutar la fila hasta guardar
        editando = { ...c };
    }

    function cerrarEdicion() {
        editando = null;
    }

    async function guardarEdicion() {
        if (!editando) return;
        guardando = true;
        try {
            const e = editando;
            const r = await api.actualizarCliente(e.id, {
                nombre: e.nombre,
                correo: e.correo,
                edad: e.edad,
                ingresos: e.ingresos,
                estado_civil: e.estado_civil,
                deudas_existentes: e.deudas_existentes,
                saldo_cuentas: e.saldo_cuentas,
                historial_pagos: e.historial_pagos,
                tiempo_empleo: e.tiempo_empleo,
                tipo_empleo: e.tipo_empleo,
                patrimonio: e.patrimonio,
                producto_solicitado: e.producto_solicitado,
                // Reenviar los productos existentes para no borrarlos en el PUT
                productos: e.productos
            });
            toasts.success(`Cliente #${r.cliente.id} actualizado (riesgo recalculado)`);
            editando = null;
            await refrescar();
        } catch (err) {
            toasts.danger(err instanceof ApiError ? err.message : 'No se pudo actualizar');
        } finally {
            guardando = false;
        }
    }

    const PRODUCTOS: { valor: ProductoClave; label: string }[] = [
        { valor: 'hipoteca', label: 'Hipoteca' },
        { valor: 'prestamo', label: 'Préstamo' },
        { valor: 'credito', label: 'Crédito' },
        { valor: 'debito', label: 'Débito' }
    ];

    let activos = $derived(clientes.filter((c) => !c.archivado).length);
    let archivadosCount = $derived(clientes.filter((c) => c.archivado).length);
</script>

<svelte:head>
    <title>Gestión de clientes — Bancat</title>
</svelte:head>

<section class="container-page py-10 md:py-14">
    {#if !$sesion.cargando && !$sesion.admin}
        <Card elevated class="max-w-md mx-auto text-center">
            <div class="flex flex-col items-center gap-4">
                <div class="flex h-12 w-12 items-center justify-center rounded-md bg-warning-soft text-warning">
                    <Lock size={24} />
                </div>
                <div>
                    <h2 class="text-lg font-semibold">Acceso restringido</h2>
                    <p class="text-sm text-muted-foreground mt-1">
                        Esta sección requiere credenciales de administrador.
                    </p>
                </div>
                <Button onclick={() => goto('/login')}>Iniciar sesión</Button>
            </div>
        </Card>
    {:else}
        <header class="mb-8 flex items-end justify-between flex-wrap gap-4">
            <div>
                <p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    Administración
                </p>
                <h1 class="text-3xl md:text-4xl font-semibold flex items-center gap-3">
                    <Users size={30} class="text-primary" />
                    Gestión de clientes
                </h1>
                <p class="text-muted-foreground mt-2">
                    Buscar, editar, archivar y eliminar registros. La eliminación es en dos
                    pasos: primero archiva, y un segundo intento borra definitivamente.
                </p>
            </div>
            <div class="flex gap-2">
                <Badge tone="success">{activos} activos</Badge>
                {#if archivadosCount > 0}
                    <Badge tone="neutral">{archivadosCount} archivados</Badge>
                {/if}
            </div>
        </header>

        <!-- Controles -->
        <Card class="mb-6">
            <div class="flex flex-wrap items-end gap-4">
                <div class="flex items-end gap-2">
                    <Field label="Buscar por ID" for="id-buscar" class="w-40">
                        <Input
                            id="id-buscar"
                            type="number"
                            bind:value={idBuscar}
                            min={1}
                            placeholder="Ej: 5"
                            onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && buscarPorId()}
                        />
                    </Field>
                    <Button onclick={buscarPorId}>
                        <Search size={16} />
                        Buscar
                    </Button>
                </div>

                <label class="flex items-center gap-2 text-sm cursor-pointer ml-auto select-none">
                    <input type="checkbox" bind:checked={incluirArchivados} class="size-4 accent-primary" />
                    Mostrar archivados
                </label>
                <Button variant="outline" onclick={refrescar}>
                    <RefreshCw size={15} />
                    Refrescar
                </Button>
            </div>
        </Card>

        <!-- Tabla -->
        <Card>
            {#if cargando}
                <p class="text-sm text-muted-foreground py-8 text-center">Cargando…</p>
            {:else if clientes.length === 0}
                <p class="text-sm text-muted-foreground py-8 text-center">
                    No hay clientes registrados todavía.
                </p>
            {:else}
                <div class="overflow-x-auto -mx-6 px-6">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                                <th class="text-left font-medium pb-2.5 pr-3">ID</th>
                                <th class="text-left font-medium pb-2.5 pr-3">Cliente</th>
                                <th class="text-left font-medium pb-2.5 pr-3">Nivel</th>
                                <th class="text-right font-medium pb-2.5 pr-3">Ingresos</th>
                                <th class="text-right font-medium pb-2.5 pr-3">Monto máx.</th>
                                <th class="text-left font-medium pb-2.5 pr-3">Estado</th>
                                <th class="text-right font-medium pb-2.5">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each clientes as c (c.id)}
                                <tr
                                    id="cliente-fila-{c.id}"
                                    class="border-b border-border last:border-0 transition-colors {resaltadoId ===
                                    c.id
                                        ? 'bg-primary-soft/50'
                                        : ''} {c.archivado ? 'opacity-60' : ''}"
                                >
                                    <td class="py-3 pr-3 tabular font-mono text-muted-foreground">#{c.id}</td>
                                    <td class="py-3 pr-3">
                                        <p class="font-medium">{c.nombre}</p>
                                        <p class="text-xs text-muted-foreground">{c.correo}</p>
                                    </td>
                                    <td class="py-3 pr-3">
                                        <Badge tone={colorPorNivel(c.nivel_riesgo) as Tone}>
                                            {c.nivel_riesgo}
                                        </Badge>
                                    </td>
                                    <td class="py-3 pr-3 text-right tabular">{formatCOP(c.ingresos)}</td>
                                    <td class="py-3 pr-3 text-right tabular">
                                        {c.monto_maximo > 0 ? formatCOP(c.monto_maximo) : '—'}
                                    </td>
                                    <td class="py-3 pr-3">
                                        {#if c.archivado}
                                            <Badge tone="neutral">Archivado</Badge>
                                        {:else if c.credito_aprobado}
                                            <Badge tone="success">Aprobado</Badge>
                                        {:else}
                                            <Badge tone="danger">Rechazado</Badge>
                                        {/if}
                                    </td>
                                    <td class="py-3 text-right whitespace-nowrap">
                                        <div class="inline-flex items-center gap-1">
                                            <button
                                                onclick={() => abrirEdicion(c)}
                                                class="p-1.5 rounded-xs text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors"
                                                aria-label="Editar"
                                                title="Editar"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            {#if c.archivado}
                                                <button
                                                    onclick={() => restaurar(c)}
                                                    class="p-1.5 rounded-xs text-muted-foreground hover:text-success hover:bg-success-soft transition-colors"
                                                    aria-label="Restaurar"
                                                    title="Restaurar"
                                                >
                                                    <ArchiveRestore size={15} />
                                                </button>
                                                <button
                                                    onclick={() => eliminar(c)}
                                                    class="p-1.5 rounded-xs text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors"
                                                    aria-label="Eliminar definitivamente"
                                                    title="Eliminar definitivamente"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            {:else}
                                                <button
                                                    onclick={() => eliminar(c)}
                                                    class="p-1.5 rounded-xs text-muted-foreground hover:text-warning hover:bg-warning-soft transition-colors"
                                                    aria-label="Archivar"
                                                    title="Archivar"
                                                >
                                                    <Archive size={15} />
                                                </button>
                                            {/if}
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </Card>
    {/if}
</section>

<!-- ===== Modal de edición ===== -->
{#if editando}
    {@const e = editando}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="presentation"
        onclick={cerrarEdicion}
    >
        <div
            class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-card shadow-xl"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            onclick={(ev) => ev.stopPropagation()}
            onkeydown={(ev) => ev.key === 'Escape' && cerrarEdicion()}
        >
            <div class="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-card">
                <h2 class="text-lg font-semibold">Editar cliente #{e.id}</h2>
                <button
                    onclick={cerrarEdicion}
                    class="p-1.5 rounded-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                    aria-label="Cerrar"
                >
                    <X size={18} />
                </button>
            </div>

            <div class="p-6 grid sm:grid-cols-2 gap-x-5 gap-y-4">
                <Field label="Nombre" for="e-nombre" required class="sm:col-span-2">
                    <Input id="e-nombre" bind:value={e.nombre} minlength={3} />
                </Field>
                <Field label="Correo" for="e-correo" required class="sm:col-span-2">
                    <Input id="e-correo" type="email" bind:value={e.correo} />
                </Field>

                <Field label="Edad" for="e-edad" required>
                    <Input id="e-edad" type="number" bind:value={e.edad} min={18} max={80} />
                </Field>
                <Field label="Estado civil" for="e-estado">
                    <Select id="e-estado" bind:value={e.estado_civil}>
                        <option value={0}>Soltero</option>
                        <option value={1}>Casado</option>
                    </Select>
                </Field>

                <Field label="Ingresos mensuales" for="e-ingresos" required>
                    <MoneyInput id="e-ingresos" bind:value={e.ingresos} />
                </Field>
                <Field label="Deudas existentes" for="e-deudas">
                    <MoneyInput id="e-deudas" bind:value={e.deudas_existentes} />
                </Field>
                <Field label="Saldo en cuentas" for="e-saldo">
                    <MoneyInput id="e-saldo" bind:value={e.saldo_cuentas} />
                </Field>
                <Field label="Patrimonio" for="e-patrimonio">
                    <MoneyInput id="e-patrimonio" bind:value={e.patrimonio} />
                </Field>

                <Field label="Historial de pagos" for="e-historial" hint="0 (malo) a 1 (perfecto)">
                    <Input id="e-historial" type="number" bind:value={e.historial_pagos} step="0.05" min={0} max={1} />
                </Field>
                <Field label="Tiempo de empleo (años)" for="e-tiempo">
                    <Input id="e-tiempo" type="number" bind:value={e.tiempo_empleo} step="0.5" min={0} max={50} />
                </Field>

                <Field label="Tipo de empleo" for="e-tipo">
                    <Select id="e-tipo" bind:value={e.tipo_empleo}>
                        <option value={0}>Informal</option>
                        <option value={1}>Empleado</option>
                        <option value={2}>Independiente</option>
                        <option value={3}>Pensionado</option>
                    </Select>
                </Field>
                <Field label="Producto solicitado" for="e-producto">
                    <Select id="e-producto" bind:value={e.producto_solicitado}>
                        <option value={null}>— Ninguno —</option>
                        {#each PRODUCTOS as p}
                            <option value={p.valor}>{p.label}</option>
                        {/each}
                    </Select>
                </Field>
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-border px-6 py-4 sticky bottom-0 bg-card">
                <p class="text-xs text-muted-foreground">
                    Al guardar se recalcula el riesgo con el modelo.
                </p>
                <div class="flex gap-2">
                    <Button variant="ghost" onclick={cerrarEdicion}>Cancelar</Button>
                    <Button onclick={guardarEdicion} loading={guardando}>Guardar cambios</Button>
                </div>
            </div>
        </div>
    </div>
{/if}
