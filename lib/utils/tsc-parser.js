/**
 * Parser for TypeScript compiler output
 * Extracts diagnostic messages from tsc output for formatting
 */

/**
 * Strip ANSI color codes from a string
 *
 * @param {string} str
 * @returns {string}
 */
function stripAnsi (str) {
  // eslint-disable-next-line no-control-regex
  return str.replaceAll(/\u001B\[[0-9;]*m/g, '');
}

/**
 * Regex to match the start of a tsc error line
 * Format: filename(line,col): error TS<code>: message
 * or: filename:line:col - error TS<code>: message
 */
const TSC_ERROR_PATTERN = /^[^:]+(?:\(\d+,\d+\):|:\d+:\d+) - error TS\d+: (.+)$/;

/**
 * Check if a line is a tsc watch status message
 *
 * @param {string} line
 * @returns {boolean}
 */
function isWatchStatusLine (line) {
  // Watch status messages typically have timestamps like [9:46:07 AM]
  return /^\[\d{1,2}:\d{2}:\d{2} [AP]M\]/.test(line);
}

/**
 * Check if a line is a tsc summary line
 *
 * @param {string} line
 * @returns {boolean}
 */
function isSummaryLine (line) {
  return /^Found \d+ errors?\.?/.test(line) ||
         /^Errors\s+Files/.test(line) ||
         /^\s+\d+\s+/.test(line); // Summary table rows
}

/**
 * Extract diagnostic message from a tsc error line
 *
 * @param {string} line
 * @returns {string | undefined}
 */
function extractDiagnosticMessage (line) {
  const cleanLine = stripAnsi(line);
  const match = cleanLine.match(TSC_ERROR_PATTERN);
  return match?.[1];
}

/**
 * Parse tsc output stream and extract error blocks
 *
 * @param {AsyncIterable<string>} lines
 * @returns {AsyncIterable<string>}
 */
export async function * parseTscErrors (lines) {
  for await (const line of lines) {
    const cleanLine = stripAnsi(line);

    // Skip watch status messages
    if (isWatchStatusLine(cleanLine)) {
      continue;
    }

    // Skip summary lines
    if (isSummaryLine(cleanLine)) {
      continue;
    }

    // Check if this is an error line and extract the diagnostic message
    const diagnostic = extractDiagnosticMessage(line);
    if (diagnostic) {
      yield diagnostic;
    }
  }
}
