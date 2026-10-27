// Pure statistics helpers for the interactive project dashboards.

export interface VacancyRow {
  county: string;
  state: string;
  year: number;
  census: number;
  uspsNarrow: number;
  uspsBroad: number;
  directionMatch: 'Match' | 'No Match' | null;
}

/** Pearson correlation coefficient; NaN when fewer than two points or no variance. */
export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return NaN;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let cov = 0;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    cov += dx * dy;
    vx += dx * dx;
    vy += dy * dy;
  }
  return vx && vy ? cov / Math.sqrt(vx * vy) : NaN;
}

/** Share of rows where USPS moved in the same direction as Census, ignoring rows with no comparison. */
export function directionMatchRate(rows: VacancyRow[]): number {
  const scored = rows.filter((r) => r.directionMatch === 'Match' || r.directionMatch === 'No Match');
  if (!scored.length) return NaN;
  return scored.filter((r) => r.directionMatch === 'Match').length / scored.length;
}

/** Mean of (Census − USPS narrow), in percentage points. */
export function meanGapPoints(rows: VacancyRow[]): number {
  if (!rows.length) return NaN;
  return (rows.reduce((s, r) => s + (r.census - r.uspsNarrow), 0) / rows.length) * 100;
}

/** Least-squares line through (x, y). */
export function linearFit(xs: number[], ys: number[]): { slope: number; intercept: number } {
  const n = Math.min(xs.length, ys.length);
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den ? num / den : 0;
  return { slope, intercept: my - slope * mx };
}
