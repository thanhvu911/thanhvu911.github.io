// Caption track for each Power BI recording, built from src/data/videoGuides.ts.
import type { APIRoute } from 'astro';
import { videoGuides } from '../../data/videoGuides';

export function getStaticPaths() {
  return Object.keys(videoGuides).map((slug) => ({ params: { slug } }));
}

const stamp = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(3).padStart(6, '0');
  return `00:${String(m).padStart(2, '0')}:${sec}`;
};

export const GET: APIRoute = ({ params }) => {
  const { steps, duration } = videoGuides[params.slug!];
  const cues = steps.map((step, i) => {
    const end = steps[i + 1]?.at ?? duration;
    return `${i + 1}\n${stamp(step.at)} --> ${stamp(end)}\n${step.text}`;
  });
  return new Response(`WEBVTT\n\n${cues.join('\n\n')}\n`, { headers: { 'Content-Type': 'text/vtt; charset=utf-8' } });
};
