import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { letterSchema, tagTopics } from '../src/lib/publishing.mjs';
import { assertSlug } from './cli.mjs';

/** @param {string} source */
export function parseLetter(source) {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error('Letter must start with YAML front matter.');
  return { data: letterSchema.parse(parse(match[1])), body: source.slice(match[0].length) };
}

/** @param {string} directory */
export async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (entry.isFile()) result.push(file);
    else throw new Error(`Unsupported filesystem entry: ${file}`);
  }
  return result.sort();
}

/** @param {string} [root] */
export async function readLetters(root = process.cwd()) {
  const directory = path.join(root, 'src', 'content', 'letter');
  const letters = [];
  for (const file of await walk(directory)) {
    if (!file.endsWith('.md')) continue;
    const id = path.relative(directory, file).split(path.sep).join('/').slice(0, -3);
    try {
      assertSlug(id);
      letters.push({ id, ...parseLetter(await readFile(file, 'utf8')) });
    } catch (error) {
      throw new Error(`Invalid letter ${file}: ${error instanceof Error ? error.message : error}`, { cause: error });
    }
  }
  tagTopics(letters);
  return letters;
}

/** @param {{ id: string, data: { draft: boolean } }[]} letters @param {string} tracker */
export function assertEditorialApproval(letters, tracker) {
  for (const post of letters.filter((entry) => !entry.data.draft)) {
    const sourcePath = `src/content/letter/${post.id}.md`;
    const rows = tracker.split(/\r?\n/).filter((line) => line.startsWith('|') && line.includes(`](${sourcePath})`));
    if (rows.length !== 1) throw new Error(`${post.id}: expected exactly one review-tracker row.`);
    const cells = rows[0].split('|').slice(1, -1).map((cell) => cell.trim());
    if (!/^\[x\]$/i.test(cells[3]) || !/^\[x\]$/i.test(cells[4])) {
      throw new Error(`${post.id}: author must mark Reviewed and Approved in DRAFT-REVIEW-TRACKER.md before draft: false.`);
    }
  }
}
