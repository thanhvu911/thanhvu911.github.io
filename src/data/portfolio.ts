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
  availability: 'Open to Data Engineer, Analytics Engineer, and Data Analyst roles',
  location: 'Lancaster, PA',
  locationNote: 'Open to New York and remote',
  email: 'vulethanh07112002@gmail.com',
  github: 'https://github.com/thanhvu911',
  githubUser: 'thanhvu911',
  linkedin: 'https://www.linkedin.com/in/thanh25/',
  resumes: [
    { id: 'analyst', label: 'Data Analyst', href: '/thanh-vu-resume-data-analyst.pdf', note: 'Dashboards, analysis, and reporting' },
    { id: 'engineer', label: 'Data Engineer', href: '/thanh-vu-resume-data-engineer.pdf', note: 'Pipelines, warehouses, and Microsoft Fabric' },
    { id: 'grad-school', label: 'Graduate school', href: '/thanh-vu-resume-graduate-school.pdf', note: 'M.S. Computer Science (AI) applications, Fall 2027' },
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
  /** Optional public Power BI "Publish to web" embed URL, shown on the Interactive dashboard tab. */
  powerbiEmbed?: string;
  /** Power BI Desktop files in the project repo, for reviewers who want the real report. */
  pbix?: { label: string; file: string }[];
}

/** Direct download link for a file at the root of a project's GitHub repo. */
export const repoFile = (repo: string, file: string) => `${repo}/raw/HEAD/${encodeURIComponent(file)}`;

export const projects: Project[] = [
  {
    slug: 'can-mail-data-predict-housing-vacancy',
    number: '01',
    title: 'Can Mail Data Predict Housing Vacancy?',
    headline: 'Testing whether the mail can see empty homes before the Census does',
    year: '2026',
    kind: 'Data engineering · Analytics',
    why: "Knowing which neighborhoods have rising vacancy is core to how a local economic development office decides where to invest. The Census estimate is the gold standard but comes out once a year and can lag reality. USPS already tracks which addresses stop receiving mail, every quarter, for free. If it reliably tracked the Census number, it would be a much faster early-warning signal between official releases.",
    role: "Solo project: data sourcing, the Microsoft Fabric pipeline, the semantic model, DAX measures, report design, and the analysis.",
    challenges: ["Inconsistent USPS header casing broke column matching across quarterly files, so headers are normalized in Power Query before combining.", "Combine Files silently dropped the filename column, which carried the county key. It is restored explicitly so every row can still be attributed.", "DAX has no native correlation function, so the Pearson r measure is hand-built with SUMX.", "A Power BI chart can legend by measure or by category, never both, so the report uses small multiples to compare Census and USPS for every county at once.", "The 2012 USPS classification change shows up as a shift that looks like a trend. It is treated and documented as a data artifact, not a finding."],
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
    results: ["Pooled across six counties, the sources move together fairly well (r = 0.77), but by county it ranges from 0.72 (Montgomery, OH) to −0.01 (Champaign, IL).", "USPS correctly flags whether vacancy is rising or falling 57.7% of the time.", "The narrow USPS estimate reads about 5.3 points below Census and the broad one about 2.7 points above, biased in opposite directions, so no single correction factor works.", "Bottom line: a real, county-dependent early-warning signal worth watching between Census releases, but not a substitute for the Census.", "Every headline number is reproducible from the 84-row comparison table with plain arithmetic."],
    skills: ["Microsoft Fabric (Lakehouse, Dataflow Gen2)", "Power Query M", "DAX", "Semantic models", "Power BI report design", "Statistical reasoning", "Data validation"],
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
    challenges: ["Loading 131M+ rows reliably: a truncate + BULK INSERT procedure with load timing and TRY/CATCH, so a failed load is logged instead of silently leaving partial data.", "Inconsistent source values (whitespace, gender, loyalty tier, nationality codes) are standardized in Silver and then verified by automated tests.", "Keeping Gold trustworthy: tests for surrogate-key uniqueness and fact-to-dimension referential integrity.", "21 automated data-quality checks filtered 10M raw transactions to 3.3M completed sales and flagged 1.58M orders whose header totals did not match their line items.", "Query tuning cut processing time by 25%."],
    tags: ['SQL Server', 'T-SQL', 'Medallion', 'ETL', 'Star schema'],
    summary:
      'A Bronze → Silver → Gold warehouse over 131M+ rows with stored-procedure ETL, automated data-quality tests, and a documented star schema.',
    repo: 'https://github.com/thanhvu911/grocery-transaction-data-warehouse',
    featured: true,
    cover: 'architecture-medallion.png',
    metrics: [
      { value: '131M+', label: 'Transaction lines loaded' },
      { value: '21', label: 'Automated quality checks' },
      { value: '3.3M', label: 'Completed sales kept' },
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
      '21 automated checks filtered 10M raw transactions down to 3.3M completed sales.',
      '1.58M orders flagged because their header totals did not match their line items, caught before reaching any report.',
      'Query tuning cut processing time by 25%.',
    ],
    skills: ["Data warehouse design", "Medallion architecture", "Dimensional modeling (star schema)", "T-SQL stored procedures", "Data-quality testing", "Technical documentation"],
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
      'A Power BI dashboard for the KPIM Mart retail chain comparing actual sales against monthly plans by store, product group, region, and time.',
    repo: 'https://github.com/thanhvu911/sales-planning-analysis',
    featured: true,
    pbix: [
      { label: 'Capstone report (.pbix, 3.7 MB)', file: 'Capstone Project.pbix' },
      { label: 'KPIM Mart sales report (.pbix, 1.9 MB)', file: 'KPIM Mart Sales Report Datathon 3.pbix' },
    ],
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
      'District plan completion ranges from about 89% to 98%: no district fully hit its target over 2020–2022.',
      'Plan completion % = Actual ÷ Plan at any grain: store, region, product group, month.',
      'Year-over-year and rolling 12-month views show whether a miss is a blip or a trend.',
      'Drill-through takes a manager from a regional miss straight to the store responsible.',
    ],
    skills: ["Galaxy-schema modeling", "DAX time intelligence", "Power Query", "SQL Server", "Executive dashboard design"],
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
    role: "Solo project, built as a technical interview case study: data preparation, the multi-fact model, benchmarking measures, and a four-page report.",
    challenges: ["Three sources at different grains (monthly labor data, annual GDP by industry, annual wages by NAICS sector) combined in one multi-fact model with shared geography, industry, and date dimensions.", "A dedicated measures table for benchmarking: industry share of total, Lancaster ÷ PA, and Lancaster ÷ U.S.", "Keeping comparisons honest: GDP is in chained 2017 dollars and the wage data covers private establishments only, and both are documented."],
    tags: ['Power BI', 'DAX', 'Power Query', 'BLS', 'BEA'],
    summary:
      'A multi-fact Power BI model benchmarking Lancaster County against Pennsylvania and the U.S. on jobs, GDP, and wages.',
    repo: 'https://github.com/thanhvu911/lancaster-economic-indicators-dashboard',
    pbix: [{ label: 'Power BI report (.pbix, 1.2 MB)', file: 'EDC presentation.pbix' }],
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
    skills: ["Power BI", "DAX", "Power Query", "Multi-fact modeling", "BLS and BEA public data", "Economic benchmarking"],
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
      'Scores every customer on recency, frequency, and monetary value with DAX calculated columns and maps each R-F-M code to a segment with a recommended marketing action.',
    repo: 'https://github.com/thanhvu911/rfm-customer-segmentation-powerbi',
    pbix: [{ label: 'Power BI report (.pbix, 3.7 MB)', file: 'Capstone Project.pbix' }],
    cover: 'powerbi-page-2-customer-analysis.png',
    metrics: [
      { value: '64', label: 'R-F-M codes' },
      { value: '9', label: 'Segments' },
      { value: '1–4', label: 'Score per axis' },
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
      'Every customer lands in one of 9 named segments with a clear next action.',
      'Marketing can see at a glance who to reward, who to win back, and who to leave alone.',
    ],
    skills: ["Customer analytics", "DAX calculated columns", "Power Query", "Power BI", "Turning analysis into actions"],
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
      'Proves a retail-banking dataset can be trusted before analyzing it: validation, transformation, then analysis in T-SQL.',
    repo: 'https://github.com/thanhvu911/bank-transaction-sql-analysis',
    cover: 'insight-peak-hours.png',
    metrics: [
      { value: '1,000', label: 'Transactions' },
      { value: '800', label: 'Accounts' },
      { value: '12.3%', label: 'Rows with missing fields' },
      { value: '17', label: 'Invalid currency codes' },
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
    skills: ["Data profiling and validation", "T-SQL joins and aggregation", "CASE-based bucketing", "Parsing semi-structured fields", "Exploratory analysis"],
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
    year: 'Nov 2021',
    kind: 'Statistics',
    why: "Before pricing a policy or targeting a health program, analysts need to know which factors actually drive costs. Demographics are easy to measure, but they may explain far less than people assume.",
    role: "Solo project: exploratory analysis, modeling, diagnostics, and an R Markdown report.",
    challenges: ["Separating the effect of age from the effect of sex by comparing five nested models instead of trusting a single regression.", "Checking residual diagnostics so the conclusions don't rest on a model that fits badly."],
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
    results: ["Age is a moderate, significant predictor: about +$258 in charges per year of age.", "Sex has minimal effect once age is accounted for.", "Most of the variation in charges comes from factors outside these two variables, which is itself a useful finding for anyone pricing on demographics alone."],
    skills: ["Linear regression", "Model comparison", "Statistical inference", "ggplot2", "R Markdown"],
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
      'Automated ingestion of 25+ federal economic series from BLS and BEA public APIs into a star-schema Power BI semantic model with 20 years of history and daily scheduled refresh, saving the team 15+ hours per month.',
      'Developed a Google Apps Script web app on a Google Sheets data store with cross-sheet imports, nightly refresh jobs, sheet locking, and a Gemini AI assistant, letting 6+ non-technical staff maintain data without code.',
      'Delivered 4+ dashboards and data products for partner organizations and internal teams, designing data-intake structures, dataset documentation, and data dictionaries that standardize how data is submitted.',
    ],
  },
  {
    role: 'Data Science Intern',
    tech: ['Python', 'Statistics', 'Machine learning', 'Seamless.AI'],
    company: 'KCC Capital Partners',
    location: 'Sheridan, WY',
    dates: 'Jan 2026 – May 2026',
    bullets: [
      'Integrated data on 100+ precious-metal and mining companies, markets, and transactions into one dataset and enriched 500+ contact records with Seamless.AI, improving data quality for deal sourcing.',
      'Trained statistical and machine-learning models on mandate data, shortlisting 100+ likely buyers for outreach.',
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
      'Engineered ETL pipelines in Python (Pandas, NumPy) and SQL Server to automate legacy client data workflows, reducing processing time by 30%, eliminating manual entry errors, and feeding validated Power BI reports.',
    ],
  },
];

export const skills = [
  {
    group: 'Programming Languages',
    icon: 'code',
    items: ['SQL (T-SQL, Spark SQL)', 'Python (Pandas, NumPy, PySpark)', 'KQL', 'DAX', 'Power Query M', 'R', 'JavaScript (Google Apps Script)'],
  },
  {
    group: 'Microsoft Fabric (DP-700)',
    icon: 'layers',
    items: ['Lakehouse, Warehouse, OneLake', 'Delta Lake', 'Data Factory pipelines', 'Dataflow Gen2', 'Notebooks (PySpark, Spark SQL)', 'Eventstream, Eventhouse / KQL', 'Semantic models, deployment pipelines'],
  },
  {
    group: 'Data Engineering',
    icon: 'database',
    items: ['ETL / ELT pipelines', 'Medallion architecture', 'Dimensional modeling (star, galaxy)', 'Stored procedures', 'Data-quality testing', 'Data documentation'],
  },
  {
    group: 'Platforms & Tools',
    icon: 'wrench',
    items: ['Power BI', 'SQL Server', 'MySQL', 'Power Automate', 'Google Sheets / Apps Script', 'Excel', 'Git / GitHub'],
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

// Academics page, from the Graduate School (MS CS-AI) resume, v7.
export const research = {
  interests:
    'Machine learning, probabilistic reasoning, and applied statistics for noisy real-world data, plus reliable data systems that make AI reproducible.',
  applying: 'In-person M.S. programs in Computer Science, Machine Learning, or Artificial Intelligence, starting Fall 2027.',
  coursework: [
    { group: 'Computer Science', items: ['Artificial Intelligence', 'Machine Learning', 'Algorithms & Data Structures', 'Theory of Computation'] },
    { group: 'Mathematics & Statistics', items: ['Probability and Statistics', 'Statistical Modeling', 'Applied Regression Analysis', 'Information Theory'] },
  ],
  projects: [
    {
      title: 'Can Mail Data Predict Housing Vacancy?',
      slug: 'can-mail-data-predict-housing-vacancy',
      meta: 'Microsoft Fabric, Power BI. Sep 2026',
      bullets: [
        'Investigated whether quarterly USPS vacancy counts can stand in for the annual Census ACS vacancy rate, building a reproducible pipeline over 6 counties and 15 years (84 county-year observations).',
        'Evaluated the hypothesis three ways (correlation, directional accuracy, bias): a pooled r = 0.77 that ranged from −0.01 to 0.72 by county and only 57.7% directional agreement, so USPS data is a county-dependent early signal.',
        'Isolated a 2012 USPS classification change as a data artifact and fixed two silent ingestion bugs, preventing a false trend.',
      ],
    },
    {
      title: 'Grocery Transaction Data Warehouse',
      slug: 'grocery-transaction-data-warehouse',
      meta: 'SQL Server, T-SQL. Jul–Aug 2025',
      bullets: [
        'Built a Medallion-architecture warehouse over 131M+ transaction lines with stored-procedure ETL, a star-schema Gold layer, and 21 automated data-quality checks; query tuning cut processing time by 25%.',
      ],
    },
    {
      title: 'Medical Cost Regression',
      slug: 'medical-cost-regression',
      meta: 'R, ggplot2, R Markdown. Nov 2021',
      bullets: [
        'Compared five nested linear models, including a sex × age interaction, on 1,338 insurance records with residual diagnostics, showing age is a significant predictor while sex adds little once age is controlled.',
      ],
    },
    {
      title: 'AI, Systems & Theory Coursework',
      meta: 'Python, C++, RISC-V. 2024–2025',
      bullets: [
        'Implemented uninformed and informed search, constraint satisfaction, logical inference, and Bayesian networks in Python, and solved a Connect-4 board puzzle with state-space search.',
        'Engineered features and explored real-world datasets (Steam games; 13.6K Melbourne housing listings) in pandas for Machine Learning; designed a CPU in Logisim, wrote recursive RISC-V assembly, coded DFA/NFAs, and benchmarked a red-black tree.',
      ],
    },
  ],
  leadership: {
    title: 'Technology Committee, Diplomatic Congress',
    meta: 'Franklin & Marshall College. Aug 2021 – Aug 2022',
    detail: 'Cut classroom technology costs by 18% by shaping campus technology policy with 10+ committee members.',
  },
};

export const nav = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Academics', href: '/academics' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/#contact' },
];
