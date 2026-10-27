import type { MarkdownInstance } from 'astro';

export interface NoteFrontmatter {
  title: string;
  description: string;
  date: string; // ISO date
  project: string; // project slug the note draws on
  cover: string; // image file inside that project's assets folder
  readingTime: string;
}

const modules = import.meta.glob<MarkdownInstance<NoteFrontmatter>>('/src/pages/notes/*.md', { eager: true });

export const notes = Object.values(modules)
  .map((m) => ({ ...m.frontmatter, url: m.url! }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
