#!/usr/bin/env node
/**
 * secret-check.js
 * 
 * Pre-commit secret scanner — detects plaintext API keys, tokens, passwords in staged files.
 * 
 * Usage:
 *   node scripts/secret-check.js
 *   npm run secret-check
 * 
 * Exit codes:
 *   0 = all clear
 *   1 = secrets detected (BLOCK commit)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Patterns that strongly suggest a plaintext secret
const SECRET_PATTERNS = [
  // Generic secrets
  { pattern: /["']?(?:secret|password|passwd|pwd|api[_-]?key|apikey|api[_-]?token|auth[_-]?token|access[_-]?token)["\s]*[:=]["\s]*[^"'`\s]{8,}/gi,
    label: 'Potential secret/key/password token' },
  
  // Known credential patterns
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, label: 'OpenAI/Stripe-like secret key' },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, label: 'GitHub Personal Access Token' },
  { pattern: /gho_[a-zA-Z0-9]{36}/g, label: 'GitHub OAuth Token' },
  { pattern: /xox[baprs]-[a-zA-Z0-9]{10,}/g, label: 'Slack Token' },
  { pattern: /AIza[0-9A-Za-z_-]{35}/g, label: 'Google API Key' },
  { pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g, label: 'Google OAuth Client ID' },
  { pattern: /[a-zA-Z0-9_-]*\.iam\.gserviceaccount\.com/g, label: 'GCP Service Account' },
  { pattern: /amzn\.[a-zA-Z0-9]{20,}/g, label: 'AWS Access Key' },
  { pattern: /AGK[0-9A-Za-z_-]{30,}/g, label: 'AWS Secret Key' },
  { pattern: /[a-zA-Z0-9+/]{40,}/g, label: 'Long base64-like credential (review manually)' },
  
  // Vercel / deployment tokens
  { pattern: /vercel_[a-zA-Z0-9]{24,}/g, label: 'Vercel Token' },
  { pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, label: 'JWT/Token (review if unexpected)' },
  
  // Facebook / social auth
  { pattern: /[0-9]{10,}:[a-zA-Z0-9_-]{32,}/g, label: 'Telegram Bot Token-like' },
];

// Files/directories to ALWAYS skip
const SKIP_PATHS = [
  'node_modules/',
  '.next/',
  '.vercel/',
  '.git/',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env.example',
  '.env.check',
  '.env.prod.check',
  '.env.prod.check2',
  '.env.verify',
  '.env.verify2',
  'coverage/',
];

// Allowlisted strings (false positives)
const ALLOW_LIST = [
  'your-api-key',
  'your-api-key-here',
  'your-secret',
  'your-secret-here',
  'dummy-secret',
  'dummy-secret-for-ci',
  'dummy-key',
  'placeholder',
  'example',
  'demo',
  'test_token',
  'test-key',
  'your-google-client-id',
  'your-facebook-client-id',
  'test_service',
  'NOT_REAL',
  'XOXO',
];

function shouldSkip(file) {
  return SKIP_PATHS.some(skip => file.includes(skip));
}

function isAllowListed(match) {
  const lower = match.toLowerCase().replace(/["'`:=]/g, '').trim();
  return ALLOW_LIST.some(allowed => lower.includes(allowed));
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --staged --name-only', { encoding: 'utf-8' });
    return output.split('\n').filter(Boolean);
  } catch {
    // No staged files
    return [];
  }
}

function scanFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues = [];

  for (const { pattern, label } of SECRET_PATTERNS) {
    pattern.lastIndex = 0; // Reset regex
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const matched = match[0];
      if (isAllowListed(matched)) continue;
      
      // Find line number
      const beforeMatch = content.substring(0, match.index);
      const lineNum = beforeMatch.split('\n').length;
      
      // Get surrounding context
      const context = lines.slice(Math.max(0, lineNum - 2), lineNum + 1)
        .map((l, i) => `  ${lineNum - 1 + i}: ${l}`)
        .join('\n');
      
      issues.push({
        file: filePath,
        line: lineNum,
        label,
        match: matched.substring(0, 60) + (matched.length > 60 ? '...' : ''),
        context,
      });
    }
  }

  return issues;
}

function scanSecrets() {
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('🔍 No staged files found. Skipping secret scan.');
    return { issues: [], total: 0 };
  }

  console.log(`🔍 Scanning ${stagedFiles.length} staged file(s) for secrets...\n`);
  
  const allIssues = [];
  
  for (const file of stagedFiles) {
    if (shouldSkip(file)) {
      console.log(`  ⏭️  Skipping (excluded): ${file}`);
      continue;
    }
    
    console.log(`  📄 Scanning: ${file}`);
    const issues = scanFile(file);
    
    if (issues.length > 0) {
      allIssues.push(...issues);
      console.log(`    ⚠️  ${issues.length} potential secret(s) found!`);
    }
  }

  return { issues: allIssues, total: stagedFiles.filter(f => !shouldSkip(f)).length };
}

function printReport(results) {
  const { issues, total } = results;
  
  console.log('\n========================================');
  console.log('🔐 Secret Scan Report');
  console.log('========================================');
  console.log(`Files scanned: ${total}`);
  console.log(`Secrets found: ${issues.length}`);
  console.log('========================================\n');

  if (issues.length === 0) {
    console.log('✅ No secrets detected. Safe to commit!');
    return true;
  }

  console.log('❌ SECRETS DETECTED — COMMIT BLOCKED\n');
  console.log('Please review and remove or replace the following:\n');
  
  // Group by file
  const byFile = {};
  for (const issue of issues) {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  }

  for (const [file, fileIssues] of Object.entries(byFile)) {
    console.log(`📁 ${file}`);
    for (const issue of fileIssues) {
      console.log(`   ⚠️  Line ${issue.line}: ${issue.label}`);
      console.log(`      Match: ${issue.match}`);
      console.log(`\n${issue.context}\n`);
    }
    console.log('');
  }

  console.log('========================================');
  console.log('❌ COMMIT BLOCKED — Fix secrets before committing');
  console.log('========================================');
  console.log('\nTip: Use git diff --staged to review what you are committing.');
  console.log('Tip: If this is a false positive, add it to ALLOW_LIST in scripts/secret-check.js');
  
  return false;
}

// Main
const results = scanSecrets();
const passed = printReport(results);

if (!passed) {
  process.exit(1);
}
