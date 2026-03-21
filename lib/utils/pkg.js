import { readFile } from 'node:fs/promises';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const pkgContent = await readFile(new URL('../../package.json', import.meta.url), 'utf8');

/** @type {import('peowly').PackageJsonLike} */
export const pkg = JSON.parse(pkgContent);
