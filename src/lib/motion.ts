// Live motion graphics for the project explainers. Each scene draws crisp SVG
// from the project's own results and animates it on a shared timeline, so it
// stays sharp at any size, follows the site's light/dark colours, and replays.
import data from '../data/motionData.json';

const NS = 'http://www.w3.org/2000/svg';
const C = {
  acc: 'var(--color-accent)',
  deep: 'var(--color-accent-ink)',
  ink: 'var(--color-strong)',
  text: 'var(--color-ink)',
  mute: 'var(--color-muted)',
  line: 'var(--color-line)',
  surf: 'var(--color-surface)',
};
const DISPLAY = 'var(--font-display)';
const MONO = 'var(--font-mono)';
const SANS = 'var(--font-sans)';

type Attrs = Record<string, string | number>;
type El = SVGElement;
export type Stage = {
  W: number;
  H: number;
  phone: boolean;
  top: number;
  bottom: number;
  x0: number;
  x1: number;
  svg: SVGSVGElement;
  mk: (tag: string, a?: Attrs, parent?: Element, text?: string) => El;
  uid: string;
};
type Scene = (s: Stage) => { dur: number; frame: (t: number) => void };

const ease = (x: number) => {
  x = Math.min(Math.max(x, 0), 1);
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
};
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const font = (e: El, f: string) => {
  e.style.fontFamily = f;
  return e;
};

function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    if (line && (line + ' ' + w).length > max) {
      out.push(line);
      line = w;
    } else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

const META: Record<string, { label: string; title: string; source: string; caption: string }> = {
  'can-mail-data-predict-housing-vacancy': {
    label: 'Project 01 // Housing vacancy',
    title: 'Does USPS vacancy track the Census rate?',
    source: 'Census ACS 1-year B25002 and HUD USPS vacancy data, 2011-2024 (no ACS 1-year release for 2020)',
    caption: 'Pooled r = 0.77, yet county by county it runs from 0.72 (Montgomery) to -0.01 (Champaign)',
  },
  'grocery-transaction-data-warehouse': {
    label: 'Project 02 // Grocery data warehouse',
    title: 'From raw files to a star schema, with checks at every layer',
    source: 'grocery-transaction-data-warehouse WALKTHROUGH.md (Kaggle data, SQL Server and DuckDB)',
    caption: '47.5% of completed orders failed the header-total check, so the test runs inside the pipeline',
  },
  'sales-planning-analysis': {
    label: 'Project 03 // Sales planning',
    title: '2022 revenue against plan, by district',
    source: 'KPIM Mart Power BI report, Store & Manager Overview page (VND billions, 2022)',
    caption: 'Whole chain: 5.90bn actual vs 6.43bn plan, 91.7% of target',
  },
  'lancaster-economic-indicators-dashboard': {
    label: 'Project 04 // Lancaster economic indicators',
    title: 'Unemployment rate: Lancaster County vs Pennsylvania',
    source: 'BLS labor-market data in the EDC Lancaster Power BI report, yearly values 2015-2025',
    caption: 'Lancaster stayed below the state rate in all 11 years, including the 2020 spike',
  },
  'rfm-customer-segmentation': {
    label: 'Project 05 // RFM customer segmentation',
    title: '18.4K customers, scored on recency, frequency, and spend',
    source: 'KPIM Mart Power BI report, Customer Analysis page. Each dot is about 46 customers.',
    caption: 'Each segment gets its own action: win back At-Risk, grow Growth, reward Premium',
  },
  'bank-transaction-sql-analysis': {
    label: 'Project 06 // Bank transaction SQL analysis',
    title: 'Audit the data first, then answer the question',
    source: 'bank-transaction-sql-analysis WALKTHROUGH.md (1,000 transactions, 800 accounts, MySQL)',
    caption: 'Over half of all transaction value came from Poor-credit accounts',
  },
  'medical-cost-regression': {
    label: 'Project 07 // Medical cost regression',
    title: 'One interaction explains the three cost bands',
    source: 'insurance.csv (1,338 policyholders); R² from the project results',
    caption: 'But error still differs by group: 29% for non-smokers vs 5% for obese smokers',
  },
  'melbourne-housing-price-prediction': {
    label: 'Project 08 // Melbourne housing prices',
    title: 'Same model, three tests: how "unseen" changes the error',
    source: 'Gradient boosting on 13,580 Melbourne sales, Jan 2016 to Sep 2017 (MAPE, lower is better)',
    caption: 'Random and time splits both said 13.1%; an unseen region pushed it to 18-38%',
  },
  'netflix-titles-etl-mysql': {
    label: 'Project 10 // Netflix titles ETL',
    title: 'From one flat file to linked tables',
    source: 'netflix-titles-etl-mysql repository: netflix_titles.csv, extract.py (PyMySQL), MySQL Workbench model, Power BI file',
    caption: 'Modeled so each genre, country and rating is stored once; the full load is unfinished',
  },
  'vacancy-nowcast-ml': {
    label: 'Project 09 // Vacancy nowcast',
    title: "Nothing beat carrying last year's Census value forward",
    source: 'vacancy-nowcast-ml results, forward-chaining test years 2015-2024 (no 2020), 6 counties',
    caption: 'Intervals hit 81% overall but only 57% in Champaign: a pooled number hides the worst county',
  },
};

// A block of text built from tspans, one per line.
function para(mk: Stage['mk'], lines: string[], x: number, y: number, lh: number, a: Attrs, parent?: Element) {
  const t = mk('text', { x, y, ...a }, parent);
  lines.forEach((l, i) => {
    const sp = document.createElementNS(NS, 'tspan');
    sp.setAttribute('x', String(x));
    if (i) sp.setAttribute('dy', String(lh));
    sp.textContent = l;
    t.appendChild(sp);
  });
  return t;
}
const set = (e: El, a: Attrs) => {
  for (const k in a) e.setAttribute(k, String(a[k]));
};

// ---------- 01 Housing: Census vs USPS, six counties ----------
const housing: Scene = (s) => {
  const { years, counties } = data.housing;
  const names = Object.keys(counties) as (keyof typeof counties)[];
  const cols = s.phone ? 2 : 3;
  const rows = s.phone ? 3 : 2;
  const gap = s.phone ? 12 : 22;
  const legendH = s.phone ? 40 : 28;
  const cw = (s.x1 - s.x0 - gap * (cols - 1)) / cols;
  const chh = (s.bottom - s.top - legendH - gap * (rows - 1)) / rows;
  const all = names.flatMap((n) => [...counties[n].census, ...counties[n].usps]).filter((v) => v != null) as number[];
  const ymax = Math.max(...all) * 1.08;
  const fs = s.phone ? 11.5 : 14;
  font(s.mk('text', { x: s.x0, y: s.top + 12, 'font-size': fs, fill: C.ink }, s.svg, '━ Census ACS rate'), MONO);
  font(s.mk('text', { x: s.x0 + (s.phone ? 140 : 175), y: s.top + 12, 'font-size': fs, fill: C.deep }, s.svg, '━ USPS rate'), MONO);
  const note = font(s.mk('text', { x: s.x0 + (s.phone ? 0 : 320), y: s.top + (s.phone ? 30 : 12), 'font-size': fs, fill: C.deep, opacity: 0 }, s.svg, '┆ 2012: USPS redefinition, not a real trend'), MONO);
  type Line = { p: El; v: (number | null)[]; dot: El; X: (i: number) => number; Y: (v: number) => number };
  const lines: Line[] = [];
  const marks: El[] = [];
  names.forEach((n, k) => {
    const ox = s.x0 + (k % cols) * (cw + gap);
    const oy = s.top + legendH + Math.floor(k / cols) * (chh + gap);
    const g = s.mk('g', { transform: `translate(${ox} ${oy})` });
    const pt = 22, pb = 14, pl = 30;
    const ph = chh - pt - pb, pw = cw - pl;
    font(s.mk('text', { x: 0, y: 12, 'font-size': s.phone ? 13 : 16, 'font-weight': 700, fill: C.ink }, g, n), DISPLAY);
    for (const f of [0, 0.5, 1]) {
      const yy = pt + ph - f * ph;
      s.mk('line', { x1: pl, x2: cw, y1: yy, y2: yy, stroke: C.line, 'stroke-width': 1, opacity: 0.8 }, g);
      font(s.mk('text', { x: pl - 5, y: yy + 3, 'font-size': 9, 'text-anchor': 'end', fill: C.mute }, g, `${Math.round(ymax * f)}%`), MONO);
    }
    const X = (i: number) => pl + (i / (years.length - 1)) * pw;
    const Y = (v: number) => pt + ph - (v / ymax) * ph;
    for (const y of [2012, 2016, 2020, 2024]) font(s.mk('text', { x: X(y - 2011), y: chh, 'font-size': 9, 'text-anchor': 'middle', fill: C.mute }, g, String(y)), MONO);
    marks.push(s.mk('line', { x1: X(1), x2: X(1), y1: pt, y2: pt + ph, stroke: C.deep, 'stroke-width': 1.3, 'stroke-dasharray': '4 3', opacity: 0 }, g));
    for (const key of ['census', 'usps'] as const) {
      const v = counties[n][key] as (number | null)[];
      let d = '', pen = false;
      v.forEach((val, i) => {
        if (val == null) return void (pen = false);
        d += `${pen ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(val).toFixed(1)}`;
        pen = true;
      });
      const col = key === 'usps' ? C.acc : C.ink;
      const p = s.mk('path', { d, fill: 'none', stroke: col, 'stroke-width': s.phone ? 2.4 : 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, g);
      const dot = s.mk('circle', { r: s.phone ? 3.5 : 4.5, fill: col }, g);
      lines.push({ p, v, dot, X, Y });
    }
  });
  return {
    dur: 8,
    frame(t) {
      const p = seg(t, 0.3, 6);
      lines.forEach(({ p: path, v, dot, X, Y }) => {
        path.setAttribute('stroke-dashoffset', String(1 - p));
        const f = p * (v.length - 1);
        const i = Math.min(Math.floor(f), v.length - 2);
        const a = (v[i] ?? v[i - 1] ?? v[i + 1]) as number, b = (v[i + 1] ?? a) as number;
        set(dot, { cx: X(f), cy: Y(lerp(a, b, f - i)), opacity: p > 0 ? 1 : 0 });
      });
      const a = seg(t, 4.5, 5.5);
      marks.forEach((m) => m.setAttribute('opacity', String(a)));
      note.setAttribute('opacity', String(a));
    },
  };
};

// ---------- 02 Grocery: rows flow through the medallion layers ----------
const grocery: Scene = (s) => {
  const boxes = [
    { n: 'BRONZE', sub: 'raw load', col: C.deep, rows: [[10000000, 'transactions'], [131291578, 'order lines']] },
    { n: 'SILVER', sub: 'cleaned + validated', col: C.mute, rows: [[3333717, 'completed orders'], [1584392, 'header ≠ line total']] },
    { n: 'GOLD', sub: 'star schema', col: C.acc, rows: [[43758515, 'fact_sales rows'], [44.7, 'revenue from top 20% of customers']] },
  ] as const;
  const split = [[3333717, C.deep], [3334621, C.mute], [3331662, C.line]] as const;
  const gap = s.phone ? 26 : 46;
  const cw = s.phone ? s.x1 - s.x0 : (s.x1 - s.x0 - gap * 2) / 3;
  const chh = s.phone ? (s.bottom - s.top - gap * 2) / 3 : Math.min(s.bottom - s.top, 330);
  type Card = { g: El; x: number; y: number; nums: { e: El; v: number; pct: boolean }[]; bar?: El[] };
  const cards: Card[] = [];
  const packets: { e: El; x: number; y: number; ar: El[] }[] = [];
  boxes.forEach((b, k) => {
    const x = s.phone ? s.x0 : s.x0 + k * (cw + gap);
    const y = s.phone ? s.top + k * (chh + gap) : s.top + (s.bottom - s.top - chh) / 2;
    const g = s.mk('g', { opacity: 0 });
    s.mk('rect', { x: 0, y: 0, width: cw, height: chh, fill: C.surf, stroke: C.line, 'stroke-width': 1.2 }, g);
    s.mk('rect', { x: 0, y: 0, width: 6, height: chh, fill: b.col }, g);
    font(s.mk('text', { x: 20, y: s.phone ? 26 : 38, 'font-size': s.phone ? 14 : 18, 'font-weight': 700, fill: C.ink }, g, b.n), MONO);
    font(s.mk('text', { x: 20, y: s.phone ? 44 : 62, 'font-size': s.phone ? 10.5 : 13, fill: C.mute }, g, b.sub), MONO);
    const nums: Card['nums'] = [];
    b.rows.forEach(([v, lab], r) => {
      const nx = s.phone ? 150 + r * ((cw - 160) / 2) : 20;
      const ny = s.phone ? 38 : 130 + r * 82;
      const e = font(s.mk('text', { x: nx, y: ny, 'font-size': s.phone ? 18 : 34, 'font-weight': 700, fill: k === 1 && r === 1 ? C.deep : C.ink }, g, '0'), DISPLAY);
      font(para(s.mk, wrap(String(lab), s.phone ? 15 : 34), nx, ny + (s.phone ? 15 : 24), s.phone ? 12 : 17, { 'font-size': s.phone ? 10.5 : 14, fill: C.mute }, g), SANS);
      nums.push({ e, v: v as number, pct: String(lab).startsWith('revenue') });
    });
    let bar: El[] | undefined;
    if (k === 1) {
      const bw = cw - 40, by = chh - (s.phone ? 12 : 38);
      bar = [];
      let xx = 20;
      split.forEach(([n, col]) => {
        const r = s.mk('rect', { x: xx, y: by, width: 0, height: s.phone ? 6 : 12, fill: col }, g);
        (r as any)._x = xx;
        (r as any)._w = (bw * n) / 1e7;
        xx += (bw * n) / 1e7;
        bar!.push(r);
      });
      if (!s.phone) bar.push(font(s.mk('text', { x: 20, y: by - 8, 'font-size': 11, fill: C.mute, opacity: 0 }, g, 'completed · failed · pending'), MONO));
    }
    set(g, { transform: `translate(${x} ${y})` });
    cards.push({ g, x, y, nums, bar });
    if (k < 2) {
      const ax = s.phone ? x + cw / 2 : x + cw + 4, ay = s.phone ? y + chh + 2 : y + chh / 2;
      const ar = [
        s.mk('path', { d: s.phone ? `M${ax} ${ay} v${gap - 8}` : `M${ax} ${ay} h${gap - 8}`, stroke: C.mute, 'stroke-width': 1.6, fill: 'none', opacity: 0 }),
        s.mk('path', { d: s.phone ? `M${ax - 5} ${ay + gap - 14} l5 6 l5 -6` : `M${ax + gap - 14} ${ay - 5} l6 5 l-6 5`, stroke: C.mute, 'stroke-width': 1.6, fill: 'none', opacity: 0 }),
      ];
      packets.push({ e: s.mk('circle', { r: 5, fill: C.acc, opacity: 0 }), x: ax, y: ay, ar });
    }
  });
  const run = s.phone ? gap - 8 : gap - 8;
  return {
    dur: 9,
    frame(t) {
      cards.forEach((c, k) => {
        const a = seg(t, 0.4 + k * 2.2, 1.3 + k * 2.2);
        set(c.g, { opacity: a, transform: `translate(${c.x} ${c.y + (1 - a) * 14})` });
        c.nums.forEach((n, r) => {
          const b = seg(t, 0.8 + k * 2.2 + r * 0.6, 1.8 + k * 2.2 + r * 0.6);
          n.e.textContent = n.pct ? `${(n.v * b).toFixed(1)}%` : fmt(n.v * b);
          n.e.setAttribute('opacity', String(b));
        });
        c.bar?.forEach((r) => {
          const w = seg(t, 2.6, 3.6);
          if ((r as any)._w != null) set(r, { x: (r as any)._x, width: (r as any)._w * w });
          else r.setAttribute('opacity', String(w > 0.95 ? 1 : 0));
        });
      });
      packets.forEach((p, k) => {
        const on = seg(t, 1.6 + k * 2.2, 2.2 + k * 2.2);
        const ph = (t * 0.9 + k * 0.3) % 1;
        p.ar.forEach((a) => a.setAttribute('opacity', String(on)));
        set(p.e, s.phone ? { cx: p.x, cy: p.y + ph * run, opacity: on } : { cx: p.x + ph * run, cy: p.y, opacity: on });
      });
    },
  };
};

// ---------- horizontal bars helper (sales, bank, nowcast) ----------
function hbars(s: Stage, x: number, y: number, w: number, h: number, rows: { label: string; col: string }[], max: number, labelW: number, fs: number) {
  const rh = h / rows.length;
  const bh = Math.min(rh * 0.62, 34);
  const out = rows.map((r, i) => {
    const cy = y + rh * i + rh / 2;
    font(s.mk('text', { x, y: cy + fs * 0.35, 'font-size': fs, fill: C.text }, s.svg, r.label), SANS);
    const bar = s.mk('rect', { x: x + labelW, y: cy - bh / 2, width: 0, height: bh, fill: r.col }, s.svg);
    const val = font(s.mk('text', { x: x + labelW, y: cy + fs * 0.35, 'font-size': fs, 'font-weight': 700, fill: C.ink, opacity: 0 }, s.svg, ''), MONO);
    return { bar, val, cy, bh };
  });
  const scale = (v: number) => ((w - labelW) * v) / max;
  return { out, scale, x0: x + labelW };
}

// ---------- 03 Sales: actual vs plan by district ----------
const sales: Scene = (s) => {
  const rows = [['Cầu Giấy', 1.61, 1.76], ['Hai Bà Trưng', 1.12, 1.2], ['Ba Đình', 0.78, 0.82], ['Hoàn Kiếm', 0.74, 0.8], ['Thanh Xuân', 0.69, 0.72], ['Đống Đa', 0.61, 0.68]] as const;
  const fs = s.phone ? 12 : 16;
  font(s.mk('text', { x: s.x1, y: s.top + 12, 'font-size': fs - 1, 'text-anchor': 'end', fill: C.mute }, s.svg, 'solid = actual, dashed = monthly plan'), MONO);
  const hb = hbars(s, s.x0, s.top + 24, s.x1 - s.x0, s.bottom - s.top - 30, rows.map((r, i) => ({ label: r[0], col: i ? C.acc : C.deep })), s.phone ? 2.3 : 2.35, s.phone ? 104 : 160, fs);
  const plans = hb.out.map((o) => s.mk('rect', { x: hb.x0, y: o.cy - o.bh / 2, width: 0, height: o.bh, fill: 'none', stroke: C.mute, 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }));
  hb.out.forEach((o) => s.svg.appendChild(o.bar));
  return {
    dur: 6.5,
    frame(t) {
      rows.forEach(([, act, plan], i) => {
        plans[i].setAttribute('width', String(hb.scale(plan) * seg(t, 0.4 + i * 0.25, 1.4 + i * 0.25)));
        const a = seg(t, 2.2 + i * 0.3, 3.6 + i * 0.3);
        hb.out[i].bar.setAttribute('width', String(hb.scale(act) * a));
        const v = hb.out[i].val;
        v.textContent = s.phone ? `${act.toFixed(2)}/${plan.toFixed(2)}` : `${act.toFixed(2)} of ${plan.toFixed(2)}bn`;
        set(v, { x: hb.x0 + hb.scale(plan) + 10, opacity: a > 0.9 ? 1 : 0 });
      });
    },
  };
};

// ---------- 04 Lancaster: unemployment vs Pennsylvania ----------
const lancaster: Scene = (s) => {
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);
  const lan = [4.2, 4.1, 3.9, 3.5, 3.38, 7.31, 4.59, 3.4, 2.9, 2.9, 3.27];
  const pa = [5.4, 5.3, 5.0, 4.4, 4.31, 8.85, 5.88, 4.2, 3.66, 3.6, 4.1];
  const pr = s.phone ? 70 : 120, pt = 14, pb = 26;
  const px = s.x0 + 30, pw = s.x1 - px - pr, py = s.top + pt, ph = s.bottom - s.top - pt - pb;
  const X = (y: number) => px + ((y - 2015) / 10) * pw;
  const Y = (v: number) => py + ph - ((v - 2) / 7.8) * ph;
  for (const v of [2, 4, 6, 8]) {
    s.mk('line', { x1: px, x2: px + pw, y1: Y(v), y2: Y(v), stroke: C.line, 'stroke-width': 1, opacity: 0.8 });
    font(s.mk('text', { x: px - 8, y: Y(v) + 4, 'font-size': 12, 'text-anchor': 'end', fill: C.mute }, s.svg, `${v}%`), MONO);
  }
  years.forEach((y, i) => {
    if (s.phone && i % 2) return;
    font(s.mk('text', { x: X(y), y: py + ph + 18, 'font-size': s.phone ? 11 : 12, 'text-anchor': 'middle', fill: C.mute }, s.svg, String(y)), MONO);
  });
  const clip = s.mk('clipPath', { id: s.uid + 'c' });
  const cr = s.mk('rect', { x: px - 8, y: py - 10, width: 0, height: ph + 20 }, clip);
  const gp = s.mk('g', { 'clip-path': `url(#${s.uid}c)` });
  const pts = (arr: number[]) => arr.map((v, i) => `${X(years[i]).toFixed(1)},${Y(v).toFixed(1)}`);
  s.mk('polygon', { points: [...pts(lan), ...pts(pa).reverse()].join(' '), fill: C.acc, opacity: 0.16 }, gp);
  s.mk('polyline', { points: pts(pa).join(' '), fill: 'none', stroke: C.ink, 'stroke-width': s.phone ? 2.6 : 3.4, 'stroke-linejoin': 'round' }, gp);
  s.mk('polyline', { points: pts(lan).join(' '), fill: 'none', stroke: C.acc, 'stroke-width': s.phone ? 3 : 4, 'stroke-linejoin': 'round' }, gp);
  const dots = years.map((y, i) => [
    s.mk('circle', { cx: X(y), cy: Y(lan[i]), r: s.phone ? 3.5 : 5, fill: C.acc, opacity: 0 }),
    s.mk('circle', { cx: X(y), cy: Y(pa[i]), r: s.phone ? 3 : 4.2, fill: C.ink, opacity: 0 }),
  ]);
  const head = s.mk('line', { y1: py - 6, y2: py + ph, stroke: C.mute, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 });
  const ann = font(s.mk('text', { x: X(2020) + (s.phone ? -8 : 12), y: Y(8.85) + 4, 'font-size': s.phone ? 12 : 15, 'font-weight': 700, 'text-anchor': s.phone ? 'end' : 'start', fill: C.ink, opacity: 0 }, s.svg, '2020: 7.3% vs 8.9%'), DISPLAY);
  const e1 = font(s.mk('text', { x: X(2025) + 12, y: Y(lan[10]) + 18, 'font-size': s.phone ? 12 : 16, 'font-weight': 700, fill: C.deep, opacity: 0 }, s.svg, `Lancaster ${lan[10]}%`), DISPLAY);
  const e2 = font(s.mk('text', { x: X(2025) + 12, y: Y(pa[10]) - 2, 'font-size': s.phone ? 12 : 16, 'font-weight': 700, fill: C.ink, opacity: 0 }, s.svg, `PA ${pa[10]}%`), DISPLAY);
  return {
    dur: 7,
    frame(t) {
      const p = seg(t, 0.4, 5);
      cr.setAttribute('width', String(Math.max(0, (pw + 16) * p)));
      const upto = 2015 + p * 10;
      years.forEach((y, i) => dots[i].forEach((d) => d.setAttribute('opacity', y <= upto + 0.01 ? '1' : '0')));
      const hx = px - 8 + (pw + 16) * p;
      set(head, { x1: hx, x2: hx, opacity: p > 0 && p < 1 ? 0.8 : 0 });
      ann.setAttribute('opacity', String(upto >= 2020 ? 1 : 0));
      const e = seg(t, 5, 5.6);
      e1.setAttribute('opacity', String(e));
      e2.setAttribute('opacity', String(e));
    },
  };
};

// ---------- 05 RFM: customers sort into segments ----------
const rfm: Scene = (s) => {
  const segs = [['At-Risk', 41.98, C.deep], ['Growth', 26.21, C.acc], ['Standard', 21.49, C.mute], ['Premium', 10.32, C.ink]] as const;
  const n = 400;
  const counts: number[] = segs.map((g) => Math.round((g[1] / 100) * n));
  counts[0] += n - counts.reduce((a, b) => a + b, 0);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cw = s.x1 - s.x0;
  const cols = s.phone ? 26 : 14;
  const cell = s.phone ? cw / cols : Math.min((cw / 4 - 22) / cols, 22);
  const size = cell * 0.8;
  type Dot = { e: El; sx: number; sy: number; tx: number; ty: number; d: number; col: string; on: boolean };
  const dots: Dot[] = [];
  const labels: El[] = [];
  const rank = Array.from({ length: n }, (_, i) => i).sort(() => rnd() - 0.5);
  let cursorY = s.top, k = 0;
  segs.forEach(([name, share, col], si) => {
    const gx = s.phone ? s.x0 : s.x0 + si * (cw / 4);
    const gy = s.phone ? cursorY + 24 : s.top + 66;
    labels.push(
      font(s.mk('text', { x: gx, y: s.phone ? cursorY + 16 : s.top + 36, 'font-size': s.phone ? 20 : 38, 'font-weight': 700, fill: C.ink, opacity: 0 }, s.svg, `${share.toFixed(1)}%`), DISPLAY),
      font(s.mk('text', { x: gx + (s.phone ? 80 : 0), y: s.phone ? cursorY + 16 : s.top + 56, 'font-size': s.phone ? 13 : 15, fill: C.mute, opacity: 0 }, s.svg, `${name} customers`), SANS),
    );
    for (let j = 0; j < counts[si]; j++, k++) {
      const e = s.mk('rect', { width: size, height: size, rx: 1, opacity: 0.45 });
      e.style.fill = C.mute;
      dots.push({ e, sx: s.x0 + rnd() * (cw - size), sy: s.top + 20 + rnd() * (s.bottom - s.top - 40), tx: gx + (j % cols) * cell, ty: gy + Math.floor(j / cols) * cell, d: (rank[k] / n) * 1.2, col, on: false });
    }
    cursorY = gy + Math.ceil(counts[si] / cols) * cell + 8;
  });
  return {
    dur: 8,
    frame(t) {
      dots.forEach((d) => {
        const p = seg(t, 1.5 + d.d, 3.5 + d.d);
        set(d.e, { x: lerp(d.sx, d.tx, p), y: lerp(d.sy, d.ty, p) });
        const on = p > 0.15;
        if (on !== d.on) {
          d.on = on;
          d.e.style.fill = on ? d.col : C.mute;
          d.e.setAttribute('opacity', on ? '1' : '0.45');
        }
      });
      const a = seg(t, 5.2, 6);
      labels.forEach((l) => l.setAttribute('opacity', String(a)));
    },
  };
};

// ---------- 06 Bank: audit, then analyse ----------
const bank: Scene = (s) => {
  const bands = [['Poor', 51.37], ['Fair', 13.98], ['Good', 12.76], ['Very good', 10.98], ['Excellent', 10.9]] as const;
  const fs = s.phone ? 12 : 15;
  const w = s.x1 - s.x0;
  font(s.mk('text', { x: s.x0, y: s.top + 12, 'font-size': fs - 1, fill: C.mute }, s.svg, '1  DATA QUALITY AUDIT'), MONO);
  const by = s.top + 24, bh = s.phone ? 24 : 34;
  s.mk('rect', { x: s.x0, y: by, width: w, height: bh, fill: C.surf, stroke: C.line });
  const good = s.mk('rect', { x: s.x0, y: by, width: 0, height: bh, fill: C.ink });
  const bad = s.mk('rect', { x: s.x0 + w * 0.877, y: by, width: 0, height: bh, fill: C.acc });
  const ty = by + bh + (s.phone ? 20 : 26);
  const t1 = font(s.mk('text', { x: s.x0, y: ty, 'font-size': fs + 1, 'font-weight': 700, fill: C.ink }, s.svg, ''), SANS);
  const t2 = font(s.mk('text', { x: s.x1, y: ty, 'font-size': fs + 1, 'font-weight': 700, 'text-anchor': 'end', fill: C.deep, opacity: 0 }, s.svg, ''), SANS);
  const t3 = font(s.mk('text', { x: s.x0, y: ty + (s.phone ? 20 : 0), 'font-size': fs + 1, fill: C.deep, opacity: 0, ...(s.phone ? {} : { 'text-anchor': 'middle' }) }, s.svg, ''), SANS);
  if (!s.phone) t3.setAttribute('x', String(s.x0 + w / 2));
  const y2 = ty + (s.phone ? 44 : 46);
  const h2 = font(s.mk('text', { x: s.x0, y: y2, 'font-size': fs - 1, fill: C.mute, opacity: 0 }, s.svg, '2  SHARE OF TRANSACTION VALUE BY CREDIT BAND'), MONO);
  const hb = hbars(s, s.x0, y2 + 8, w, s.bottom - y2 - 8, bands.map((b, i) => ({ label: b[0], col: i ? C.acc : C.deep })), 60, s.phone ? 84 : 120, fs);
  return {
    dur: 7,
    frame(t) {
      const p = seg(t, 0.4, 2.2), q = seg(t, 2.2, 3);
      good.setAttribute('width', String(w * 0.877 * p));
      bad.setAttribute('width', String(w * 0.123 * q));
      t1.textContent = `${(87.7 * p).toFixed(1)}% complete rows`;
      t2.textContent = `${(12.3 * q).toFixed(1)}% missing a field`;
      t3.textContent = `${Math.floor(17 * q)} invalid currency codes`;
      t2.setAttribute('opacity', String(q));
      t3.setAttribute('opacity', String(q));
      h2.setAttribute('opacity', String(seg(t, 3.6, 4.2)));
      bands.forEach(([, v], i) => {
        const b = seg(t, 4 + i * 0.35, 5.2 + i * 0.35);
        hb.out[i].bar.setAttribute('width', String(hb.scale(v) * b));
        set(hb.out[i].val, { x: hb.x0 + hb.scale(v * b) + 8, opacity: b });
        hb.out[i].val.textContent = `${(v * b).toFixed(1)}%`;
      });
    },
  };
};

// ---------- 07 Medical: smoking x obesity makes three cost bands ----------
const medical: Scene = (s) => {
  const pts = data.medical as number[][];
  const gcol = [C.mute, C.acc, C.deep];
  const glab = ['non-smokers', 'smokers, BMI < 30', 'smokers, BMI ≥ 30'];
  const sw = s.phone ? s.x1 - s.x0 : (s.x1 - s.x0) * 0.58;
  const sh = s.phone ? (s.bottom - s.top) * 0.56 : s.bottom - s.top;
  const pl = 44, pb = 22;
  const X = (a: number) => s.x0 + pl + ((a - 17) / 48) * (sw - pl - 6);
  const Y = (c: number) => s.top + (sh - pb) - (c / 660) * (sh - pb - 6);
  for (const v of [0, 200, 400, 600]) {
    s.mk('line', { x1: s.x0 + pl, x2: s.x0 + sw, y1: Y(v), y2: Y(v), stroke: C.line, opacity: 0.8 });
    font(s.mk('text', { x: s.x0 + pl - 6, y: Y(v) + 4, 'font-size': 11, 'text-anchor': 'end', fill: C.mute }, s.svg, `$${v / 10}k`), MONO);
  }
  for (const a of [20, 40, 60]) font(s.mk('text', { x: X(a), y: s.top + sh - 4, 'font-size': 11, 'text-anchor': 'middle', fill: C.mute }, s.svg, String(a)), MONO);
  const circles = pts.map(([a, c]) => {
    const e = s.mk('circle', { cx: X(a), cy: Y(c), r: s.phone ? 1.9 : 2.7, opacity: 0 });
    e.style.fill = C.mute;
    return e;
  });
  const leg = glab.map((g, i) => font(s.mk('text', { x: s.x0 + pl + 10, y: s.top + 16 + i * 20, 'font-size': s.phone ? 11 : 13, 'font-weight': 700, fill: i ? gcol[i] : C.mute, opacity: 0 }, s.svg, '● ' + g), SANS));
  const bx = s.phone ? s.x0 : s.x0 + sw + 40;
  const bw = s.phone ? s.x1 - s.x0 : s.x1 - bx;
  const by0 = s.phone ? s.top + sh + 34 : s.top + 36;
  const bh = s.phone ? s.bottom - by0 - 34 : s.bottom - by0 - 40;
  font(s.mk('text', { x: bx, y: s.phone ? s.top + sh + 18 : s.top + 12, 'font-size': 12, fill: C.mute }, s.svg, 'R² (share of cost explained)'), MONO);
  const r2 = [['age + sex', 0.09, C.mute], ['+ smoker × obese', 0.86, C.acc], ['held-out test', 0.88, C.deep]] as const;
  const colW = bw / 3;
  const bars = r2.map(([lab, v, col], i) => {
    const cx = bx + colW * i + colW / 2;
    const bwid = Math.min(colW * 0.56, 70);
    const r = s.mk('rect', { x: cx - bwid / 2, width: bwid, y: by0 + bh, height: 0, fill: col });
    const t = font(s.mk('text', { x: cx, 'font-size': s.phone ? 14 : 20, 'font-weight': 700, 'text-anchor': 'middle', fill: C.ink, opacity: 0 }, s.svg, ''), DISPLAY);
    font(para(s.mk, wrap(lab, s.phone ? 14 : 12), cx, by0 + bh + 16, 14, { 'font-size': s.phone ? 10.5 : 12, 'text-anchor': 'middle', fill: C.text }, s.svg), SANS);
    return { r, t, v };
  });
  let shown = 0, colored = false;
  return {
    dur: 8,
    frame(t) {
      const n = Math.round(seg(t, 0.2, 2.4) * pts.length);
      if (n !== shown) {
        const op = colored ? '0.9' : '0.6';
        if (n > shown) for (let i = shown; i < n; i++) circles[i].setAttribute('opacity', op);
        else for (let i = n; i < shown; i++) circles[i].setAttribute('opacity', '0');
        shown = n;
      }
      const c = seg(t, 2.8, 3.8);
      if (c > 0.5 !== colored) {
        colored = c > 0.5;
        circles.forEach((e, i) => {
          e.style.fill = colored ? gcol[pts[i][2]] : C.mute;
          if (i < shown) e.setAttribute('opacity', colored ? '0.9' : '0.6');
        });
      }
      leg.forEach((l) => l.setAttribute('opacity', String(Math.max(0, (c - 0.5) * 2))));
      bars.forEach((b, i) => {
        const p = seg(t, 4.4 + i * 0.9, 5.4 + i * 0.9);
        const h = bh * b.v * p;
        set(b.r, { y: by0 + bh - h, height: h });
        b.t.textContent = (b.v * p).toFixed(2);
        set(b.t, { y: by0 + bh - h - 8, opacity: p });
      });
    },
  };
};

// ---------- 08 Melbourne: one model, three tests ----------
const melbourne: Scene = (s) => {
  const bars = [['Random 5-fold CV', 13.1], ['Future sales', 13.1], ['South-Eastern', 18.2], ['Northern', 18.9], ['Southern', 21.3], ['Eastern', 22], ['Western', 37.9]] as const;
  const pb = s.phone ? 44 : 34;
  const px = s.x0 + 44, pw = s.x1 - px, py = s.top + 10, ph = s.bottom - s.top - 10 - pb;
  const Y = (v: number) => py + ph - (v / 42) * ph;
  for (const v of [0, 10, 20, 30, 40]) {
    s.mk('line', { x1: px, x2: px + pw, y1: Y(v), y2: Y(v), stroke: C.line, opacity: 0.8 });
    font(s.mk('text', { x: px - 8, y: Y(v) + 4, 'font-size': 12, 'text-anchor': 'end', fill: C.mute }, s.svg, `${v}%`), MONO);
  }
  const colW = pw / bars.length;
  const els = bars.map(([lab, v], i) => {
    const cx = px + colW * i + colW / 2;
    const bw = colW * 0.62;
    const r = s.mk('rect', { x: cx - bw / 2, width: bw, y: Y(0), height: 0, fill: i < 2 ? C.mute : v > 30 ? C.deep : C.acc });
    const t = font(s.mk('text', { x: cx, 'font-size': s.phone ? 12 : 17, 'font-weight': 700, 'text-anchor': 'middle', fill: C.ink, opacity: 0 }, s.svg, ''), DISPLAY);
    font(para(s.mk, wrap(lab, s.phone ? 8 : 13), cx, py + ph + 18, 13, { 'font-size': s.phone ? 10 : 12.5, 'text-anchor': 'middle', fill: C.text }, s.svg), SANS);
    return { r, t, v, i };
  });
  const base = s.mk('line', { x1: px, x2: px + pw, y1: Y(13.1), y2: Y(13.1), stroke: C.mute, 'stroke-width': 1.3, 'stroke-dasharray': '5 4', opacity: 0 });
  const div = s.mk('line', { x1: px + colW * 2, x2: px + colW * 2, y1: py, y2: py + ph, stroke: C.line, 'stroke-width': 1.2, opacity: 0 });
  const note = font(s.mk('text', { x: px + colW * 2 + 10, y: py + 14, 'font-size': s.phone ? 11 : 14, fill: C.mute, opacity: 0 }, s.svg, s.phone ? 'unseen region →' : 'held-out region the model never saw  →'), MONO);
  return {
    dur: 7,
    frame(t) {
      els.forEach(({ r, t: tx, v, i }) => {
        const st = i < 2 ? 0.4 + i * 0.9 : 2.6 + i * 0.45;
        const p = seg(t, st, st + 0.9);
        const h = (Y(0) - Y(v)) * p;
        set(r, { y: Y(0) - h, height: h });
        tx.textContent = `${(v * p).toFixed(1)}%`;
        set(tx, { y: Y(0) - h - 8, opacity: p });
      });
      const a = seg(t, 2.4, 2.8);
      [base, div, note].forEach((e) => e.setAttribute('opacity', String(a)));
    },
  };
};

// ---------- 09 Nowcast: honest evaluation ----------
const nowcast: Scene = (s) => {
  const mae = data.nowcast.mae as [string, number][];
  const cov = data.nowcast.coverage as [string, number][];
  const fs = s.phone ? 11.5 : 14;
  const total = s.bottom - s.top;
  const pw = s.phone ? s.x1 - s.x0 : (s.x1 - s.x0 - 50) / 2;
  const ph = s.phone ? (total - 14) / 2 : total;
  font(s.mk('text', { x: s.x0, y: s.top + 12, 'font-size': fs - 1, fill: C.mute }, s.svg, 'Mean absolute error, percentage points'), MONO);
  const A = hbars(s, s.x0, s.top + 22, pw, ph - 22, mae.map((m, i) => ({ label: m[0], col: i ? C.mute : C.deep })), 1.75, s.phone ? 116 : 150, fs);
  const x2 = s.phone ? s.x0 : s.x0 + pw + 50, y2 = s.phone ? s.top + ph + 14 : s.top;
  font(s.mk('text', { x: x2, y: y2 + 12, 'font-size': fs - 1, fill: C.mute }, s.svg, '80% interval coverage (ridge)'), MONO);
  const B = hbars(s, x2, y2 + 22, pw, ph - 22, cov.map((c) => ({ label: c[0], col: c[1] < 0.7 ? C.deep : c[0] === 'Pooled' ? C.ink : C.acc })), 1.1, s.phone ? 92 : 110, fs);
  const dash = s.mk('line', { x1: B.x0 + B.scale(0.8), x2: B.x0 + B.scale(0.8), y1: y2 + 20, y2: y2 + ph, stroke: C.mute, 'stroke-width': 1.3, 'stroke-dasharray': '5 4', opacity: 0 });
  return {
    dur: 7,
    frame(t) {
      mae.forEach(([, v], i) => {
        const b = seg(t, 0.4 + i * 0.4, 1.4 + i * 0.4);
        A.out[i].bar.setAttribute('width', String(A.scale(v) * b));
        A.out[i].val.textContent = (v * b).toFixed(3);
        set(A.out[i].val, { x: A.x0 + A.scale(v * b) + 8, opacity: b });
      });
      dash.setAttribute('opacity', String(seg(t, 4, 4.6)));
      cov.forEach(([, v], i) => {
        const b = seg(t, 4.4 + i * 0.3, 5.3 + i * 0.3);
        B.out[i].bar.setAttribute('width', String(B.scale(v) * b));
        B.out[i].val.textContent = `${Math.round(v * b * 100)}%`;
        set(B.out[i].val, { x: B.x0 + B.scale(v * b) + 8, opacity: b });
      });
    },
  };
};

// ---------- 10 Netflix: flat file to linked tables ----------
const netflix: Scene = (s) => {
  const names = [
    ['netflix_titles.csv', 'one flat file'],
    ['extract.py', 'Python + PyMySQL'],
    ['MySQL tables', 'dimension, fact, link'],
    ['Power BI', 'report on the tables'],
  ];
  const aw = s.x1 - s.x0, ah = s.bottom - s.top;
  const gap = s.phone ? 28 : 56;
  const bw = s.phone ? aw : (aw - 3 * gap) / 4;
  const bh = s.phone ? Math.min(78, (ah - 3 * gap) / 4) : 132;
  const y0 = s.phone ? s.top + (ah - (4 * bh + 3 * gap)) / 2 : s.top + (ah - bh) / 2;
  const pos = names.map((_, i) => (s.phone ? { x: s.x0, y: y0 + i * (bh + gap) } : { x: s.x0 + i * (bw + gap), y: y0 }));
  const lf = s.phone ? 14 : 17, sf = s.phone ? 11 : 13;
  const boxes = names.map(([a, b], i) => {
    const { x, y } = pos[i];
    const r = s.mk('rect', { x, y, width: bw, height: bh, fill: C.surf, stroke: C.line, 'stroke-width': 1.5 });
    font(s.mk('text', { x: x + 16, y: y + bh / 2 - 2, 'font-size': lf, 'font-weight': 700, fill: C.ink }, s.svg, a), MONO);
    font(s.mk('text', { x: x + 16, y: y + bh / 2 + sf + 6, 'font-size': sf, fill: C.mute }, s.svg, b), MONO);
    font(s.mk('text', { x: x + bw - 14, y: y + 22, 'font-size': sf, 'text-anchor': 'end', fill: C.deep }, s.svg, String(i + 1).padStart(2, '0')), MONO);
    return r;
  });
  const links = [0, 1, 2].map((i) => {
    const a = pos[i], b = pos[i + 1];
    const p1 = s.phone ? { x: a.x + bw / 2, y: a.y + bh } : { x: a.x + bw, y: a.y + bh / 2 };
    const p2 = s.phone ? { x: b.x + bw / 2, y: b.y } : { x: b.x, y: b.y + bh / 2 };
    s.mk('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: C.line, 'stroke-width': 2 });
    const fill = s.mk('line', { x1: p1.x, y1: p1.y, x2: p1.x, y2: p1.y, stroke: C.acc, 'stroke-width': 3 });
    const pk = [0, 1, 2].map(() => s.mk('rect', { width: 8, height: 8, fill: C.deep, opacity: 0 }));
    return { p1, p2, fill, pk };
  });
  return {
    dur: 7,
    frame(t) {
      boxes[0].style.setProperty('stroke', C.ink);
      links.forEach((l, i) => {
        const st = 0.5 + i * 1.6;
        const g = seg(t, st, st + 0.8);
        set(l.fill, { x2: lerp(l.p1.x, l.p2.x, g), y2: lerp(l.p1.y, l.p2.y, g) });
        const on = seg(t, st + 0.7, st + 1.0);
        boxes[i + 1].style.setProperty('stroke', on > 0.5 ? C.ink : C.line);
        boxes[i + 1].style.setProperty('fill', on > 0.5 ? 'var(--color-accent-wash)' : C.surf);
        l.pk.forEach((p, k) => {
          const q = (((t - st - 0.8) * 0.7 + k / 3) % 1 + 1) % 1;
          set(p, {
            x: lerp(l.p1.x, l.p2.x, q) - 4,
            y: lerp(l.p1.y, l.p2.y, q) - 4,
            opacity: t > st + 0.8 ? 1 : 0,
          });
        });
      });
    },
  };
};

const SCENES: Record<string, Scene> = {
  'netflix-titles-etl-mysql': netflix,
  'can-mail-data-predict-housing-vacancy': housing,
  'grocery-transaction-data-warehouse': grocery,
  'sales-planning-analysis': sales,
  'lancaster-economic-indicators-dashboard': lancaster,
  'rfm-customer-segmentation': rfm,
  'bank-transaction-sql-analysis': bank,
  'medical-cost-regression': medical,
  'melbourne-housing-price-prediction': melbourne,
  'vacancy-nowcast-ml': nowcast,
};

let uidN = 0;

/** Build the SVG for one scene; returns its length and a frame function. */
function build(host: HTMLElement, key: string, phone: boolean, alt: string) {
  const meta = META[key];
  const W = phone ? 480 : 1200, H = phone ? 600 : 675;
  const svg = document.createElementNS(NS, 'svg') as SVGSVGElement;
  set(svg, { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': alt, preserveAspectRatio: 'xMidYMid meet' });
  svg.style.cssText = 'display:block;width:100%;height:100%';
  const mk: Stage['mk'] = (tag, a = {}, parent, text) => {
    const e = document.createElementNS(NS, tag) as El;
    for (const k in a) {
      if (k === 'fill' || k === 'stroke') e.style.setProperty(k, String(a[k]));
      else e.setAttribute(k, String(a[k]));
    }
    if (text != null) e.textContent = text;
    (parent ?? svg).appendChild(e);
    return e;
  };
  mk('rect', { x: 0, y: 0, width: W, height: H, fill: C.surf });
  const pad = phone ? 22 : 44;
  mk('rect', { x: pad, y: pad - 6, width: 9, height: 14, fill: C.acc });
  const lb = font(mk('text', { x: pad + 18, y: pad + 5, 'font-size': phone ? 11 : 13, fill: C.mute }, svg, meta.label.toUpperCase()), MONO);
  lb.style.letterSpacing = '0.06em';
  const tFs = phone ? 21 : 32;
  const tLines = wrap(meta.title, phone ? 30 : 62);
  font(para(mk, tLines, pad, pad + (phone ? 40 : 52), tFs * 1.2, { 'font-size': tFs, 'font-weight': 700, fill: C.ink }, svg), DISPLAY);
  const top = pad + (phone ? 40 : 52) + (tLines.length - 1) * tFs * 1.2 + (phone ? 26 : 34);
  const sLines = wrap(meta.source, phone ? 62 : 150);
  const sFs = phone ? 9.5 : 11;
  const sY = H - pad * 0.55 - (sLines.length - 1) * (sFs + 3);
  font(para(mk, sLines, pad, sY, sFs + 3, { 'font-size': sFs, fill: C.mute }, svg), MONO);
  const cFs = phone ? 15 : 21;
  const cLines = wrap(meta.caption, phone ? 38 : 96);
  const cY = sY - 22 - (cLines.length - 1) * cFs * 1.25;
  const cap = font(para(mk, cLines, pad, cY, cFs * 1.25, { 'font-size': cFs, 'font-weight': 700, fill: C.deep, opacity: 0 }, svg), DISPLAY);
  const stage: Stage = { W, H, phone, top, bottom: cY - cFs - 12, x0: pad, x1: W - pad, svg, mk, uid: 'm' + ++uidN };
  const scene = SCENES[key](stage);
  host.appendChild(svg);
  return {
    dur: scene.dur,
    frame: (t: number) => {
      scene.frame(t);
      cap.setAttribute('opacity', String(seg(t, scene.dur - 0.5, scene.dur + 0.5)));
    },
  };
}

export function initMotion(root: ParentNode = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mq = matchMedia('(max-width: 767px)');
  root.querySelectorAll<HTMLElement>('[data-motion]').forEach((host) => {
    const key = host.dataset.motion!;
    if (!SCENES[key]) return;
    const alt = host.dataset.alt ?? '';
    const compact = host.hasAttribute('data-compact');
    let player: ReturnType<typeof build> | null = null;
    let t = 0, last = 0, raf = 0, visible = false;
    const draw = () => player?.frame(Math.min(t, player.dur + 1));
    const tick = (now: number) => {
      raf = 0;
      if (!visible || !player) return;
      t += Math.min((now - last) / 1000, 0.05);
      last = now;
      if (t > player.dur + 6) t = 0;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (reduced || raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const mount = () => {
      host.querySelector('svg:not(.mg-replay svg)')?.remove();
      player = build(host, key, compact || mq.matches, alt);
      t = reduced ? player.dur + 1 : 0;
      draw();
    };
    const btn = host.querySelector<HTMLButtonElement>('[data-replay]');
    btn?.addEventListener('click', () => {
      t = 0;
      draw();
      play();
    });
    if (reduced && btn) btn.hidden = true;
    mq.addEventListener('change', () => player && mount());
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          visible = e.isIntersecting;
          if (visible) {
            if (!player) mount();
            play();
          } else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }),
      { threshold: 0.2 },
    ).observe(host);
  });
}
