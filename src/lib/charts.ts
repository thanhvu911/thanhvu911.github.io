// Shared Chart.js setup so every dashboard matches the site's palette and type.
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  ScatterController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
);

export const palette = {
  navy: '#0f2757',
  blue: '#175e82',
  teal: '#11d4d4',
  tealInk: '#0a7a82',
  muted: '#5b6472',
  line: '#e5e7eb',
  // Distinguishable series colors for up to six counties or districts.
  series: ['#0f2757', '#11b5b5', '#e07a2f', '#7c5cc4', '#2f8f4e', '#c2416c'],
};

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

Chart.defaults.font.family = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = palette.muted;
Chart.defaults.borderColor = palette.line;
Chart.defaults.animation = reduce ? false : { duration: 500 };
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.tooltip.backgroundColor = palette.navy;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

export const axisTitle = (text: string) => ({ display: true, text, color: palette.muted, font: { weight: 600 as const } });

export { Chart };
