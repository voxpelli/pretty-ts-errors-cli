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
  // Watch status messages typically have timestamps like [9:46:07 AM] or [21:46:07]
  return /^\[\d{1,2}:\d{2}:\d{2}(?:\s?(?:AM|PM))?\]/i.test(line);
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
         /^\s+\d+\s+\S/.test(line); // Summary table rows (with at least one non-whitespace after the number)
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
 * Parse input stream and extract diagnostic messages
 * Handles both tsc output format and plain diagnostic messages
 *
 * @param {AsyncIterable<string>} lines
 * @returns {AsyncIterable<string>}
 */
export async function * parseTscErrors (lines) {
  /** @type {string[]} */
  const currentMessage = [];
  let isTscFormat = false;
  let hasSeenAnyLine = false;

  for await (const line of lines) {
    const cleanLine = stripAnsi(line);
    hasSeenAnyLine = true;

    // Skip watch status messages
    if (isWatchStatusLine(cleanLine)) {
      continue;
    }

    // Skip summary lines
    if (isSummaryLine(cleanLine)) {
      continue;
    }

    // Check if this is a tsc error line and extract the diagnostic message
    const diagnostic = extractDiagnosticMessage(line);
    if (diagnostic) {
      // This is tsc format - yield the extracted diagnostic
      isTscFormat = true;
      yield diagnostic;
    } else if (!isTscFormat) {
      // Not tsc format - accumulate lines as a plain diagnostic message
      currentMessage.push(line);
    }
  }

  // If we accumulated a plain diagnostic message, yield it
  // Add back the final newline that readline strips from the last line
  if (currentMessage.length > 0 && hasSeenAnyLine) {
    yield currentMessage.join('\n') + '\n';
  }
}
