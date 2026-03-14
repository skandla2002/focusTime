#!/usr/bin/env node
/**
 * generate-preprompt.js
 *
 * Codex API 또는 웹 UI 사용 시 워크플로우 컨텍스트를 하나의 프롬프트로 조립합니다.
 * Codex CLI 사용 시에는 AGENTS.md가 자동으로 로드되므로 이 스크립트가 필요 없습니다.
 *
 * 실행 시 .workflowSvc/docs/architecture/structure.md 파일이 없으면 자동 생성합니다.
 *
 * 사용법:
 *   node .workflowSvc/ai/generate-preprompt.js              → stdout 출력
 *   node .workflowSvc/ai/generate-preprompt.js --out preprompt.txt → 파일 저장
 *   node .workflowSvc/ai/generate-preprompt.js --approved-only     → [x] 이슈만 포함
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ROOT = .workflowSvc/   PROJECT_ROOT = 프로젝트 루트 (.workflowSvc 상위)
const ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.dirname(ROOT);

// CLI 옵션 파싱
const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const outFile = outIdx !== -1 ? args[outIdx + 1] : null;
const approvedOnly = args.includes('--approved-only');

// ── 유틸 ──────────────────────────────────────────────────────────────
function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return `<!-- ${relPath} 파일 없음 -->`;
  return fs.readFileSync(full, 'utf-8').trimEnd();
}

// ── 프로젝트 구조 분석 ────────────────────────────────────────────────

/** structure.md 생성 시 스캔 제외 폴더 */
const SCAN_SKIP = new Set([
  '.workflowSvc', 'node_modules', '.git', '.claude',
  '.vscode', '.idea', 'dist', 'build', 'out', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '__pycache__',
  '.pytest_cache', '.mypy_cache', 'target', '.cache', '.turbo',
]);

/** 폴더명 → 역할 추론 테이블 */
const ROLE_MAP = {
  src:          '소스 코드 (주요 구현)',
  lib:          '공유 라이브러리',
  test:         '테스트 코드',
  tests:        '테스트 코드',
  __tests__:    '테스트 코드',
  spec:         '테스트/명세',
  specs:        '테스트/명세',
  components:   'UI 컴포넌트',
  pages:        '페이지/라우트',
  views:        '뷰 컴포넌트',
  app:          '앱 진입점/라우트',
  api:          'API 핸들러',
  routes:       '라우터',
  controllers:  '컨트롤러',
  services:     '서비스 계층',
  models:       '데이터 모델',
  schemas:      'DB 스키마',
  utils:        '유틸리티',
  helpers:      '헬퍼 함수',
  hooks:        '훅/이벤트 핸들러',
  middleware:   '미들웨어',
  config:       '설정 파일',
  configs:      '설정 파일',
  scripts:      '빌드/유틸 스크립트',
  public:       '정적 파일 (public)',
  static:       '정적 파일',
  assets:       '에셋 (이미지·폰트 등)',
  styles:       '스타일시트',
  css:          '스타일시트',
  scss:         '스타일시트 (SCSS)',
  types:        'TypeScript 타입 정의',
  interfaces:   '인터페이스 정의',
  store:        '상태 관리 (Store)',
  redux:        '상태 관리 (Redux)',
  context:      '컨텍스트 (React)',
  migrations:   'DB 마이그레이션',
  seeds:        'DB 시드 데이터',
  fixtures:     '테스트 픽스처',
  mocks:        '목(Mock) 데이터',
  i18n:         '국제화 (다국어)',
  locales:      '로케일/번역',
  plugins:      '플러그인',
  modules:      '모듈',
  packages:     '패키지 (모노레포)',
  bin:          '실행 바이너리',
};

function inferRole(name) {
  return ROLE_MAP[name.toLowerCase()] || '분석 필요';
}

/**
 * 디렉토리 트리를 텍스트 형태로 재귀 생성합니다 (디렉토리만, maxDepth까지).
 */
function buildTree(dir, prefix, depth, maxDepth) {
  if (depth > maxDepth) return '';
  let result = '';
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return '';
  }
  const dirs = entries
    .filter(e => e.isDirectory() && !SCAN_SKIP.has(e.name) && !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name));

  dirs.forEach((entry, idx) => {
    const isLast = idx === dirs.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = isLast ? '    ' : '│   ';
    result += `${prefix}${connector}${entry.name}/\n`;
    result += buildTree(path.join(dir, entry.name), prefix + childPrefix, depth + 1, maxDepth);
  });
  return result;
}

/**
 * 프로젝트 루트의 최상위 디렉토리 목록을 반환합니다 (SCAN_SKIP 및 숨김 폴더 제외).
 */
function getTopLevelDirs(rootDir) {
  try {
    return fs.readdirSync(rootDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !SCAN_SKIP.has(e.name) && !e.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(e => e.name);
  } catch {
    return [];
  }
}

/**
 * 거버넌스 폴더 현황을 분석합니다.
 * .workflowSvc/docs/governance/ 하위 파일 존재 여부를 확인합니다.
 */
function checkGovernance() {
  const govDir = path.join(ROOT, 'docs/governance');
  const files = {
    naming:   path.join(govDir, 'naming.md'),
    patterns: path.join(govDir, 'patterns.md'),
    style:    path.join(govDir, 'style.md'),
    jsFunc:   path.join(govDir, 'functions/javascript.md'),
    javaFunc: path.join(govDir, 'functions/java.md'),
  };
  return {
    exists:   fs.existsSync(govDir),
    naming:   fs.existsSync(files.naming),
    patterns: fs.existsSync(files.patterns),
    style:    fs.existsSync(files.style),
    jsFunc:   fs.existsSync(files.jsFunc),
    javaFunc: fs.existsSync(files.javaFunc),
  };
}

/**
 * structure.md 파일 내용을 생성합니다.
 *
 * 구조:
 *   1. High-level 폴더 역할 (표)        ← 자동 생성
 *   2. 폴더 트리                         ← 자동 생성
 *   3. 거버넌스 구조 권장                ← 자동 생성 (현황 포함)
 *   4. 상세 분석                         ← 폴더별 빈 섹션, AI/사람이 채워 넣음
 */
function generateStructureMd() {
  const today = new Date().toISOString().slice(0, 10);
  const topDirs = getTopLevelDirs(PROJECT_ROOT);
  const projectName = path.basename(PROJECT_ROOT);

  // 1) High-level 역할 테이블
  const roleRows = topDirs.length > 0
    ? topDirs.map(d => `| ${d}/ | ${inferRole(d)} |`).join('\n')
    : '| (소스 폴더 없음) | 프로젝트 소스를 추가한 후 다시 실행하세요 |';

  // 2) 폴더 트리 (디렉토리만, 3단계까지)
  const treeLines = buildTree(PROJECT_ROOT, '', 0, 3);

  // 3) 거버넌스 현황
  const gov = checkGovernance();
  const mark = (ok) => ok ? '✅' : '⬜';
  const govStatus = gov.exists
    ? [
        `| ${mark(gov.naming)}   | \`.workflowSvc/docs/governance/naming.md\`               | 폴더·클래스·파일 네이밍 규칙 |`,
        `| ${mark(gov.patterns)} | \`.workflowSvc/docs/governance/patterns.md\`             | 아키텍처·디자인 패턴 |`,
        `| ${mark(gov.style)}    | \`.workflowSvc/docs/governance/style.md\`               | 코드 스타일 가이드 |`,
        `| ${mark(gov.jsFunc)}   | \`.workflowSvc/docs/governance/functions/javascript.md\` | JavaScript/TypeScript 함수 거버넌스 |`,
        `| ${mark(gov.javaFunc)} | \`.workflowSvc/docs/governance/functions/java.md\`      | Java 함수 거버넌스 |`,
      ].join('\n')
    : '> ⚠ `.workflowSvc/docs/governance/` 폴더가 없습니다. `npm run preprompt` 재실행 또는 수동 생성하세요.';

  // 4) 상세 분석 섹션 (폴더별 빈 섹션)
  const detailSections = topDirs.length > 0
    ? topDirs.map(d => [
        `### ${d}/`,
        '',
        `<!-- AI에게 "${d}/ 상세 분석해줘"라고 요청하거나 .workflowSvc/workflow/1.brief.md에 작성하세요 -->`,
        '',
      ].join('\n')).join('\n')
    : '<!-- 소스 폴더를 추가한 후 분석을 요청하세요 -->\n';

  return [
    '# Project Structure',
    '',
    `> 자동 생성: ${today} | \`.workflowSvc/ai/generate-preprompt.js\``,
    '> ⚠ **High-level 표·트리·거버넌스 현황**은 자동 생성됩니다.',
    '> **상세 분석** 섹션은 AI에게 요청하거나 직접 작성하세요.',
    '',
    '---',
    '',
    '## High-level 폴더 역할',
    '',
    '| 경로 | 역할 |',
    '| ---- | ---- |',
    roleRows,
    '',
    '---',
    '',
    '## 폴더 트리',
    '',
    '```text',
    `${projectName}/`,
    treeLines.length > 0 ? treeLines.trimEnd() : '(소스 폴더 없음)',
    '```',
    '',
    '---',
    '',
    '## 거버넌스 구조 권장',
    '',
    '> 코드 일관성 유지를 위해 아래 거버넌스 파일을 작성합니다.',
    '> ✅ 작성됨  ⬜ 미작성 (클릭하여 작성)',
    '',
    '| 상태 | 파일 | 내용 |',
    '| ---- | ---- | ---- |',
    govStatus,
    '',
    '**Style 거버넌스** (`naming.md`, `patterns.md`, `style.md`)',
    '- **naming** — 폴더·클래스·파일·변수 네이밍 규칙 (kebab-case, PascalCase 등)',
    '- **patterns** — 아키텍처·디자인 패턴 및 금지 패턴',
    '- **style** — 코드 포맷·주석·import 순서·린트 설정 연동',
    '',
    '**함수 거버넌스** (`functions/`)',
    '- **javascript.md** — JS/TS 함수 선언·비동기·타입·에러 처리 규칙',
    '- **java.md** — Java 메서드·예외·Null 처리·어노테이션 규칙',
    '- 추가 언어 필요 시 `functions/{언어}.md` 파일을 생성하세요.',
    '',
    '---',
    '',
    '## 상세 분석',
    '',
    '> 아래 각 섹션은 해당 폴더의 상세 분석입니다.',
    '> AI에게 요청하거나 `.workflowSvc/workflow/1.brief.md`에 작성하면 채워집니다.',
    '',
    detailSections,
  ].join('\n');
}

// ── structure.md 존재 확인 및 자동 생성 ───────────────────────────────
const STRUCTURE_REL = 'docs/architecture/structure.md';
const structureFullPath = path.join(ROOT, STRUCTURE_REL);

if (!fs.existsSync(structureFullPath)) {
  const content = generateStructureMd();
  fs.mkdirSync(path.dirname(structureFullPath), { recursive: true });
  fs.writeFileSync(structureFullPath, content, 'utf-8');
  process.stderr.write(`✓ structure.md 자동 생성 → ${structureFullPath}\n`);
}

// ── plan.md 파싱 ──────────────────────────────────────────────────────
/**
 * plan.md에서 [x] 승인된 이슈 섹션만 추출합니다.
 * approvedOnly=false면 전체 내용을 반환합니다.
 */
function processPlan(content, filterApproved) {
  if (!filterApproved) return content;

  const lines = content.split('\n');

  // 이슈 목록에서 [x] 항목 제목 수집
  const approvedTitles = new Set();
  for (const line of lines) {
    const m = line.match(/^- \[x\]\s+(ISSUE-\d+)/i);
    if (m) approvedTitles.add(m[1]);
  }

  if (approvedTitles.size === 0) return '<!-- 승인된 이슈 없음 -->';

  // 이슈 상세 섹션 분리 (### ISSUE-XXX: 기준)
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^### (ISSUE-\d+):/i);
    if (heading) {
      if (current) sections.push(current);
      current = { id: heading[1], lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);

  // 승인된 섹션만 필터
  const approved = sections
    .filter(s => approvedTitles.has(s.id))
    .map(s => s.lines.join('\n'));

  // 이슈 목록 (승인 항목만) + 상세
  const listLines = lines
    .filter(l => /^- \[x\]/i.test(l))
    .join('\n');

  return `## 승인된 이슈 목록\n\n${listLines}\n\n---\n\n## 이슈 상세\n\n${approved.join('\n\n---\n\n')}`;
}

// ── 조립 ──────────────────────────────────────────────────────────────
const sections = [
  {
    title: 'PROJECT CONTEXT',
    content: [
      'AI와 사람이 함께 협업하는 SDLC 템플릿 프로젝트입니다.',
      '워크플로우: BRIEF → PLAN → DO → REVIEW → COMMIT → DOCS',
      '',
      '핵심 규칙:',
      '- [x] 항목만 실행, 미승인 항목 절대 금지',
      '- 소스 수정 시 단위 테스트 필수',
      '- 이슈 전환 전 커밋 먼저',
      '- 판단 필요 시 사람에게 먼저 확인',
    ].join('\n'),
  },
  {
    title: 'PROJECT STRUCTURE (.workflowSvc/docs/architecture/structure.md)',
    content: readFile(STRUCTURE_REL),
  },
  {
    title: 'RULES (.workflowSvc/ai/rules.md)',
    content: readFile('ai/rules.md'),
  },
  {
    title: 'WORKFLOW RULES (.workflowSvc/ai/workflow-rules.md)',
    content: readFile('ai/workflow-rules.md'),
  },
  {
    title: 'FILE MAP (.workflowSvc/ai/file-map.md)',
    content: readFile('ai/file-map.md'),
  },
  {
    title: 'CURRENT BRIEF (.workflowSvc/workflow/1.brief.md)',
    content: readFile('workflow/1.brief.md'),
  },
  {
    title: `CURRENT PLAN (.workflowSvc/workflow/2.plan.md)${approvedOnly ? ' — 승인 이슈만' : ''}`,
    content: processPlan(readFile('workflow/2.plan.md'), approvedOnly),
  },
];

const separator = '\n\n' + '='.repeat(60) + '\n\n';
const preprompt =
  '# AI SESSION PREPROMPT\n' +
  `# Generated: ${new Date().toISOString()}\n` +
  `# Mode: ${approvedOnly ? 'approved-only' : 'full'}\n` +
  separator +
  sections
    .map(s => `## ${s.title}\n\n${s.content}`)
    .join(separator);

// ── 출력 ──────────────────────────────────────────────────────────────
if (outFile) {
  const outPath = path.resolve(outFile);
  fs.writeFileSync(outPath, preprompt, 'utf-8');
  console.log(`Preprompt saved → ${outPath}`);
  console.log(`Size: ${(preprompt.length / 1024).toFixed(1)} KB`);
} else {
  process.stdout.write(preprompt + '\n');
}
