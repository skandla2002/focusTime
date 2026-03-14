#!/usr/bin/env node
/**
 * finalize-docs.js
 *
 * workflow/3.review.md에서 체크리스트 전체 완료([x]) 이슈를 감지하여
 * 해당 내용을 docs/ 산출물 파일에 자동 반영합니다.
 *
 * 처리 대상:
 *   - docs/changelog.md        : 모든 완료 이슈
 *   - docs/api/api-spec.md     : "변경 API" 체크된 이슈
 *   - docs/decisions/adr-template.md : "주요 결정" 체크된 이슈
 *
 * review.md 완료 이슈는 제목에 [완료] 태그를 추가하여 재처리를 방지합니다.
 *
 * 사용법:
 *   node ai/finalize-docs.js
 *   npm run docs:finalize
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf-8');
}

function writeFile(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content, 'utf-8');
}

// ── review.md 파싱 ─────────────────────────────────────────────────────
/**
 * review.md의 ## 기록 섹션에서 이슈 단위로 분리합니다.
 * 반환: Array<{ raw, heading, date, summary, checks, isComplete, alreadyDone }>
 */
function parseReviews(content) {
  const recordsStart = content.indexOf('## 기록');
  if (recordsStart === -1) return [];

  const recordsSection = content.slice(recordsStart);
  // ### [ISSUE-XXX] 제목 — YYYY-MM-DD 또는 ### [완료] [ISSUE-XXX] ...
  const issuePattern = /^(### .+)$/gm;

  const positions = [];
  let m;
  while ((m = issuePattern.exec(recordsSection)) !== null) {
    positions.push({ index: m.index, heading: m[1] });
  }

  const reviews = [];
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = i + 1 < positions.length ? positions[i + 1].index : recordsSection.length;
    const raw = recordsSection.slice(start, end).trimEnd();
    const heading = positions[i].heading;

    const alreadyDone = heading.includes('[완료]');

    // 날짜 추출 — YYYY-MM-DD
    const dateMatch = heading.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);

    // 이슈 번호 + 제목 추출
    const titleMatch = heading.match(/###\s+(?:\[완료\]\s+)?\[?(ISSUE-\d+)\]?\s+(.+?)\s*(?:—|-)\s*\d{4}/);
    const issueId = titleMatch ? titleMatch[1] : 'ISSUE-???';
    const issueTitle = titleMatch ? titleMatch[2].trim() : heading;

    // 수정사항 요약 (첫 번째 비헤딩 줄)
    const summaryMatch = raw.match(/^수정사항:\s*(.+)$/m);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // 체크리스트 분석
    const checks = {
      requirements: /- \[x\] 요구사항/.test(raw),
      exceptions:   /- \[x\] 예외 케이스/.test(raw),
      tests:        /- \[x\] 단위 테스트/.test(raw),
      rules:        /- \[x\] ai\/rules\.md/.test(raw),
      dod:          /- \[x\] docs\/specs\/dod\.md/.test(raw),
      api:          /- \[x\] 변경 API/.test(raw),
      decisions:    /- \[x\] 주요 결정/.test(raw),
      committed:    /- \[x\] 커밋 완료/.test(raw),
    };

    // 전체 완료 여부 (모든 체크가 true)
    const isComplete = Object.values(checks).every(Boolean);

    reviews.push({ raw, heading, issueId, issueTitle, date, summary, checks, isComplete, alreadyDone });
  }

  return reviews;
}

// ── docs/changelog.md 업데이트 ────────────────────────────────────────
function appendChangelog(content, review) {
  const entry = [
    '',
    `### [${review.issueId}] ${review.issueTitle} — ${review.date}`,
    review.summary ? `- ${review.summary}` : '- (상세 내용은 workflow/3.review.md 참조)',
  ].join('\n');

  // ## [Unreleased] 섹션 아래에 삽입
  const marker = '## [Unreleased]';
  const idx = content.indexOf(marker);
  if (idx === -1) return content + entry + '\n';

  // 이미 같은 이슈가 있으면 건너뜀
  if (content.includes(`[${review.issueId}]`)) return null;

  const insertAt = content.indexOf('\n', idx) + 1;
  return content.slice(0, insertAt) + entry + '\n' + content.slice(insertAt);
}

// ── docs/api/api-spec.md 업데이트 ────────────────────────────────────
function appendApiNote(content, review) {
  if (content.includes(`[${review.issueId}]`)) return null;

  const entry = [
    '',
    `### [${review.issueId}] ${review.issueTitle} — ${review.date}`,
    '',
    '- **엔드포인트 / 인터페이스**: _(구현 내용 직접 기입)_',
    '- **설명**: _(구현 내용 직접 기입)_',
    '- **변경 사유**: ' + (review.summary || '(상세 내용은 workflow/3.review.md 참조)'),
    '',
  ].join('\n');

  const marker = '## API 목록';
  const idx = content.indexOf(marker);
  if (idx === -1) return content + entry;

  const insertAt = content.indexOf('\n', idx) + 1;
  return content.slice(0, insertAt) + entry + content.slice(insertAt);
}

// ── docs/decisions/adr-template.md 업데이트 ──────────────────────────
function appendAdr(content, review) {
  if (content.includes(`[${review.issueId}]`)) return null;

  // 현재 ADR 번호 계산
  const adrMatches = content.match(/## ADR-(\d+)/g) || [];
  const nextNum = String(adrMatches.length + 1).padStart(3, '0');

  const entry = [
    '',
    `## ADR-${nextNum}: [${review.issueId}] ${review.issueTitle}`,
    '',
    `- **날짜**: ${review.date}`,
    '- **상태**: 승인',
    `- **배경**: ${review.summary || '(workflow/decisions.md 참조)'}`,
    '- **결정**: _(결정 내용 직접 기입 또는 workflow/decisions.md 참조)_',
    '- **근거**: _(직접 기입)_',
    '- **대안**: _(직접 기입)_',
    '- **결과**: _(직접 기입)_',
    '',
  ].join('\n');

  return content.trimEnd() + '\n' + entry;
}

// ── review.md에 [완료] 마킹 ───────────────────────────────────────────
function markReviewDone(content, review) {
  // "### [ISSUE-XXX]" → "### [완료] [ISSUE-XXX]"
  return content.replace(
    review.heading,
    review.heading.replace('### ', '### [완료] ')
  );
}

// ── 메인 ──────────────────────────────────────────────────────────────
function main() {
  const reviewContent = readFile('workflow/3.review.md');
  if (!reviewContent) {
    console.error('workflow/3.review.md 를 찾을 수 없습니다.');
    process.exit(1);
  }

  const reviews = parseReviews(reviewContent);
  // [x] 항목이 하나라도 있고 아직 [완료] 처리되지 않은 이슈 대상
  const pending = reviews.filter(r =>
    Object.values(r.checks).some(Boolean) && !r.alreadyDone
  );

  if (pending.length === 0) {
    console.log('처리할 이슈가 없습니다.');
    console.log('([x] 체크 항목이 하나라도 있는 미처리 이슈를 찾습니다)');
    return;
  }

  console.log(`처리 대상 이슈 ${pending.length}건...\n`);

  let updatedReview = reviewContent;
  const report = [];

  for (const review of pending) {
    const tag = `[${review.issueId}] ${review.issueTitle}`;
    const updated = [];

    // changelog (커밋 완료 체크 시 또는 다른 항목이라도 체크된 경우)
    const changelogPath = 'docs/changelog.md';
    const changelog = readFile(changelogPath);
    if (changelog) {
      const next = appendChangelog(changelog, review);
      if (next) { writeFile(changelogPath, next); updated.push('docs/changelog.md'); }
      else        { updated.push('docs/changelog.md (이미 반영됨)'); }
    }

    // api-spec (변경 API 체크 시만)
    if (review.checks.api) {
      const apiPath = 'docs/api/api-spec.md';
      const apiContent = readFile(apiPath);
      if (apiContent) {
        const next = appendApiNote(apiContent, review);
        if (next) { writeFile(apiPath, next); updated.push('docs/api/api-spec.md'); }
        else        { updated.push('docs/api/api-spec.md (이미 반영됨)'); }
      }
    }

    // adr (주요 결정 체크 시만)
    if (review.checks.decisions) {
      const adrPath = 'docs/decisions/adr-template.md';
      const adrContent = readFile(adrPath);
      if (adrContent) {
        const next = appendAdr(adrContent, review);
        if (next) { writeFile(adrPath, next); updated.push('docs/decisions/adr-template.md'); }
        else        { updated.push('docs/decisions/adr-template.md (이미 반영됨)'); }
      }
    }

    // review.md [완료] 마킹 — 전체 체크 완료된 경우에만
    if (review.isComplete) {
      updatedReview = markReviewDone(updatedReview, review);
    }

    const status = review.isComplete ? '✓ [전체완료]' : '◑ [진행중]';
    report.push({ tag, updated });
    console.log(`${status} ${tag}`);
    updated.forEach(f => console.log(`  → ${f}`));
    console.log('');
  }

  // review.md 저장
  writeFile('workflow/3.review.md', updatedReview);

  const doneCount = pending.filter(r => r.isComplete).length;
  const partialCount = pending.length - doneCount;
  console.log('─'.repeat(50));
  if (doneCount > 0)    console.log(`✓ 전체완료 ${doneCount}건 → [완료] 마킹 적용`);
  if (partialCount > 0) console.log(`◑ 진행중   ${partialCount}건 → docs 반영됨 (미완료 항목 남음)`);
  console.log('⚠  docs/ 파일의 _(직접 기입)_ 항목은 수동으로 채워주세요.');
}

main();
