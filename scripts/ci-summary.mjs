// Builds the weekly-run summary from the Playwright JSON report (reports/results.json).
// Writes:
//   - the job summary to $GITHUB_STEP_SUMMARY
//   - reports/issue-body.md (used for the "Weekly run failures" issue)
//   - outputs to $GITHUB_OUTPUT: has_results, failed, date
// Usage: node scripts/ci-summary.mjs [path/to/results.json]
import fs from 'node:fs';
import path from 'node:path';

const resultsPath = process.argv[2] ?? 'reports/results.json';
const runUrl = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : '';
const MAX_ROWS = 200; // keeps the issue body under GitHub's 65,536-character limit

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

function writeSummary(md) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  else process.stdout.write(md);
}

if (!fs.existsSync(resultsPath)) {
  writeSummary(`## Weekly NuMaa test run\n\nNo test results found (${resultsPath}). The test step did not finish; check the job log.\n`);
  setOutput('has_results', 'false');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const stats = report.stats ?? {};
const date = new Date(stats.startTime ?? Date.now()).toISOString().slice(0, 10); // UTC date of the run

const stripAnsi = (s) => s.replace(/\u001b\[[0-9;]*m/g, '');
const cell = (s) => s.replace(/\|/g, '\\|').replace(/`/g, "'").trim();

function firstErrorLine(test) {
  for (const result of test.results ?? []) {
    const errors = result.errors?.length ? result.errors : result.error ? [result.error] : [];
    for (const e of errors) {
      const line = stripAnsi(e.message ?? e.value ?? '').split('\n').map((l) => l.trim()).find(Boolean);
      if (line) return line.length > 200 ? `${line.slice(0, 197)}...` : line;
    }
  }
  return '(no error message)';
}

// Test IDs are the leading token of the title, e.g. "DASH-03: ..." or "MTM-H01 [HIGH]: ...".
function testId(title) {
  const m = title.trim().match(/^([A-Z][A-Z0-9]*-[A-Z0-9-]+)/);
  return m ? m[1] : title.trim().slice(0, 60);
}

const failed = [];
const flaky = [];
function walk(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const row = { id: testId(spec.title), loc: `${spec.file}:${spec.line}`, project: test.projectName, error: firstErrorLine(test) };
      if (test.status === 'unexpected') failed.push(row);
      else if (test.status === 'flaky') flaky.push(row);
    }
  }
  for (const child of suite.suites ?? []) walk(child);
}
for (const suite of report.suites ?? []) walk(suite);

// Crisis-safety tests first, then by spec location
const priority = (r) => (/^MTM-H(01|09)$/.test(r.id) ? 0 : 1);
const byPriority = (a, b) => priority(a) - priority(b) || a.loc.localeCompare(b.loc, undefined, { numeric: true });
failed.sort(byPriority);
flaky.sort(byPriority);

function table(rows) {
  const lines = ['| Test ID | Spec:line | First line of error |', '|---|---|---|'];
  for (const r of rows.slice(0, MAX_ROWS)) lines.push(`| ${cell(r.id)} | \`${cell(r.loc)}\` | ${cell(r.error)} |`);
  if (rows.length > MAX_ROWS) lines.push(`| ... | | ${rows.length - MAX_ROWS} more; see the HTML report |`);
  return lines.join('\n');
}

const counts = [
  '| Passed | Failed | Flaky | Skipped |',
  '|---|---|---|---|',
  `| ${stats.expected ?? 0} | ${stats.unexpected ?? 0} | ${stats.flaky ?? 0} | ${stats.skipped ?? 0} |`,
].join('\n');

let md = `## Weekly NuMaa test run – ${date}\n\n${counts}\n\n`;
md += failed.length ? `### Failed tests (${failed.length})\n\n${table(failed)}\n\n` : 'No failed tests.\n\n';
if (flaky.length) md += `### Flaky tests (${flaky.length}, failed then passed on retry)\n\n${table(flaky)}\n\n`;
if (runUrl) md += `[Run log and playwright-report artifact](${runUrl})\n`;

writeSummary(md);
fs.mkdirSync(path.dirname(resultsPath), { recursive: true });
fs.writeFileSync(path.join(path.dirname(resultsPath), 'issue-body.md'), md);
setOutput('has_results', 'true');
setOutput('failed', String(failed.length));
setOutput('date', date);
