// Single source of truth for site content. Every fact here comes from
// Thanh's resumes, project READMEs, or portfolio brief: do not add numbers
// that are not backed by one of those.

export const profile = {
  name: 'Thanh Vu',
  role: 'Data Engineer & Analyst',
  eyebrow: 'Data Engineer & Analyst',
  tagline: 'Transforming data into intelligence that drives impact.',
  phone: '(717) 869-9502',
  phoneHref: 'tel:+17178699502',
  status: 'Data Analyst Fellow @ EDC Lancaster County',
  availability: 'Open to Data Engineer and Data Analyst roles',
  location: 'Lancaster, PA',
  locationNote: 'Open to New York and remote',
  email: 'vulethanh07112002@gmail.com',
  github: 'https://github.com/thanhvu911',
  githubUser: 'thanhvu911',
  linkedin: 'https://www.linkedin.com/in/thanh25/',
  resumes: [
    { label: 'Data Engineer', href: '/thanh-vu-resume-data-engineer.pdf', note: 'Pipelines, warehouses, Microsoft Fabric' },
    { label: 'Data Analyst', href: '/thanh-vu-resume-data-analyst.pdf', note: 'Dashboards, analysis, insights' },
  ],
};

// About section, one paragraph per entry.
export const bio = [
  "I'm a Computer Science graduate of Franklin & Marshall College (GPA 3.72, major GPA 3.82) and a Microsoft Certified Fabric Data Engineer Associate (DP-700). My work sits where data engineering, analytics, and statistical modeling meet.",
  "I'm currently a Data Analyst Fellow at the EDC Lancaster County Center for Regional Analysis, building Power BI reporting on federal economic data and a web dashboard with a built-in AI assistant. I enjoy turning raw data into decisions: building ETL pipelines, designing data warehouses and dashboards, and developing models that solve real-world problems.",
];

export type ImageCategory = 'Power BI' | 'Data flow' | 'Data model' | 'Code' | 'Insights';

export interface ProjectImage {
  file: string; // file name inside src/assets/projects/<slug>/
  category: ImageCategory;
  caption: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  /** Short serif headline for the case-study hero. */
  headline: string;
  year: string;
  kind: string;
  tags: string[];
  summary: string;
  repo: string;
  featured?: boolean;
  cover: string;
  metrics: { value: string; label: string }[];
  context?: string;
  problem: string;
  approach: string[];
  architecture: string[];
  dataModel?: { facts: string[]; dims: string[]; note?: string };
  dataQuality?: string[];
  results: string[];
  skills: string[];
  images: ProjectImage[];
}

export const projects: Project[] = [
  {
    slug: 'can-mail-data-predict-housing-vacancy',
    number: '01',
    title: 'Can Mail Data Predict Housing Vacancy?',
    headline: 'Testing whether the mail can see empty homes before the Census does',
    year: '2026',
    kind: 'Data engineering · Analytics',
    tags: ['Microsoft Fabric', 'Lakehouse', 'Dataflow Gen2', 'Power BI', 'DAX'],
    summary:
      'Tested USPS mail data as an early-warning signal for Census housing vacancy across 6 counties and 15 years, on an end-to-end Microsoft Fabric pipeline.',
    repo: 'https://github.com/thanhvu911/can-mail-data-predict-housing-vacancy',
    featured: true,
    cover: 'powerbi-dashboard-overview-all-counties.png',
    metrics: [
      { value: '0.77', label: 'Pooled Pearson r' },
      { value: '57.7%', label: 'Directional match' },
      { value: '84', label: 'County-year observations' },
      { value: '6 × 15', label: 'Counties × years' },
    ],
    problem:
      "The Census Bureau's vacancy rate is the gold standard, but it is published annually and lags reality. USPS publishes vacancy counts quarterly for every ZIP code. Can the faster source stand in for the slower one?",
    approach: [
      'Ingested raw USPS quarterly CSVs and Census ACS (Table B25002) annual CSVs into a Fabric Lakehouse, untouched, as the source of truth.',
      'Consolidated them with Dataflow Gen2 (Power Query M) into one county-year comparison table: 6 counties, 2010–2024, 84 observations. 2020 is excluded because the ACS 1-year estimates were not released.',
      'Served the table through a Fabric semantic model to a Power BI report with county and year slicers.',
      'Answered three separate questions instead of one: correlation, directional accuracy, and bias.',
    ],
    architecture: ['USPS + Census CSVs', 'Lakehouse', 'Dataflow Gen2', 'Semantic model', 'Power BI'],
    dataModel: {
      facts: ['Comparison (county-year)'],
      dims: ['County (FIPS)', 'Year'],
      note: 'Calculated columns for gaps and year-over-year direction; DAX measures for Pearson r, match rate, and mean gap.',
    },
    dataQuality: [
      'Inconsistent USPS header casing broke column matching, so headers were normalized before combining.',
      'Combine Files silently dropped the filename column, which carried the county key, so it was restored explicitly.',
      'Treated the 2012 USPS classification change as a data artifact, not a finding.',
    ],
    results: [
      'Pooled r = 0.77, but per county it ranges from −0.01 (Champaign) to 0.72 (Montgomery).',
      'USPS calls the direction of change correctly 57.7% of the time.',
      'The narrow USPS estimate reads about 5.3 points below Census and the broad one about 2.7 points above, so no single correction factor works.',
      'Conclusion: a county-dependent early-warning signal, not a substitute for the Census.',
    ],
    skills: ['Microsoft Fabric', 'Power Query M', 'DAX', 'Power BI', 'Statistics'],
    images: [
      { file: 'powerbi-dashboard-overview-all-counties.png', category: 'Power BI', caption: 'Report overview: all six counties' },
      { file: 'powerbi-filtered-lancaster-county.png', category: 'Power BI', caption: 'Filtered to Lancaster County' },
      { file: 'powerbi-filtered-cook-county.png', category: 'Power BI', caption: 'Filtered to Cook County' },
      { file: 'powerbi-filtered-montgomery-county.png', category: 'Power BI', caption: 'Filtered to Montgomery County' },
      { file: 'powerbi-filtered-king-county.png', category: 'Power BI', caption: 'Filtered to King County' },
      { file: 'powerbi-filtered-champaign-county.png', category: 'Power BI', caption: 'Filtered to Champaign County' },
      { file: 'powerbi-filtered-onondaga-county.png', category: 'Power BI', caption: 'Filtered to Onondaga County' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Fabric pipeline: raw files to a Power BI report' },
      { file: 'design-dashboard-wireframe.png', category: 'Data flow', caption: 'Dashboard wireframe' },
      { file: 'data-model.png', category: 'Data model', caption: 'Semantic model' },
      { file: 'code-dataflow-gen2-lakehouse.png', category: 'Code', caption: 'Dataflow Gen2: combining Lakehouse files' },
      { file: 'code-pearson-correlation.png', category: 'Code', caption: 'Hand-built Pearson correlation in DAX' },
      { file: 'insight-correlation-by-county.png', category: 'Insights', caption: 'Correlation by county' },
      { file: 'insight-directional-match-rate.png', category: 'Insights', caption: 'Directional match rate' },
      { file: 'insight-average-gap.png', category: 'Insights', caption: 'Average gap: USPS vs. Census' },
    ],
  },
  {
    slug: 'grocery-transaction-data-warehouse',
    number: '02',
    title: 'Grocery Transaction Data Warehouse',
    headline: 'A Medallion warehouse over 131M+ rows, in plain SQL Server',
    year: 'Jul–Aug 2025',
    kind: 'Data engineering',
    tags: ['SQL Server', 'T-SQL', 'Medallion', 'ETL', 'Star schema'],
    summary:
      'A Bronze → Silver → Gold warehouse over 131M+ rows with stored-procedure ETL, automated data-quality tests, and a documented star schema.',
    repo: 'https://github.com/thanhvu911/grocery-transaction-data-warehouse',
    featured: true,
    cover: 'architecture-medallion.png',
    metrics: [
      { value: '131M+', label: 'Rows' },
      { value: '1M+', label: 'Customers' },
      { value: '25K', label: 'Products' },
      { value: '25%', label: 'Faster processing' },
    ],
    problem:
      'Retail transaction data typically arrives as messy, disconnected extracts. The goal: make it trustworthy and fast to query by landing it raw, cleaning and standardizing it, then modeling it for analytics on sales, customers, and product performance.',
    approach: [
      'Bronze: a raw copy of six source CSVs (brands, categories, customers, products, transactions, transaction lines), loaded by a truncate + BULK INSERT procedure with load timing and TRY/CATCH error handling.',
      'Silver: cleaned and standardized data (type casting, value normalization, text cleanup) loaded by its own procedure with per-table timing.',
      'Gold: a business-ready star schema exposed as views.',
      'Documented a column-level data catalog and naming conventions for schemas, tables, columns, and procedures; query tuning cut processing time by 25%.',
    ],
    architecture: ['CSV sources', 'Bronze (BULK INSERT)', 'Silver (cleaned)', 'Gold (star schema)', 'Analytics'],
    dataModel: { facts: ['fact_sales'], dims: ['dim_customers', 'dim_products'] },
    dataQuality: [
      'Silver tests: null and duplicate keys, unwanted whitespace, broken references between tables, and unexpected categorical values (gender, loyalty tier, nationality).',
      'Gold tests: surrogate-key uniqueness and referential integrity between facts and dimensions.',
    ],
    results: [
      'A layered warehouse where each step can be re-run and audited independently.',
      'A Gold star schema that answers sales, customer, and product questions with simple joins.',
      'Query tuning cut processing time by 25%.',
    ],
    skills: ['Data warehouse design', 'Dimensional modeling', 'Stored procedures', 'Data-quality testing', 'Documentation'],
    images: [
      { file: 'architecture-medallion.png', category: 'Data flow', caption: 'Medallion architecture: Source → Bronze → Silver → Gold → BI' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'End-to-end data flow' },
      { file: 'architecture-dataflow-drawio.png', category: 'Data flow', caption: 'How each source CSV moves through the layers' },
      { file: 'architecture-integration-model.png', category: 'Data model', caption: 'Integration model across source tables' },
      { file: 'architecture-star-schema.png', category: 'Data model', caption: 'Gold star schema' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'code-bronze-load-procedure.png', category: 'Code', caption: 'Bronze load procedure with logging and TRY/CATCH' },
      { file: 'code-silver-quality-checks.png', category: 'Code', caption: 'Silver data-quality checks' },
      { file: 'code-gold-fact-sales.png', category: 'Code', caption: 'Gold fact_sales view' },
    ],
  },
  {
    slug: 'sales-planning-analysis',
    number: '03',
    title: 'Sales Planning Analysis',
    headline: 'Who is on plan, and where targets are at risk',
    year: 'Aug 2025',
    kind: 'Analytics · BI',
    tags: ['Power BI', 'DAX', 'SQL Server', 'Galaxy schema'],
    summary:
      'A Power BI dashboard for the KPIM Mart retail chain comparing actual sales against monthly plans by store, product group, region, and time.',
    repo: 'https://github.com/thanhvu911/sales-planning-analysis',
    featured: true,
    cover: 'sales-analysis-dashboard.png',
    metrics: [
      { value: '58K+', label: 'Transactions' },
      { value: '2', label: 'Fact tables' },
      { value: '6', label: 'Shared dimensions' },
      { value: 'R12M', label: 'Rolling trend' },
    ],
    problem:
      'Which stores, regions, and product groups are meeting their monthly plan, and which are falling behind? And how is performance trending year over year and over the last 12 months?',
    approach: [
      'Integrated sales and monthly plan data from SQL Server into one Power BI model.',
      'Modeled a galaxy schema: two fact tables share conformed dimensions, so actual and planned figures can be compared at any grain.',
      'Wrote DAX measures for plan completion, year-over-year growth, rolling 12-month trend, and store and region rankings.',
      'Designed KPI cards, an actual-vs-plan trend, rankings, breakdowns, and drill-through to store detail.',
    ],
    architecture: ['SQL Server', 'Power Query', 'Galaxy schema', 'DAX measures', 'Power BI report'],
    dataModel: {
      facts: ['Sales (~58K lines)', 'Plan (monthly targets)'],
      dims: ['Store', 'Product', 'Category', 'Customer', 'Promotion', 'Date'],
    },
    results: [
      'Plan completion % = Actual ÷ Plan at any grain: store, region, product group, month.',
      'Year-over-year and rolling 12-month views show whether a miss is a blip or a trend.',
      'Drill-through takes a manager from a regional miss straight to the store responsible.',
    ],
    skills: ['Galaxy-schema modeling', 'DAX time intelligence', 'Power Query', 'Executive dashboards'],
    images: [
      { file: 'sales-analysis-dashboard.png', category: 'Power BI', caption: 'Sales analysis: KPIs, districts, trends, and managers' },
      { file: 'sales-report-dashboard.png', category: 'Power BI', caption: 'Drill-through: Dec 2022 vs. Dec 2021 by manager' },
      { file: 'sales-decomposition.png', category: 'Power BI', caption: 'Decomposition tree: store, brand, loyalty, income, promotion' },
      { file: 'sales-detailed-analysis.png', category: 'Power BI', caption: 'Transaction-level detail table' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'sales-data-model.png', category: 'Data model', caption: 'Galaxy schema in Power BI' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'insight-actual-vs-plan.png', category: 'Insights', caption: 'Actual vs. plan' },
      { file: 'insight-plan-completion-by-district.png', category: 'Insights', caption: 'Plan completion by district' },
    ],
  },
  {
    slug: 'lancaster-economic-indicators-dashboard',
    number: '04',
    title: 'Lancaster County Economic Indicators',
    headline: 'Benchmarking a county economy against the state and the nation',
    year: '2026',
    kind: 'Analytics · BI',
    tags: ['Power BI', 'DAX', 'Power Query', 'BLS', 'BEA'],
    summary:
      'A multi-fact Power BI model benchmarking Lancaster County against Pennsylvania and the U.S. on jobs, GDP, and wages.',
    repo: 'https://github.com/thanhvu911/lancaster-economic-indicators-dashboard',
    cover: 'edc-labor-lancaster.png',
    metrics: [
      { value: '10+', label: 'Years of data' },
      { value: '24+', label: 'NAICS sectors' },
      { value: '3', label: 'Geographies' },
      { value: '$59.5K', label: 'Avg. wage, 2024' },
    ],
    context:
      'Built as a technical interview case study for the Center for Regional Analysis at EDC Lancaster County, before I joined the team as a Data Analyst Fellow.',
    problem:
      "How is Lancaster County's economy performing relative to the state and the nation, and which industries drive its output and wages?",
    approach: [
      'Pulled BLS Local Area Unemployment Statistics (2015–2025, monthly), BEA real GDP by county and industry (chained 2017 dollars), and BLS QCEW wages.',
      'Modeled a star-schema variant with several fact tables sharing dimensions, so labor, GDP, and wage data filter together.',
      'Built a measures table for benchmarking: industry share of total, Lancaster ÷ PA, and Lancaster ÷ U.S.',
      'Designed four report pages: labor market, rate comparison, economic growth, and wages and employment.',
    ],
    architecture: ['BLS + BEA data', 'Excel workbook', 'Power Query', 'Multi-fact model', 'Power BI report'],
    dataModel: {
      facts: ['fact_employment', 'fact_gdp', 'fact_lan_wages', 'lan_avg_annual'],
      dims: ['dim_geo', 'dim_industry', 'dim_date'],
    },
    results: [
      "Lancaster's unemployment rate stayed below Pennsylvania's from 2015 to 2025, including during the 2020 spike.",
      'Average private-sector pay grew from about $41K (2014) to about $59.5K (2024).',
      'The largest employers (health care, manufacturing, retail) pay below the county average, while the highest-paying sectors employ fewer people.',
    ],
    skills: ['Power BI', 'DAX', 'Multi-fact modeling', 'Public economic data'],
    images: [
      { file: 'edc-labor-lancaster.png', category: 'Power BI', caption: 'Labor market: Lancaster unemployment, labor force, and employment, 2015–2025' },
      { file: 'edc-labor-pennsylvania.png', category: 'Power BI', caption: 'Labor market: Pennsylvania statewide' },
      { file: 'edc-growth-rate.png', category: 'Power BI', caption: 'Growth rate comparison: Lancaster vs. Pennsylvania' },
      { file: 'edc-economic-growth.png', category: 'Power BI', caption: 'Economic growth: GDP by industry, GDP trend, and wages' },
      { file: 'edc-economic-bottom5.png', category: 'Power BI', caption: 'Bottom 5 GDP industries and industry comparison' },
      { file: 'edc-economic-employees.png', category: 'Power BI', caption: 'Employees by sector' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'edc-data-model.png', category: 'Data model', caption: 'Power BI model: facts and shared dimensions' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'insight-unemployment.png', category: 'Insights', caption: 'Unemployment: Lancaster vs. Pennsylvania' },
      { file: 'insight-wages.png', category: 'Insights', caption: 'Average annual wage trend' },
      { file: 'insight-employment-by-sector.png', category: 'Insights', caption: 'Employment by sector' },
    ],
  },
  {
    slug: 'rfm-customer-segmentation',
    number: '05',
    title: 'RFM Customer Segmentation',
    headline: 'Turning every customer segment into a concrete action',
    year: '2025',
    kind: 'Analytics · BI',
    tags: ['Power BI', 'DAX', 'Power Query'],
    summary:
      'Scores customers on recency, frequency, and monetary value with config-driven DAX, and maps each segment to a marketing action.',
    repo: 'https://github.com/thanhvu911/rfm-customer-segmentation-powerbi',
    cover: 'insight-segment-playbook.png',
    metrics: [
      { value: '64', label: 'R-F-M codes' },
      { value: '1–4', label: 'Score per axis' },
      { value: 'Config', label: 'Driven thresholds' },
    ],
    problem:
      'Not every customer is worth the same marketing effort. Which customers are VIPs to reward, and which are at risk of churning and need re-engaging?',
    approach: [
      'Score: each customer gets a 1–4 score on Recency, Frequency, and Monetary value. Thresholds live in a configuration table by year, so they can be tuned without rewriting DAX.',
      'Segment: the R-F-M combination (for example 4-4-4) maps to a named segment.',
      'Act: each segment carries a description and a recommended marketing action.',
      'Track: actual revenue is compared against the monthly revenue plan.',
    ],
    architecture: ['Sales data', 'RFM config table', 'DAX scoring', 'Segment mapping', 'Power BI report'],
    results: [
      'Every customer lands in a named segment with a clear next action.',
      'Analysts can retune thresholds in a table instead of editing measures.',
    ],
    skills: ['Customer analytics', 'Config-driven DAX', 'Power Query'],
    images: [
      { file: 'insight-segment-playbook.png', category: 'Insights', caption: 'Segment playbook' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
    ],
  },
  {
    slug: 'bank-transaction-sql-analysis',
    number: '06',
    title: 'Bank Transaction SQL Analysis',
    headline: 'Validate first, then analyze',
    year: '2025',
    kind: 'Analytics · SQL',
    tags: ['SQL Server', 'T-SQL', 'Data quality'],
    summary:
      'Proves a retail-banking dataset can be trusted before analyzing it: validation, transformation, then analysis in T-SQL.',
    repo: 'https://github.com/thanhvu911/bank-transaction-sql-analysis',
    cover: 'insight-peak-hours.png',
    metrics: [
      { value: '1,000', label: 'Transactions' },
      { value: '800', label: 'Accounts' },
      { value: '15:00', label: 'Peak hour' },
    ],
    problem:
      'Which branches and currencies carry the most activity? How does behavior differ by credit-score band, account type, customer sector, and city? When are the peak transaction hours?',
    approach: [
      'Validate: NULL checks on every column, duplicate-key checks, distinct-value profiling, and distributions for categorical columns.',
      'Transform: standardize missing transaction amounts.',
      'Analyze: volume and value by branch, currency, credit-score range, account type, transaction type, sector, residence length, and city; peak transaction hours.',
      'Parsed a semi-structured text field (sector, years of residence, city) during analysis.',
    ],
    architecture: ['Excel / .bak', 'validation.sql', 'transform.sql', 'analysis.sql', 'Insights'],
    dataModel: { facts: ['banking_transaction'], dims: ['customer_account'] },
    results: [
      'Transactions peak at 15:00.',
      'Behavior broken down by branch, currency, credit-score band, account type, sector, and city.',
    ],
    skills: ['Data profiling', 'T-SQL', 'CASE bucketing', 'Parsing semi-structured fields'],
    images: [
      { file: 'insight-peak-hours.png', category: 'Insights', caption: 'Transactions by hour of day' },
      { file: 'insight-data-quality.png', category: 'Insights', caption: 'Data-quality findings' },
      { file: 'insight-value-by-account-type.png', category: 'Insights', caption: 'Value by account type' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'code-validation-checks.png', category: 'Code', caption: 'Validation checks' },
      { file: 'code-analysis-queries.png', category: 'Code', caption: 'Analysis queries' },
    ],
  },
  {
    slug: 'medical-cost-regression',
    number: '07',
    title: 'Medical Cost Regression',
    headline: 'How much do age and sex explain medical charges?',
    year: '2021',
    kind: 'Statistics',
    tags: ['R', 'Linear regression', 'ggplot2'],
    summary: 'Five nested linear models on 1,338 U.S. insurance records, compared with residual diagnostics.',
    repo: 'https://github.com/thanhvu911/medical-cost-regression-r',
    cover: 'insight-summary.png',
    metrics: [
      { value: '1,338', label: 'Records' },
      { value: '5', label: 'Nested models' },
      { value: '+$258', label: 'Per year of age' },
    ],
    problem: 'How much do age and sex explain differences in individual medical insurance charges?',
    approach: [
      'Exploratory analysis and visualization with ggplot2.',
      'Compared five nested linear models: intercept only, sex, age, sex + age, and a sex × age interaction.',
      'Model comparison and residual diagnostics, reported in R Markdown.',
    ],
    architecture: ['Insurance CSV', 'R / ggplot2', 'Nested models', 'Diagnostics', 'R Markdown report'],
    results: [
      'Age is a moderate, significant predictor of charges.',
      'Sex has minimal effect once age is accounted for.',
      'Most of the variation in charges comes from factors outside these two variables.',
    ],
    skills: ['Linear regression', 'Model comparison', 'Statistical inference', 'R Markdown'],
    images: [
      { file: 'insight-summary.png', category: 'Insights', caption: 'Summary of findings' },
      { file: 'report-page-2.png', category: 'Insights', caption: 'Report page 2' },
      { file: 'report-page-3.png', category: 'Insights', caption: 'Report page 3' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Analysis flow' },
      { file: 'code-nested-models.png', category: 'Code', caption: 'Nested models in R' },
    ],
  },
];

export const experience = [
  {
    role: 'Data Analyst Fellow',
    tech: ['Power BI', 'DAX', 'BLS / BEA APIs', 'Google Apps Script', 'Gemini'],
    company: 'EDC Lancaster County, Center for Regional Analysis',
    location: 'Lancaster, PA',
    dates: 'Aug 2026 – Present',
    current: true,
    bullets: [
      'Built an automated Power BI reporting pipeline that sources labor-market and economic data from federal public APIs (BLS, BEA) into a star-schema model, with scheduled refresh replacing manual data pulls.',
      'Developed a Google Apps Script web dashboard backed by Google Sheets, with automated imports, nightly refresh, and an integrated Gemini AI assistant that summarizes trends and flags anomalies for non-technical staff.',
      'Designed data-intake structures and dashboards for partner organizations, wrote dataset documentation and data dictionaries, and iterated on requirements with the Director of the Center for Regional Analysis.',
    ],
  },
  {
    role: 'Data Science Intern',
    tech: ['Python', 'Statistics', 'Machine learning', 'Seamless.AI'],
    company: 'KCC Capital Partners',
    location: 'Sheridan, WY',
    dates: 'Jan 2026 – May 2026',
    bullets: [
      'Collected, cleaned, and integrated datasets on precious-metal and mining companies, markets, and transactions; enriched contact records with Seamless.AI.',
      'Built statistical and machine-learning models to identify likely strategic and financial buyers for active mandates, and automated recurring reports and dashboards for the deal team.',
    ],
  },
  {
    role: 'Technology Support Assistant',
    tech: ['IT support', 'Imaging'],
    company: 'Quantitative Science Center, Franklin & Marshall College',
    location: 'Lancaster, PA',
    dates: 'Sep 2021 – Sep 2022',
    bullets: [
      'Resolved 50+ technical incidents per week, maintaining 99% classroom uptime.',
      'Standardized workstation imaging, cutting setup time by 40%.',
    ],
  },
  {
    role: 'Data Engineer Intern',
    tech: ['Python', 'Pandas', 'SQL Server', 'Power BI'],
    company: 'KPIM Joint Stock Company',
    location: 'Hanoi, Vietnam',
    dates: 'Jan 2021 – Apr 2021',
    bullets: [
      'Engineered ETL pipelines in Python (Pandas, NumPy) and SQL Server to automate legacy client data workflows, reducing processing time by 30% and eliminating manual entry errors.',
      'Validated Power BI reports with the analysis team and documented pipeline logic as reusable references.',
    ],
  },
];

export const skills = [
  {
    group: 'Programming Languages',
    icon: 'code',
    items: ['Python (Pandas, NumPy)', 'SQL (T-SQL, MySQL)', 'R', 'DAX', 'Power Query M', 'JavaScript (Apps Script)', 'HTML/CSS'],
  },
  {
    group: 'Tools & Platforms',
    icon: 'wrench',
    items: ['Power BI', 'Microsoft Fabric', 'SQL Server', 'Power Query', 'Excel', 'Power Automate', 'Google Sheets / Apps Script', 'Git / GitHub'],
  },
  {
    group: 'Data Engineering & Analytics',
    icon: 'database',
    items: ['ETL / ELT pipelines', 'Medallion architecture', 'Dimensional modeling', 'Data-quality testing', 'Statistical modeling', 'Machine learning', 'Predictive analytics'],
  },
];

export const credentials = [
  { title: 'Microsoft Certified: Fabric Data Engineer Associate', detail: 'DP-700 · Microsoft · Oct 2026' },
  { title: 'SQL (Advanced) Certificate', detail: 'HackerRank · Sep 2025' },
];

export const education = {
  degree: 'B.A. Computer Science',
  school: 'Franklin & Marshall College',
  location: 'Lancaster, PA',
  date: 'May 2026',
  gpa: 'GPA 3.72 · Major 3.82',
  honors: "Honors List Fall 2021, 2023, 2024, 2025 · Dean's List Spring 2022",
  coursework: [
    'Data Science',
    'Algorithms',
    'Artificial Intelligence',
    'Machine Learning',
    'Statistical Modeling',
    'Probability & Statistics',
    'Information Theory',
    'Theory of Computation',
    'Applied Regression Analysis',
  ],
};

export const nav = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Education', href: '/#education' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
];
