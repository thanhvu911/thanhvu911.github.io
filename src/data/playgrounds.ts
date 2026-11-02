// Runnable SQL for the project pages. Each playground loads one small public
// table in the browser and runs the visitor's query against it with alasql.
export interface Playground {
  /** Table name used in queries, and the file at /data/<table>.json. */
  table: string;
  blurb: string;
  columns: string;
  queries: { label: string; sql: string }[];
}

export const playgrounds: Record<string, Playground> = {
  'medical-cost-regression': {
    table: 'insurance',
    blurb: 'The 1,338 policyholders from this project, loaded into your browser. Edit the SQL and run it.',
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
  },
  'can-mail-data-predict-housing-vacancy': {
    table: 'vacancy',
    blurb: 'The county-year table behind this project (78 rows, Census and USPS vacancy rates in percent). Edit the SQL and run it.',
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
  },
};
