// What the "Ask about Thanh" assistant knows, built from portfolio.ts so it
// never drifts from the site. knowledgeText() is published at
// /assistant-knowledge.json for the AI worker; quickAnswers back the
// assistant when the AI isn't connected.
import { credentials, education, experience, profile, projects, research, skills } from '../data/portfolio';

const SITE = 'https://thanhvu911.github.io';

export function knowledgeText(): string {
  const lines: string[] = [];
  lines.push(`# ${profile.name}`);
  lines.push(`Data engineer and data analyst based in ${profile.location}.`);
  lines.push(`Contact: email ${profile.email}; LinkedIn ${profile.linkedin}; GitHub ${profile.github}; contact section ${SITE}/#contact.`);
  lines.push(`Resumes: ${profile.resumes.map((r) => `${r.label} ${SITE}${r.href}`).join('; ')}.`);

  lines.push('\n## Education');
  lines.push(`${education.degree}, ${education.school} (${education.location}), ${education.date}. GPA 3.72 overall, 3.82 in the major. ${education.honors}.`);
  lines.push(`Research interests: ${research.interests}`);
  research.coursework.forEach((g) => lines.push(`${g.group} coursework: ${g.items.join(', ')}.`));
  lines.push(`Certifications: ${credentials.map((c) => `${c.title} (${c.detail.replaceAll(' · ', ', ')})`).join('; ')}.`);
  lines.push(`Leadership: ${research.leadership.title}, ${research.leadership.meta}. ${research.leadership.detail}`);

  lines.push('\n## Experience');
  experience.forEach((j) => {
    lines.push(`${j.role}, ${j.company}, ${j.location}, ${j.dates}. Tools: ${j.tech.join(', ')}.`);
    j.bullets.forEach((b) => lines.push(`- ${b}`));
  });

  lines.push('\n## Projects');
  projects.forEach((p) => {
    lines.push(`### ${p.title} (${p.year}; ${p.tags.join(', ')}) ${SITE}/projects/${p.slug}`);
    lines.push(p.summary);
    lines.push(`Problem: ${p.problem}`);
    lines.push(`Role: ${p.role}`);
    p.results.forEach((r) => lines.push(`- ${r}`));
  });
  research.projects
    .filter((p) => !p.slug)
    .forEach((p) => {
      lines.push(`### ${p.title} (${p.meta})`);
      p.bullets.forEach((b) => lines.push(`- ${b}`));
    });

  lines.push('\n## Skills');
  skills.forEach((g) => lines.push(`${g.group}: ${g.items.join(', ')}.`));
  return lines.join('\n');
}

export interface QuickAnswer {
  keys: string[];
  answer: string;
  link?: { href: string; label: string };
}

const current = experience[0];

export const quickAnswers: QuickAnswer[] = [
  {
    keys: ['contact', 'email', 'reach', 'phone', 'call', 'hire', 'interview', 'message', 'linkedin'],
    answer: `Email ${profile.email} or message Thanh on LinkedIn (linkedin.com/in/thanh25). A phone number is in the contact section, and Thanh usually replies within a day.`,
    link: { href: '/#contact', label: 'Go to contact' },
  },
  {
    keys: ['edc', 'current', 'now', 'fellow', 'job', 'lancaster county', 'apps script', 'center for regional analysis'],
    answer: `Thanh is a ${current.role} at ${current.company} (${current.dates}). ${current.bullets.join(' ')}`,
    link: { href: '/#experience', label: 'See experience' },
  },
  ...experience.slice(1).map((j) => ({
    keys: [j.company.split(',')[0].toLowerCase(), j.role.toLowerCase(), ...j.tech.map((t) => t.toLowerCase())],
    answer: `${j.role} at ${j.company}, ${j.location} (${j.dates}). ${j.bullets.join(' ')}`,
    link: { href: '/#experience', label: 'See experience' },
  })),
  {
    keys: ['gpa', 'education', 'degree', 'college', 'franklin', 'marshall', 'f&m', 'honors', 'graduated', 'major'],
    answer: `${education.degree} from ${education.school}, ${education.date}. GPA 3.72 overall and 3.82 in the major, with ${education.honors.replaceAll(' · ', ' and ')}.`,
    link: { href: '/academics', label: 'Open Academics' },
  },
  {
    keys: ['master', 'grad school', 'graduate school', 'admission', 'research', 'interests', 'phd', 'fall 2027', 'professor'],
    answer: `Research interests: ${research.interests} The Academics page has coursework, research projects, and the graduate school resume.`,
    link: { href: '/academics', label: 'Open Academics' },
  },
  {
    keys: ['ai', 'artificial intelligence', 'llm', 'gemini', 'machine learning', 'ml', 'model', 'models'],
    answer: `At EDC, Thanh built a Google Apps Script web app with a Gemini AI assistant that lets 6+ non-technical staff explore and maintain data. At KCC Capital Partners, Thanh trained statistical and machine-learning models that shortlisted 100+ likely buyers. Coursework covers AI (search, constraint satisfaction, Bayesian networks) and machine learning.`,
    link: { href: '/academics', label: 'Open Academics' },
  },
  {
    keys: ['skills', 'stack', 'tools', 'languages', 'python', 'sql', 'tech', 'technologies', 'know'],
    answer: skills.map((g) => `${g.group}: ${g.items.join(', ')}.`).join(' '),
    link: { href: '/#skills', label: 'See skills' },
  },
  {
    keys: ['certified', 'certification', 'certificate', 'dp-700', 'dp700', 'hackerrank'],
    answer: `${credentials.map((c) => `${c.title} (${c.detail.split(' · ').slice(-2).join(', ')})`).join('; ')}.`,
  },
  {
    keys: ['available', 'open to', 'relocate', 'relocation', 'remote', 'new york', 'where', 'based', 'location', 'roles'],
    answer: `Thanh is based in ${profile.location}. The fastest way to reach him is email: ${profile.email}.`,
    link: { href: '/#contact', label: 'Contact' },
  },
  {
    keys: ['resume', 'cv', 'download', 'pdf'],
    answer: `There are three one-page resumes: ${profile.resumes.map((r) => r.label).join(', ')}.`,
    link: { href: '/resume', label: 'Open resumes' },
  },
  ...projects.map((p) => ({
    keys: [...p.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3), ...p.tags.map((t) => t.toLowerCase())],
    answer: `${p.title}: ${p.summary} ${p.results[0]}`,
    link: { href: `/projects/${p.slug}`, label: 'Read the case study' },
  })),
  // "Which projects use X?" for every tool tagged on two or more projects.
  ...[...new Set(projects.flatMap((p) => p.tags))]
    .map((tag) => ({ tag, using: projects.filter((p) => p.tags.includes(tag)) }))
    .filter(({ using }) => using.length > 1)
    .map(({ tag, using }) => ({
      keys: [tag.toLowerCase(), 'projects', 'project', 'which'],
      answer: `Projects that use ${tag}: ${using.map((p) => p.title).join('; ')}.`,
      link: { href: '/projects', label: 'See all projects' },
    })),
];

export const suggestions = [
  'What does Thanh do at EDC?',
  'Which projects use Power BI?',
  'Tell me about the housing vacancy research',
  'What are Thanh’s research interests?',
  'How can I contact Thanh?',
];
