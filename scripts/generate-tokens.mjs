/**
 * generate-tokens.mjs
 * src/tokens/design-tokens.json → src/styles/_tokens.css
 *
 * Usage:  node scripts/generate-tokens.mjs
 * Auto-run via package.json "prebuild" hook.
 */

import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dir, '..')

const tokens = JSON.parse(
  readFileSync(resolve(root, 'src/tokens/design-tokens.json'), 'utf-8')
)

/** Flatten nested object to CSS custom property name.
 *  { color: { bg: { primary: { value: "#x" } } } }
 *  → --color-bg-primary: #x
 */
function flatten(obj, prefix = '') {
  const lines = []
  for (const [key, val] of Object.entries(obj)) {
    const cssKey = prefix ? `${prefix}-${key}` : key
    // camelCase → kebab-case
    const kebab = cssKey.replace(/([A-Z])/g, '-$1').toLowerCase()
    if (val && typeof val === 'object' && 'value' in val) {
      const comment = val.comment ? ` /* ${val.comment} */` : ''
      lines.push(`  --${kebab}: ${val.value};${comment}`)
    } else if (val && typeof val === 'object') {
      lines.push(...flatten(val, cssKey))
    }
  }
  return lines
}

// color 토큰 — :root
const colorLines = flatten({ ...tokens, grayscale: undefined })
// grayscale 토큰 — [data-visual-mode='grayscale']
const grayscaleLines = tokens.grayscale ? flatten(tokens.grayscale, 'grayscale') : []

const output = [
  '/* AUTO-GENERATED — do not edit manually */',
  '/* Source: src/tokens/design-tokens.json */',
  '/* Run: node scripts/generate-tokens.mjs */',
  '',
  ':root {',
  ...colorLines,
  '}',
  '',
  "[data-visual-mode='grayscale'] {",
  ...grayscaleLines,
  '}',
  '',
].join('\n')

const dest = resolve(root, 'src/styles/_tokens.css')
writeFileSync(dest, output, 'utf-8')
console.log(`✓ Tokens written to src/styles/_tokens.css (${colorLines.length} color + ${grayscaleLines.length} grayscale variables)`)
