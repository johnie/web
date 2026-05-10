export const SITE_NAME = "Johnie Hjelm";
export const SITE_URL = "https://johnie.se";
export const SITE_LOCALE = "en_US";
export const DEFAULT_OG_IMAGE_PATH = "/images/og-image.png";
export const DEFAULT_DESCRIPTION =
  "Developer, engineering leader, and inclusive tech advocate writing about AI-augmented engineering, leadership, and building inclusive teams.";
export const DEFAULT_KEYWORDS = [
  "Johnie Hjelm",
  "engineering leadership",
  "AI-augmented engineering",
  "inclusive tech",
  "software development",
  "writing",
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path === "/") {
    return SITE_URL;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageTitle(title?: string) {
  if (!title || title === SITE_NAME) {
    return SITE_NAME;
  }

  return `${title} | ${SITE_NAME}`;
}
