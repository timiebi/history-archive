/**
 * API client – uses .env NEXT_PUBLIC_API_URL for all requests.
 * Your .env: NEXT_PUBLIC_API_URL=https://afri-archive-backend.onrender.com
 * Routes: POST /auth/signup, POST /auth/login, GET /api/categories, GET /api/countries, GET /api/stories, etc.
 */

import axios, { type AxiosError } from "axios";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import type { ApiError, Manuscript, Timeline, TimelineDetail, Culture } from "./types";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "";
  return url.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Ensure every request uses current NEXT_PUBLIC_API_URL from env and Bearer token when available
api.interceptors.request.use((config) => {
  const base = getBaseUrl();
  if (base) config.baseURL = base;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiUrl(path: string): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiError
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/** Parse error message from API response (POST/GET) - handles validation, BadRequest, etc. */
function parseApiErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (!data || typeof data !== "object") return fallback;
  const d = data as { message?: string | string[]; detail?: string | { msg?: string }[] };
  if (d.message) {
    if (typeof d.message === "string") return d.message;
    if (Array.isArray(d.message) && d.message.length) return d.message.join(". ");
  }
  if (typeof d.detail === "string") return d.detail;
  if (Array.isArray(d.detail) && d.detail.length) {
    return (d.detail as { msg?: string }[]).map((x) => x?.msg ?? "").filter(Boolean).join(". ") || fallback;
  }
  return fallback;
}

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiError>) => {
    const status = err.response?.status ?? 0;
    const data = err.response?.data;
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      const path = window.location.pathname;
      const isAuthPage = path.startsWith("/auth/");
      if (!isAuthPage) {
        const redirect = "&redirect=" + encodeURIComponent(path + window.location.search);
        window.location.href = "/auth/login?reason=session_expired" + redirect;
      }
    }
    const fallback =
      err.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : err.response
          ? "Request failed."
          : "Network error. Check your connection.";
    const msg = parseApiErrorMessage(data, err.message || fallback);
    throw new ApiClientError(msg, status, data as ApiError);
  }
);

// ——— Auth (backend: POST /auth/register, POST /auth/login) ———
export interface AuthSignUpBody {
  name?: string;
  email?: string;
  password?: string;
  role?: "READER" | "CONTRIBUTOR";
}

export interface AuthLoginBody {
  email?: string;
  password?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export async function authSignUp(
  body: AuthSignUpBody = {}
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", body);
  return data;
}

export async function authLogin(
  body: AuthLoginBody = {}
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", body);
  return data;
}

export async function authForgotPassword(email: string): Promise<{ message?: string }> {
  const { data } = await api.post<{ message?: string }>("/auth/forgot-password", { email });
  return data;
}

export async function authResetPassword(token: string, newPassword: string): Promise<{ message?: string }> {
  const { data } = await api.patch<{ message?: string }>("/auth/reset-password", { token, newPassword });
  return data;
}

// ——— Current user profile (GET /users/me, PATCH /users/me, PATCH /users/me/password) ———
export interface MeUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export async function getMe(): Promise<MeUser> {
  const { data } = await api.get<MeUser>("/users/me");
  return data;
}

export async function updateMe(body: { name?: string }): Promise<MeUser> {
  const { data } = await api.patch<MeUser>("/users/me", body);
  return data;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(body: ChangePasswordBody): Promise<{ message?: string }> {
  const { data } = await api.patch<{ message?: string }>("/users/me/password", body);
  return data;
}

// ——— Artifacts (GET /artifacts returns array when no query) ———
export interface Artifact {
  id: string;
  name: string;
  origin?: string;
  material?: string;
  year?: string;
  image?: string;
  hdImage?: string;
  description?: string;
  dimensions?: string;
  cultureName?: string;
  location?: string;
  currentLocation?: string;
}

export async function getArtifacts(): Promise<Artifact[]> {
  try {
    const { data } = await api.get<Artifact[] | { local?: Artifact[] }>("/artifacts");
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && Array.isArray((data as { local?: Artifact[] }).local)) {
      return (data as { local: Artifact[] }).local;
    }
    return [];
  } catch (e: unknown) {
    if (isApiClientError(e) && (e.status === 404 || e.status === 500)) return [];
    throw e;
  }
}

// ——— Contributors (GET /users/contributors) ———
export async function getContributors(): Promise<{ items?: unknown[] }> {
  try {
    const { data } = await api.get<unknown[]>("/users/contributors");
    const items = Array.isArray(data) ? data : [];
    return { items };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

// ——— Categories (GET /api/categories) ———
export async function getCategories(): Promise<{
  items?: unknown[];
  [key: string]: unknown;
}> {
  try {
    const { data } = await api.get<
      { items?: unknown[]; [key: string]: unknown } | unknown[]
    >("/categories");
    return Array.isArray(data) ? { items: data } : (data as { items?: unknown[]; [key: string]: unknown });
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

// ——— Countries (GET /api/countries, GET /api/countries/:id) ———
export async function getCountries(): Promise<{
  items?: unknown[];
  [key: string]: unknown;
}> {
  try {
    const { data } = await api.get<
      { items?: unknown[]; [key: string]: unknown } | unknown[]
    >("/countries");
    return Array.isArray(data) ? { items: data } : (data as { items?: unknown[]; [key: string]: unknown });
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

export async function getCountryById(id: string): Promise<Record<string, unknown>> {
  try {
    const { data } = await api.get<Record<string, unknown>>(
      `/countries/${encodeURIComponent(id)}`
    );
    return data;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return {};
    throw e;
  }
}

// ——— Stories (GET /stories returns { storyOfTheDay, stories, ... }) ———
export async function getStories(params?: { page?: number; limit?: number; search?: string; categoryId?: string }): Promise<{
  items?: unknown[];
  storyOfTheDay?: unknown;
  [key: string]: unknown;
}> {
  try {
    const { data } = await api.get<{
      storyOfTheDay?: unknown;
      stories?: unknown[];
      items?: unknown[];
      [key: string]: unknown;
    }>("/stories", { params });
    const items = Array.isArray(data?.stories)
      ? (data.storyOfTheDay ? [data.storyOfTheDay, ...data.stories] : data.stories)
      : Array.isArray(data?.items) ? data.items : [];
    return { ...data, items };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

export async function getStoryById(id: string): Promise<Record<string, unknown>> {
  try {
    const { data } = await api.get<Record<string, unknown>>(
      `/stories/${encodeURIComponent(id)}`
    );
    return data;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return {};
    throw e;
  }
}

export async function getStoryByExternalId(
  source: string,
  externalId: string
): Promise<Record<string, unknown>> {
  try {
    const { data } = await api.get<Record<string, unknown>>(
      `/stories/external/${encodeURIComponent(source)}/${encodeURIComponent(externalId)}`
    );
    return data;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return {};
    throw e;
  }
}

// ——— Create story (contributors/admins, requires auth) ———
export interface StorySectionInput {
  text: string;
  image?: string;
}

export interface CreateStoryBody {
  title: string;
  content: string;
  /** Category UUID (optional if categoryName is sent). */
  categoryId?: string;
  /** Category name; backend finds or creates. Use with static dropdown. */
  categoryName?: string;
  /** Cover image URL (required). */
  image: string;
  sections?: StorySectionInput[];
  videoUrl?: string;
  sourceUrl?: string;
  author?: string;
  countryId?: string;
  /** Country name; sent when countryId is external (ext-XX) so backend can create internal country. */
  countryName?: string;
  /** Attach to existing timeline */
  timelineId?: string;
  /** Create new timeline: name (required when creating new) */
  timelineName?: string;
  timelineDescription?: string;
  timelineStartYear?: number;
  timelineEndYear?: number;
}

export async function createStory(body: CreateStoryBody): Promise<Record<string, unknown>> {
  const { data } = await api.post<Record<string, unknown>>("/stories", body);
  return data;
}

export type ReactionType = "LIKE" | "HEART" | "INSIGHTFUL";

export async function toggleStoryReaction(storyId: string, type: ReactionType): Promise<unknown> {
  const { data } = await api.post(`/stories/${encodeURIComponent(storyId)}/react`, { type });
  return data;
}

// ——— Cultures (GET /cultures) ———
export async function getCultures(params?: { region?: string; year?: number; search?: string }): Promise<{ items: Culture[] }> {
  try {
    const { data } = await api.get<Culture[]>("/cultures", { params });
    const items = Array.isArray(data) ? data : [];
    return { items };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

// ——— Timelines (GET /timelines, GET /timelines/:id) ———
export async function getTimelines(): Promise<{ items: Timeline[] }> {
  try {
    const { data } = await api.get<Timeline[]>("/timelines");
    const items = Array.isArray(data) ? data : [];
    return { items };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

export async function getTimelineById(id: string): Promise<TimelineDetail | null> {
  try {
    const { data } = await api.get<TimelineDetail>(`/timelines/${encodeURIComponent(id)}`);
    return data;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return null;
    throw e;
  }
}

// ——— Contributor dashboard (GET /contributors/me/overview) ———
export interface ContributorOverviewResponse {
  myStories: Array<{
    id: string;
    title: string;
    createdAt: string;
    timelineId: string | null;
    timelineName: string | null;
    countryName: string | null;
    categoryName: string;
    source: string;
  }>;
  myTimelines: Array<{
    id: string;
    name: string;
    startYear: number;
    endYear: number | null;
    description: string | null;
    storyCount: number;
  }>;
}

export async function getContributorOverview(): Promise<ContributorOverviewResponse> {
  const { data } = await api.get<ContributorOverviewResponse>("/contributors/me/overview");
  return data;
}

// ——— Library / Manuscripts (GET /library, GET /library/:id) ———
export async function getLibrary(): Promise<{ items: Manuscript[] }> {
  try {
    const { data } = await api.get<Manuscript[]>("/library");
    const items = Array.isArray(data) ? data : [];
    return { items };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return { items: [] };
    throw e;
  }
}

export async function getManuscriptById(id: string): Promise<Manuscript | null> {
  try {
    const { data } = await api.get<Manuscript>(`/library/${encodeURIComponent(id)}`);
    return data;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return null;
    throw e;
  }
}

export function isApiClientError(e: unknown): e is ApiClientError {
  return e instanceof ApiClientError;
}
