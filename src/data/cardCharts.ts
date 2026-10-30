// Small animated charts for project cards that have no Power BI report.
// Every value comes from the project's own results (see portfolio.ts).

export interface CardChart {
  title: string;
  note?: string;
  /** Bars, drawn in order. `width` is the bar length in percent. */
  bars: { label: string; value: string; width: number; hi?: boolean }[];
}

export const cardCharts: Record<string, CardChart> = {
  'grocery-transaction-data-warehouse': {
    title: 'Rows per layer',
    note: 'log scale',
    bars: [
      { label: 'Bronze // order lines', value: '131.3M', width: 100 },
      { label: 'Silver // completed orders', value: '3.3M', width: 49 },
      { label: 'Gold // fact_sales rows', value: '43.8M', width: 85, hi: true },
    ],
  },
  'bank-transaction-sql-analysis': {
    title: 'Data quality audit',
    note: '1,000 transactions',
    bars: [
      { label: 'Complete rows', value: '87.7%', width: 87.7 },
      { label: 'Missing fields', value: '12.3%', width: 12.3, hi: true },
      { label: 'Bad currency codes', value: '17', width: 1.7, hi: true },
    ],
  },
  'medical-cost-regression': {
    title: 'R² by model',
    note: 'higher is better',
    bars: [
      { label: 'Baseline', value: '0.09', width: 9 },
      { label: 'Final model', value: '0.86', width: 86 },
      { label: 'Held-out test', value: '0.88', width: 88, hi: true },
    ],
  },
  'melbourne-housing-price-prediction': {
    title: 'Price error (MAPE)',
    note: 'lower is better',
    bars: [
      { label: 'Random CV', value: '13.1%', width: 34.6, hi: true },
      { label: 'Best unseen region', value: '18%', width: 47.5 },
      { label: 'Western Metro', value: '37.9%', width: 100 },
    ],
  },
  'vacancy-nowcast-ml': {
    title: 'Nowcast error (MAE)',
    note: 'lower is better',
    bars: [
      { label: 'Persistence', value: '1.02', width: 66.5, hi: true },
      { label: 'Ridge', value: '1.05', width: 68.5 },
      { label: 'Random forest', value: '1.12', width: 72.8 },
      { label: 'Gradient boosting', value: '1.22', width: 79 },
      { label: 'County average', value: '1.54', width: 100 },
    ],
  },
};
