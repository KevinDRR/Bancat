<script lang="ts">
    import {
        ArrowLeft,
        ArrowRight,
        Banknote,
        BarChart3,
        Check,
        CheckCircle2,
        ChevronRight,
        Lightbulb,
        Search,
        Sparkles,
        Trash2,
        TrendingUp,
        UserPlus,
        XCircle
    } from 'lucide-svelte';

    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
    import Field from '$lib/components/Field.svelte';
    import Input from '$lib/components/Input.svelte';
    import MoneyInput from '$lib/components/MoneyInput.svelte';
    import Select from '$lib/components/Select.svelte';
    import Stepper from '$lib/components/Stepper.svelte';
    import Badge from '$lib/components/Badge.svelte';
    import Skeleton from '$lib/components/Skeleton.svelte';
    import ProductoChip from '$lib/components/ProductoChip.svelte';
    import ShapChart from '$lib/components/ShapChart.svelte';
    import { toasts } from '$lib/components/Toast.svelte';

    import { api, ApiError } from '$lib/api';
    import { sesion } from '$lib/session';
    import { PRODUCTOS_CATALOGO, PRODUCTO_POR_CLAVE } from '$lib/productos';
    import { formatCOP, formatPct, colorPorNivel } from '$lib/format';
    import type {
        Cliente,
        EvaluarPayload,
        EvaluarResponse,
        ProductoClave,
        QueMejorarResponse
    } from '$lib/types';

    type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

    // -------- Estado del flujo --------
    let paso = $state(0);
    let cargando = $state(false);

    // Paso 0
    let nombre = $state('');
    let correo = $state('');
    let clienteExistente = $state<Cliente | null>(null);

    // Paso 1 — datos financieros
    let edad = $state(30);
    let ingresos = $state(5_000_000);
    let estadoCivil = $state(0);
    let deudasExistentes = $state(2_000_000);
    let saldoCuentas = $state(8_000_000);
    let historialPagos = $state(0.85);
    let tiempoEmpleo = $state(3);
    let tipoEmpleoSel = $state(1);
    let patrimonio = $state(30_000_000);

    // Paso 2
    let productoSolicitado = $state<ProductoClave | null>(null);

    // Paso 3 — resultado
    let resultadoCliente = $state<Cliente | null>(null);
    let queMejorar = $state<QueMejorarResponse | null>(null);

    // Simulador inline (recalcula al cambiar inputs en paso 1 o 2)
    let evaluacionSim = $state<EvaluarResponse | null>(null);
    let cargandoSim = $state(false);

    // Tabla
    let solicitudes = $state<Cliente[]>([]);

    const PASOS = [
        { titulo: 'Identificación', descripcion: 'Nombre y correo' },
        { titulo: 'Perfil financiero', descripcion: 'Datos económicos' },
        { titulo: 'Producto', descripcion: 'Qué quieres' },
        { titulo: 'Resultado', descripcion: 'Decisión y detalle' }
    ];

    async function refrescarSolicitudes() {
        if (!$sesion.admin) {
            solicitudes = [];
            return;
        }
        try {
            solicitudes = await api.listarClientes();
        } catch {
            // Silenciar — la tabla puede estar vacía o el endpoint no estar listo
        }
    }

    $effect(() => {
        $sesion.admin;
        refrescarSolicitudes();
    });

    // -------- Paso 0: buscar cliente --------
    async function handleBuscar(e: Event) {
        e.preventDefault();
        cargando = true;
        try {
            const r = await api.buscarCliente({ nombre, correo });
            if (r.encontrado && r.cliente) {
                clienteExistente = r.cliente;
                edad = r.cliente.edad;
                ingresos = r.cliente.ingresos;
                estadoCivil = r.cliente.estado_civil;
                deudasExistentes = r.cliente.deudas_existentes;
                saldoCuentas = r.cliente.saldo_cuentas;
                historialPagos = r.cliente.historial_pagos;
                tiempoEmpleo = r.cliente.tiempo_empleo;
                tipoEmpleoSel = r.cliente.tipo_empleo;
                patrimonio = r.cliente.patrimonio;
                productoSolicitado = r.cliente.producto_solicitado;
                toasts.info('Cliente encontrado — datos precargados');
            } else {
                clienteExistente = null;
                toasts.info('Cliente nuevo — completa el perfil');
            }
            paso = 1;
        } catch (err) {
            const msg =
                err instanceof ApiError ? err.message : 'No se pudo buscar el cliente';
            toasts.danger(msg);
        } finally {
            cargando = false;
        }
    }

    // -------- Simulador inline (paso 1, 2) --------
    function payloadActual(): EvaluarPayload {
        return {
            edad,
            ingresos,
            estado_civil: estadoCivil,
            deudas_existentes: deudasExistentes,
            saldo_cuentas: saldoCuentas,
            historial_pagos: historialPagos,
            tiempo_empleo: tiempoEmpleo,
            tipo_empleo: tipoEmpleoSel,
            patrimonio,
            producto_solicitado: productoSolicitado
        };
    }

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    $effect(() => {
        // Trigger en cualquier campo
        edad;
        ingresos;
        estadoCivil;
        deudasExistentes;
        saldoCuentas;
        historialPagos;
        tiempoEmpleo;
        tipoEmpleoSel;
        patrimonio;
        productoSolicitado;

        if (paso !== 1 && paso !== 2) return;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => evaluarSim(), 300);
    });

    async function evaluarSim() {
        cargandoSim = true;
        try {
            evaluacionSim = await api.evaluar(payloadActual());
        } catch {
            evaluacionSim = null;
        } finally {
            cargandoSim = false;
        }
    }

    // -------- Paso 3: enviar solicitud --------
    async function handleSolicitar() {
        cargando = true;
        try {
            let cliente: Cliente;
            if (clienteExistente) {
                const r = await api.solicitarCreditoExistente({
                    nombre,
                    correo,
                    producto_solicitado: productoSolicitado
                });
                cliente = r.cliente;
            } else {
                const r = await api.solicitarCredito({
                    nombre,
                    correo,
                    edad,
                    ingresos,
                    estado_civil: estadoCivil,
                    deudas_existentes: deudasExistentes,
                    saldo_cuentas: saldoCuentas,
                    historial_pagos: historialPagos,
                    tiempo_empleo: tiempoEmpleo,
                    tipo_empleo: tipoEmpleoSel,
                    patrimonio,
                    producto_solicitado: productoSolicitado
                });
                cliente = r.cliente;
            }
            resultadoCliente = cliente;

            if (!cliente.credito_aprobado) {
                queMejorar = await api.queMejorar(payloadActual());
            } else {
                queMejorar = null;
            }

            // refrescar tabla (solo admin ve la lista completa)
            await refrescarSolicitudes();
            paso = 3;
            toasts.success('Solicitud procesada');
        } catch (err) {
            const msg =
                err instanceof ApiError ? err.message : 'No se pudo enviar la solicitud';
            toasts.danger(msg);
        } finally {
            cargando = false;
        }
    }

    // -------- Tabla --------
    async function eliminarSolicitud(id: number) {
        if (!confirm('¿Archivar esta solicitud? (se podrá restaurar desde Clientes)')) return;
        try {
            const r = await api.eliminarCliente(id);
            await refrescarSolicitudes();
            toasts.success(r.mensaje);
        } catch {
            toasts.danger('No se pudo archivar');
        }
    }

    function reiniciar() {
        paso = 0;
        clienteExistente = null;
        resultadoCliente = null;
        queMejorar = null;
        evaluacionSim = null;
        nombre = '';
        correo = '';
        productoSolicitado = null;
    }

    // -------- Derivados --------
    let nivelTone = $derived<Tone>(
        (evaluacionSim ? colorPorNivel(evaluacionSim.nivel_riesgo) : 'neutral') as Tone
    );

    let resultadoTone = $derived<Tone>(
        (resultadoCliente ? colorPorNivel(resultadoCliente.nivel_riesgo) : 'neutral') as Tone
    );

    function shortcut(value: number, target: 'ingresos' | 'deudas' | 'saldo' | 'patrimonio') {
        // si el valor es chico (1-999) lo interpretamos en millones para escritura rápida
        if (value < 1000) {
            const v = value * 1_000_000;
            if (target === 'ingresos') ingresos = v;
            else if (target === 'deudas') deudasExistentes = v;
            else if (target === 'saldo') saldoCuentas = v;
            else if (target === 'patrimonio') patrimonio = v;
        }
    }
</script>

<svelte:head>
    <title>Solicitar crédito — Bancat</title>
</svelte:head>

<section class="container-page py-10 md:py-14">
    <header class="mb-8">
        <p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Solicitud de crédito
        </p>
        <h1 class="text-3xl md:text-4xl font-semibold">
            Evaluación instantánea de tu perfil
        </h1>
    </header>

    <Stepper pasos={PASOS} actual={paso} class="mb-10" />

    <div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div class="min-w-0">
            <!-- ===== PASO 0: Identificación ===== -->
            {#if paso === 0}
                <Card elevated class="animate-(--animate-slide-up)">
                    <form onsubmit={handleBuscar} class="flex flex-col gap-5">
                        <div>
                            <h2 class="text-xl font-semibold mb-1">¿Eres cliente nuevo o existente?</h2>
                            <p class="text-sm text-muted-foreground">
                                Buscamos por nombre y correo. Si ya estás registrado,
                                precargaremos tus datos.
                            </p>
                        </div>

                        <div class="grid sm:grid-cols-2 gap-4">
                            <Field label="Nombre completo" for="nombre" required>
                                <Input
                                    id="nombre"
                                    bind:value={nombre}
                                    placeholder="Maria González"
                                    minlength={3}
                                    required
                                />
                            </Field>
                            <Field label="Correo electrónico" for="correo" required>
                                <Input
                                    id="correo"
                                    type="email"
                                    bind:value={correo}
                                    placeholder="maria@ejemplo.com"
                                    required
                                />
                            </Field>
                        </div>

                        <div class="flex justify-end">
                            <Button type="submit" loading={cargando}>
                                <Search size={16} />
                                Continuar
                            </Button>
                        </div>
                    </form>
                </Card>
            {/if}

            <!-- ===== PASO 1: Datos financieros ===== -->
            {#if paso === 1}
                <Card elevated class="animate-(--animate-slide-up)">
                    <div class="flex items-start justify-between mb-5">
                        <div>
                            <h2 class="text-xl font-semibold mb-1">Perfil financiero</h2>
                            <p class="text-sm text-muted-foreground">
                                {#if clienteExistente}
                                    Datos precargados de <strong>{clienteExistente.nombre}</strong>.
                                    Puedes editarlos si tu situación cambió.
                                {:else}
                                    Estos datos alimentan el modelo de scoring.
                                {/if}
                            </p>
                        </div>
                        {#if clienteExistente}
                            <Badge tone="info">
                                <UserPlus size={12} />
                                Cliente existente
                            </Badge>
                        {/if}
                    </div>

                    <div class="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                        <Field label="Edad" for="edad" required>
                            <Input id="edad" type="number" bind:value={edad} min={18} max={80} required />
                        </Field>

                        <Field label="Estado civil" for="estado">
                            <Select id="estado" bind:value={estadoCivil}>
                                <option value={0}>Soltero</option>
                                <option value={1}>Casado</option>
                            </Select>
                        </Field>

                        <Field label="Ingresos mensuales" for="ingresos" hint="Atajo: escribe '5' para 5'000'000" required>
                            <MoneyInput
                                id="ingresos"
                                bind:value={ingresos}
                                onblur={() => shortcut(ingresos, 'ingresos')}
                                required
                            />
                        </Field>

                        <Field label="Deudas existentes" for="deudas" hint="Suma de tus deudas. Los créditos hipotecarios no se tienen en cuenta.">
                            <MoneyInput
                                id="deudas"
                                bind:value={deudasExistentes}
                                onblur={() => shortcut(deudasExistentes, 'deudas')}
                            />
                        </Field>

                        <Field label="Saldo en cuentas" for="saldo">
                            <MoneyInput
                                id="saldo"
                                bind:value={saldoCuentas}
                                onblur={() => shortcut(saldoCuentas, 'saldo')}
                            />
                        </Field>

                        <Field label="Patrimonio" for="patrimonio" hint="Bienes, propiedades, vehículos">
                            <MoneyInput
                                id="patrimonio"
                                bind:value={patrimonio}
                                onblur={() => shortcut(patrimonio, 'patrimonio')}
                            />
                        </Field>

                        <Field label="Historial de pagos" for="historial" hint="Entre 0 (malo) y 1 (perfecto)">
                            <Input
                                id="historial"
                                type="number"
                                bind:value={historialPagos}
                                step="0.05"
                                min={0}
                                max={1}
                            />
                        </Field>

                        <Field label="Tiempo de empleo (años)" for="tiempo">
                            <Input
                                id="tiempo"
                                type="number"
                                bind:value={tiempoEmpleo}
                                step="0.5"
                                min={0}
                                max={50}
                            />
                        </Field>

                        <Field label="Tipo de empleo" for="tipo" class="sm:col-span-2">
                            <Select id="tipo" bind:value={tipoEmpleoSel}>
                                <option value={0}>Informal</option>
                                <option value={1}>Empleado</option>
                                <option value={2}>Independiente</option>
                                <option value={3}>Pensionado</option>
                            </Select>
                        </Field>
                    </div>

                    <div class="flex items-center justify-between mt-6 pt-5 border-t border-border">
                        <Button variant="ghost" onclick={() => (paso = 0)}>
                            <ArrowLeft size={16} />
                            Atrás
                        </Button>
                        <Button onclick={() => (paso = 2)}>
                            Continuar
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </Card>
            {/if}

            <!-- ===== PASO 2: Producto solicitado ===== -->
            {#if paso === 2}
                <Card elevated class="animate-(--animate-slide-up)">
                    <h2 class="text-xl font-semibold mb-1">¿Qué producto te interesa?</h2>
                    <p class="text-sm text-muted-foreground mb-6">
                        Validamos elegibilidad por nivel de riesgo y umbrales de perfil.
                        Si tu perfil no aplica para el que elijas, te diremos por qué.
                    </p>

                    <div class="grid sm:grid-cols-2 gap-3">
                        {#each PRODUCTOS_CATALOGO as producto}
                            <ProductoChip
                                {producto}
                                seleccionado={productoSolicitado === producto.clave}
                                recomendado={evaluacionSim?.producto_recomendado.clave ===
                                    producto.clave}
                                onselect={() => (productoSolicitado = producto.clave)}
                            />
                        {/each}
                    </div>

                    <div class="flex items-center justify-between mt-6 pt-5 border-t border-border">
                        <Button variant="ghost" onclick={() => (paso = 1)}>
                            <ArrowLeft size={16} />
                            Atrás
                        </Button>
                        <Button
                            onclick={handleSolicitar}
                            loading={cargando}
                            disabled={!productoSolicitado}
                        >
                            Solicitar crédito
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </Card>
            {/if}

            <!-- ===== PASO 3: Resultado ===== -->
            {#if paso === 3 && resultadoCliente}
                {@const c = resultadoCliente}
                {@const evaluacion = c.producto_solicitado_evaluacion}
                <div class="flex flex-col gap-5 animate-(--animate-slide-up)">
                    <!-- Banner de decisión -->
                    <Card
                        elevated
                        class="relative overflow-hidden border-l-4 {c.credito_aprobado
                            ? 'border-l-success'
                            : 'border-l-danger'}"
                    >
                        <div class="flex items-start gap-4">
                            <div
                                class="flex h-12 w-12 items-center justify-center rounded-full {c.credito_aprobado
                                    ? 'bg-success-soft text-success'
                                    : 'bg-danger-soft text-danger'}"
                            >
                                {#if c.credito_aprobado}
                                    <CheckCircle2 size={28} />
                                {:else}
                                    <XCircle size={28} />
                                {/if}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-2xl font-semibold {c.credito_aprobado
                                        ? 'text-success'
                                        : 'text-danger'}"
                                >
                                    {c.credito_aprobado ? 'Crédito aprobado' : 'Crédito rechazado'}
                                </p>
                                <p class="text-sm text-muted-foreground mt-1">
                                    {c.nombre} · {c.correo}
                                </p>
                            </div>
                            <Badge tone={resultadoTone}>
                                Riesgo {c.nivel_riesgo}
                            </Badge>
                        </div>
                    </Card>

                    <!-- Cards principales -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Card class="!p-4">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">
                                Probabilidad de riesgo
                            </p>
                            <p class="text-2xl font-bold tabular mt-1">
                                {c.riesgo_porcentaje.toFixed(1)}%
                            </p>
                        </Card>
                        <Card class="!p-4">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">
                                Monto máximo
                            </p>
                            <p class="text-2xl font-bold tabular mt-1">
                                {c.monto_maximo > 0 ? formatCOP(c.monto_maximo) : '—'}
                            </p>
                        </Card>
                        <Card class="!p-4">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">
                                Tasa sugerida
                            </p>
                            <p class="text-2xl font-bold tabular mt-1">
                                {c.tasa_sugerida !== null ? `${c.tasa_sugerida}% E.A.` : 'N/A'}
                            </p>
                        </Card>
                        <Card class="!p-4">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">
                                Producto recomendado
                            </p>
                            <p class="text-lg font-semibold mt-1">
                                {c.producto_recomendado.nombre}
                            </p>
                        </Card>
                    </div>

                    <!-- Producto solicitado (aplica/no aplica) -->
                    {#if evaluacion}
                        <Card
                            class="border-l-4 {evaluacion.aplica
                                ? 'border-l-success bg-success-soft/20'
                                : 'border-l-danger bg-danger-soft/20'}"
                        >
                            <div class="flex items-start gap-3">
                                {#if evaluacion.aplica}
                                    <Check size={20} class="text-success mt-0.5 shrink-0" />
                                {:else}
                                    <XCircle size={20} class="text-danger mt-0.5 shrink-0" />
                                {/if}
                                <div class="min-w-0">
                                    <p class="font-semibold">
                                        Producto solicitado: {evaluacion.nombre}
                                    </p>
                                    <p class="text-sm text-muted-foreground mt-1">
                                        {evaluacion.razon}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    {/if}

                    <!-- SHAP -->
                    {#if c.explicacion}
                        <Card>
                            <div class="flex items-center gap-2 mb-4">
                                <BarChart3 size={18} class="text-primary" />
                                <h3 class="font-semibold">Explicación del modelo (SHAP)</h3>
                            </div>
                            <p class="text-sm text-muted-foreground mb-5">
                                Cada feature aporta positiva o negativamente a la decisión final.
                                <span class="text-danger font-semibold">Rojo</span> sube riesgo,
                                <span class="text-success font-semibold">verde</span> lo baja.
                            </p>
                            <ShapChart explicacion={c.explicacion} />
                        </Card>
                    {/if}

                    <!-- Qué mejorar -->
                    {#if queMejorar && queMejorar.sugerencias.length > 0}
                        <Card class="bg-warning-soft/30 border-warning/30">
                            <div class="flex items-center gap-2 mb-4">
                                <Lightbulb size={18} class="text-warning" />
                                <h3 class="font-semibold">¿Qué debo mejorar?</h3>
                            </div>
                            <p class="text-sm text-muted-foreground mb-5">
                                Estos cambios concretos voltearían tu rechazo a aprobado:
                            </p>
                            <ul class="flex flex-col gap-2">
                                {#each queMejorar.sugerencias as sug}
                                    <li
                                        class="flex items-start gap-3 p-3 rounded-md bg-card border border-border"
                                    >
                                        <TrendingUp size={16} class="text-success mt-0.5 shrink-0" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium">{sug.accion}</p>
                                            <p class="text-xs text-muted-foreground mt-0.5">
                                                Nueva probabilidad:
                                                <span class="text-success font-mono font-semibold">
                                                    {(sug.nueva_probabilidad * 100).toFixed(1)}%
                                                </span>
                                            </p>
                                        </div>
                                    </li>
                                {/each}
                            </ul>
                        </Card>
                    {/if}

                    <div class="flex justify-center gap-3 pt-2">
                        <Button variant="outline" onclick={reiniciar}>
                            <Search size={16} />
                            Otra solicitud
                        </Button>
                    </div>
                </div>
            {/if}

            <!-- Tabla de solicitudes (solo admin) -->
            {#if $sesion.admin && solicitudes.length > 0}
                <Card class="mt-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold">Solicitudes recientes</h3>
                        <Badge tone="neutral">{solicitudes.length}</Badge>
                    </div>
                    <div class="overflow-x-auto -mx-6 px-6">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                                    <th class="text-left font-medium pb-2.5 pr-3">Cliente</th>
                                    <th class="text-left font-medium pb-2.5 pr-3">Nivel</th>
                                    <th class="text-right font-medium pb-2.5 pr-3">Riesgo</th>
                                    <th class="text-right font-medium pb-2.5 pr-3">Monto máx.</th>
                                    <th class="text-left font-medium pb-2.5 pr-3">Decisión</th>
                                    <th class="pb-2.5"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each solicitudes as s}
                                    <tr class="border-b border-border last:border-0">
                                        <td class="py-3 pr-3">
                                            <p class="font-medium">{s.nombre}</p>
                                            <p class="text-xs text-muted-foreground">{s.correo}</p>
                                        </td>
                                        <td class="py-3 pr-3">
                                            <Badge tone={colorPorNivel(s.nivel_riesgo) as Tone}>
                                                {s.nivel_riesgo}
                                            </Badge>
                                        </td>
                                        <td class="py-3 pr-3 text-right tabular">
                                            {s.riesgo_porcentaje.toFixed(1)}%
                                        </td>
                                        <td class="py-3 pr-3 text-right tabular">
                                            {s.monto_maximo > 0 ? formatCOP(s.monto_maximo) : '—'}
                                        </td>
                                        <td class="py-3 pr-3">
                                            {#if s.credito_aprobado}
                                                <Badge tone="success">Aprobado</Badge>
                                            {:else}
                                                <Badge tone="danger">Rechazado</Badge>
                                            {/if}
                                        </td>
                                        <td class="py-3 text-right">
                                            <button
                                                onclick={() => eliminarSolicitud(s.id)}
                                                class="p-1.5 rounded-xs text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors"
                                                aria-label="Eliminar"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </Card>
            {/if}
        </div>

        <!-- ============ Sidebar simulador ============ -->
        <aside class="lg:sticky lg:top-24">
            <Card elevated class="!p-5">
                <div class="flex items-center gap-2 mb-1">
                    <Sparkles size={16} class="text-primary" />
                    <p class="text-xs font-semibold text-primary uppercase tracking-wider">
                        Simulador en vivo
                    </p>
                </div>
                <p class="text-xs text-muted-foreground mb-4">
                    Recalcula al cambiar cualquier campo
                </p>

                {#if paso === 0}
                    <div class="text-sm text-muted-foreground italic">
                        Completa la identificación para empezar a simular.
                    </div>
                {:else if cargandoSim && !evaluacionSim}
                    <div class="space-y-3">
                        <Skeleton height="h-3" />
                        <Skeleton height="h-8" width="w-2/3" />
                        <Skeleton height="h-3" />
                    </div>
                {:else if evaluacionSim}
                    {@const e = evaluacionSim}
                    <div class="space-y-4">
                        <div>
                            <p class="text-xs text-muted-foreground">Decisión</p>
                            <div class="flex items-center gap-2 mt-1">
                                {#if e.credito_aprobado}
                                    <Badge tone="success">
                                        <Check size={12} />
                                        Aprobado
                                    </Badge>
                                {:else}
                                    <Badge tone="danger">
                                        <XCircle size={12} />
                                        Rechazado
                                    </Badge>
                                {/if}
                                <Badge tone={nivelTone}>{e.nivel_riesgo}</Badge>
                            </div>
                        </div>

                        <div>
                            <p class="text-xs text-muted-foreground">Probabilidad de riesgo</p>
                            <div class="flex items-end gap-2 mt-1">
                                <span class="text-3xl font-bold tabular">
                                    {e.riesgo_porcentaje.toFixed(1)}<span class="text-base text-muted-foreground">%</span>
                                </span>
                            </div>
                            <div class="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    class="h-full transition-all duration-500 {e.credito_aprobado
                                        ? 'bg-success'
                                        : 'bg-danger'}"
                                    style="width: {e.riesgo_porcentaje}%"
                                ></div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                            <div>
                                <p class="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Monto máx.
                                </p>
                                <p class="text-sm font-semibold tabular mt-0.5">
                                    {e.monto_maximo > 0 ? formatCOP(e.monto_maximo) : '—'}
                                </p>
                            </div>
                            <div>
                                <p class="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Tasa
                                </p>
                                <p class="text-sm font-semibold tabular mt-0.5">
                                    {e.tasa_sugerida !== null ? `${e.tasa_sugerida}%` : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div class="pt-3 border-t border-border">
                            <p class="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                                Recomendado
                            </p>
                            <p class="text-sm font-semibold flex items-center gap-1.5">
                                <Banknote size={14} class="text-primary" />
                                {e.producto_recomendado.nombre}
                            </p>
                        </div>

                        {#if e.producto_solicitado_evaluacion}
                            {@const ev = e.producto_solicitado_evaluacion}
                            <div
                                class="rounded-md p-3 border {ev.aplica
                                    ? 'bg-success-soft/40 border-success/30'
                                    : 'bg-danger-soft/40 border-danger/30'}"
                            >
                                <div class="flex items-center gap-2">
                                    {#if ev.aplica}
                                        <Check size={14} class="text-success" />
                                    {:else}
                                        <XCircle size={14} class="text-danger" />
                                    {/if}
                                    <p class="text-xs font-semibold">
                                        {PRODUCTO_POR_CLAVE[ev.clave].nombre}: {ev.aplica
                                            ? 'Aplica'
                                            : 'No aplica'}
                                    </p>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}
            </Card>
        </aside>
    </div>
</section>
