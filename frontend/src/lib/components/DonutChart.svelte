<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

    Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

    type Props = {
        labels: string[];
        data: number[];
        colors: string[];
        height?: string;
    };

    let { labels, data, colors, height = 'h-[260px]' }: Props = $props();

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    function crear() {
        if (!canvas) return;
        chart?.destroy();
        chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Inter', size: 11 },
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 12,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0a1f14',
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: (ctx) => {
                                const total = data.reduce((a, b) => a + b, 0) || 1;
                                const v = ctx.parsed;
                                return ` ${ctx.label}: ${v} (${((v / total) * 100).toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    onMount(crear);

    // Recrear si los datos cambian (p. ej. al refrescar tras agregar clientes)
    $effect(() => {
        labels;
        data;
        colors;
        crear();
    });

    onDestroy(() => chart?.destroy());
</script>

<div class="relative {height}">
    <canvas bind:this={canvas}></canvas>
</div>
