// Plain-English subtitles for the Power BI screen recordings in public/videos.
// Each step starts at `at` seconds and runs until the next one; steps with a
// `chapter` start a new section in the step list under the video. The same
// steps become the caption track (/videos/<slug>.vtt).

export interface VideoStep {
  at: number;
  text: string;
  chapter?: string;
}

export interface VideoGuide {
  duration: number;
  steps: VideoStep[];
}

export const videoGuides: Record<string, VideoGuide> = {
  'can-mail-data-predict-housing-vacancy': {
    duration: 58.3,
    steps: [
      { at: 0, chapter: 'The question', text: 'Does mail data track the Census? Each dot is one county in one year.' },
      { at: 3, text: 'Hover a point to see the Census vacancy rate and the USPS mail rate for that year.' },
      { at: 6, chapter: 'Filter by county', text: 'Pick a county (here Cook County) and the three cards at the top recalculate.' },
      { at: 12, text: 'Champaign County: the two sources barely move together, so mail data would mislead here.' },
      { at: 18, text: 'All six counties together: the pooled correlation is 0.77.' },
      { at: 20.5, chapter: 'Time window', text: 'Drag the year slider to narrow the time window. Every chart follows.' },
      { at: 26, text: 'Gap by county: how far the mail rate sits from the Census rate.' },
      { at: 32, chapter: 'Detail table', text: 'Sort the table by gap to find the years where the two sources disagree most.' },
      { at: 38.5, text: 'Back to Lancaster. Red means a big gap, blue a small one; a check means both rates moved the same way.' },
    ],
  },
  'sales-planning-analysis': {
    duration: 126.8,
    steps: [
      { at: 0, chapter: 'District revenue plan', text: 'Page 1: the 2020–2022 sales target by district and by store.' },
      { at: 3, text: 'Hover the monthly trend to read the exact planned revenue.' },
      { at: 6, text: 'Pick a district (here Cầu Giấy): the map zooms in and every chart filters.' },
      { at: 12, text: 'Clear the filter to go back to all districts.' },
      { at: 17, text: 'Drag the date range to focus on one period.' },
      { at: 22, text: 'Click a bubble on the map to filter to that district.' },
      { at: 27, text: 'Expand the matrix from district to store, month by month.' },
      { at: 48, chapter: 'Category table', text: 'Page 2: the plan split by product category for each district and store.' },
      { at: 51, text: 'Year buttons switch between 2022, 2021 and 2020.' },
      { at: 59, text: 'Category buttons narrow the table to one product group.' },
      { at: 69, chapter: 'Store & manager overview', text: 'Page 3: actual sales (blue) against plan (orange) by district, store and month.' },
      { at: 72, text: 'Year and category filters update actual and plan together.' },
      { at: 81, text: 'Click a district bar or a store to filter the manager tables below.' },
      { at: 93, text: 'Hover the trend to compare actual and plan in a single month.' },
      { at: 102, chapter: 'Manager achievement', text: 'Page 4: sales against plan and last year, with % of plan and % growth.' },
      { at: 105, text: 'Switch years to compare each manager’s progress toward plan.' },
      { at: 114, text: 'Click a manager’s bar: the store map and trends filter to their stores.' },
      { at: 117, text: 'Tooltips show plan progress and growth for each month.' },
      { at: 120, text: 'Drill up and down the date hierarchy on the sales trend.' },
    ],
  },
  'rfm-customer-segmentation': {
    duration: 94.7,
    steps: [
      { at: 0, chapter: 'Sales analysis', text: 'Page 1: revenue, products, orders and customers at a glance.' },
      { at: 3, text: 'Hover the trend: a tooltip page lists the top 5 products for that date.' },
      { at: 6, text: 'Year buttons filter the whole page (here 2020).' },
      { at: 9, text: 'The “By” menu swaps what every chart measures: revenue, items, orders or customers.' },
      { at: 15, text: 'Change the trend’s time grain: month, quarter or year.' },
      { at: 24, text: 'The performance table switches between managers and products.' },
      { at: 27, text: 'Click a district in the donut and every other chart filters to it.' },
      { at: 33, text: 'Click a store bar to narrow it further, then clear the selection.' },
      { at: 39, text: 'Back to revenue for the full picture.' },
      { at: 54, chapter: 'Customer analysis', text: 'Page 2: the RFM model scores each customer on recency, frequency and money spent.' },
      { at: 57, text: 'Filter by loyalty tier (here Gold) and the score gauges update.' },
      { at: 66, text: '“Tree” opens a decomposition tree that breaks customers down by income and education.' },
      { at: 72, text: '“Demographic” shows customer count and RFM score by age group.' },
      { at: 75, text: 'Click a segment in the RFM bar to see only those customers.' },
      { at: 88.5, text: 'Sort the customer table by order value to find the top buyers.' },
    ],
  },
  'lancaster-economic-indicators-dashboard': {
    duration: 105.7,
    steps: [
      { at: 0, chapter: 'Labor market', text: 'Page 1: the labor market in Lancaster County and Pennsylvania, from BLS data.' },
      { at: 3, text: 'Hover a line for that month’s labor force or unemployment; drill up to quarters or years.' },
      { at: 9, text: 'Location filter: Lancaster only, then Pennsylvania only, then both.' },
      { at: 18, text: 'The Lan / Pen / % Rate buttons switch each chart between counts and growth rate.' },
      { at: 29, text: 'Year filter: pick 2020 to see the COVID unemployment spike month by month.' },
      { at: 48, text: 'Clear it, then drag the date range to zoom in on recent years.' },
      { at: 60, chapter: 'Economic growth', text: 'Page 2: GDP and wages for Lancaster, Pennsylvania and the U.S., from BEA data.' },
      { at: 62, text: 'Top 5 / Bottom 5 flips the industry ranking; hover the trend for yearly values.' },
      { at: 68, text: 'Click an industry bar to highlight it across the page.' },
      { at: 74, text: 'The wage chart switches between average wage, wages by sector and jobs by sector.' },
      { at: 84, text: 'The table compares each industry in Lancaster with Pennsylvania and the U.S.' },
      { at: 90, text: 'Location filter: show Pennsylvania on its own, or both together.' },
    ],
  },
};
