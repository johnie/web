import { execSync } from "node:child_process";
import type { Plugin } from "vite";
import pkg from "../../package.json";

export interface BuildMetadataPluginOptions {
  branchName?: string;
  prefix?: string;
  timeFormatter?: (buildDate: Date) => string;
}

const DEFAULT_BRANCH_NAME = "main";
const DEFAULT_PREFIX = "VITE_BUILD_";
const GIT_PREFIX_REGEX = /^git\+/;
const GIT_SUFFIX_REGEX = /\.git$/;
const SSH_REPO_REGEX = /^git@([^:]+):(.+)$/;
const SSH_PROTOCOL_REPO_REGEX = /^ssh:\/\/git@([^/]+)\/(.+)$/;

function normalizePrefix(prefix: string): string {
  return prefix.endsWith("_") ? prefix : `${prefix}_`;
}

function normalizeRepositoryUrl(url: string): string {
  const sshMatch =
    url.match(SSH_REPO_REGEX) ?? url.match(SSH_PROTOCOL_REPO_REGEX);

  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2]}`;
  }

  return url;
}

function getGitSha(): string | null {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function getRepoUrl(): string | null {
  const repository = pkg.repository;
  let url = typeof repository === "string" ? repository : repository?.url;

  if (!url) {
    return null;
  }

  url = url.replace(GIT_PREFIX_REGEX, "").replace(GIT_SUFFIX_REGEX, "");

  return normalizeRepositoryUrl(url);
}

function createDefineEntries(
  prefix: string,
  metadata: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      `import.meta.env.${prefix}${key}`,
      JSON.stringify(value),
    ])
  );
}

export default function buildMetadataPlugin(
  options: BuildMetadataPluginOptions = {}
): Plugin {
  const branchName = options.branchName ?? DEFAULT_BRANCH_NAME;
  const prefix = normalizePrefix(options.prefix ?? DEFAULT_PREFIX);
  const buildDate = new Date();
  const repoUrl = getRepoUrl();
  const gitSha = getGitSha() ?? branchName;
  let gitShaUrl = "";

  if (repoUrl) {
    gitShaUrl =
      gitSha === branchName
        ? `${repoUrl}/tree/${branchName}`
        : `${repoUrl}/commit/${gitSha}`;
  }

  const buildTime = options.timeFormatter
    ? options.timeFormatter(buildDate)
    : buildDate.toISOString();

  return {
    name: "vite-plugin-build-metadata",
    config() {
      return {
        define: createDefineEntries(prefix, {
          TIME: buildTime,
          GIT_SHA: gitSha,
          GIT_SHA_URL: gitShaUrl,
          VERSION: pkg.version,
        }),
      };
    },
  };
}
