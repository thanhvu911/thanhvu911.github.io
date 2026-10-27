// Long-form detail for each project page: tools, data model tables, and a
// walkthrough of each dashboard or diagram. Facts come from the project READMEs,
// the bank WALKTHROUGH.md, and Thanh's resumes. Numbers that only appeared in the
// old Lovable pages and could not be verified are deliberately left out.

export interface ToolCard {
  name: string;
  use: string;
}
export interface ModelTable {
  name: string;
  kind: 'fact' | 'dim' | 'measures';
  desc: string;
}
export interface WalkStep {
  image: string; // file in src/assets/projects/<slug>/
  title: string;
  summary: string;
  points: string[];
}
export interface ProjectDetail {
  overview: string[];
  tools: ToolCard[];
  model?: { note: string; tables: ModelTable[] };
  walkthrough: WalkStep[];
}

export const details: Record<string, ProjectDetail> = {
  'can-mail-data-predict-housing-vacancy': {
    overview: [
      'The U.S. Postal Service quietly publishes a vacancy count for every ZIP code in the country, every quarter. This project asks whether that data is good enough to stand in for the Census Bureau\'s official, but slow and annual, vacancy rate, and answers it with a live Microsoft Fabric and Power BI pipeline instead of a guess.',
      'It tests the idea against six real U.S. counties and fifteen years of government data (2010–2024, 84 county-year observations) and gives a three-part answer: do the sources move together, does USPS call the direction of change correctly, and how far off is it on average.',
      'Every headline number is reproducible from the 84-row comparison table in the repository with plain arithmetic, and the Power Query M and report definition are exported from the real Fabric workspace rather than described from memory.',
    ],
    tools: [
      { name: 'Fabric Lakehouse (OneLake)', use: 'Landing zone for every raw USPS quarterly CSV and Census ACS (B25002) annual CSV, kept untouched as the source of truth.' },
      { name: 'Dataflow Gen2 (Power Query M)', use: 'Combines dozens of quarterly files, normalizes inconsistent headers, restores the county key, rolls USPS up to county-year, and joins it to Census on FIPS code and year.' },
      { name: 'Fabric semantic model', use: 'Live-connected to the report (not an imported copy), so every slicer recalculates against the model.' },
      { name: 'DAX', use: 'Calculated columns for gaps and year-over-year direction, plus a hand-built Pearson correlation with SUMX, since DAX has no native correlation function.' },
      { name: 'Power BI report design', use: 'A hand-specified 1920×1080 layout grid, a custom validated color theme, and small multiples to work around a chart limitation.' },
      { name: 'Statistics', use: 'Correlation, directional accuracy, and systematic bias treated as three separate questions rather than one score.' },
    ],
    model: {
      note: 'One clean comparison table drives every visual. The county and year slicers filter it, and DAX measures compute the statistics on the fly for whatever is selected.',
      tables: [
        { name: 'comparison (county-year)', kind: 'fact', desc: '84 rows: county, FIPS, year, Census vacancy rate, USPS narrow and broad rates, gaps, and the year-over-year direction of each source.' },
        { name: 'County', kind: 'dim', desc: 'Six counties keyed by FIPS: Champaign IL, Cook IL, King WA, Lancaster PA, Montgomery OH, Onondaga NY.' },
        { name: 'Year', kind: 'dim', desc: '2010–2024, with 2020 excluded because ACS 1-year estimates were not released.' },
        { name: 'Measures', kind: 'measures', desc: 'Pearson r, directional match rate, and average narrow and broad gaps.' },
      ],
    },
    walkthrough: [
      {
        image: 'powerbi-dashboard-overview-all-counties.png',
        title: 'Report overview: all six counties',
        summary: 'Nine visuals on one page: two slicers, three KPI cards, a small-multiples line chart, a scatter chart, a bar chart, and a county-year detail table.',
        points: [
          'KPI cards show the three answers at once: correlation (0.77), directional match rate (0.58), and the average narrow gap.',
          'Small multiples plot Census against USPS over time for each county, because a Power BI chart cannot legend by measure and by category at the same time.',
          'The scatter chart with its trend line shows the counties sitting in different clusters, the first hint that one pooled number hides a lot.',
          'The detail table flags, year by year, whether USPS moved in the same direction as Census.',
        ],
      },
      {
        image: 'powerbi-filtered-champaign-county.png',
        title: 'One county at a time',
        summary: 'Checking a single county recalculates every KPI and chart for that county alone, which is where the real story appears.',
        points: [
          'Montgomery, OH: r = 0.72 and Cook, IL: r = 0.70, where USPS tracks Census closely.',
          'King, WA: r = 0.52, Lancaster, PA: r = 0.34, and Onondaga, NY: r = 0.26, which are weaker.',
          'Champaign, IL: r = −0.01, no relationship at all.',
          'Conclusion: USPS is worth watching between Census releases in some counties and close to useless in others.',
        ],
      },
      {
        image: 'dataflow.png',
        title: 'The pipeline behind the dashboard',
        summary: 'Raw government files to a live report in five steps, all inside Microsoft Fabric.',
        points: [
          'Raw sources: USPS Vacant Address Report (quarterly, ZIP level) and Census ACS Table B25002 (annual, county).',
          'Lakehouse: raw CSVs landed in USPS and Census folders, never edited.',
          'Dataflow Gen2: combine quarterly files, roll up to county-year, join on FIPS and year, and fix two silent data-quality bugs.',
          'Semantic model and report: calculated columns, DAX measures, slicers, KPI cards, and small multiples.',
        ],
      },
      {
        image: 'insight-correlation-by-county.png',
        title: 'Correlation by county',
        summary: 'The same pooled r of 0.77 breaks down very unevenly once you look county by county.',
        points: [
          'The spread from 0.72 down to −0.01 is why the project reports per-county results, not just the pooled figure.',
          'This is the chart to show a stakeholder who asks whether they can rely on USPS for their county.',
        ],
      },
      {
        image: 'code-pearson-correlation.png',
        title: 'Hand-built Pearson correlation in DAX',
        summary: 'DAX has no CORREL function, so the measure computes covariance and standard deviations with SUMX over the filtered rows.',
        points: [
          'Because it is a measure, it responds to every slicer, so each county\'s r is calculated live.',
          'Every number it produces can be checked against the CSV with plain arithmetic.',
        ],
      },
    ],
  },

  'grocery-transaction-data-warehouse': {
    overview: [
      'An end-to-end data warehouse in SQL Server that turns raw grocery-transaction CSV extracts into a business-ready star schema. It is built on the public Supermarket Transactional Data dataset on Kaggle; the warehouse design, ETL, tests, and documentation are my own work.',
      'It follows the Medallion pattern: Bronze keeps an untouched copy of the six source files, Silver cleans and standardizes them, and Gold exposes a star schema of views that BI tools and analysts can query directly.',
      'The whole load is automated with stored procedures that log their timing and catch errors, and 21 automated data-quality checks run after each layer: they filtered 10M raw transactions to 3.3M completed sales and flagged 1.58M orders whose header totals did not match their line items.',
    ],
    tools: [
      { name: 'Microsoft SQL Server', use: 'Database engine for the whole warehouse: bronze, silver, and gold schemas in one database.' },
      { name: 'SQL Server Management Studio', use: 'Writing, testing, and debugging every script and stored procedure.' },
      { name: 'T-SQL stored procedures', use: 'bronze.load_bronze and silver.load_silver, with per-table load timing and TRY/CATCH error handling.' },
      { name: 'BULK INSERT', use: 'Fast loading of large CSV extracts into Bronze with a truncate-and-insert full load.' },
      { name: 'Medallion architecture', use: 'Separates raw ingestion, cleaning, and business modeling so each step is auditable.' },
      { name: 'draw.io and Markdown', use: 'Architecture, data-flow, integration, and star-schema diagrams, plus a data catalog and naming conventions.' },
    ],
    model: {
      note: 'The Gold layer is a classic star schema: one fact table at line-item grain with two dimensions joined on surrogate keys.',
      tables: [
        { name: 'gold.fact_sales', kind: 'fact', desc: 'One row per product per transaction: transaction_line_id, transaction_id, customer_key, product_key, transaction date, price, and total amount.' },
        { name: 'gold.dim_customers', kind: 'dim', desc: 'Surrogate customer_key plus customer ID, name, gender, date of birth, city, nationality, joining date, and loyalty tier.' },
        { name: 'gold.dim_products', kind: 'dim', desc: 'Surrogate product_key plus product name, category, brand, and price, denormalized from three Silver tables.' },
      ],
    },
    walkthrough: [
      {
        image: 'architecture-medallion.png',
        title: 'High-level architecture',
        summary: 'Six source CSVs flow left to right through three layers of increasing refinement before BI tools consume them.',
        points: [
          'Bronze: raw tables, batch full load (truncate and insert), no transformation.',
          'Silver: the same tables cleaned, standardized, and normalized, with derived columns.',
          'Gold: views that integrate and model the data as a star schema for analytics.',
        ],
      },
      {
        image: 'architecture-dataflow-drawio.png',
        title: 'Table-level data flow',
        summary: 'Each source maps one-to-one into Bronze and Silver, then converges into three Gold tables.',
        points: [
          'transactions + transaction_lines become gold.fact_sales.',
          'products + brands + categories become gold.dim_products.',
          'customers becomes gold.dim_customers.',
        ],
      },
      {
        image: 'architecture-integration-model.png',
        title: 'Integration model',
        summary: 'How the six source tables relate before modeling: sales, product, and customer domains linked by foreign keys.',
        points: [
          'transaction_lines is the grain: each row links to a transaction and a product.',
          'Join paths: lines → transactions → customers, and lines → products → brands and categories.',
          'These paths are flattened in Gold so analysts never have to write them again.',
        ],
      },
      {
        image: 'code-bronze-load-procedure.png',
        title: 'Bronze load procedure',
        summary: 'Truncate and BULK INSERT each table, time every step, and catch failures.',
        points: [
          'Load timing is printed per table, so slow steps are easy to spot.',
          'TRY/CATCH reports the error instead of leaving a half-loaded layer behind silently.',
        ],
      },
      {
        image: 'code-silver-quality-checks.png',
        title: 'Silver data-quality checks',
        summary: 'Automated tests run after the Silver load.',
        points: [
          'Null or duplicate keys, unwanted whitespace, and broken references between tables.',
          'Unexpected categorical values such as gender, loyalty tier, and nationality.',
          'Gold tests then check surrogate-key uniqueness and fact-to-dimension integrity.',
        ],
      },
    ],
  },

  'sales-planning-analysis': {
    overview: [
      'A multi-page Power BI solution for the KPIM Mart retail chain that gives managers full visibility into sales performance, plan attainment, and growth trends.',
      'Sales and monthly plan data from SQL Server are modeled as a galaxy schema: two fact tables, actual sales and plan targets, sharing conformed dimensions, so the two can be compared at any grain.',
      'DAX measures calculate plan completion, year-over-year growth, year-to-date comparisons, and rolling 12-month trends by store, product group, and region, and drill-through takes a manager from a summary number to the transactions behind it.',
    ],
    tools: [
      { name: 'Power BI Desktop', use: 'Four report pages with cross-filtering, drill-through, slicers for year and promotion, and a decomposition tree.' },
      { name: 'DAX time intelligence', use: 'Plan completion (actual ÷ plan), Sales YTD vs. last year with TOTALYTD and SAMEPERIODLASTYEAR, YoY growth, and rolling 12-month trends.' },
      { name: 'Power Query', use: 'Type casting, renaming, null handling, date formatting, and merges to shape the source tables for the model.' },
      { name: 'SQL Server', use: 'Source system for the sales transactions and plan tables.' },
      { name: 'Excel', use: 'Data exploration and cross-checking DAX results against manual calculations.' },
      { name: 'Galaxy schema', use: 'Two fact tables on shared dimensions, the right shape for actual-vs-plan analysis.' },
    ],
    model: {
      note: 'A standard star schema has one fact table. Comparing actuals with plans needs two, so both facts connect to the same date and store dimensions and one measure can divide one by the other.',
      tables: [
        { name: 'fact_sales', kind: 'fact', desc: 'One row per order line (about 58K): order number and line, order date key, customer, product, promotion, and quantity.' },
        { name: 'fact_sales_plan', kind: 'fact', desc: 'Monthly sales targets by district, shared date and store dimensions with fact_sales.' },
        { name: 'dim_store', kind: 'dim', desc: 'Store, district, city, manager, and location, for regional and manager-level analysis.' },
        { name: 'dim_product', kind: 'dim', desc: 'Product, brand, category, price, and cost, for product-mix analysis.' },
        { name: 'dim_customer', kind: 'dim', desc: 'Demographics and loyalty group, for customer segmentation.' },
        { name: 'dim_promotion', kind: 'dim', desc: 'Promotion type, discount, and dates, to judge campaign effect.' },
        { name: 'dim_date', kind: 'dim', desc: 'Date, month, quarter, and year, powering every time-intelligence measure.' },
        { name: '_Measures', kind: 'measures', desc: 'Plan completion and the other KPI measures, kept separate from the data tables.' },
      ],
    },
    walkthrough: [
      {
        image: 'sales-analysis-dashboard.png',
        title: 'Page 1: Sales analysis',
        summary: 'The executive overview: revenue against last year and against plan, where sales come from, and who is on track.',
        points: [
          'Two KPI cards answer the first questions: are we growing versus last year, and are we hitting plan, with a check or warning icon on each.',
          'Donut charts split revenue by district and by product group.',
          'A monthly trend toggles between overall, versus plan, and versus last year.',
          'The manager table shows plan attainment and growth per manager with sparklines.',
        ],
      },
      {
        image: 'sales-report-dashboard.png',
        title: 'Page 2: Drill-through by manager',
        summary: 'Right-click any number to land here: the month and year-to-date against the prior year, by store manager.',
        points: [
          'December 2022 sales of 1,858,396,200 are up 60% on December 2021.',
          'Year to date is down 15% on the prior year, a nuance the monthly number alone would hide.',
          'Bars show each manager\'s YTD against last year, colored red for decline and blue for growth.',
        ],
      },
      {
        image: 'sales-decomposition.png',
        title: 'Page 3: Decomposition tree',
        summary: 'Self-service root-cause analysis: start from year-to-date revenue and expand by store, brand, loyalty group, income, and promotion.',
        points: [
          'Managers can follow a revenue figure down to the customer segment and promotion driving it.',
          'Filter chips show the current path and can be removed to widen the view.',
        ],
      },
      {
        image: 'sales-detailed-analysis.png',
        title: 'Page 4: Transaction-level detail',
        summary: 'The audit trail behind every KPI: order, ship, and payment dates, store, customer, quantities, discounts, and sales.',
        points: [
          'Drill-through destinations land here so any summary number can be traced to its orders.',
          'Footer totals update with the year and promotion filters.',
        ],
      },
      {
        image: 'sales-data-model.png',
        title: 'Galaxy schema in Power BI',
        summary: 'Both fact tables connect to shared dimensions, which is what makes actual-vs-plan measures possible.',
        points: [
          'Plan completion = DIVIDE([Total Sales], [Sales Plan]) pulls from both facts in one measure.',
          'A dedicated measures table keeps calculations organized.',
        ],
      },
    ],
  },

  'lancaster-economic-indicators-dashboard': {
    overview: [
      'An interactive Power BI report that benchmarks Lancaster County, Pennsylvania against the state and the nation on the labor market, real GDP by industry, and wages, using public data from the Bureau of Labor Statistics and the Bureau of Economic Analysis.',
      'I built it as a technical interview case study for the Center for Regional Analysis at EDC Lancaster County, before joining the team as a Data Analyst Fellow.',
      'Side-by-side comparisons let economic development staff see quickly where Lancaster outperforms or lags, in a format ready for presentations to investors, officials, and partners.',
    ],
    tools: [
      { name: 'Power BI Desktop', use: 'Four report pages with toggles between Lancaster, Pennsylvania, and percentage-rate views, a custom Power KPI visual, and a navy theme.' },
      { name: 'Power Query', use: 'Shaping seven Excel sheets: unpivoting, date parsing, type casting, and combining them into model tables.' },
      { name: 'DAX', use: 'Benchmarking measures: industry share of total, average annual rate, Lancaster ÷ PA, and Lancaster ÷ U.S.' },
      { name: 'BLS LAUS and QCEW', use: 'Monthly labor force, employment, and unemployment (2015–2025), plus private-sector wages by NAICS sector.' },
      { name: 'BEA CAGDP9', use: 'Real GDP by county and industry in chained 2017 dollars, 2001–2024, for Lancaster, PA, and the U.S.' },
      { name: 'Excel', use: 'Source workbook holding all seven datasets.' },
    ],
    model: {
      note: 'A star-schema variant with several fact tables sharing dimensions, so labor, GDP, and wage data can be filtered together by place, industry, and date.',
      tables: [
        { name: 'fact_employment', kind: 'fact', desc: 'Monthly labor force, employment, unemployment, and unemployment rate by geography.' },
        { name: 'fact_gdp', kind: 'fact', desc: 'Real GDP by industry line code and geography, in thousands of chained 2017 dollars.' },
        { name: 'fact_lan_wages', kind: 'fact', desc: '2024 Lancaster average employment and annual wages per employee by NAICS sector.' },
        { name: 'lan_avg_annual', kind: 'fact', desc: 'Lancaster average annual private-sector pay, 2014–2024.' },
        { name: 'dim_geo', kind: 'dim', desc: 'Lancaster, Pennsylvania, and United States, keyed by FIPS.' },
        { name: 'dim_industry', kind: 'dim', desc: 'NAICS codes mapped to sector names for GDP and wage analysis.' },
        { name: 'dim_date', kind: 'dim', desc: 'Date, month, and year for monthly and annual views.' },
        { name: '_Measures', kind: 'measures', desc: 'Share-of-total and Lancaster-versus-benchmark ratios.' },
      ],
    },
    walkthrough: [
      {
        image: 'edc-labor-lancaster.png',
        title: 'Labor market: Lancaster view',
        summary: 'The landing page: KPI cards, annual labor force and unemployment, and monthly trends, with date, year, and location controls.',
        points: [
          'Toggle buttons switch every chart between Lancaster, Pennsylvania, and percentage-rate views.',
          'The 2020 unemployment spike and the recovery after it are clear in both the annual bars and the monthly lines.',
        ],
      },
      {
        image: 'edc-labor-pennsylvania.png',
        title: 'Labor market: Pennsylvania view',
        summary: 'The same page with the statewide data, for a direct comparison with Lancaster.',
        points: ['Switching views keeps the layout identical, so differences between the county and the state stand out immediately.'],
      },
      {
        image: 'edc-growth-rate.png',
        title: 'Rate comparison',
        summary: 'Labor-force growth and unemployment rate, Lancaster against Pennsylvania.',
        points: [
          'Lancaster\'s unemployment rate ran below Pennsylvania\'s every year from 2015 to 2025, including during the 2020 spike.',
          'This is the core message for EDC stakeholders: a resilient local labor market.',
        ],
      },
      {
        image: 'edc-economic-growth.png',
        title: 'Economic growth: GDP and wages',
        summary: 'Top industries by real GDP, the GDP trend for Lancaster, PA, and the U.S., and Lancaster\'s wage trend.',
        points: [
          'Average annual private-sector pay in Lancaster rose from about $41K in 2014 to about $59.5K in 2024.',
          'A sector table ranks 2024 wages by NAICS sector, with management, utilities, and finance at the top.',
        ],
      },
      {
        image: 'edc-economic-bottom5.png',
        title: 'Bottom 5 industries and benchmarking',
        summary: 'The smallest GDP contributors, plus an industry table comparing Lancaster with Pennsylvania and the U.S.',
        points: ['Lancaster ÷ PA and Lancaster ÷ U.S. columns show each industry\'s weight locally against its benchmark.'],
      },
      {
        image: 'edc-economic-employees.png',
        title: 'Employees by sector',
        summary: 'Which industries employ the most people in the county.',
        points: [
          'Health care, manufacturing, and retail are the largest employers but pay below the county average.',
          'The highest-paying sectors (management, utilities, finance) employ far fewer people, a useful insight for workforce strategy.',
        ],
      },
    ],
  },

  'rfm-customer-segmentation': {
    overview: [
      'Not every customer is worth the same marketing effort. This project segments customers with the classic RFM model (Recency, Frequency, Monetary value) and turns each segment into a concrete action, such as rewarding VIPs or re-engaging customers at risk of churning.',
      'In the Power BI model, DAX calculated columns on dim_customer score recency, frequency, and monetary value from 1 to 4. The resulting R-F-M code (for example 444) links to a segment table, and the report also tracks revenue against the monthly plan.',
    ],
    tools: [
      { name: 'Power BI', use: 'Segment report with recency, frequency, and monetary breakdowns and revenue against plan.' },
      { name: 'DAX calculated columns', use: 'Columns on dim_customer that score each customer 1–4 on recency, frequency, and monetary value and build the R-F-M code.' },
      { name: 'Power Query', use: 'Loading the sales data, the segment table, segment labels, and the monthly revenue plan.' },
      { name: 'Segment table (Excel)', use: 'Maps each R-F-M code to a segment, a description, and a recommended action.' },
    ],
    walkthrough: [
      {
        image: 'insight-segment-playbook.png',
        title: 'Segment playbook',
        summary: 'Every R-F-M combination maps to a named segment with a description and a recommended marketing action.',
        points: [
          '64 possible score codes (4 × 4 × 4) collapse into 9 segments a marketing team can act on.',
          'Each segment says who the customers are and what to do next, so the analysis ends in a decision, not a chart.',
        ],
      },
      {
        image: 'powerbi-page-2-customer-analysis.png',
        title: 'Customer analysis page',
        summary: 'RFM scores, segments, and loyalty groups on one Power BI page.',
        points: ['Shows how many customers fall in each segment and how segments relate to loyalty groups.'],
      },
      {
        image: 'data-model.png',
        title: 'Data model',
        summary: 'DAX-scored customers mapped to the segment table, alongside sales and the revenue plan.',
        points: ['The R-F-M code calculated on dim_customer is the key that links each customer to its segment.'],
      },
    ],
  },

  'bank-transaction-sql-analysis': {
    overview: [
      'A retail-banking analysis in SQL Server that answers questions such as which branches and currencies carry the most activity, how behavior differs by credit-score band, account type, sector, and city, and when transactions peak.',
      'The workflow mirrors a real analyst engagement: first prove the data can be trusted (validation), fix what is broken (transformation), then analyze. A query-by-query walkthrough in the repository shows each SQL statement, its result, and what it means.',
    ],
    tools: [
      { name: 'SQL Server and SSMS', use: 'Restoring the database and running the three scripts in order.' },
      { name: 'T-SQL', use: 'CTEs, window functions (LAG, RANK, SUM OVER), CASE bucketing, and parsing a semi-structured text field.' },
      { name: 'Data profiling', use: 'NULL checks, duplicate-key checks, distinct values, and categorical distributions before any analysis.' },
      { name: 'DuckDB', use: 'Re-running the same logic on the same Excel files to publish the result tables in the walkthrough.' },
    ],
    model: {
      note: 'Two tables joined on account number. A semi-structured details field is parsed into sector, years of residence, and city during analysis.',
      tables: [
        { name: 'banking_transaction', kind: 'fact', desc: '1,000 rows, Jan 2023 – Sep 2025: transaction ID, account, type, amount, date, time, branch, and currency.' },
        { name: 'customer_account', kind: 'dim', desc: '800 rows: account holder, account type, balance, interest rate, credit score, opening date, loan amount, and holder details.' },
      ],
    },
    walkthrough: [
      {
        image: 'insight-data-quality.png',
        title: 'Validate: can we trust the data?',
        summary: 'Before any analysis, every column is profiled.',
        points: [
          '12.3% of raw transactions had at least one missing field: 60 with no transaction type, 60 with no amount, and 5 with no currency.',
          '17 rows carried invalid currency codes such as -999 and *^$$, which would distort any currency-level report.',
          'Primary keys in both tables are unique, so joins will not double-count.',
        ],
      },
      {
        image: 'insight-peak-hours.png',
        title: 'When customers transact',
        summary: 'Transactions by hour of day.',
        points: [
          'Activity peaks at 15:00.',
          'Useful for staffing branches and scheduling system maintenance away from busy hours.',
        ],
      },
      {
        image: 'insight-value-by-account-type.png',
        title: 'Value by account type',
        summary: 'How each account type is actually used.',
        points: [
          'Credit accounts lean on transfers, checking accounts on withdrawals, and loan accounts on deposits and payments.',
          'The mix across transaction types, currencies, and account types is fairly balanced; no single segment dominates.',
        ],
      },
      {
        image: 'code-analysis-queries.png',
        title: 'Analysis queries',
        summary: 'Context matters as much as the headline number.',
        points: [
          'The apparent 25% drop in 2025 is a partial year; per month, activity is flat.',
          'Poor-credit customers account for 51% of value, which simply matches their 52% share of customers.',
          'Activity is spread over 431 branches, so branch rankings are noisy at this data size.',
        ],
      },
    ],
  },

  'medical-cost-regression': {
    overview: [
      'A statistics project that asks how much age and sex explain differences in individual medical insurance charges, using linear regression in R on 1,338 U.S. insurance records.',
      'Instead of fitting one model and reading its coefficients, it compares five nested models, from intercept-only to a sex × age interaction, and checks residual diagnostics before drawing conclusions.',
    ],
    tools: [
      { name: 'R', use: 'Data manipulation, model fitting, and hypothesis testing.' },
      { name: 'lm()', use: 'Five nested linear models: intercept only, sex, age, sex + age, and sex × age.' },
      { name: 'ggplot2', use: 'Scatter plots with fitted lines, distributions, and residual plots.' },
      { name: 'R Markdown', use: 'A reproducible report combining code, output, and interpretation.' },
    ],
    walkthrough: [
      {
        image: 'insight-summary.png',
        title: 'Summary of findings',
        summary: 'What the models say about age, sex, and charges.',
        points: [
          'Age is a moderate, significant predictor: about +$258 in charges per year of age.',
          'Sex has minimal effect once age is accounted for.',
          'Most variation comes from factors outside these two variables.',
        ],
      },
      {
        image: 'code-nested-models.png',
        title: 'Nested model comparison',
        summary: 'Each model adds one term, so the comparison shows exactly what each variable contributes.',
        points: ['Comparing nested models avoids over-reading a single regression.'],
      },
      {
        image: 'report-page-2.png',
        title: 'Report: exploration and fit',
        summary: 'Pages from the rendered R Markdown report.',
        points: ['Plots and model output sit next to the interpretation, so the reasoning is easy to follow.'],
      },
    ],
  },
};
