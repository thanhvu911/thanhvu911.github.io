// Single source of truth for site content. Every fact here comes from
// Thanh's resumes, project READMEs, or portfolio brief: do not add numbers
// that are not backed by one of those.

export const profile = {
  name: 'Thanh Vu',
  role: 'Data Engineer & Analyst',
  eyebrow: 'Data Engineer & Analyst',
  tagline: 'I build the pipelines, models, and Power BI reports that turn public and business data into decisions.',
  // Phone digits are stored reversed and assembled in the browser, so simple
  // scrapers reading the HTML don't pick up the number.
  phoneReversed: '2059968717',
  // Web3Forms access key (free, from web3forms.com). Leave empty to hide the form;
  // the one-click email, Gmail, and LinkedIn buttons always show.
  web3formsKey: '',
  // GoatCounter site code (free, cookie-free visit counts at <code>.goatcounter.com).
  // Leave empty until the account exists; no tracking script loads while it is empty.
  goatcounter: '',
  // URL of the Cloudflare Worker in worker/ that answers "Ask about Thanh" with
  // Gemini. Leave empty to use the prewritten quick answers instead.
  assistantEndpoint: '',
  roles: ['Data Engineer', 'Data Analyst', 'Power BI Developer'],
  status: 'Data Analyst Fellow @ EDC Lancaster County',
  availability: 'Data Engineer and Data Analyst, available for on-site roles anywhere in the U.S.',
  location: 'Lancaster, PA',
  locationNote: 'Available for on-site roles anywhere in the U.S.',
  email: 'vulethanh07112002@gmail.com',
  github: 'https://github.com/thanhvu911',
  githubUser: 'thanhvu911',
  linkedin: 'https://www.linkedin.com/in/thanh25/',
  resumes: [
    { id: 'analyst', label: 'Data Analyst', href: '/thanh-vu-resume-data-analyst.pdf', note: 'Dashboards, analysis, and reporting' },
    { id: 'engineer', label: 'Data Engineer', href: '/thanh-vu-resume-data-engineer.pdf', note: 'Pipelines, warehouses, and Microsoft Fabric' },
    { id: 'grad-school', label: 'Graduate school', href: '/thanh-vu-resume-graduate-school.pdf', note: 'Research, coursework, and projects for graduate programs' },
  ],
};

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
  why: string;
  role: string;
  challenges: string[];
  problem: string;
  approach: string[];
  architecture: string[];
  dataModel?: { facts: string[]; dims: string[]; note?: string };
  dataQuality?: string[];
  results: string[];
  skills: string[];
  images: ProjectImage[];
  /** What the project taught me, and what I would do next; shown as part 05 of the case study. */
  learned?: string[];
  improve?: string[];
  /** Optional public Power BI "Publish to web" embed URL, shown on the Interactive dashboard tab. */
  powerbiEmbed?: string;
  /** Alt text for the live motion graphic (src/lib/motion.ts, drawn from the project's own results). */
  animation?: string;
  /** Screen recording of the original report in Power BI Desktop: base name of /videos/<name>.mp4 and its .jpg poster. */
  powerbiVideo?: string;
  /** Power BI Desktop files in the project repo, for reviewers who want the real report. */
  pbix?: { label: string; file: string }[];
}

/** Projects with an interactive Power BI-style dashboard on their page (see projects/[slug].astro). */
export const dashboardSlugs = ['can-mail-data-predict-housing-vacancy', 'lancaster-economic-indicators-dashboard', 'sales-planning-analysis', 'rfm-customer-segmentation'];

/** Direct download link for a file at the root of a project's GitHub repo. */
export const repoFile = (repo: string, file: string) => `${repo}/raw/HEAD/${encodeURIComponent(file)}`;

export const projects: Project[] = [
  {
    slug: 'can-mail-data-predict-housing-vacancy',
    number: '01',
    title: 'Can Mail Data Predict Housing Vacancy?',
    headline: 'Does USPS vacancy track the Census rate, county by county?',
    year: '2026',
    kind: 'Data engineering · Analytics',
    why: "Knowing which neighborhoods have rising vacancy is core to how a local economic development office decides where to invest. The Census estimate is the gold standard but comes out once a year and can lag reality. USPS already tracks which addresses stop receiving mail, every quarter, for free. If it reliably tracked the Census number, it would be a much faster early-warning signal between official releases.",
    role: "Solo project: data sourcing, the Microsoft Fabric pipeline, the semantic model, DAX measures, report design, and the analysis.",
    challenges: ["Inconsistent USPS header casing broke column matching across quarterly files, so headers are normalized in Power Query before combining.", "Combine Files silently dropped the filename column, which carried the county key. It is restored explicitly so every row can still be attributed.", "DAX has no native correlation function, so the Pearson r measure is hand-built with SUMX.", "A Power BI chart can legend by measure or by category, never both, so the report uses small multiples to compare Census and USPS for every county at once.", "The 2012 USPS classification change shows up as a shift that looks like a trend. It is treated and documented as a data artifact, not a finding."],
    tags: ['Microsoft Fabric', 'Lakehouse', 'Dataflow Gen2', 'Power BI', 'DAX'],
    summary:
      "Does USPS mail data track the Census vacancy rate? Compared across 6 counties and 84 county-years (2010–2024, 2020 missing) on a Microsoft Fabric pipeline with a Power BI report. Overall they track each other (r = 0.77, where 1.0 is perfect), but one county sits at −0.01.",
    repo: 'https://github.com/thanhvu911/can-mail-data-predict-housing-vacancy',
    featured: true,
    animation: 'Six county charts draw Census and USPS vacancy rates from 2011 to 2024, mark the 2012 USPS redefinition, and note that the pooled correlation is 0.77, but within a county it ranges from 0.72 to −0.01.',
    powerbiVideo: 'can-mail-data-predict-housing-vacancy',
    cover: 'powerbi-dashboard-overview-all-counties.png',
    metrics: [
      { value: '0.77', label: 'Pooled correlation (−0.01 in one county)' },
      { value: '57.7%', label: 'Directional match (78 county-years with a prior year)' },
      { value: '84', label: 'County-year observations' },
      { value: '6 × 14', label: 'Counties × years' },
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
    results: ["Pooled across counties the two sources track each other (r = 0.77, where 1.0 is perfect; counties sitting at different vacancy levels inflate this), but within a county it ranges from 0.72 (Montgomery, OH) to −0.01 (Champaign, IL).", "USPS correctly flags whether vacancy is rising or falling 57.7% of the time, below what always guessing “down” achieves. A plain always-“down” guess scored 64.8% in the follow-up nowcast project, so direction alone is not a usable signal.", "The narrow USPS estimate reads about 5.3 points below Census and the broad one about 2.7 points above, biased in opposite directions, so no single correction factor works.", "Bottom line: a county-dependent signal at best. Correlation (r) ranges from 0.72 to −0.01 and direction is right 57.7% of the time, so check the county before relying on it, and it is not a substitute for the Census.", "Every headline number is reproducible from the 84-row comparison table with plain arithmetic."],
    skills: ["Microsoft Fabric (Lakehouse, Dataflow Gen2)", "Power Query M", "DAX", "Semantic models", "Power BI report design", "Statistical reasoning", "Data validation"],
    learned: ["A strong pooled correlation (r = 0.77) can hide weak or even reversed relationships inside single counties, so I check results group by group before trusting them.", "Data definitions change: what looked like a 2012 trend was a USPS reclassification, found only by tracing the number back to its source."],
    improve: ["I followed up with a nowcasting model (the vacancy nowcast project) to test whether USPS data can predict the Census rate, not just track it.", "Add more years, or a pooled model, so per-county results rest on more than 14 years each."],
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
      { file: 'data-model.png', category: 'Data model', caption: 'Data model: Dataflow Gen2 query lineage' },
      { file: 'fabric-dataflow-gen2-diagram-view.png', category: 'Code', caption: 'Dataflow Gen2 in Fabric: query diagram view' },
      { file: 'code-pearson-correlation.png', category: 'Code', caption: 'Hand-built Pearson correlation in DAX' },
      { file: 'insight-correlation-by-county.png', category: 'Insights', caption: 'Correlation by county' },
      { file: 'insight-directional-match-rate.png', category: 'Insights', caption: 'Directional match rate' },
      { file: 'insight-average-gap.png', category: 'Insights', caption: 'Average gap: USPS vs. Census' },
    ],
  },
  {
    slug: 'grocery-transaction-data-warehouse',
    context: 'Built on the public Supermarket Transactional Data dataset by Nadin Ramadan on Kaggle. The warehouse design, ETL, tests, and documentation are my own work.',
    number: '02',
    title: 'Grocery Transaction Data Warehouse',
    headline: 'A Medallion warehouse over 131M+ rows, in plain SQL Server',
    year: 'Jul–Aug 2025',
    kind: 'Data engineering',
    why: "Retail transaction data usually arrives as messy, disconnected CSV extracts that nobody fully trusts, so analysts end up cleaning the same data again for every question. A layered warehouse lands the raw data once, cleans it once, and gives the business one tested, documented model for sales, customer, and product questions.",
    role: "Solo project: architecture, stored-procedure ETL, dimensional modeling, data-quality tests, and documentation.",
    challenges: ["Loading 131M+ rows reliably: a truncate + BULK INSERT procedure with load timing and TRY/CATCH, so a failed load is logged instead of silently leaving partial data.", "Inconsistent source values (whitespace, gender, loyalty tier, nationality codes) are standardized in Silver and then verified by automated tests.", "Keeping Gold trustworthy: tests for surrogate-key uniqueness and fact-to-dimension referential integrity.", "21 automated data-quality checks filtered 10M raw transactions to 3.3M completed sales and flagged 1.58M orders whose header totals did not match their line items."],
    tags: ['SQL Server', 'T-SQL', 'Medallion', 'ETL', 'Star schema'],
    summary:
      "Raw store data lands in SQL Server and is cleaned layer by layer (Bronze is raw, Silver is cleaned, Gold is report-ready) into a documented star schema. Built on 131M+ rows of synthetic Kaggle data, with 21 automated quality checks that flagged 1.58M orders whose totals did not add up.",
    repo: 'https://github.com/thanhvu911/grocery-transaction-data-warehouse',
    featured: true,
    animation: 'Row counts flow from Bronze (10 million transactions, 131 million lines) to Silver (3.3 million completed orders, 1.58 million failing the header-total check) to Gold (43.8 million fact rows).',
    cover: 'architecture-medallion.png',
    metrics: [
      { value: '131M+', label: 'Transaction lines loaded' },
      { value: '21', label: 'Automated quality checks' },
      { value: '3.3M', label: 'Completed sales kept' },
    ],
    problem:
      'Retail transaction data typically arrives as messy, disconnected extracts. The goal: make it trustworthy and fast to query by landing it raw, cleaning and standardizing it, then modeling it for analytics on sales, customers, and product performance.',
    approach: [
      'Bronze: a raw copy of six source CSVs (brands, categories, customers, products, transactions, transaction lines), loaded by a truncate + BULK INSERT procedure with load timing and TRY/CATCH error handling.',
      'Silver: cleaned and standardized data (type casting, value normalization, text cleanup) loaded by its own procedure with per-table timing.',
      'Gold: a business-ready star schema exposed as views.',
      'Documented a column-level data catalog and naming conventions for schemas, tables, columns, and procedures.',
    ],
    architecture: ['CSV sources', 'Bronze (BULK INSERT)', 'Silver (cleaned)', 'Gold (star schema)', 'Analytics'],
    dataModel: { facts: ['fact_sales'], dims: ['dim_customers', 'dim_products'] },
    dataQuality: [
      'Silver tests: null and duplicate keys, unwanted whitespace, broken references between tables, and unexpected categorical values (gender, loyalty tier, nationality).',
      'Gold tests: surrogate-key uniqueness and referential integrity between facts and dimensions.',
    ],
    results: [
      'A layered warehouse where each step can be re-run and audited independently.',
      'Keeping completed orders cut 10M raw transactions to 3.3M; 21 automated checks run after each layer.',
      '1.58M orders flagged because their header totals did not match their line items (47.5% of completed orders), so revenue is rebuilt from line prices.',
      'In this synthetic data, the top 20% of customers generate 44.7% of $3.4B in revenue.',
      'Data: a synthetic Kaggle retail dataset (about 12 GB of CSV). Results were re-checked by running the same SQL logic in DuckDB.',
    ],
    skills: ["Data warehouse design", "Medallion architecture", "Dimensional modeling (star schema)", "T-SQL stored procedures", "Data-quality testing", "Technical documentation"],
    learned: ["Header totals cannot be trusted blindly: 47.5% of completed orders did not match their line items, so quality tests belong inside the pipeline, not after it.", "Layered Bronze, Silver, and Gold loads make every step re-runnable and easy to audit."],
    improve: ["Load new data incrementally instead of truncating and reloading every table.", "Record timings for the full load on SQL Server, and alert when a quality check fails."],
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
    why: "Retail managers need to know early which stores, regions, and product groups are going to miss their monthly targets, so they can act before the month closes rather than explain the miss afterwards.",
    role: "Solo project: data preparation, the galaxy-schema model, DAX measures, and report design.",
    challenges: ["Actuals are recorded per transaction line while plans are monthly targets. A galaxy schema with two fact tables on shared dimensions lets them be compared at any grain.", "Time intelligence in DAX: plan completion, year-over-year growth, and a rolling 12-month trend that hold up under every slicer.", "Turning a wide dataset into a report a manager can use: KPI cards first, then rankings, then drill-through to the store responsible."],
    tags: ['Power BI', 'DAX', 'SQL Server', 'Galaxy schema'],
    summary:
      "A Power BI dashboard on a synthetic dataset for the KPIM Mart retail chain that shows whether each store, product group, and region is on track against its monthly plan, from a KPI overview down to the store responsible. The chain reached 91.7% of its 2022 plan.",
    repo: 'https://github.com/thanhvu911/sales-planning-analysis',
    featured: true,
    pbix: [
      { label: 'Capstone report (.pbix, 3.7 MB)', file: 'Capstone Project.pbix' },
      { label: 'KPIM Mart sales report (.pbix, 1.9 MB)', file: 'KPIM Mart Sales Report Datathon 3.pbix' },
    ],
    powerbiVideo: 'sales-planning-analysis',
    animation: 'Bars fill toward each district’s 2022 plan; the chain reached 5.90 billion VND of a 6.43 billion plan, 91.7%.',
    cover: 'sales-analysis-dashboard.png',
    metrics: [
      { value: '91.7%', label: 'of the 2022 plan reached, chain-wide' },
      { value: '58K+', label: 'Order lines' },
      { value: '2', label: 'Fact tables' },
      { value: '6', label: 'Shared dimensions' },
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
      'District plan completion ranges from about 89% to 98%: no district fully hit its target over 2020–2022.',
      'Over 36 months, year-over-year revenue ranged from +37% to −15%; this project describes the swings and does not test their causes.',
      'Plan completion % = Actual ÷ Plan at any grain: store, region, product group, month.',
      'Year-over-year and rolling 12-month views show whether a miss is a blip or a trend.',
      'Drill-through takes a manager from a regional miss straight to the store responsible.',
    ],
    skills: ["Galaxy-schema modeling", "DAX time intelligence", "Power Query", "SQL Server", "Executive dashboard design"],
    learned: ["Comparing monthly plans with transaction-level actuals needs two fact tables on shared dimensions; one flat table cannot answer both grains.", "Managers act on the answer, not the chart: KPI first, then the ranking, then drill-through to the store responsible."],
    improve: ["Add a forecast for the rest of the year so a district can see a miss coming.", "Publish with row-level security so each manager sees only their own stores."],
    images: [
      { file: 'powerbi-page-1-district-revenue-plan.png', category: 'Power BI', caption: "District revenue plan: planned revenue by district, store, and month" },
      { file: 'powerbi-page-2-district-category-table.png', category: 'Power BI', caption: "District category table: revenue by district, store, and product category" },
      { file: 'powerbi-page-3-store-manager-overview.png', category: 'Power BI', caption: "Store and manager overview: actual vs. plan" },
      { file: 'powerbi-page-4-manager-achievement.png', category: 'Power BI', caption: "Manager achievement: progress toward plan and growth by store" },
      { file: 'sales-analysis-dashboard.png', category: 'Power BI', caption: 'Sales analysis: KPIs, districts, trends, and managers' },
      { file: 'sales-report-dashboard.png', category: 'Power BI', caption: 'Drill-through: Dec 2022 vs. Dec 2021 by manager' },
      { file: 'sales-decomposition.png', category: 'Power BI', caption: 'Decomposition tree: store, brand, loyalty, income, promotion' },
      { file: 'sales-detailed-analysis.png', category: 'Power BI', caption: 'Transaction-level detail table' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'sales-data-model.png', category: 'Data model', caption: 'Galaxy schema in Power BI' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'powerbi-data-model.png', category: 'Data model', caption: 'Power BI Model view (from Power BI Desktop)' },
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
    why: "Economic development staff brief investors, officials, and partners on how the county is doing. They need a trusted, side-by-side view of Lancaster against Pennsylvania and the U.S. on jobs, output, and pay, built from official public data.",
    role: "Solo project, built as a technical interview case study: data preparation, the multi-fact model, benchmarking measures, and a two-page report.",
    challenges: ["Three sources at different grains (monthly labor data, annual GDP by industry, annual wages by NAICS sector) combined in one multi-fact model with shared geography, industry, and date dimensions.", "A dedicated measures table for benchmarking: industry share of total, Lancaster ÷ PA, and Lancaster ÷ U.S.", "Keeping comparisons honest: GDP is in chained 2017 dollars and the wage data covers private establishments only, and both are documented."],
    tags: ['Power BI', 'DAX', 'Power Query', 'BLS', 'BEA'],
    summary:
      "Lancaster County, Pennsylvania, and the U.S. side by side on jobs, economic output, and pay, built from official BLS and BEA data in Power BI for briefing officials and investors.",
    repo: 'https://github.com/thanhvu911/lancaster-economic-indicators-dashboard',
    pbix: [{ label: 'Power BI report (.pbix, 1.2 MB)', file: 'EDC presentation.pbix' }],
    powerbiVideo: 'lancaster-economic-indicators-dashboard',
    animation: 'Lancaster and Pennsylvania unemployment rates draw from 2015 to 2025; Lancaster stays below the state every year, 7.3% vs 8.9% in 2020.',
    cover: 'edc-labor-lancaster.png',
    metrics: [
      { value: '$41K → $59.5K', label: 'Avg. private pay, 2014–2024 (not inflation-adjusted)' },
      { value: '24+', label: 'NAICS sectors' },
      { value: '3', label: 'Geographies' },
          ],
    context:
      'Built as a technical interview case study for the Center for Regional Analysis at EDC Lancaster County, before I joined the team as a Data Analyst Fellow.',
    problem:
      "How is Lancaster County's economy performing relative to the state and the nation, and which industries drive its output and wages?",
    approach: [
      'Pulled BLS Local Area Unemployment Statistics (2015–2025, monthly), BEA real GDP by county and industry (chained 2017 dollars), and BLS QCEW wages.',
      'Modeled a star-schema variant with several fact tables sharing dimensions, so labor, GDP, and wage data filter together.',
      'Built a measures table for benchmarking: industry share of total, Lancaster ÷ PA, and Lancaster ÷ U.S.',
      'Designed a two-page report: a labor market page that toggles between Lancaster, Pennsylvania, and rate views, and an economic growth page for GDP, wages, and employment.',
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
    skills: ["Power BI", "DAX", "Power Query", "Multi-fact modeling", "BLS and BEA public data", "Economic benchmarking"],
    learned: ["Federal series arrive on different schedules and geographies; shared date and geography dimensions keep them comparable.", "Toggles on one page (Lancaster, Pennsylvania, rates) are easier to read than several near-identical pages."],
    improve: ["Refresh the data straight from the BLS and BEA APIs on a schedule, the approach I now use at EDC.", "Add peer counties so Lancaster is compared with places like it, not only with the state."],
    images: [
      { file: 'powerbi-page-1-overview-labor-market.png', category: 'Power BI', caption: "Overview & labor market: Lancaster vs. Pennsylvania" },
      { file: 'powerbi-page-2-economic-growth.png', category: 'Power BI', caption: "Economic growth: GDP by industry, GDP trend, and wages" },
      { file: 'edc-labor-lancaster.png', category: 'Power BI', caption: 'Labor market: Lancaster unemployment, labor force, and employment, 2015–2025' },
      { file: 'edc-labor-pennsylvania.png', category: 'Power BI', caption: 'Labor market: Pennsylvania statewide' },
      { file: 'edc-growth-rate.png', category: 'Power BI', caption: 'Growth rate comparison: Lancaster vs. Pennsylvania' },
      { file: 'edc-economic-growth.png', category: 'Power BI', caption: 'Economic growth: GDP by industry, GDP trend, and wages' },
      { file: 'edc-economic-bottom5.png', category: 'Power BI', caption: 'Bottom 5 GDP industries and industry comparison' },
      { file: 'edc-economic-employees.png', category: 'Power BI', caption: 'Employees by sector' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'edc-data-model.png', category: 'Data model', caption: 'Power BI model: facts and shared dimensions' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model' },
      { file: 'powerbi-data-model.png', category: 'Data model', caption: 'Power BI Model view (from Power BI Desktop)' },
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
    why: "Marketing budgets are limited. Treating every customer the same wastes money on low-value customers and misses the ones about to churn. RFM segmentation tells a team exactly who to reward, who to win back, and who to leave alone.",
    role: "Solo project: scoring logic, segment mapping, data model, and report.",
    challenges: ["Scoring lives in the model as DAX calculated columns on dim_customer, so every customer's R, F, and M score updates with the data.", "64 possible R-F-M codes map to 9 named segments, each with a description and a recommended marketing action.", "Segments sit alongside revenue against the monthly plan, so marketing and sales see one picture."],
    tags: ['Power BI', 'DAX', 'Power Query', 'Segmentation'],
    summary:
      "Scores 18.4K customers (a synthetic dataset) on how recently, how often, and how much they buy, then sorts them into 9 named segments, each with a suggested action: reward, win back, or leave alone.",
    repo: 'https://github.com/thanhvu911/rfm-customer-segmentation-powerbi',
    pbix: [{ label: 'Power BI report (.pbix, 3.7 MB)', file: 'Capstone Project.pbix' }],
    powerbiVideo: 'rfm-customer-segmentation',
    animation: 'Dots representing 18.4 thousand customers sort into segments: 42% At-Risk, 26% Growth, 21% Standard, 10% Premium.',
    cover: 'powerbi-page-2-customer-analysis.png',
    metrics: [
      { value: '42%', label: 'of 18.4K customers fall in the rule-based At-Risk group, the largest' },
      { value: '18.4K', label: 'Customers scored' },
      { value: '64', label: 'R-F-M codes' },
      { value: '9', label: 'Named segments (shown as 4 groups)' },
    ],
    problem:
      'Not every customer is worth the same marketing effort. Which customers are VIPs to reward, and which are at risk of churning and need re-engaging?',
    approach: [
      'Score: DAX calculated columns on dim_customer score recency, frequency, and monetary value from 1 to 4.',
      'Segment: the three scores form an R-F-M code (for example 444) that links to a segment table.',
      'Act: each segment carries a description and a recommended marketing action.',
      'Track: actual revenue is compared against the monthly revenue plan in the same report.',
    ],
    architecture: ['Sales data', 'dim_customer', 'DAX R-F-M scores', 'Segment table', 'Power BI report'],
    results: [
      'Scored 18.4K customers from 1 to 4 on recency, frequency, and spend, and mapped 64 codes to 9 named segments with a next action each (a rule-based method, not a fitted model); 42% fall in the At-Risk group, the largest to win back.',
      'Marketing can see at a glance who to reward, who to win back, and who to leave alone.',
    ],
    skills: ["Customer analytics", "DAX calculated columns", "Power Query", "Power BI", "Turning analysis into actions"],
    learned: ["Quartile scores are easy to explain to a marketing team, and the segment names matter as much as the math.", "Recency has to be measured from one fixed date, or the same customer scores differently each time the report refreshes."],
    improve: ["Track how customers move between segments month to month.", "Compare the RFM groups with a clustering method such as k-means to see whether the data suggests different groups."],
    images: [
      { file: 'powerbi-page-1-sales-analysis.png', category: 'Power BI', caption: "Sales analysis: sales by district, product, and manager" },
      { file: 'powerbi-page-2-customer-analysis.png', category: 'Power BI', caption: "Customer analysis: RFM scores, segments, and loyalty groups" },
      { file: 'insight-segment-playbook.png', category: 'Insights', caption: 'Segment playbook' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
      { file: 'data-model.png', category: 'Data model', caption: 'Data model: DAX-scored customers mapped to the segment table' },
      { file: 'powerbi-data-model.png', category: 'Data model', caption: 'Power BI Model view (from Power BI Desktop)' },
    ],
  },
  {
    slug: 'bank-transaction-sql-analysis',
    number: '06',
    title: 'Bank Transaction SQL Analysis',
    headline: 'Validate first, then analyze',
    year: '2025',
    kind: 'Analytics · SQL',
    why: "Banks act on branch, product, and customer-segment insights. Analysis built on data nobody has checked leads to confident but wrong decisions, so this project proves the data can be trusted before answering any business question.",
    role: "Solo project: validation, transformation, and analysis scripts in T-SQL.",
    challenges: ["Every column profiled first: NULL checks, duplicate-key checks, distinct values, and distributions for categorical columns.", "Missing transaction amounts standardized in a separate transform step, so the fix is explicit and repeatable.", "A semi-structured text field (sector, years of residence, city) parsed with T-SQL so it could be analyzed."],
    tags: ['SQL Server', 'T-SQL', 'Data quality'],
    summary:
      "Before analyzing 1,000 bank transactions, the data itself gets checked: 12.3% of rows were missing a field and 17 currency codes were invalid. Missing amounts are standardized in a separate, repeatable step, then the business question is answered in T-SQL.",
    repo: 'https://github.com/thanhvu911/bank-transaction-sql-analysis',
    animation: 'A data-quality bar shows 87.7% complete rows, 12.3% missing a field, and 17 invalid currency codes, then credit bands show Poor-credit accounts hold 51.4% of transaction value.',
    cover: 'insight-peak-hours.png',
    metrics: [
      { value: '12.3%', label: 'of rows had a missing field; missing amounts were standardized before analysis' },
      { value: '17', label: 'Invalid currency codes' },
      { value: '800', label: 'Accounts' },
      { value: '51%', label: 'of value from Poor-credit accounts (52% of customers)' },
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
      'In these 1,000 transactions the busiest hour is 15:00; I have not tested whether this exceeds chance variation.',
      'Poor-credit accounts hold 51% of transaction value, matching their 52% share of customers, so value is roughly proportional to customer share.',
    ],
    skills: ["Data profiling and validation", "T-SQL joins and aggregation", "CASE-based bucketing", "Parsing semi-structured fields", "Exploratory analysis"],
    learned: ["Profiling first (12.3% of rows missing fields, 17 invalid currency codes) decides which questions the data can honestly answer.", "A partial year can look like a 25% drop; comparing per month removes the false signal."],
    improve: ["Add validation rules at load time so bad rows are flagged before analysis.", "Convert amounts with a dated exchange-rate table so cities can be compared in one currency."],
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
    title: 'Medical Cost Modeling and Prediction',
    headline: 'Which factors are associated with medical costs, and where does the model fail?',
    year: 'Oct 2026',
    kind: 'Machine learning · Statistics',
    why: "Before pricing a policy or targeting a health program, analysts need to know which factors actually drive costs, and how far a prediction can be trusted for each group of people.",
    role: "Two parts: my own 2021 R study of age and sex, and a 2026 Python extension with the full feature set, a nine-model comparison, and subgroup error analysis. I chose the questions and designed the evaluations, and used AI tools to double-check code for edge cases.",
    challenges: ["Testing whether a smoker × obese interaction explains three cost bands that age and sex could not (nested F-test, not just a chart).", "Keeping model selection honest: 5-fold cross-validation on the training split only, with the test set scored once."],
    tags: ['Python', 'scikit-learn', 'R'],
    summary:
      "Age and sex explain only 9% of medical charges. Adding the other predictors lifts R² to 75%, and a smoker × obese interaction takes it to 86% (88% on held-out data, against 86% in-sample; from a single split I cannot tell whether that gap is real). Nine models are compared with cross-validation on 1,338 insurance records.",
    repo: 'https://github.com/thanhvu911/medical-cost-regression-r',
    featured: true,
    animation: '1,338 policyholders split into three cost bands by smoking and obesity, and R-squared rises from 0.09 (age and sex) to 0.75 (all predictors) to 0.86 (with the smoker × obese interaction), with 0.88 on held-out data.',
    cover: '01-three-bands.png',
    metrics: [
      { value: '0.09 → 0.86', label: 'Share of cost variation explained (R², in-sample): 9% (age + sex) to 86% (with smoker × obese interaction)' },
      { value: '9', label: 'Models compared' },
      { value: '0.88', label: 'Held-out R²' },
    ],
    problem: 'Age and sex explain only 9% of medical charges. What explains the rest, and how well can charges be predicted?',
    approach: [
      'Part 1 (R, 2021): five nested linear models on age and sex.',
      'Part 2 (Python, 2026): explained three cost bands with a smoker × obesity interaction, tested with a nested F-test and bootstrap confidence intervals.',
      'Compared nine models (linear, ridge, lasso, random forest, gradient boosting, and baselines) with 5-fold cross-validation, then scored a held-out test set once.',
      'Measured error by subgroup and ranked features by permutation importance.',
    ],
    architecture: ['Insurance CSV', 'R nested models', 'Python / pandas', 'scikit-learn CV', 'Subgroup errors'],
    results: [
      'A smoking × obesity interaction lifts in-sample R² from 0.75 to 0.86 (0.88 on held-out data). Because the cost bands are defined by smoking and obesity, this describes the data rather than validating a predictor.',
      'The earlier sex effect was confounded by smoking: it flips from +$1,539 to −$494 once smoking is in the model.',
      'The interpretable linear model matched ridge, lasso, and random forest and beat boosting, with a held-out R² of 0.88.',
      'Errors are uneven: 29% relative error for non-smokers versus 5% for obese smokers.',
    ],
    skills: ['Linear regression', 'Interaction effects and confounding', 'Cross-validation', 'scikit-learn', 'Bootstrap confidence intervals', 'Subgroup error analysis', 'R'],
    learned: ["One interaction term (smoking × obesity) took in-sample R² from 0.75 to 0.86 on top of the other predictors (0.88 on held-out data).", "A good average can hide who the model serves worst: 29% relative error for non-smokers versus 5% for obese smokers.", "The apparent sex effect flipped sign once smoking was accounted for, a real example of confounding."],
    improve: ["Report error by subgroup next to the overall score by default.", "Add prediction intervals and check their coverage for each subgroup."],
    images: [
      { file: '01-three-bands.png', category: 'Insights', caption: 'Three cost bands: smoking and obesity' },
      { file: '02-model-comparison.png', category: 'Insights', caption: 'Nine models compared with 5-fold CV' },
      { file: '03-subgroup-error.png', category: 'Insights', caption: 'Where the model fails: error by subgroup' },
      { file: 'insight-summary.png', category: 'Insights', caption: 'Part 1 (2021): summary of findings' },
      { file: 'report-page-2.png', category: 'Insights', caption: 'Report page 2' },
      { file: 'report-page-3.png', category: 'Insights', caption: 'Report page 3' },
      { file: 'dataflow.png', category: 'Data flow', caption: 'Analysis flow' },
      { file: 'code-nested-models.png', category: 'Code', caption: 'Nested models in R' },
    ],
  },
  {
    slug: 'melbourne-housing-price-prediction',
    number: '08',
    title: 'Melbourne Housing Price Prediction',
    headline: 'Does the way you test a model change the answer?',
    year: '2026',
    kind: 'Machine learning',
    why: "A price model that looks accurate in testing can still fail when it is used somewhere new. Knowing how a model was tested tells you where its accuracy actually holds.",
    role: "Extended a Machine Learning course exploration into a full modeling study, from feature preparation to three evaluation designs and an error analysis. I chose the questions and designed the evaluations, and used AI tools to double-check code for edge cases.",
    challenges: ["Handling heavy missing data honestly: BuildingArea is missing for 47.5% of sales and YearBuilt for 39.6%, so the model gets median values plus missing-value flags.", "Designing three different tests (random folds, past-to-future, and leave-one-region-out) so the results answer different real questions."],
    tags: ['Python', 'scikit-learn', 'pandas'],
    summary:
      "How accurate a house-price model looks depends on how it is tested. On 13,580 Melbourne sales, random cross-validation gives a 13.1% error; hold out a whole region the model has never seen and it rises to 18–38%.",
    repo: 'https://github.com/thanhvu911/machine-learning-coursework',
    animation: 'Error bars: 13.1% under random and time splits, 18 to 38% when a whole region is held out.',
    cover: '02-leave-one-region-out.png',
    metrics: [
      { value: '13.1%', label: 'Error on random folds, versus 18–38% on an unseen region' },
      { value: '13.1%', label: 'Error under random CV' },
      { value: '18–38%', label: 'Error on an unseen region' },
    ],
    problem: 'How accurate is a house-price model, and does the answer depend on how the model is tested?',
    approach: [
      'Prepared 13,580 sales (Jan 2016 – Sep 2017) with log price as the target and rooms, type, distance, land and building area, location, sale method, and region as features.',
      'Compared a median baseline, ridge regression, random forest, and gradient boosting.',
      'Tested each model three ways: random 5-fold cross-validation, training on past sales to predict the last 25%, and holding out one region at a time.',
      'Broke down the best model’s error by property type and by missing data.',
    ],
    architecture: ['Melbourne sales CSV', 'pandas features', 'scikit-learn models', 'Three test designs', 'Error analysis'],
    results: [
      'Gradient boosting was best: 13.1% average error under random CV (R² on log price 0.887), and the same 13.1% when predicting future sales.',
      'On a region the model has never seen, error rises to 18–38%, and to 37.9% for Western Metropolitan, nearly three times worse.',
      'Random cross-validation answers “how well does this work on more houses like these?”, not “how well does it work somewhere new?”.',
      '7.9% of sales are predicted more than 30% away from the sale price, and sales missing BuildingArea have higher error (13.8% versus 12.5%).',
    ],
    skills: ['scikit-learn', 'Cross-validation design', 'Gradient boosting', 'Missing-data handling', 'Error analysis', 'pandas'],
    learned: ["How you split the data decides what “accurate” means: 13.1% error on random folds became 18–38% on a region the model had never seen.", "Sales missing building area have somewhat higher error (13.8% versus 12.5%); I did not test whether that gap is real."],
    improve: ["Add location features that transfer between regions, such as distance to transit and schools.", "Try one model per region, or a hierarchical model that shares strength across regions."],
    images: [
      { file: '01-random-vs-future.png', category: 'Insights', caption: 'Random CV versus predicting future sales' },
      { file: '02-leave-one-region-out.png', category: 'Insights', caption: 'Error on a region the model has never seen' },
    ],
  },
  {
    slug: 'vacancy-nowcast-ml',
    number: '09',
    title: 'Can a Model Nowcast Census Vacancy from Mail Data?',
    headline: 'An honest evaluation: in forward-chaining, the test that matches real use, no model beat last year’s number.',
    year: 'Oct 2026',
    kind: 'Machine learning · Evaluation',
    why: 'Census vacancy estimates arrive about nine months after the year ends, while USPS data comes out every quarter. A reliable early estimate would let a local economic development office see housing problems sooner, and if it is not reliable, it is better to know before anyone acts on its numbers.',
    role: 'Follow-up to my housing vacancy project: SQL pipeline, from-scratch gradient-descent models, eight-model comparison, three evaluation designs, and prediction intervals. I chose the questions and designed the evaluations, and used AI tools to double-check code for edge cases.',
    challenges: [
      'A 2012 USPS definition change makes the broad vacancy rate jump 2.2–4.9 points in every county, so the pipeline zeroes that year’s change and adds a post-2012 flag; otherwise a model learns a fake trend.',
      'There is no 1-year Census release for 2020, so 2021 is compared with 2019 and the model table records the two-year gap.',
      'Making the test match real use: only forward-chaining (train on earlier years, predict the next) reflects how a nowcast would actually be run.',
      'Proving the from-scratch code is right: tests check that gradient-descent regression matches the closed-form solution and that logistic regression matches scikit-learn with the same penalty.',
    ],
    tags: ['Python', 'NumPy', 'scikit-learn', 'SQLite', 'pytest'],
    summary:
      "Can last year’s Census rate plus this year’s USPS movement predict this year’s Census vacancy? Eight models and three evaluation designs find no model that beats carrying last year’s value forward in forward-chaining, the design that matches real use.",
    repo: 'https://github.com/thanhvu911/vacancy-nowcast-ml',
    featured: true,
    animation: 'Reusing last year’s Census vacancy rate gave the lowest error (1.023 points) among the models compared, ahead of ridge (1.054). Its 80% intervals cover 81% overall but only 57% in Champaign.',
    cover: '01-error-by-scheme.png',
    metrics: [
      { value: '1.02 vs 1.05', label: 'MAE: last year’s value vs ridge (8 models compared; with 78 rows the gap is not distinguishable)' },
      { value: '1.02', label: 'Lowest error, in points (last year’s value)' },
      { value: '81%', label: 'Pooled interval coverage' },
      { value: '57%', label: 'Coverage in Champaign' },
    ],
    problem: 'Can a model that combines last year’s Census vacancy rate with this year’s USPS movement predict this year’s Census rate, and does the answer hold in every county?',
    approach: [
      'Built a bronze → silver → gold pipeline in SQLite over Census ACS table B25002 and HUD USPS vacancy data for 6 counties (84 county-years, 78 modeling rows), with 15 data-quality checks that stop the run if any fail.',
      'Wrote linear and logistic regression trained by gradient descent from scratch in NumPy, with tests against closed-form and scikit-learn results.',
      'Compared eight regression models and five direction classifiers under random 5-fold CV (×20), forward-chaining (test years 2015–2024), and leave-one-county-out.',
      'Added split-conformal 80% prediction intervals, calibrated only on earlier years, and checked their coverage county by county.',
    ],
    architecture: ['Census + USPS CSVs', 'SQLite bronze / silver / gold', 'NumPy gradient descent', '8 models × 3 tests', 'Intervals by county'],
    results: [
      'In a realistic nowcast, carrying last year’s Census value forward had the lowest error: mean absolute error 1.023 points, versus 1.054 for my ridge model (3% worse; with only 78 rows, I cannot say whether that gap is real), 1.119 for random forest, and 1.215 for gradient boosting.',
      'The evaluation choice decided the conclusion: ridge ties persistence under random CV (0.945 vs 0.947) and beats it leaving one county out (ridge 0.914). Only the scheme that matches real use shows the loss.',
      'For rise-or-fall predictions, always guessing “down” is right 64.8% of the time; my from-scratch logistic model reaches 57.4%, and adding features drops it to 51.9%.',
      '80% intervals cover 81% of values pooled, but only 57% in Champaign and 100% in Cook and King: a pooled number can hide the county a model serves worst.',
    ],
    skills: ['Evaluation design', 'Gradient descent from scratch', 'Conformal prediction', 'SQL pipelines', 'Data-quality testing', 'Testing with pytest'],
    learned: ["The evaluation design decided the conclusion: two standard schemes showed a small win, and only forward-chaining, which matches real use, showed the loss.", "A pooled number can hide the place a model serves worst: 81% interval coverage overall, 57% in Champaign (few test years per county, so a noisy estimate).", "With 78 rows, simple linear models beat trees, and adding features made the classifier worse."],
    improve: ["Add more counties; the same pipeline works for any county with a 1-year ACS estimate.", "Add ACS margins of error to separate model error from Census sampling noise.", "Use the quarterly USPS series directly so the latest quarter can carry more weight."],
    images: [
      { file: '01-error-by-scheme.png', category: 'Insights', caption: 'Nowcast error under three evaluation schemes' },
      { file: '02-nowcast-error-by-county.png', category: 'Insights', caption: 'Forward-chaining error by county' },
      { file: '03-direction-accuracy.png', category: 'Insights', caption: 'Direction accuracy: always guessing down wins' },
      { file: '04-interval-coverage-by-county.png', category: 'Insights', caption: '80% interval coverage by county' },
      { file: '05-learning-rates.png', category: 'Code', caption: 'Gradient descent: loss by learning rate' },
    ],
  },
  {
    slug: 'netflix-titles-etl-mysql',
    number: '10',
    title: 'Netflix Titles ETL',
    headline: 'An early ETL: one CSV into a normalized MySQL model',
    year: 'Early project',
    kind: 'Data engineering',
    tags: ['MySQL', 'Python', 'Power BI'],
    summary:
      'An early data-engineering project: the public Netflix titles CSV split into dimension, fact, and link tables in MySQL with a Python script, then reported in Power BI. The repo is honest about its state: only the genre link-table step is wired up.',
    repo: 'https://github.com/thanhvu911/netflix-etl-mysql',
    cover: 'dataflow.png',
    animation: 'Data flows from netflix_titles.csv through extract.py into MySQL dimension, fact, and link tables, then into a Power BI report.',
    metrics: [
      { value: 'MySQL', label: 'Normalized dimension, fact, and link tables' },
      { value: 'Python', label: 'PyMySQL load script (extract.py)' },
      { value: 'Power BI', label: 'Report on the loaded tables' },
    ],
    why: 'Titles carry several genres, countries, and cast members in one text cell. Splitting those into related tables is the same relational modeling that makes Power BI analysis cleaner than a flat CSV.',
    role: 'Solo project: schema design in MySQL Workbench, the Python load script, and the Power BI report.',
    challenges: ['Multi-value text fields (genres, countries, cast) had to become link tables.', 'Foreign keys have to be looked up while loading, so load order matters.'],
    problem: 'How do you model a flat titles file so each genre, country, and rating is stored once and titles link to them?',
    approach: [
      'Model the schema in MySQL Workbench (dimension, fact, and link tables).',
      'Read the CSV in Python and split multi-value fields on commas.',
      'Insert values into dimension tables, then resolve their keys when loading the fact and link tables.',
      'Build a Power BI report on the loaded tables.',
    ],
    architecture: ['netflix_titles.csv', 'extract.py', 'MySQL tables', 'Power BI'],
    results: [
      'The repo holds the Workbench model, the load script, the Power BI file, and the source CSV.',
      'In the current script only the genre link-table loader runs; the dimension and movie-fact loaders are written but not enabled, so the full load is unfinished.',
    ],
    skills: ['Relational data modeling', 'Python ETL with PyMySQL', 'MySQL', 'Power BI'],
    learned: ['Splitting one multi-value cell into link tables is straightforward; keeping load order and keys correct is the hard part.'],
    improve: ['Use parameterized queries instead of building SQL strings, so apostrophes in titles cannot break a load.', 'Run the dimension loaders first and wire every step into one repeatable script with row-count checks.'],
    images: [
      { file: 'dataflow.png', category: 'Data flow', caption: 'Data flow' },
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
      'Replaced manual downloads of CSV and Excel files from national websites with automated ingestion of 25+ federal economic series from BLS and BEA public APIs, plus pipeline checks that validate the numbers.',
      'Built a star-schema Power BI semantic model with 20 years of history and daily scheduled refresh. Colleagues use it regularly because it replaces their monthly manual work of visiting separate agency websites, and staff can brief officials and investors without rebuilding a spreadsheet.',
      'Developed a Google Apps Script web app on a Google Sheets data store with cross-sheet imports, nightly refresh jobs, sheet locking, and a Gemini AI assistant, letting 6+ non-technical staff maintain data without code.',
      'Delivered 4+ dashboards and data products for partner organizations and internal teams, designing data-intake structures, dataset documentation, and data dictionaries that standardize how data is submitted.',
      'Led requirements, data decisions, testing, and deployment for internal economic dashboards (Google Apps Script, Power BI, and a staff-only web app with a Python and DuckDB warehouse and relational data model); built with Claude Code, which wrote most of the code.',
      'Attend regional events with business leaders and non-profits (for example Workforce Summit 2030) and produce slides and Excel analyses, such as a Denver downtown supply-and-demand study.',
    ],
  },
  {
    role: 'Data Science Intern',
    tech: ['Excel', 'Seamless.AI', 'Data collection'],
    company: 'KCC Capital Partners',
    location: 'Sheridan, WY',
    dates: 'Jan 2026 – May 2026',
    bullets: [
      'Collected and integrated data on 100+ precious-metal and mining companies, markets, and transactions into one dataset to enrich the firm’s AI agent for investment, and enriched 500+ contact records with Seamless.AI for deal sourcing.',
      'Reviewed the resulting shortlist of 100+ likely buyers for outreach.',
      'Launched automated weekly deal-team reports and dashboards, replacing manual spreadsheets and saving 5+ hours per week.',
    ],
  },
  {
    role: 'Technology Support Assistant',
    tech: ['IT support', 'Imaging'],
    company: 'Quantitative Science Center, Franklin & Marshall College',
    location: 'Lancaster, PA',
    dates: 'Sep 2021 – Sep 2022',
    bullets: [
      'Resolved technical incidents for classroom and lab computers and kept classroom systems running.',
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
      'Built ETL pipelines in Python (Pandas, NumPy) and SQL Server that automated legacy client data workflows and reduced processing time, and modeled the data in star and galaxy schemas so Power BI could use related tables instead of flat Excel and CSV files.',
    ],
  },
];

// Skills by the kind of work, each with a project that shows it.
export const skills = [
  {
    group: 'Data engineering',
    icon: 'database',
    items: ['SQL (T-SQL)', 'Python (pandas)', 'PySpark and Spark SQL (Fabric certification study)', 'ETL / ELT pipelines', 'Medallion architecture', 'Dimensional modeling (star, galaxy)', 'Stored procedures', 'Data-quality testing'],
    proof: { label: 'Grocery data warehouse', href: '/projects/grocery-transaction-data-warehouse' },
  },
  {
    group: 'Analytics & BI',
    icon: 'bar-chart',
    items: ['Power BI', 'DAX', 'Power Query M', 'KPI and report design', 'Excel (pivot tables, lookups)', 'Matplotlib', 'R (ggplot2)'],
    proof: { label: 'Sales planning analysis', href: '/projects/sales-planning-analysis' },
  },
  {
    group: 'Machine learning',
    icon: 'trending-up',
    items: ['scikit-learn', 'Regression and statistical inference', 'Cross-validation and evaluation design', 'Gradient boosting', 'Conformal prediction intervals'],
    proof: { label: 'Vacancy nowcast', href: '/projects/vacancy-nowcast-ml' },
  },
  {
    group: 'Software engineering',
    icon: 'code',
    items: ['Python', 'C++ (coursework)', 'JavaScript (Apps Script)', 'Git / GitHub', 'Testing with pytest', 'Algorithms and data structures (coursework)', 'Models written from scratch (NumPy)'],
    proof: { label: 'Vacancy nowcast tests', href: '/projects/vacancy-nowcast-ml' },
  },
  {
    group: 'Platforms',
    icon: 'layers',
    items: ['Microsoft Fabric', 'Lakehouse', 'Warehouse', 'Dataflow Gen2', 'Notebooks', 'SQL Server', 'MySQL (Netflix titles ETL)', 'SQLite', 'Power Automate', 'Google Sheets / Apps Script'],
    proof: { label: 'Can mail data predict housing vacancy?', href: '/projects/can-mail-data-predict-housing-vacancy' },
  },
];

export const credentials = [
  { title: 'Microsoft Certified: Fabric Data Engineer Associate', detail: 'DP-700 · Microsoft · Oct 2026', note: 'Credential ID 5CE20E8CF4AC4CE3' },
  { title: 'SQL (Advanced) Certificate', detail: 'HackerRank · Sep 2025' },
];

export const education = {
  degree: 'B.A. Computer Science',
  school: 'Franklin & Marshall College',
  location: 'Lancaster, PA',
  date: 'May 2026',
  gpa: 'GPA 3.72',
  honors: "Magna Cum Laude · Honors List (5 semesters) · Dean's List (Spring 2022)",
  honorsShort: 'Magna Cum Laude',
  coursework: [
    'Machine Learning',
    'Artificial Intelligence',
    'Algorithms',
    'Data Structures (C++)',
    'Theory of Computer Science',
    'Information Theory',
    'Calculus III',
    'Linear Algebra',
    'Discrete Math',
    'Probability & Statistics',
    'Applied Regression',
  ],
};

// Academics page, from the Graduate School (MS CS-AI) resume, Oct 29 2026 version.
export const research = {
  interests:
    'Honest model evaluation when data is noisy, biased, or shifting. In my projects I compare random cross-validation with forward-in-time tests and held-out regions (Melbourne housing: 13.1% error on random folds versus 18–38% on an unseen region), and build the data pipelines that make those tests reproducible.',
  coursework: [
    { group: 'Computer Science (transcript grades)', items: ['Intro to Machine Learning · B+', 'Artificial Intelligence · A-', 'Algorithms · A', 'Data Structures (C++)', 'Theory of Computer Science · B+', 'Information Theory · A-', 'Computational Discrete Math · A', 'Computer Organization · A'] },
    { group: 'Mathematics & Statistics (transcript grades)', items: ['Applied Regression Analysis · A', 'Probability and Statistics I · A-', 'Intro to Statistical Modeling · A', 'Intro to Data Science · A', 'Calculus II · A', 'Calculus III · B', 'Linear Algebra and Differential Equations · Pass (no letter grade)'] },
  ],
  projects: [
    {
      title: 'Can Mail Data Predict Housing Vacancy?',
      slug: 'can-mail-data-predict-housing-vacancy',
      meta: 'Microsoft Fabric, Power BI. Sep 2026',
      bullets: [
        'Investigated whether quarterly USPS vacancy counts can stand in for the annual Census ACS vacancy rate, building a reproducible pipeline over 6 counties (84 usable county-year observations).',
        'Evaluated the hypothesis three ways (correlation, directional accuracy, bias): a pooled r = 0.77 fell to between −0.01 and 0.72 within counties, with only 57.7% directional agreement, so USPS data is a county-dependent signal at best, not a substitute.',
        'Flagged a 2012 USPS classification change as a data artifact and fixed two silent ingestion bugs, preventing a false trend.',
      ],
    },
    {
      title: 'Grocery Transaction Data Warehouse',
      slug: 'grocery-transaction-data-warehouse',
      meta: 'SQL Server, T-SQL. Jul–Aug 2025',
      bullets: [
        'Built a Medallion-architecture warehouse over 131M+ transaction lines with stored-procedure ETL, a star-schema Gold layer, and 21 SQL data-quality checks; found that 47.5% of completed orders had totals that did not match their line items, and rebuilt revenue from line prices.',
      ],
    },
    {
      title: 'Medical Cost Modeling and Prediction',
      slug: 'medical-cost-regression',
      meta: 'Python, scikit-learn, R. Oct 2026',
      bullets: [
        'Extended my 2021 R study of 1,338 insurance records: a smoking × obesity interaction is associated with the three cost bands, raising in-sample R² from 0.75 to 0.86 and showing the earlier sex effect was confounded by smoking (it flips from +$1,539 to −$494).',
        'Compared 9 models with 5-fold CV; the interpretable linear model matched ridge, lasso, and random forest and beat boosting (held-out R² 0.88), but subgroup analysis found 29% relative error for non-smokers versus 5% for obese smokers.',
      ],
    },
    {
      title: 'Melbourne Housing Price Prediction',
      slug: 'melbourne-housing-price-prediction',
      meta: 'Python, scikit-learn. 2026',
      bullets: [
        'Tested four models on 13,580 Melbourne home sales three ways: gradient boosting’s error was 13.1% under random 5-fold CV and also held on future sales, but rose to 18–38% on regions held out entirely.',
      ],
    },
    {
      title: 'Can a Model Nowcast Census Vacancy from Mail Data?',
      slug: 'vacancy-nowcast-ml',
      meta: 'Python, NumPy, scikit-learn, SQLite. Oct 2026',
      bullets: [
        'Compared eight models under three evaluation designs; none beat carrying last year’s Census value forward in a realistic forward-chaining nowcast (MAE 1.023 vs 1.054 for ridge; with only 78 rows, I cannot say whether that gap is real), although two standard schemes would have shown a small win.',
        'Wrote gradient-descent linear and logistic regression from scratch with tests against closed-form and scikit-learn results, and found 80% conformal intervals that cover 81% pooled but only 57% in one county.',
      ],
    },
    {
      title: 'AI, Systems & Theory Coursework',
      meta: 'Python, C++, RISC-V. 2024 – 2026',
      bullets: [
        'Implemented uninformed and informed search, constraint satisfaction, logical inference, and Bayesian networks in Python, and solved a Connect-4 board puzzle with state-space search.',
        'Implemented k-means and gradient-descent linear and logistic regression from scratch in Machine Learning (Steam games; 13.6K Melbourne housing listings), and later re-tested the housing data with gradient boosting on held-out regions (error 13% → 18–38%).',
        'Designed a CPU in Logisim, wrote recursive RISC-V assembly, coded DFAs and NFAs, and benchmarked a red-black tree in C++.',
      ],
    },
  ],
  leadership: {
    title: 'Technology Committee, Diplomatic Congress',
    meta: 'Franklin & Marshall College. Aug 2021 – Aug 2022',
    detail: 'Cut classroom technology costs by 18% by leading IT policy work and centralized license management across 15+ departments.',
  },
  service: {
    title: 'Service Year Participant, The Shalom Project',
    meta: 'Lancaster, PA. Aug 2026 – Jul 2027',
    detail: 'Full-time service year placed at the Center for Regional Analysis, living in an intentional community with a cohort of young adults.',
  },
};

export const nav = [
  { label: 'Work', href: '/#projects' },
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Academics', href: '/academics' },
  { label: 'Contact', href: '/#contact' },
];
