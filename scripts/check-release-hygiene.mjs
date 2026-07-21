/* global console, process */
import { execFileSync } from "node:child_process";

// Maintenance guide:
// - Keep generated output, local caches, local databases, logs, editor state,
//   and secret-bearing files out of v1.0 release-preparation changes.
// - Scan both tracked files and the current working tree, including untracked
//   files, so release review does not depend on manual local cleanup.
// - Environment templates such as `.env.example` are intentionally allowed;
//   real `.env*` files are local material and must stay out of release review.
// - If a flagged path becomes intentional public release material, update this
//   checker and document the reason in the same release-prep change.
const GENERATED_OR_LOCAL_PATTERNS = [
  { label: "dependency directory", pattern: /(^|\/)node_modules\// },
  { label: "Next.js build output", pattern: /(^|\/)\.next\// },
  { label: "distribution output", pattern: /(^|\/)(dist|build|out)\// },
  { label: "coverage output", pattern: /(^|\/)coverage\// },
  {
    label: "browser test output",
    pattern: /(^|\/)(test-results|playwright-report)\//,
  },
  { label: "TypeScript build info", pattern: /\.tsbuildinfo$/ },
  { label: "logs", pattern: /(^|\/)(logs\/|[^/]+\.log$)/ },
  { label: "local runtime file", pattern: /\.(pid|pid\.lock)$/ },
  {
    label: "tool cache",
    pattern:
      /(^|\/)(\.eslintcache|\.cache\/|\.turbo\/|\.vite\/|\.vitest\/|\.pnpm-store\/)/,
  },
  { label: "local scratch directory", pattern: /(^|\/)(tmp|temp)\// },
  { label: "deployment metadata", pattern: /(^|\/)\.vercel\// },
  { label: "editor workspace state", pattern: /(^|\/)(\.idea|\.vscode)\// },
  { label: "OS metadata", pattern: /(^|\/)\.DS_Store$/ },
  { label: "local database", pattern: /\.(db|sqlite|sqlite3)$/ },
  { label: "local secret key material", pattern: /\.(pem|key|p12|pfx)$/ },
  { label: "local environment file", pattern: /(^|\/)\.env($|\.|rc$)/ },
  { label: "local direnv state", pattern: /(^|\/)\.direnv\// },
];

function execGit(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

function parseNulSeparated(output) {
  return output.split("\0").filter(Boolean);
}

function parseStatusPath(entry) {
  const rawPath = entry.slice(3);
  const renameSeparator = " -> ";

  if (rawPath.includes(renameSeparator)) {
    return rawPath.split(renameSeparator).at(-1);
  }

  return rawPath;
}

function isAllowedEnvironmentTemplate(filePath) {
  return (
    filePath.endsWith(".env.example") ||
    filePath.endsWith(".env.local.example") ||
    /\.env\.[^.]+\.example$/.test(filePath)
  );
}

function findViolations(paths) {
  const violations = [];

  for (const filePath of paths) {
    if (isAllowedEnvironmentTemplate(filePath)) continue;

    for (const { label, pattern } of GENERATED_OR_LOCAL_PATTERNS) {
      if (pattern.test(filePath)) {
        violations.push(`${filePath} (${label})`);
        break;
      }
    }
  }

  return violations;
}

const trackedFiles = parseNulSeparated(execGit(["ls-files", "-z"]));
const statusEntries = parseNulSeparated(
  execGit(["status", "--porcelain=v1", "-z", "--untracked-files=all"]),
);
const changedFiles = statusEntries.map(parseStatusPath);

const trackedViolations = findViolations(trackedFiles);
const changedViolations = findViolations(changedFiles);

if (trackedViolations.length || changedViolations.length) {
  console.error("Release hygiene check failed.");
  console.error("");

  if (trackedViolations.length) {
    console.error("Tracked generated or local-only files:");
    for (const violation of trackedViolations) console.error(`- ${violation}`);
    console.error("");
  }

  if (changedViolations.length) {
    console.error("Changed generated or local-only files:");
    for (const violation of changedViolations) console.error(`- ${violation}`);
    console.error("");
  }

  console.error("Guidance:");
  console.error(
    "- Remove generated artifacts, logs, caches, local databases, and machine-local files.",
  );
  console.error(
    "- Keep real secrets out of git; only checked-in environment templates are allowed.",
  );
  console.error(
    "- If a listed file is intentional release material, update this checker in the same release-prep task.",
  );

  process.exit(1);
}

console.log(
  `Release hygiene check passed: ${trackedFiles.length} tracked files, ${changedFiles.length} changed paths`,
);
