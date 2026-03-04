/** LocalStorage keys for auth (used by navbar, dashboard, contribute, login, signup). */
export const AUTH_USER_KEY = "archive_user";
export const AUTH_TOKEN_KEY = "archive_token";

/** Category options for the submit-a-story form. Backend finds or creates by name. */
export const STORY_CATEGORIES = [
  "History",
  "Folklore & Legends",
  "Tourism & Landmarks",
  "Traditional Festivals",
  "Cuisine & Art",
] as const;
