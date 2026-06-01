<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Legend,
        Filler
    } from 'chart.js';

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Tooltip,
        Legend,
        Filler
    );

    type Props = {
        historial: { train: number[]; val?: number[] };
    };

    let { historial }: Props = $props();

    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    onMount(() => {
        const epocas = historial.train.map((_, i) => i + 1);
        const datasets: any[] = [
            {
                label: 'Entrenamiento',
                data: historial.train,
                borderColor: '#047857',
                backgroundColor: 'rgba(4, 120, 87, 0.08)',
                tension: 0.3,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2
            }
        ];

        if (historial.val && historial.val.length > 0) {
            datasets.push({
                label: 'Validación',
                data: historial.val,
                borderColor: '#d97706',
                backgroundColor: 'transparent',
                tension: 0.3,
                fill: false,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2,
                borderDash: [5, 4]
            });
        }

        chart = new Chart(canvas, {
            type: 'line',
            data: { labels: epocas, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { family: 'Inter', size: 11 }, boxWidth: 12, boxHeight: 12 }
                    },
                    tooltip: {
                        backgroundColor: '#0a1f14',
                        titleFont: { family: 'Inter', size: 11 },
                        bodyFont: { family: 'JetBrains Mono', size: 11 },
                        padding: 10,
                        cornerRadius: 6
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Época', font: { family: 'Inter', size: 11 } },
                        grid: { display: false },
                        ticks: { font: { family: 'Inter', size: 10 }, maxTicksLimit: 10 }
                    },
                    y: {
                        title: { display: true, text: 'BCE Loss', font: { family: 'Inter', size: 11 } },
                        grid: { color: 'rgba(15, 31, 20, 0.06)' },
                        ticks: { font: { family: 'JetBrains Mono', size: 10 } }
                    }
                }
            }
        });
    });

    onDestroy(() => {
        chart?.destroy();
    });
</script>

<div class="relative h-[280px]">
    <canvas bind:this={canvas}></canvas>
</div>
