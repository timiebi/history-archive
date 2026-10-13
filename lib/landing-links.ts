/** Same-origin routes after landing is merged into history-frontend. */
export const landingLinks = {
  explore: "/explore",
  home: "/explore",
  /** Always-visible marketing (no logged-in redirect). */
  welcome: "/welcome",
  stories: "/stories",
  visit: "/visit",
  contribute: "/contribute",
  partner: "/partner",
  manifesto: "/manifesto",
  map: "/map",
  signup: "/auth/signup",
  login: "/auth/login",
} as const;
