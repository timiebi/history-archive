/**
 * API client – uses .env NEXT_PUBLIC_API_URL for all requests.
 * Your .env: NEXT_PUBLIC_API_URL=https://afri-archive-backend.onrender.com
 * Routes: POST /auth/signup, POST /auth/login, GET /api/categories, GET /api/countries, GET /api/stories, etc.
 */

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import axios, { type AxiosError } from "axios";
import type { ApiError, Culture, Manuscript, Timeline, TimelineDetail, TourismPartner } from "./types";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "";
  return url.replace(/\/$/, "");
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
  // timeout: 15000,
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

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  storyId?: string | null;
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

export async function getNotifications(limit = 30): Promise<{ items: UserNotification[]; unreadCount: number }> {
  const { data } = await api.get<{ items?: UserNotification[]; unreadCount?: number }>("/notifications", {
    params: { limit },
  });
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    unreadCount: Number(data?.unreadCount ?? 0),
  };
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const { data } = await api.patch<{ updated?: number }>("/notifications/read-all");
  return { updated: Number(data?.updated ?? 0) };
}

export async function markNotificationRead(notificationId: string): Promise<{ updated: number }> {
  const { data } = await api.patch<{ updated?: number }>(`/notifications/${encodeURIComponent(notificationId)}/read`);
  return { updated: Number(data?.updated ?? 0) };
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
  visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
  verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
  provenance?: {
    sourceType?: string;
    sourceName?: string;
    sourceContact?: string;
    collectionLocation?: string;
    interviewDate?: string;
    interviewerName?: string;
    verificationMethod?: string;
    notes?: string;
  };
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

// ——— Cultures (GET /cultures, POST /cultures) ———
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

function normalizeTourismPartnersResponse(data: unknown): TourismPartner[] {
  const list: unknown[] = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { items?: unknown }).items)
      ? ((data as { items: unknown[] }).items ?? [])
      : [];
  const out: TourismPartner[] = [];
  for (const row of list) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : "";
    const name = typeof r.name === "string" ? r.name : "";
    const websiteUrl =
      typeof r.websiteUrl === "string"
        ? r.websiteUrl
        : typeof r.website_url === "string"
          ? r.website_url
          : "";
    if (!id || !name || !websiteUrl) continue;
    out.push({
      id,
      name,
      description: typeof r.description === "string" ? r.description : undefined,
      websiteUrl,
      bookingUrl:
        typeof r.bookingUrl === "string"
          ? r.bookingUrl
          : typeof r.booking_url === "string"
            ? r.booking_url
            : undefined,
      logoUrl:
        typeof r.logoUrl === "string" ? r.logoUrl : typeof r.logo_url === "string" ? r.logo_url : undefined,
    });
  }
  return out;
}

/** GET /tourism/partners — query with either storyId or cultureId (not both). */
export async function getTourismPartners(params: {
  storyId?: string;
  cultureId?: string;
}): Promise<TourismPartner[]> {
  try {
    const { data } = await api.get<unknown>("/tourism/partners", { params });
    return normalizeTourismPartnersResponse(data);
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return [];
    throw e;
  }
}

export type TourismToursListResponse = {
  items: import("@/lib/tourism/map-api-tour").ApiTour[];
  total: number;
  page: number;
  limit: number;
};

/** GET /tourism/tours — published Gesi-curated tours */
export async function getTours(params?: {
  region?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<TourismToursListResponse> {
  try {
    const { data } = await api.get<TourismToursListResponse>("/tourism/tours", { params });
    return {
      items: Array.isArray(data?.items) ? data.items : [],
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      limit: data?.limit ?? 20,
    };
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) {
      return { items: [], total: 0, page: 1, limit: 20 };
    }
    throw e;
  }
}

/** GET /tourism/tours/:idOrSlug */
export async function getTourByIdOrSlug(
  idOrSlug: string
): Promise<import("@/lib/tourism/map-api-tour").ApiTour | null> {
  try {
    const { data } = await api.get<import("@/lib/tourism/map-api-tour").ApiTour>(
      `/tourism/tours/${encodeURIComponent(idOrSlug)}`
    );
    return data ?? null;
  } catch (e: unknown) {
    if (isApiClientError(e) && e.status === 404) return null;
    throw e;
  }
}

export interface CreateCultureInput {
  name: string;
  region: string;
  timelineId: string;
  capital?: string;
  language?: string;
  description?: string;
  /** If omitted and countryId is set, backend uses the country flag. */
  image?: string;
  countryId?: string;
  visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
  verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
  provenance?: {
    sourceType?: string;
    sourceName?: string;
    sourceContact?: string;
    collectionLocation?: string;
    interviewDate?: string;
    interviewerName?: string;
    verificationMethod?: string;
    notes?: string;
  };
}

export async function createCulture(body: CreateCultureInput): Promise<Culture> {
  const { data } = await api.post<Culture>("/cultures", body);
  return data;
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
    status: string;
    visibility: string;
    reviewNotes: string | null;
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

export interface AdminStoryModerationItem {
  id: string;
  title: string;
  author?: string;
  source: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
  visibility: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  consentStatus: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
  verificationStatus: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
  createdAt: string;
}

export interface AdminCultureModerationItem {
  id: string;
  name: string;
  region: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
  visibility: "PUBLIC" | "RESTRICTED" | "PRIVATE";
  consentStatus: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
  verificationStatus: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
  createdAt: string;
}

export async function adminGetStories(params?: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
}): Promise<{ items: AdminStoryModerationItem[]; total: number }> {
  const { data } = await api.get<{ items: AdminStoryModerationItem[]; total: number }>("/admin/stories", { params });
  return data;
}

export async function adminModerateStory(
  storyId: string,
  body: {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
    visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
    consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
    verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
    reviewNotes?: string;
  },
): Promise<{ message: string }> {
  const { data } = await api.patch<{ message: string }>(`/admin/stories/${encodeURIComponent(storyId)}/status`, body);
  return data;
}

export async function adminGetCultures(params?: {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
}): Promise<{ items: AdminCultureModerationItem[]; total: number }> {
  const { data } = await api.get<{ items: AdminCultureModerationItem[]; total: number }>("/admin/cultures", { params });
  return data;
}

export async function adminModerateCulture(
  cultureId: string,
  body: {
    status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
    visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
    consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
    verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
    reviewNotes?: string;
  },
): Promise<{ message: string }> {
  const { data } = await api.patch<{ message: string }>(`/admin/cultures/${encodeURIComponent(cultureId)}/status`, body);
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

// ——— Partner organizations (Phase 4A) ———

export type PartnerOrgStatus =
  | "DRAFT_APPLICATION"
  | "PENDING_REVIEW"
  | "NEEDS_INFO"
  | "VERIFIED"
  | "REJECTED"
  | "SUSPENDED";

export interface PartnerOrganization {
  id: string;
  name: string;
  legalName?: string | null;
  slug: string;
  country: string;
  websiteUrl?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  socialLinks?: string[];
  status: PartnerOrgStatus;
  verificationNotes?: string | null;
  reviewedAt?: string | null;
  businessRegistrationId?: string | null;
  supportingDocUrls?: string[];
  attestationAcceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; name: string; email: string } | null;
  memberships?: PartnerMembership[];
}

export type PartnerMemberRole = "OWNER" | "MANAGER";

export interface PartnerMembership {
  id: string;
  role: PartnerMemberRole | string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}


export type CreatePartnerOrganizationBody = {
  name: string;
  legalName: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl?: string;
  businessRegistrationId?: string;
  description: string;
  logoUrl?: string;
  address?: string;
  socialLinks?: string[];
  supportingDocUrls?: string[];
  authorizedToRepresent: boolean;
};

export type UpdatePartnerOrganizationBody = Partial<
  Omit<CreatePartnerOrganizationBody, "authorizedToRepresent">
> & {
  resubmitForReview?: boolean;
};

/** GET /partner/organizations/me */
export async function getMyPartnerOrganizations(): Promise<{
  items: { membershipRole: string; organization: PartnerOrganization }[];
}> {
  const { data } = await api.get<{
    items: { membershipRole: string; organization: PartnerOrganization }[];
  }>("/partner/organizations/me");
  return { items: Array.isArray(data?.items) ? data.items : [] };
}

/** POST /partner/organizations */
export async function createPartnerOrganization(
  body: CreatePartnerOrganizationBody
): Promise<PartnerOrganization> {
  const { data } = await api.post<PartnerOrganization>("/partner/organizations", body);
  return data;
}

/** PATCH /partner/organizations/:orgId */
export async function updatePartnerOrganization(
  orgId: string,
  body: UpdatePartnerOrganizationBody
): Promise<PartnerOrganization> {
  const { data } = await api.patch<PartnerOrganization>(
    `/partner/organizations/${encodeURIComponent(orgId)}`,
    body
  );
  return data;
}

/** GET /partner/organizations/:orgId/members */
export async function getPartnerMembers(
  orgId: string
): Promise<{ items: PartnerMembership[]; total: number }> {
  const { data } = await api.get<{ items: PartnerMembership[]; total: number }>(
    `/partner/organizations/${encodeURIComponent(orgId)}/members`
  );
  return {
    items: Array.isArray(data?.items) ? data.items : [],
    total: data?.total ?? 0,
  };
}

/** POST /partner/organizations/:orgId/members */
export async function addPartnerMember(
  orgId: string,
  body: { email: string; role: "MANAGER" }
): Promise<PartnerMembership> {
  const { data } = await api.post<PartnerMembership>(
    `/partner/organizations/${encodeURIComponent(orgId)}/members`,
    body
  );
  return data;
}

/** DELETE /partner/organizations/:orgId/members/:membershipId */
export async function removePartnerMember(
  orgId: string,
  membershipId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/partner/organizations/${encodeURIComponent(orgId)}/members/${encodeURIComponent(membershipId)}`
  );
  return data;
}

// ——— Partner tours (Phase 4C) ———

export type PartnerTourStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PartnerTourModerationStatus =
  | "NONE"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEEDS_CHANGES"
  | "REJECTED";

export interface PartnerTour {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  locationLabel: string;
  location: string;
  countryLabel: string;
  region: string;
  price: number;
  duration: string;
  heroImageUrl: string;
  operatorsLabel?: string | null;
  overview: string;
  story?: string;
  historicalSignificance?: string;
  difficulty?: string | null;
  groupSize?: string | null;
  bestSeason?: string | null;
  meetingPoint?: string | null;
  highlights?: string[];
  status: PartnerTourStatus;
  listingKind: string;
  moderationStatus?: PartnerTourModerationStatus;
  submittedAt?: string | null;
  reviewNotes?: string | null;
  reviewedAt?: string | null;
  partnerOrganizationId?: string | null;
  createdByUserId?: string | null;
  countryId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mapLabel?: string | null;
  images?: { url: string; altText?: string | null; caption?: string | null; sortOrder?: number; isHero?: boolean }[];
  itineraryDays?: { dayNumber: number; title: string; description: string; sortOrder?: number }[];
  faqs?: { question: string; answer: string; sortOrder?: number }[];
  experienceItems?: { title: string; description: string; sortOrder?: number }[];
  included?: string[];
  excluded?: string[];
  relatedStoryIds?: string[];
  updatedAt?: string;
  createdAt?: string;
}

export type PartnerTourBody = {
  slug: string;
  name: string;
  shortDescription: string;
  locationLabel: string;
  location: string;
  countryLabel: string;
  region: string;
  price: number;
  duration: string;
  heroImageUrl: string;
  operatorsLabel?: string;
  overview: string;
  difficulty?: string;
  groupSize?: string;
  bestSeason?: string;
  meetingPoint?: string;
  highlights?: string[];
  status?: "DRAFT" | "ARCHIVED";
  countryId?: string;
  latitude?: number;
  longitude?: number;
  mapLabel?: string;
  images?: { url: string; altText?: string; caption?: string; sortOrder?: number; isHero?: boolean }[];
  itineraryDays?: { dayNumber: number; title: string; description: string; sortOrder?: number }[];
  faqs?: { question: string; answer: string; sortOrder?: number }[];
  lineItems?: { kind: "INCLUDED" | "EXCLUDED"; text: string; sortOrder?: number }[];
  experienceItems?: { title: string; description: string; sortOrder?: number }[];
};

export async function getPartnerTours(params?: {
  status?: PartnerTourStatus;
  moderationStatus?: PartnerTourModerationStatus;
  page?: number;
  limit?: number;
}): Promise<{ items: PartnerTour[]; total: number }> {
  const { data } = await api.get<{ items: PartnerTour[]; total: number }>("/partner/tours", {
    params,
  });
  return { items: Array.isArray(data?.items) ? data.items : [], total: data?.total ?? 0 };
}

export async function getPartnerTour(id: string): Promise<PartnerTour> {
  const { data } = await api.get<PartnerTour>(`/partner/tours/${encodeURIComponent(id)}`);
  return data;
}

export async function createPartnerTour(body: PartnerTourBody): Promise<PartnerTour> {
  const { data } = await api.post<PartnerTour>("/partner/tours", body);
  return data;
}

export async function updatePartnerTour(
  id: string,
  body: Partial<PartnerTourBody>
): Promise<PartnerTour> {
  const { data } = await api.patch<PartnerTour>(
    `/partner/tours/${encodeURIComponent(id)}`,
    body
  );
  return data;
}

export async function submitPartnerTour(id: string): Promise<PartnerTour> {
  const { data } = await api.post<PartnerTour>(
    `/partner/tours/${encodeURIComponent(id)}/submit`
  );
  return data;
}

export async function withdrawPartnerTour(id: string): Promise<PartnerTour> {
  const { data } = await api.post<PartnerTour>(
    `/partner/tours/${encodeURIComponent(id)}/withdraw`
  );
  return data;
}

export async function uploadPartnerImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ url: string }>("/partner/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// ——— Partner listing claims (Phase 4F) ———

export type ClaimStatus =
  | "PENDING"
  | "NEEDS_INFO"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

export interface TourListingClaim {
  id: string;
  tourId: string;
  organizationId: string;
  submittedByUserId: string;
  status: ClaimStatus;
  evidenceNotes: string;
  evidenceUrls: string[];
  reviewNotes?: string | null;
  reviewedByUserId?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tour?: {
    id: string;
    slug: string;
    name: string;
    status: string;
    listingKind: string;
    partnerOrganizationId?: string | null;
    locationLabel: string;
    heroImageUrl: string;
    shortDescription: string;
    heritageLinkCounts?: {
      stories: number;
      timelines: number;
      cultures: number;
      artifacts: number;
      manuscripts: number;
    };
  } | null;
  organization?: {
    id: string;
    name: string;
    slug: string;
    status: string;
    country: string;
    contactEmail: string;
  } | null;
  submittedByUser?: { id: string; name: string; email: string } | null;
  reviewedByUser?: { id: string; name: string; email: string } | null;
}

export interface ClaimEligibility {
  eligible: boolean;
  reason?: string;
  message?: string;
  existingClaimId?: string;
  existingClaimStatus?: ClaimStatus;
  organization?: { id: string; name: string; status: string };
  tour?: {
    id: string;
    slug: string;
    name: string;
    listingKind: string;
    status: string;
    partnerOrganizationId?: string | null;
  };
}

export async function getClaimEligibility(
  tourIdOrSlug: string
): Promise<ClaimEligibility> {
  const { data } = await api.get<ClaimEligibility>(
    `/partner/claims/eligibility/${encodeURIComponent(tourIdOrSlug)}`
  );
  return data;
}

export async function getPartnerClaims(params?: {
  status?: ClaimStatus;
  page?: number;
  limit?: number;
}): Promise<{ items: TourListingClaim[]; total: number }> {
  const { data } = await api.get<{ items: TourListingClaim[]; total: number }>(
    "/partner/claims",
    { params }
  );
  return { items: Array.isArray(data?.items) ? data.items : [], total: data?.total ?? 0 };
}

export async function getPartnerClaim(id: string): Promise<TourListingClaim> {
  const { data } = await api.get<TourListingClaim>(
    `/partner/claims/${encodeURIComponent(id)}`
  );
  return data;
}

export async function createTourListingClaim(body: {
  tourIdOrSlug: string;
  organizationId?: string;
  evidenceNotes: string;
  evidenceUrls?: string[];
}): Promise<TourListingClaim> {
  const { data } = await api.post<TourListingClaim>("/partner/claims", body);
  return data;
}

export async function resubmitTourListingClaim(
  id: string,
  body: { evidenceNotes: string; evidenceUrls?: string[] }
): Promise<TourListingClaim> {
  const { data } = await api.patch<TourListingClaim>(
    `/partner/claims/${encodeURIComponent(id)}/resubmit`,
    body
  );
  return data;
}

export async function withdrawTourListingClaim(id: string): Promise<TourListingClaim> {
  const { data } = await api.post<TourListingClaim>(
    `/partner/claims/${encodeURIComponent(id)}/withdraw`
  );
  return data;
}
