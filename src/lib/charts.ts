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
  // Power BI's default theme colors, so the dashboards read like real reports.
  primary: '#118DFF',
  secondary: '#E66C37',
  muted: '#605E5C',
  line: '#E1DFDD',
  faded: '#B3D9FF',
  series: ['#118DFF', '#12239E', '#E66C37', '#6B007B', '#E044A7', '#744EC2'],
};

const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

Chart.defaults.font.family = '"Segoe UI", "Public Sans Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = palette.muted;
Chart.defaults.borderColor = palette.line;
Chart.defaults.animation = reduce ? false : { duration: 500 };
Chart.defaults.maintainAspectRatio = false;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;
Chart.defaults.plugins.tooltip.backgroundColor = '#ffffff';
Chart.defaults.plugins.tooltip.titleColor = '#252423';
Chart.defaults.plugins.tooltip.bodyColor = '#252423';
Chart.defaults.plugins.tooltip.borderColor = '#C8C6C4';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 2;

export const axisTitle = (text: string) => ({ display: true, text, color: palette.muted, font: { weight: 600 as const } });

export { Chart };
