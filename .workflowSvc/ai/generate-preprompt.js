#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const WORKFLOW_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.dirname(WORKFLOW_ROOT);

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outFile = outIndex >= 0 ? args[outIndex + 1] : null;
const approvedOnly = args.includes('--approved') || args.includes('--approved-only');

const SKIP_DIRS = new Set([
  '.git',
  '.idea',
  '.vscode',
  '.workflowSvc',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
]);

function readWorkflowFile(relativePath) {
  const fullPath = path.join(WORKFLOW_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    return `<!-- Missing: ${relativePath} -->`;
  }
  return fs.readFileSync(fullPath, 'utf8').trimEnd();
}

function listTopLevelDirectories() {
  return fs
    .readdirSync(PROJECT_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function roleForDirectory(name) {
  const roles = {
    public: 'Static assets served directly by Vite.',
    src: 'React application source, screens, stores, types, and utilities.',
  };
  return roles[name] ?? 'Project-specific source or assets.';
}

function buildDirectoryTree(directory, prefix = '', depth = 0, maxDepth = 3) {
  if (depth >= maxDepth) {
    return [];
  }

  const children = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.'))
    .sort((left, right) => left.name.localeCompare(right.name));

  return children.flatMap((entry, index) => {
    const isLast = index === children.length - 1;
    const branch = `${prefix}${isLast ? '└── ' : '├── '}${entry.name}/`;
    const nextPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
    return [branch, ...buildDirectoryTree(path.join(directory, entry.name), nextPrefix, depth + 1, maxDepth)];
  });
}

function hasJavaSources() {
  return (
    fs.existsSync(path.join(PROJECT_ROOT, 'pom.xml')) ||
    fs.existsSync(path.join(PROJECT_ROOT, 'build.gradle')) ||
    fs.existsSync(path.join(PROJECT_ROOT, 'build.gradle.kts')) ||
    fs.existsSync(path.join(PROJECT_ROOT, 'src', 'main', 'java'))
  );
}

function buildStructureDocument() {
  const topDirectories = listTopLevelDirectories();
  const projectName = path.basename(PROJECT_ROOT);
  const tree = buildDirectoryTree(PROJECT_ROOT);
  const javaSupported = hasJavaSources();

  const roleRows =
    topDirectories.length > 0
      ? topDirectories.map((name) => `| ${name}/ | ${roleForDirectory(name)} |`).join('\n')
      : '| (none) | Add source directories and rerun `npm run preprompt`. |';

  const governanceRows = [
    '| OK | `.workflowSvc/docs/governance/naming.md` | Naming conventions |',
    '| OK | `.workflowSvc/docs/governance/patterns.md` | Preferred architectural patterns |',
    '| OK | `.workflowSvc/docs/governance/style.md` | Shared code style guidance |',
    '| OK | `.workflowSvc/docs/governance/functions/javascript.md` | JavaScript and TypeScript function rules |',
    `| ${javaSupported ? 'OK' : 'N/A'} | \`.workflowSvc/docs/governance/functions/java.md\` | ${javaSupported ? 'Java function rules' : 'Template-only reference; Java is not used in this project.'} |`,
  ].join('\n');

  return [
    '# Project Structure',
    '',
    `> Auto-generated: ${new Date().toISOString().slice(0, 10)} by \`.workflowSvc/ai/generate-preprompt.js\``,
    '> Review this file at session start to confirm the live project layout.',
    '',
    '---',
    '',
    '## High-level Directory Roles',
    '',
    '| Path | Role |',
    '| ---- | ---- |',
    roleRows,
    '',
    '---',
    '',
    '## Directory Tree',
    '',
    '```text',
    `${projectName}/`,
    ...(tree.length > 0 ? tree : ['(no source directories detected)']),
    '```',
    '',
    '---',
    '',
    '## Governance Status',
    '',
    '| Status | File | Purpose |',
    '| ---- | ---- | ---- |',
    governanceRows,
    '',
    '---',
    '',
    '## Detailed Notes',
    '',
    '### public/',
    '',
    '- Holds static assets such as the timer SVG used by the app shell.',
    '',
    '### src/',
    '',
    '- `screens/` contains the main app views for home, timer, statistics, and goals.',
    '- `store/` contains Zustand state for navigation, timer progress, study records, and goals.',
    '- `components/` contains navigation and placeholder AdMob surfaces.',
    '- `utils/` contains time formatting helpers and localStorage persistence.',
    '- `types/` contains app-wide domain types and timer constants.',
  ].join('\n');
}

function ensureStructureDocument() {
  const structurePath = path.join(WORKFLOW_ROOT, 'docs', 'architecture', 'structure.md');
  fs.mkdirSync(path.dirname(structurePath), { recursive: true });
  fs.writeFileSync(structurePath, `${buildStructureDocument()}\n`, 'utf8');
}

function processPlan(content) {
  if (!approvedOnly) {
    return content;
  }

  const approvedIds = new Set();
  for (const line of content.split('\n')) {
    const match = line.match(/^- \[x\]\s+(ISSUE-\d+)/i);
    if (match) {
      approvedIds.add(match[1].toUpperCase());
    }
  }

  if (approvedIds.size === 0) {
    return '<!-- No approved issues found in 2.plan.md -->';
  }

  const lines = content.split('\n');
  const approvedList = lines.filter((line) => /^- \[x\]/i.test(line)).join('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    const heading = line.match(/^### (ISSUE-\d+):/i);
    if (heading) {
      if (current) {
        sections.push(current);
      }
      current = {
        id: heading[1].toUpperCase(),
        lines: [line],
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  const approvedSections = sections
    .filter((section) => approvedIds.has(section.id))
    .map((section) => section.lines.join('\n'));

  return [
    '## Approved Issue List',
    '',
    approvedList,
    '',
    '---',
    '',
    '## Approved Issue Details',
    '',
    approvedSections.join('\n\n---\n\n'),
  ].join('\n');
}

function buildPreprompt() {
  ensureStructureDocument();

  const sections = [
    {
      title: 'PROJECT CONTEXT',
      content: [
        'FocusTimer is a React + TypeScript study timer app built on the SDLC template.',
        'Workflow order: BRIEF -> PLAN -> DO -> REVIEW -> COMMIT -> DOCS.',
        '',
        'Core execution rules:',
        '- Only work on `[x]` issues from `2.plan.md`.',
        '- Run tests or verification appropriate to the touched files.',
        '- Commit before moving to the next issue when the workflow requires it.',
        '- Ask the human before making judgment calls with hidden product risk.',
      ].join('\n'),
    },
    {
      title: 'PROJECT STRUCTURE (.workflowSvc/docs/architecture/structure.md)',
      content: readWorkflowFile('docs/architecture/structure.md'),
    },
    {
      title: 'RULES (.workflowSvc/ai/rules.md)',
      content: readWorkflowFile('ai/rules.md'),
    },
    {
      title: 'WORKFLOW RULES (.workflowSvc/ai/workflow-rules.md)',
      content: readWorkflowFile('ai/workflow-rules.md'),
    },
    {
      title: 'FILE MAP (.workflowSvc/ai/file-map.md)',
      content: readWorkflowFile('ai/file-map.md'),
    },
    {
      title: 'CURRENT BRIEF (.workflowSvc/workflow/1.brief.md)',
      content: readWorkflowFile('workflow/1.brief.md'),
    },
    {
      title: `CURRENT PLAN (.workflowSvc/workflow/2.plan.md)${approvedOnly ? ' - approved only' : ''}`,
      content: processPlan(readWorkflowFile('workflow/2.plan.md')),
    },
  ];

  const separator = `\n\n${'='.repeat(60)}\n\n`;
  return (
    '# AI SESSION PREPROMPT\n' +
    `# Generated: ${new Date().toISOString()}\n` +
    `# Mode: ${approvedOnly ? 'approved-only' : 'full'}\n` +
    separator +
    sections.map((section) => `## ${section.title}\n\n${section.content}`).join(separator)
  );
}

const preprompt = `${buildPreprompt()}\n`;

if (outFile) {
  const fullOutputPath = path.resolve(outFile);
  fs.writeFileSync(fullOutputPath, preprompt, 'utf8');
  process.stdout.write(`Preprompt saved to ${fullOutputPath}\n`);
} else {
  process.stdout.write(preprompt);
}
