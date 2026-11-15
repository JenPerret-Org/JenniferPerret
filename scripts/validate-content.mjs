import { readFile } from 'node:fs/promises';
import { assertEditorialApproval, readLetters } from './content.mjs';

const letters = await readLetters();
assertEditorialApproval(letters, await readFile('DRAFT-REVIEW-TRACKER.md', 'utf8'));
console.log(`Validated ${letters.length} letters and author-approval gates.`);
