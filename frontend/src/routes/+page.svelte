<script lang="ts">
    import {
        ArrowRight,
        BrainCircuit,
        ShieldCheck,
        Sparkles,
        TrendingDown,
        Layers,
        Zap
    } from 'lucide-svelte';
    import Button from '$lib/components/Button.svelte';
    import Card from '$lib/components/Card.svelte';
</script>

<svelte:head>
    <title>Bancat — Evaluación crediticia con Deep Learning</title>
</svelte:head>

<!-- Hero -->
<section class="relative overflow-hidden">
    <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-soft),_transparent_50%)] -z-10"
    ></div>

    <div class="container-page py-20 md:py-28 lg:py-32">
        <div class="max-w-3xl">
            <span
                class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-3.5 py-1 text-xs font-semibold text-accent-foreground mb-6"
            >
                <Sparkles size={14} />
                Powered by una red neuronal entrenada sobre 5.000 perfiles
            </span>

            <h1 class="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
                Crédito justo,<br />
                <span class="text-primary">decisión transparente.</span>
            </h1>

            <p class="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Bancat evalúa tu perfil financiero con una red neuronal explicable.
                Una sola predicción alimenta todas las decisiones — monto, tasa,
                producto recomendado y qué cambiar para mejorar.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-3">
                <Button href="/credito" size="lg">
                    Solicitar crédito
                    <ArrowRight size={18} />
                </Button>
                <Button href="#como-funciona" variant="outline" size="lg">
                    Cómo funciona
                </Button>
            </div>
        </div>

        <!-- Hero stats inline -->
        <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {#each [
                { valor: '0.958', label: 'AUC-ROC del modelo' },
                { valor: '89.6%', label: 'Accuracy en validación' },
                { valor: '< 100ms', label: 'Tiempo de inferencia' },
                { valor: '10', label: 'Features evaluadas' }
            ] as stat}
                <div class="bg-card p-5">
                    <div class="text-2xl md:text-3xl font-bold tabular text-primary">
                        {stat.valor}
                    </div>
                    <div class="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Servicios -->
<section id="como-funciona" class="container-page py-16 md:py-24">
    <div class="max-w-2xl mb-12">
        <p class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Cómo funciona
        </p>
        <h2 class="text-3xl md:text-4xl font-semibold">
            Una sola predicción, múltiples decisiones de negocio.
        </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {#each [
            {
                Icon: BrainCircuit,
                titulo: 'Modelo explicable',
                desc: 'Red neuronal con BatchNorm + Dropout entrenada sobre 5.000 perfiles. Cada decisión viene acompañada de una explicación SHAP feature-por-feature.'
            },
            {
                Icon: Layers,
                titulo: 'Decisiones derivadas',
                desc: 'Una probabilidad alimenta todo: nivel de riesgo, monto máximo, tasa sugerida, producto recomendado y elegibilidad por requisitos de perfil.'
            },
            {
                Icon: TrendingDown,
                titulo: '¿Qué debo mejorar?',
                desc: 'Si tu solicitud es rechazada, el sistema simula cambios concretos en tu perfil y te muestra exactamente qué necesitas para que cambie la decisión.'
            }
        ] as servicio}
            <Card class="hover:border-primary/30 transition-all duration-200 group" elevated>
                <div class="flex flex-col gap-4">
                    <div
                        class="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                        <servicio.Icon size={22} />
                    </div>
                    <h3 class="text-lg font-semibold">{servicio.titulo}</h3>
                    <p class="text-sm text-muted-foreground leading-relaxed">
                        {servicio.desc}
                    </p>
                </div>
            </Card>
        {/each}
    </div>
</section>

<!-- Productos -->
<section class="container-page py-16 md:py-24">
    <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <p class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Productos
            </p>
            <h2 class="text-3xl md:text-4xl font-semibold mb-4">
                4 productos, calibrados por perfil de riesgo.
            </h2>
            <p class="text-muted-foreground leading-relaxed mb-6">
                Hipoteca para perfiles sólidos, préstamo para riesgo moderado,
                tarjeta de crédito hasta riesgo alto, y débito siempre disponible.
                El sistema valida el nivel de riesgo y los umbrales de perfil
                (historial, ingresos, ratio deuda) antes de aprobar.
            </p>
            <Button href="/credito">
                Ver mi elegibilidad
                <ArrowRight size={16} />
            </Button>
        </div>

        <div class="grid grid-cols-2 gap-3">
            {#each [
                { nombre: 'Hipoteca', desc: 'Riesgo Bajo', tone: 'bg-primary text-primary-foreground' },
                { nombre: 'Préstamo', desc: 'Riesgo ≤ Moderado', tone: 'bg-primary-soft text-accent-foreground' },
                { nombre: 'Crédito', desc: 'Riesgo ≤ Alto', tone: 'bg-warning-soft text-warning' },
                { nombre: 'Débito', desc: 'Todos los perfiles', tone: 'bg-muted text-foreground' }
            ] as producto, i}
                <div
                    class="rounded-lg border border-border p-5 transition-transform hover:-translate-y-0.5 {i %
                        2 ===
                    1
                        ? 'mt-6'
                        : ''}"
                >
                    <div class="text-xs font-semibold {producto.tone} inline-block px-2 py-0.5 rounded-xs mb-3">
                        {producto.desc}
                    </div>
                    <p class="font-semibold">{producto.nombre}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- CTA final -->
<section class="container-page py-16">
    <div
        class="rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-10 md:p-14 relative overflow-hidden"
    >
        <div
            class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        ></div>
        <div class="relative max-w-2xl flex flex-col gap-5">
            <Zap size={32} />
            <h2 class="text-3xl md:text-4xl font-semibold">
                Evalúa tu perfil en menos de un minuto.
            </h2>
            <p class="text-white/90 text-lg">
                Sin compromiso, sin impacto en tu historial. Solo un análisis
                instantáneo con explicación detallada.
            </p>
            <div class="flex flex-wrap gap-3 mt-2">
                <a
                    href="/credito"
                    class="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-white text-primary font-semibold hover:bg-white/90 transition-colors"
                >
                    Comenzar evaluación
                    <ArrowRight size={18} />
                </a>
                <a
                    href="/credito"
                    class="inline-flex items-center gap-2 h-12 px-6 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                    <ShieldCheck size={18} />
                    Solo simular
                </a>
            </div>
        </div>
    </div>
</section>
