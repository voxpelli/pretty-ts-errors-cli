/* eslint-disable security/detect-non-literal-fs-filename */
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * @param {string} name
 * @returns {string}
 */
export const fixturePath = (name) => fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

/**
 * @param {string} name
 * @returns {Promise<string>}
 */
export const readFixture = (name) => readFile(fixturePath(name), 'utf8');

/** @returns {import('node:fs').ReadStream} */
export const inputStream = () => createReadStream(fixturePath('input.txt'));
