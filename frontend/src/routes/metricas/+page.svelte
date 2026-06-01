<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import {
        Activity,
        BrainCircuit,
        Briefcase,
        CheckCircle2,
        Database,
        Gauge,
        Lock,
        PieChart,
        Target,
        TrendingDown,
        TrendingUp,
        Users,
        Wallet,
        Zap
    } from 'lucide-svelte';
    import { api, ApiError } from '$lib/api';
    import { sesion } from '$lib/session';
    import { formatCOP } from '$lib/format';
    import Card from '$lib/components/Card.svelte';
    import Badge from '$lib/components/Badge.svelte';
    import Skeleton from '$lib/components/Skeleton.svelte';
    import Button from '$lib/components/Button.svelte';
    import DonutChart from '$lib/components/DonutChart.svelte';
    import BarChart from '$lib/components/BarChart.svelte';
    import LossChart from './LossChart.svelte';
    import type { MetricasModelo, InfoModelo, EstadisticasClientes } from '$lib/types';

    let metricas = $state<MetricasModelo | null>(null);
    let info = $state<InfoModelo | null>(null);
    let stats = $state<EstadisticasClientes | null>(null);
    let cargando = $state(true);
    let error = $state('');

    async function cargarTodo() {
        try {
            const [m, i, s] = await Promise.all([
                api.metricas(),
                api.infoModelo(),
                api.estadisticasClientes()
            ]);
            metricas = m;
            info = i;
            stats = s;
        } catch (err) {
            if (err instanceof ApiError) error = err.message;
            else error = 'No se pudieron cargar las métricas';
        } finally {
            cargando = false;
        }
    }

    onMount(cargarTodo);

    // Matriz de confusión: [[TN, FP], [FN, TP]]
    let cm = $derived(metricas?.matriz_confusion);

    let total = $derived(cm ? cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1] : 0);

    // ----- Colores coherentes con el tema para las gráficas de cartera -----
    const COLOR_NIVEL: Record<string, string> = {
        Bajo: '#047857',
        Moderado: '#2563eb',
        Alto: '#d97706',
        'Muy alto': '#dc2626'
    };
    const PALETA = ['#047857', '#2563eb', '#7c3aed', '#d97706', '#0ea5e9', '#dc2626'];

    // Helpers para convertir los dicts del backend en {labels, data} para las gráficas
    const labelsDe = (o: Record<string, number> | undefined) => (o ? Object.keys(o) : []);
    const dataDe = (o: Record<string, number> | undefined) => (o ? Object.values(o) : []);

    const NOMBRE_PRODUCTO: Record<string, string> = {
        hipoteca: 'Hipoteca',
        prestamo: 'Préstamo',
        credito: 'Crédito',
        debito: 'Débito'
    };
    const capitalizarProductos = (o: Record<string, number> | undefined) =>
        o ? Object.keys(o).map((k) => NOMBRE_PRODUCTO[k] ?? k) : [];
</script>

<svelte:head>
    <title>Métricas del modelo — Bancat</title>
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
                    Dashboard
                </p>
                <h1 class="text-3xl md:text-4xl font-semibold">
                    Cartera y desempeño del modelo
                </h1>
                <p class="text-muted-foreground mt-2">
                    Analítica de los clientes almacenados y evaluación del modelo de scoring.
                </p>
            </div>
            {#if stats}
                <Badge tone="primary">
                    <Users size={12} />
                    {stats.total_clientes} clientes activos
                </Badge>
            {/if}
        </header>

        <!-- ============ SECCIÓN: CARTERA DE CLIENTES ============ -->
        {#if stats && stats.total_clientes > 0}
            <div class="flex items-center gap-2 mb-4">
                <Users size={18} class="text-primary" />
                <h2 class="text-xl font-semibold">Cartera de clientes</h2>
                <span class="text-xs text-muted-foreground">· se actualiza al agregar o editar clientes</span>
            </div>

            <!-- KPIs de cartera -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {#each [
                    { icon: Users, label: 'Total clientes', valor: String(stats.total_clientes), sub: `${stats.archivados} archivados`, tone: 'primary' },
                    { icon: CheckCircle2, label: 'Tasa de aprobación', valor: `${stats.tasa_aprobacion}%`, sub: `${stats.aprobados} aprob. · ${stats.rechazados} rech.`, tone: 'success' },
                    { icon: Gauge, label: 'Riesgo promedio', valor: `${stats.riesgo_promedio}%`, sub: `edad media ${stats.edad_promedio} años`, tone: 'warning' },
                    { icon: Wallet, label: 'Monto total aprobado', valor: formatCOP(stats.monto_total_aprobado), sub: `ingreso medio ${formatCOP(stats.ingreso_promedio)}`, tone: 'info' }
                ] as kpi}
                    <Card class="!p-5">
                        <div class="flex items-center justify-between mb-3">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                {kpi.label}
                            </p>
                            <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
                                <kpi.icon size={16} />
                            </span>
                        </div>
                        <p class="text-2xl font-bold tabular">{kpi.valor}</p>
                        <p class="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                    </Card>
                {/each}
            </div>

            <!-- Gráficas de cartera -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <PieChart size={16} class="text-primary" />
                        <h3 class="font-semibold">Distribución por nivel de riesgo</h3>
                    </div>
                    <DonutChart
                        labels={labelsDe(stats.distribucion_riesgo)}
                        data={dataDe(stats.distribucion_riesgo)}
                        colors={labelsDe(stats.distribucion_riesgo).map((n) => COLOR_NIVEL[n] ?? '#64748b')}
                    />
                </Card>

                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <CheckCircle2 size={16} class="text-success" />
                        <h3 class="font-semibold">Decisiones de crédito</h3>
                    </div>
                    <DonutChart
                        labels={['Aprobados', 'Rechazados']}
                        data={[stats.aprobados, stats.rechazados]}
                        colors={['#047857', '#dc2626']}
                    />
                </Card>

                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <Briefcase size={16} class="text-primary" />
                        <h3 class="font-semibold">Productos bancarios contratados</h3>
                    </div>
                    <BarChart
                        labels={capitalizarProductos(stats.productos_bancarios_por_tipo)}
                        data={dataDe(stats.productos_bancarios_por_tipo)}
                        colors={PALETA}
                    />
                </Card>

                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} class="text-primary" />
                        <h3 class="font-semibold">Producto solicitado</h3>
                    </div>
                    <BarChart
                        labels={capitalizarProductos(stats.distribucion_producto_solicitado)}
                        data={dataDe(stats.distribucion_producto_solicitado)}
                        colors={PALETA}
                    />
                </Card>

                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <Users size={16} class="text-primary" />
                        <h3 class="font-semibold">Clientes por tipo de empleo</h3>
                    </div>
                    <BarChart
                        labels={labelsDe(stats.distribucion_tipo_empleo)}
                        data={dataDe(stats.distribucion_tipo_empleo)}
                        colors={PALETA}
                    />
                </Card>

                <Card>
                    <div class="flex items-center gap-2 mb-4">
                        <Wallet size={16} class="text-primary" />
                        <h3 class="font-semibold">Ingreso promedio por tipo de empleo</h3>
                    </div>
                    <BarChart
                        labels={labelsDe(stats.ingreso_promedio_por_empleo)}
                        data={dataDe(stats.ingreso_promedio_por_empleo)}
                        colors="#2563eb"
                        moneda
                    />
                </Card>
            </div>

            <div class="flex items-center gap-2 mb-4 pt-4 border-t border-border">
                <BrainCircuit size={18} class="text-primary" />
                <h2 class="text-xl font-semibold">Desempeño del modelo</h2>
                {#if info}
                    <span class="text-xs text-muted-foreground">
                        · {info.n_features} features · umbral {info.umbral_decision}
                    </span>
                {/if}
            </div>
        {/if}

        {#if error}
            <Card class="border-danger/30 bg-danger-soft/30 text-danger">
                {error}
            </Card>
        {:else if cargando}
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {#each Array(6) as _}
                    <Card class="!p-5">
                        <Skeleton height="h-3" width="w-1/2" />
                        <Skeleton height="h-8" width="w-2/3" class="mt-3" />
                    </Card>
                {/each}
            </div>
        {:else if metricas}
            {@const m = metricas}

            <!-- 6 metric cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {#each [
                    { icon: Gauge, label: 'AUC-ROC', valor: m.auc_roc.toFixed(4), tone: 'primary' },
                    { icon: Target, label: 'Accuracy', valor: `${(m.accuracy * 100).toFixed(1)}%`, tone: 'info' },
                    { icon: Activity, label: 'F1-Score', valor: m.f1_score.toFixed(3), tone: 'success' },
                    { icon: Zap, label: 'Precision', valor: `${(m.precision * 100).toFixed(1)}%`, tone: 'info' },
                    { icon: TrendingDown, label: 'Recall', valor: `${(m.recall * 100).toFixed(1)}%`, tone: 'warning' },
                    { icon: Database, label: 'Muestras val.', valor: m.muestras_validacion?.toLocaleString('es-CO') ?? '—', tone: 'neutral' }
                ] as item}
                    <Card class="!p-5 hover:shadow-md transition-shadow group">
                        <div class="flex items-center justify-between mb-3">
                            <p class="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                {item.label}
                            </p>
                            <span
                                class="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary-soft group-hover:text-primary transition-colors"
                            >
                                <item.icon size={16} />
                            </span>
                        </div>
                        <p class="text-3xl font-bold tabular">{item.valor}</p>
                    </Card>
                {/each}
            </div>

            <div class="grid lg:grid-cols-[1fr_400px] gap-6">
                <!-- Curva de loss -->
                {#if m.historial_loss}
                    <Card>
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-semibold">Curva de pérdida (BCE)</h3>
                            <div class="flex items-center gap-3 text-xs text-muted-foreground">
                                {#if m.mejor_epoca !== undefined}
                                    <span>
                                        Mejor época: <strong class="text-foreground">{m.mejor_epoca}</strong>
                                    </span>
                                {/if}
                                {#if m.epocas_entrenadas !== undefined}
                                    <span>
                                        Total: <strong class="text-foreground">{m.epocas_entrenadas}</strong>
                                    </span>
                                {/if}
                            </div>
                        </div>
                        <LossChart historial={m.historial_loss} />
                    </Card>
                {/if}

                <!-- Matriz de confusión -->
                {#if cm}
                    <Card>
                        <h3 class="font-semibold mb-4">Matriz de confusión</h3>
                        <div class="grid grid-cols-[auto_1fr_1fr] gap-1">
                            <div></div>
                            <div class="text-center text-xs text-muted-foreground pb-2 font-medium">
                                Pred. sin riesgo
                            </div>
                            <div class="text-center text-xs text-muted-foreground pb-2 font-medium">
                                Pred. riesgo
                            </div>

                            <div class="flex items-center pr-3">
                                <span class="text-xs text-muted-foreground font-medium [writing-mode:vertical-rl] rotate-180">
                                    Real sin riesgo
                                </span>
                            </div>
                            <div class="aspect-square flex flex-col items-center justify-center rounded-md bg-success-soft border-2 border-success/40">
                                <p class="text-2xl font-bold tabular text-success">{cm[0][0]}</p>
                                <p class="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                    True Negative
                                </p>
                            </div>
                            <div class="aspect-square flex flex-col items-center justify-center rounded-md bg-warning-soft/60 border-2 border-warning/30">
                                <p class="text-2xl font-bold tabular text-warning">{cm[0][1]}</p>
                                <p class="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                    False Positive
                                </p>
                            </div>

                            <div class="flex items-center pr-3">
                                <span class="text-xs text-muted-foreground font-medium [writing-mode:vertical-rl] rotate-180">
                                    Real riesgo
                                </span>
                            </div>
                            <div class="aspect-square flex flex-col items-center justify-center rounded-md bg-danger-soft/60 border-2 border-danger/30">
                                <p class="text-2xl font-bold tabular text-danger">{cm[1][0]}</p>
                                <p class="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                    False Negative
                                </p>
                            </div>
                            <div class="aspect-square flex flex-col items-center justify-center rounded-md bg-success-soft border-2 border-success/40">
                                <p class="text-2xl font-bold tabular text-success">{cm[1][1]}</p>
                                <p class="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                    True Positive
                                </p>
                            </div>
                        </div>
                        <p class="text-xs text-muted-foreground mt-4 pt-4 border-t border-border tabular">
                            Total evaluado: <strong class="text-foreground">{total.toLocaleString('es-CO')}</strong>
                        </p>
                    </Card>
                {/if}
            </div>

            <!-- Detalle del modelo -->
            {#if info}
                <Card class="mt-6">
                    <h3 class="font-semibold mb-4">Features evaluadas</h3>
                    <div class="flex flex-wrap gap-2">
                        {#each info.nombres_features as f}
                            <span
                                class="px-2.5 py-1 rounded-xs bg-muted text-xs font-mono text-foreground"
                            >
                                {f}
                            </span>
                        {/each}
                    </div>
                    <p class="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                        SHAP {info.shap_disponible ? 'disponible' : 'no disponible'} ·
                        Niveles de riesgo: {info.niveles_riesgo.join(' / ')}
                    </p>
                </Card>
            {/if}
        {/if}
    {/if}
</section>
