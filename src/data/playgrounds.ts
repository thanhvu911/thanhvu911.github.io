// Runnable code for the project pages. Each playground loads one small table in
// the browser. SQL runs with alasql; Python (pandas) runs with Pyodide, loaded
// only when a visitor presses Run on the Python tab.
export interface Playground {
  /** Table name used in queries, and the file at /data/<table>.json. */
  table: string;
  blurb: string;
  columns: string;
  queries: { label: string; sql: string }[];
  /** Python (pandas) examples; the table is loaded as `df` and under its own name. */
  py: { label: string; code: string }[];
}

export const playgrounds: Record<string, Playground> = {
  'medical-cost-regression': {
    table: 'insurance',
    blurb: 'The 1,338 policyholders from this project, loaded into your browser. Edit the code and run it.',
    columns: 'age, sex, bmi, children, smoker, region, charges',
    queries: [
      {
        label: 'Smoking effect',
        sql: `SELECT smoker,\n       COUNT(*) AS people,\n       ROUND(AVG(charges)) AS avg_charge\nFROM insurance\nGROUP BY smoker\nORDER BY avg_charge DESC`,
      },
      {
        label: 'Three cost bands',
        sql: `SELECT CASE WHEN smoker = 'no' THEN 'non-smoker'\n            WHEN bmi >= 30 THEN 'smoker, BMI >= 30'\n            ELSE 'smoker, BMI < 30' END AS band,\n       COUNT(*) AS people,\n       ROUND(AVG(charges)) AS avg_charge\nFROM insurance\nGROUP BY CASE WHEN smoker = 'no' THEN 'non-smoker'\n            WHEN bmi >= 30 THEN 'smoker, BMI >= 30'\n            ELSE 'smoker, BMI < 30' END\nORDER BY avg_charge`,
      },
      {
        label: 'Top 10 charges',
        sql: `SELECT age, sex, bmi, smoker, region, charges\nFROM insurance\nORDER BY charges DESC\nLIMIT 10`,
      },
    ],
    py: [
      { label: 'Smoking effect', code: `df.groupby('smoker')['charges'].agg(['count', 'mean']).round(0).reset_index()` },
      {
        label: 'Charges vs BMI',
        code: `s = df[df.smoker == 'yes']\nn = df[df.smoker == 'no']\nprint('correlation of BMI and charges, smokers:', round(s.bmi.corr(s.charges), 3))\nprint('correlation of BMI and charges, non-smokers:', round(n.bmi.corr(n.charges), 3))`,
      },
      { label: 'Describe', code: `df[['age', 'bmi', 'charges']].describe().round(1).reset_index()` },
    ],
  },
  'can-mail-data-predict-housing-vacancy': {
    table: 'vacancy',
    blurb: 'The county-year table behind this project (78 county-year rows: 2011–2024, because 2010 has no prior year to compare with, and without 2020, which has no Census release; Census and USPS vacancy rates in percent). Edit the code and run it.',
    columns: 'county, year, census_pct, usps_pct, usps_narrow_pct, post_2012',
    queries: [
      {
        label: 'Gap by county',
        sql: `SELECT county,\n       ROUND(AVG(census_pct), 2) AS census_avg,\n       ROUND(AVG(usps_pct), 2) AS usps_avg,\n       ROUND(AVG(usps_pct) - AVG(census_pct), 2) AS gap\nFROM vacancy\nGROUP BY county\nORDER BY gap DESC`,
      },
      {
        label: 'The 2012 jump',
        sql: `SELECT year,\n       ROUND(AVG(usps_pct), 2) AS usps_avg,\n       ROUND(AVG(census_pct), 2) AS census_avg\nFROM vacancy\nWHERE year BETWEEN 2010 AND 2014\nGROUP BY year\nORDER BY year`,
      },
      {
        label: 'Latest year',
        sql: `SELECT county, year, census_pct, usps_pct\nFROM vacancy\nWHERE year = 2024\nORDER BY usps_pct DESC\nLIMIT 10`,
      },
    ],
    py: [
      {
        label: 'Gap by county',
        code: `g = df.groupby('county')[['census_pct', 'usps_pct']].mean().round(2)\ng['gap'] = (g.usps_pct - g.census_pct).round(2)\ng.sort_values('gap', ascending=False).reset_index()`,
      },
      {
        label: 'Correlation by county',
        code: `rows = []\nfor county, g in df.groupby('county'):\n    rows.append({'county': county, 'r': round(g.census_pct.corr(g.usps_pct), 2)})\npd.DataFrame(rows)`,
      },
      { label: 'Pooled correlation', code: `print('pooled r =', round(df.census_pct.corr(df.usps_pct), 3))` },
    ],
  },
  'sales-planning-analysis': {
    table: 'sales',
    blurb: 'Monthly actual and planned revenue by district from this project (a synthetic dataset; 289 district-month rows, in Vietnamese dong). Edit the code and run it.',
    columns: 'district, month, actual, plan',
    queries: [
      {
        label: 'Plan completion',
        sql: `SELECT district,\n       ROUND(SUM(actual) * 100.0 / SUM(plan), 1) AS completion_pct\nFROM sales\nGROUP BY district\nORDER BY completion_pct DESC`,
      },
      {
        label: 'Months below plan',
        sql: `SELECT district, COUNT(*) AS months_below_plan\nFROM sales\nWHERE actual < plan\nGROUP BY district\nORDER BY months_below_plan DESC`,
      },
      {
        label: 'Biggest misses',
        sql: `SELECT district, month, actual, plan, plan - actual AS shortfall\nFROM sales\nORDER BY shortfall DESC\nLIMIT 10`,
      },
    ],
    py: [
      {
        label: 'Plan completion',
        code: `g = df.groupby('district')[['actual', 'plan']].sum()\n(g.actual / g.plan * 100).round(1).rename('completion_pct').sort_values(ascending=False).reset_index()`,
      },
      { label: 'Monthly gap', code: `m = df.groupby('month')[['actual', 'plan']].sum()\nm['gap'] = m.actual - m.plan\nm.reset_index().tail(12)` },
    ],
  },
  'lancaster-economic-indicators-dashboard': {
    table: 'unemployment',
    blurb: 'Annual unemployment rates (percent) for Lancaster County and Pennsylvania from the public series shown in the dashboard. Edit the code and run it.',
    columns: 'year, lancaster, pennsylvania',
    queries: [
      {
        label: 'Lancaster vs state',
        sql: `SELECT year, lancaster, pennsylvania,\n       ROUND(pennsylvania - lancaster, 2) AS gap\nFROM unemployment\nORDER BY year`,
      },
      {
        label: 'Highest years',
        sql: `SELECT year, lancaster\nFROM unemployment\nORDER BY lancaster DESC\nLIMIT 3`,
      },
    ],
    py: [
      { label: 'Gap by year', code: `df.assign(gap=(df.pennsylvania - df.lancaster).round(2))` },
      { label: 'Averages', code: `df[['lancaster', 'pennsylvania']].mean().round(2).rename('avg_rate').reset_index()` },
    ],
  },
};
