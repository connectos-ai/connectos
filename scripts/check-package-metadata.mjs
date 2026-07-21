/* global console, process */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Maintenance guide:
// - Keep package manifests neutral, private, and pointed at the approved
//   public ConnectOS GitHub home during v1.0 release preparation.
// - `repository`, `homepage`, and `bugs` must use the owner-approved
//   https://github.com/connectos-ai/connectos URL.
// - Generated manifests under dependency build output are intentionally
//   excluded; source package manifests remain part of the release gate.
// - Keep this script aligned with `docs/PACKAGE_METADATA_AUDIT.md` whenever
//   package metadata policy intentionally changes.
const OWNER_APPROVED_AUTHOR = "ConnectOS contributors";
const OWNER_APPROVED_LICENSE = "MIT";
const OWNER_APPROVED_REPOSITORY_URL =
  "git+https://github.com/connectos-ai/connectos.git";
const OWNER_APPROVED_HOMEPAGE =
  "https://github.com/connectos-ai/connectos#readme";
const OWNER_APPROVED_BUGS_URL =
  "https://github.com/connectos-ai/connectos/issues";

const MANIFEST_FIND_ARGS = [
  ".",
  "-path",
  "./node_modules",
  "-prune",
  "-o",
  "-path",
  "./apps/web/node_modules",
  "-prune",
  "-o",
  "-path",
  "./apps/web/.next",
  "-prune",
  "-o",
  "-name",
  "package.json",
  "-maxdepth",
  "4",
  "-print",
];

function findManifestPaths() {
  return execFileSync("find", MANIFEST_FIND_ARGS, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
}

function readManifest(manifestPath) {
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function validateManifest(manifestPath, manifest) {
  const errors = [];

  if (manifest.private !== true) {
    errors.push(`${manifestPath}: expected private true during v1.0 prep`);
  }

  if (manifest.license !== OWNER_APPROVED_LICENSE) {
    errors.push(`${manifestPath}: expected license ${OWNER_APPROVED_LICENSE}`);
  }

  if (manifest.author !== OWNER_APPROVED_AUTHOR) {
    errors.push(`${manifestPath}: expected author ${OWNER_APPROVED_AUTHOR}`);
  }

  if (!manifest.description?.includes("ConnectOS")) {
    errors.push(`${manifestPath}: description should mention ConnectOS`);
  }

  if (manifest.repository?.type !== "git") {
    errors.push(`${manifestPath}: expected repository.type git`);
  }

  if (manifest.repository?.url !== OWNER_APPROVED_REPOSITORY_URL) {
    errors.push(
      `${manifestPath}: expected repository.url ${OWNER_APPROVED_REPOSITORY_URL}`,
    );
  }

  if (manifest.homepage !== OWNER_APPROVED_HOMEPAGE) {
    errors.push(`${manifestPath}: expected homepage ${OWNER_APPROVED_HOMEPAGE}`);
  }

  if (manifest.bugs?.url !== OWNER_APPROVED_BUGS_URL) {
    errors.push(`${manifestPath}: expected bugs.url ${OWNER_APPROVED_BUGS_URL}`);
  }

  return errors;
}

const manifestPaths = findManifestPaths();
const errors = manifestPaths.flatMap((manifestPath) =>
  validateManifest(manifestPath, readManifest(manifestPath)),
);

if (errors.length > 0) {
  console.error(`Package metadata check failed: ${errors.length} issue(s)`);
  console.error("");
  console.error("Fix package manifest release-readiness items below:");
  for (const error of errors) console.error(`- ${error}`);
  console.error("");
  console.error("Guidance:");
  console.error("- Keep package manifests private during v1.0 release preparation.");
  console.error("- Use neutral ConnectOS metadata only.");
  console.error(
    "- Use the owner-approved public GitHub home: https://github.com/connectos-ai/connectos.",
  );
  console.error("");
  console.error(
    "Review docs/PACKAGE_METADATA_AUDIT.md docs/PRE_PUBLIC_OWNER_DECISIONS.md.",
  );
  console.error("Then rerun pnpm release-metadata:check.");
  process.exit(1);
}

console.log(
  `Package metadata check passed: ${manifestPaths.length} manifests checked`,
);
