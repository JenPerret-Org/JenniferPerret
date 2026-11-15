import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { stringify } from 'yaml';
import { letterSchema } from '../src/lib/publishing.mjs';
import { assertSlug, isMain } from './cli.mjs';

/** @param {{ slug: string, title: string, pillar?: string, date?: string, tags?: string }} options @param {string} [root] */
export async function createPost(options, root = process.cwd()) {
  const slug = assertSlug(options.slug);
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('Use a valid YYYY-MM-DD date.');
  }
  const metadata = {
    title: options.title,
    description: 'Replace with a concise, accurate summary before publication.',
    pubDate: date,
    tags: options.tags ? options.tags.split(',').map((tag) => tag.trim()) : [],
    pillar: options.pillar ?? 'ai-general',
    draft: true,
  };
  letterSchema.parse(metadata);
  const trackerPath = path.join(root, 'DRAFT-REVIEW-TRACKER.md');
  const tracker = await readFile(trackerPath, 'utf8');
  if (!tracker.includes('## Progress')) throw new Error('Review tracker is missing its Progress section.');
  const sourcePath = `src/content/letter/${slug}.md`;
  if (tracker.includes(`](${sourcePath})`)) throw new Error('This post already has a review-tracker entry.');
  const title = options.title.replace(/[\r\n|[\]]/g, ' ');
  const row = `| - | [${title}](${sourcePath}) | ${date} | [ ] | [ ] | Awaiting author review |`;
  const rows = tracker.split(/\r?\n/);
  const later = rows.findIndex((line) => /^\| [^|]+ \|.*\| \d{4}-\d{2}-\d{2} \|/.test(line) &&
    line.split('|')[3].trim() > date);
  const insertion = later >= 0 ? later : rows.findIndex((line) => line === '## Progress') - 1;
  rows.splice(insertion, 0, row);
  const trackedRows = rows.filter((line) => /^\| [^|]+ \|.*\| \d{4}-\d{2}-\d{2} \|/.test(line));
  const reviewed = trackedRows.filter((line) => /^\[x\]$/i.test(line.split('|')[4].trim())).length;
  const approved = trackedRows.filter((line) => /^\[x\]$/i.test(line.split('|')[5].trim())).length;
  const updatedTracker = rows.join('\n')
    .replace(/- Reviewed: \d+ \/ \d+/, `- Reviewed: ${reviewed} / ${trackedRows.length}`)
    .replace(/- Approved: \d+ \/ \d+/, `- Approved: ${approved} / ${trackedRows.length}`);
  const file = path.join(root, 'src', 'content', 'letter', `${slug}.md`);
  await writeFile(file, `---\n${stringify(metadata)}---\n\nWrite your letter here.\n`, { flag: 'wx' });
  try {
    await writeFile(trackerPath, updatedTracker);
  } catch (error) {
    throw new Error(`Draft created at ${file}, but tracker update failed. Add its unapproved row manually before proceeding.`, { cause: error });
  }
  return file;
}

if (isMain(import.meta.url)) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { title: { type: 'string' }, pillar: { type: 'string' }, date: { type: 'string' }, tags: { type: 'string' } },
  });
  if (positionals.length !== 1 || !values.title) {
    throw new Error('Usage: npm run post:new -- my-next-letter --title "My next letter" [--pillar ai-general] [--date YYYY-MM-DD] [--tags ai,governance]');
  }
  console.log(`Created draft: ${await createPost({ ...values, slug: positionals[0], title: values.title })}`);
  console.log('Registered as unreviewed and unapproved. Preview locally with npm run dev.');
}
