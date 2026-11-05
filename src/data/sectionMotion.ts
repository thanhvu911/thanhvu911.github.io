// Facts behind the small animated graphics inside each project's case study.
// Every number here is taken from the project's own entry in portfolio.ts.

export interface BarRow {
  label: string;
  /** Used for the bar length. */
  value: number;
  /** What to print beside the bar. */
  display: string;
  /** Highlight this row (the finding). */
  hi?: boolean;
}

export interface BarGroup {
  title: string;
  /** Full-length value of the bar scale. */
  max: number;
  rows: BarRow[];
  /** Optional reference line, drawn at this value. */
  mark?: { value: number; label: string };
  note?: string;
}

export interface SectionMotion {
  /** One short line under each step of "What I built", in the same order as project.architecture. */
  flowNotes?: string[];
  bars?: BarGroup[];
}

/** Which pipeline step (0-based, same order as project.architecture) each skill is used in.
 *  Only skills that clearly belong to one step are listed; the rest stay plain tags. */
export const skillSteps: Record<string, Record<string, number>> = {
  'can-mail-data-predict-housing-vacancy': {
    'Microsoft Fabric (Lakehouse, Dataflow Gen2)': 1,
    'Power Query M': 2,
    'Semantic models': 3,
    DAX: 3,
    'Power BI report design': 4,
  },
  'grocery-transaction-data-warehouse': {
    'T-SQL stored procedures': 2,
    'Data-quality testing': 2,
    'Dimensional modeling (star schema)': 3,
  },
  'sales-planning-analysis': {
    'SQL Server': 0,
    'Power Query': 1,
    'Galaxy-schema modeling': 2,
    'DAX time intelligence': 3,
    'Executive dashboard design': 4,
  },
  'lancaster-economic-indicators-dashboard': {
    'BLS and BEA public data': 0,
    'Power Query': 2,
    'Multi-fact modeling': 3,
    'Power BI': 4,
  },
  'rfm-customer-segmentation': {
    'DAX calculated columns': 2,
    'Turning analysis into actions': 3,
    'Power BI': 4,
  },
  'bank-transaction-sql-analysis': {
    'Data profiling and validation': 1,
    'Parsing semi-structured fields': 2,
    'CASE-based bucketing': 2,
    'T-SQL joins and aggregation': 3,
    'Exploratory analysis': 3,
  },
  'medical-cost-regression': {
    'Linear regression': 1,
    'Interaction effects and confounding': 1,
    R: 1,
    'scikit-learn': 3,
    'Cross-validation': 3,
    'Subgroup error analysis': 4,
  },
  'melbourne-housing-price-prediction': {
    pandas: 1,
    'scikit-learn': 2,
    'Gradient boosting': 2,
    'Cross-validation design': 3,
    'Error analysis': 4,
  },
  'vacancy-nowcast-ml': {
    'SQL pipelines': 1,
    'Data-quality testing': 1,
    'Gradient descent from scratch': 2,
    'Testing with pytest': 2,
    'Evaluation design': 3,
    'Conformal prediction': 4,
  },
  'netflix-titles-etl-mysql': {
    'Python ETL with PyMySQL': 1,
    'Relational data modeling': 2,
    MySQL: 2,
    'Power BI': 3,
  },
};

export const sectionMotion: Record<string, SectionMotion> = {
  'grocery-transaction-data-warehouse': {
    flowNotes: [
      '6 files, about 12 GB',
      '10M transactions, 131M lines, kept as they arrived',
      '3.3M completed orders, cleaned, 21 checks run',
      '43.8M rows in a star schema',
      'Sales, customer and product questions',
    ],
    bars: [
      {
        title: 'Header total vs line items',
        max: 3.3,
        rows: [
          { label: 'Completed orders', value: 3.3, display: '3.3M' },
          { label: 'Totals did not match', value: 1.58, display: '1.58M · 47.5%', hi: true },
        ],
        note: 'Revenue is rebuilt from line prices.',
      },
      {
        title: 'Share of revenue (synthetic data)',
        max: 100,
        rows: [{ label: 'Top 20% of customers', value: 44.7, display: '44.7%', hi: true }],
      },
    ],
  },
  'can-mail-data-predict-housing-vacancy': {
    flowNotes: ['6 counties, 84 county-year pairs', '', '', '', 'Check the county before relying on it'],
    bars: [
      {
        title: 'Rise-or-fall accuracy',
        max: 100,
        rows: [
          { label: 'Always guess “down”', value: 64.8, display: '64.8%', hi: true },
          { label: 'USPS direction', value: 57.7, display: '57.7%' },
        ],
        note: 'The always-“down” score comes from the follow-up nowcast project.',
      },
      {
        title: 'USPS vs Census, average gap (points)',
        max: 6,
        rows: [
          { label: 'Narrow estimate, below', value: 5.3, display: '5.3' },
          { label: 'Broad estimate, above', value: 2.7, display: '2.7' },
        ],
        note: 'Opposite directions, so no single correction factor works.',
      },
    ],
  },
  'sales-planning-analysis': {
    flowNotes: ['', '', '', 'Plan completion, year-over-year and rolling 12 months', 'Drill-through from region to store'],
    bars: [
      {
        title: 'District plan completion, 2020–2022',
        max: 100,
        rows: [
          { label: 'Lowest district', value: 89, display: '~89%', hi: true },
          { label: 'Highest district', value: 98, display: '~98%' },
        ],
        mark: { value: 100, label: 'Plan' },
        note: 'No district fully hit its target.',
      },
    ],
  },
  'lancaster-economic-indicators-dashboard': {
    flowNotes: ['', '', '', '', 'Unemployment, pay and employers by sector'],
    bars: [
      {
        title: 'Average private-sector pay (US$ thousands)',
        max: 60,
        rows: [
          { label: '2014', value: 41, display: '~$41K' },
          { label: '2024', value: 59.5, display: '~$59.5K', hi: true },
        ],
      },
    ],
  },
  'rfm-customer-segmentation': {
    flowNotes: [
      '18.4K customers',
      '',
      'Scored 1 to 4 on recency, frequency and spend',
      '64 codes mapped to 9 named segments, each with a next action',
      'Rule-based, not a fitted model',
    ],
  },
  'bank-transaction-sql-analysis': {
    flowNotes: [
      '1,000 transactions',
      'Profiles missing fields and currency codes',
      'Buckets values and parses semi-structured fields',
      'Busiest hour is 15:00; not tested against chance',
      'Value is roughly proportional to customer share',
    ],
  },
  'medical-cost-regression': {
    flowNotes: [
      '1,338 policyholders',
      'Nested models, then a smoker × obese interaction',
      '',
      'Linear model matched ridge, lasso and random forest',
      'Error differs a lot by subgroup',
    ],
    bars: [
      {
        title: 'Average relative error by group',
        max: 30,
        rows: [
          { label: 'Non-smokers', value: 29, display: '29%', hi: true },
          { label: 'Obese smokers', value: 5, display: '5%' },
        ],
        note: 'Same model, very different reliability.',
      },
    ],
  },
  'melbourne-housing-price-prediction': {
    flowNotes: ['', '', '', 'Random CV, a time split, and a held-out region', 'Sales missing BuildingArea, and sales predicted far off'],
    bars: [
      {
        title: 'Average error when BuildingArea is…',
        max: 15,
        rows: [
          { label: 'Present', value: 12.5, display: '12.5%' },
          { label: 'Missing', value: 13.8, display: '13.8%', hi: true },
        ],
        note: '7.9% of sales are predicted more than 30% away from the sale price.',
      },
    ],
  },
  'netflix-titles-etl-mysql': {
    flowNotes: [
      'Flat titles file',
      'Splits multi-value fields on commas; only the genre link loader is enabled so far',
      'Dimension, fact and link tables; keys looked up at load',
      'Report built on the loaded tables',
    ],
  },
  'vacancy-nowcast-ml': {
    flowNotes: [
      '6 counties, 84 county-years',
      '15 quality checks stop the run if any fail',
      'Written from scratch and tested against scikit-learn',
      'Random CV, forward-chaining, leave-one-county-out',
      '80% intervals, checked county by county',
    ],
    bars: [
      {
        title: 'Rise-or-fall accuracy',
        max: 100,
        rows: [
          { label: 'Always guess “down”', value: 64.8, display: '64.8%', hi: true },
          { label: 'My logistic model', value: 57.4, display: '57.4%' },
          { label: 'With more features', value: 51.9, display: '51.9%' },
        ],
      },
    ],
  },
};
