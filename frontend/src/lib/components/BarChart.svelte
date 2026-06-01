<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import {
        Chart,
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Tooltip
    } from 'chart.js';

    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

    type Props = {
        labels: string[];
        data: number[];
        colors?: string | string[];
        horizontal?: boolean;
        moneda?: boolean;
        height?: string;
    };

    let {
        labels,
        data,
        colors = '#047857',
        horizontal = false,
        moneda = false,
        height = 'h-[260px]'
    }: Props = $props();

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    const fmtMoneda = (n: number) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
            notation: 'compact'
        }).format(n);

    function crear() {
        if (!canvas) return;
        chart?.destroy();
        chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: colors,
                        borderRadius: 6,
                        maxBarThickness: 48
                    }
                ]
            },
            options: {
                indexAxis: horizontal ? 'y' : 'x',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0a1f14',
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            label: (ctx) => {
                                const v = (horizontal ? ctx.parsed.x : ctx.parsed.y) as number;
                                return ` ${moneda ? fmtMoneda(v) : v}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: horizontal },
                        ticks: {
                            font: { family: 'Inter', size: 10 },
                            callback: horizontal
                                ? (v) => (moneda ? fmtMoneda(v as number) : v)
                                : undefined
                        }
                    },
                    y: {
                        grid: { display: !horizontal, color: 'rgba(15, 31, 20, 0.06)' },
                        beginAtZero: true,
                        ticks: {
                            font: { family: 'Inter', size: 10 },
                            precision: 0,
                            callback: !horizontal
                                ? (v) => (moneda ? fmtMoneda(v as number) : v)
                                : undefined
                        }
                    }
                }
            }
        });
    }

    onMount(crear);

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
