import { readFile } from 'node:fs/promises';

/**
 * @returns {Promise<import('peowly').PackageJsonLike>}
 */
export async function readPkg () {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const pkgContent = await readFile(new URL('../../package.json', import.meta.url), 'utf8');

  return JSON.parse(pkgContent);
}
