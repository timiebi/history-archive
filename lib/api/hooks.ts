"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from "@tanstack/react-query";
import {
    authForgotPassword,
    authLogin,
    authResetPassword,
    authSignUp,
    adminGetCultures,
    adminGetStories,
    adminModerateCulture,
    adminModerateStory,
    changePassword,
    createStory,
    getArtifacts,
    getCategories,
    getContributorOverview,
    getContributors,
    getCountries,
    getCountryById,
    getCultures,
    getLibrary,
    getManuscriptById,
    getMe,
    getNotifications,
    getStories,
    getStoryByExternalId,
    getStoryById,
    getTimelineById,
    getTimelines,
    getTourByIdOrSlug,
    getTours,
    getTourismPartners,
    getMyPartnerOrganizations,
    createPartnerOrganization,
    updatePartnerOrganization,
    getPartnerMembers,
    addPartnerMember,
    removePartnerMember,
    getPartnerTours,
    getPartnerTour,
    createPartnerTour,
    updatePartnerTour,
    submitPartnerTour,
    withdrawPartnerTour,
    getClaimEligibility,
    getPartnerClaims,
    getPartnerClaim,
    createTourListingClaim,
    resubmitTourListingClaim,
    withdrawTourListingClaim,
    markAllNotificationsRead,
    markNotificationRead,
    toggleStoryReaction,
    updateMe,
    type Artifact,
    type AdminCultureModerationItem,
    type AdminStoryModerationItem,
    type AuthLoginBody,
    type AuthSignUpBody,
    type ChangePasswordBody,
    type ContributorOverviewResponse,
    type CreateStoryBody,
    type MeUser,
    type ReactionType,
    type UserNotification,
} from "./client";
import type { Category, Country, Culture, Manuscript, Story, Timeline, TimelineDetail, TourismPartner } from "./types";
import { mapApiTourToTour } from "@/lib/tourism/map-api-tour";
import type { Tour } from "@/lib/tourism/types";

const keys = {
  categories: ["api", "categories"] as const,
  countries: ["api", "countries"] as const,
  country: (id: string) => ["api", "countries", id] as const,
  stories: (params?: Record<string, unknown>) => ["api", "stories", params ?? {}] as const,
  story: (id: string) => ["api", "stories", id] as const,
  storyExternal: (source: string, externalId: string) =>
    ["api", "stories", "external", source, externalId] as const,
  contributors: ["api", "contributors"] as const,
  artifacts: ["api", "artifacts"] as const,
  cultures: (params?: Record<string, unknown>) => ["api", "cultures", params ?? {}] as const,
  timelines: ["api", "timelines"] as const,
  timeline: (id: string) => ["api", "timelines", id] as const,
  contributorOverview: ["api", "contributors", "me", "overview"] as const,
  me: ["api", "users", "me"] as const,
  notifications: ["api", "notifications"] as const,
  adminStories: (params?: Record<string, unknown>) => ["api", "admin", "stories", params ?? {}] as const,
  adminCultures: (params?: Record<string, unknown>) => ["api", "admin", "cultures", params ?? {}] as const,
  library: ["api", "library"] as const,
  manuscript: (id: string) => ["api", "library", id] as const,
  tourismPartners: (p: { storyId: string; cultureId: string }) =>
    ["api", "tourism", "partners", p.storyId, p.cultureId] as const,
  tours: (params?: Record<string, unknown>) => ["api", "tourism", "tours", params ?? {}] as const,
  tour: (idOrSlug: string) => ["api", "tourism", "tours", idOrSlug] as const,
  myPartnerOrgs: ["api", "partner", "organizations", "me"] as const,
  partnerMembers: (orgId: string) => ["api", "partner", "organizations", orgId, "members"] as const,
  partnerTours: (params?: Record<string, unknown>) =>
    ["api", "partner", "tours", params ?? {}] as const,
  partnerTour: (id: string) => ["api", "partner", "tours", id] as const,
  claimEligibility: (tourIdOrSlug: string) =>
    ["api", "partner", "claims", "eligibility", tourIdOrSlug] as const,
  partnerClaims: (params?: Record<string, unknown>) =>
    ["api", "partner", "claims", params ?? {}] as const,
  partnerClaim: (id: string) => ["api", "partner", "claims", id] as const,
};

export function useCategories(
  options?: Omit<
    UseQueryOptions<{ items?: Category[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.categories,
    queryFn: async () => {
      const res = await getCategories();
      const items = (res?.items ?? res) as Category[];
      return { items: Array.isArray(items) ? items : [] };
    },
    retry: false,
    ...options,
  });
}

export function useCountries(
  options?: Omit<
    UseQueryOptions<{ items?: Country[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.countries,
    queryFn: async () => {
      const res = await getCountries();
      const items = (res?.items ?? res) as Country[];
      return { items: Array.isArray(items) ? items : [] };
    },
    retry: false,
    ...options,
  });
}

export function useCountry(
  id: string | null,
  options?: Omit<
    UseQueryOptions<Country, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.country(id ?? ""),
    queryFn: () => getCountryById(id!) as Promise<Country>,
    enabled: !!id,
    ...options,
  });
}

export function useStories(
  params?: { page?: number; limit?: number; search?: string; categoryId?: string },
  options?: Omit<
    UseQueryOptions<{ items?: Story[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.stories(params),
    queryFn: async () => {
      const res = await getStories(params);
      const items = (res?.items ?? res) as Story[];
      return { items: Array.isArray(items) ? items : [] };
    },
    retry: false,
    ...options,
  });
}

export function useArtifacts(
  options?: Omit<
    UseQueryOptions<Artifact[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.artifacts,
    queryFn: getArtifacts,
    retry: false,
    ...options,
  });
}

export function useCultures(
  params?: { region?: string; year?: number; search?: string },
  options?: Omit<
    UseQueryOptions<{ items: Culture[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.cultures(params),
    queryFn: async () => {
      const res = await getCultures(params);
      return { items: res.items ?? [] };
    },
    retry: false,
    ...options,
  });
}

export function useTimelines(
  options?: Omit<
    UseQueryOptions<{ items: Timeline[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.timelines,
    queryFn: async () => {
      const res = await getTimelines();
      return { items: res.items ?? [] };
    },
    retry: false,
    ...options,
  });
}

export function useTimeline(
  id: string | null,
  options?: Omit<UseQueryOptions<TimelineDetail | null, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.timeline(id ?? ""),
    queryFn: () => getTimelineById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useLibrary(
  options?: Omit<
    UseQueryOptions<{ items: Manuscript[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.library,
    queryFn: async () => {
      const res = await getLibrary();
      return { items: res.items ?? [] };
    },
    retry: false,
    ...options,
  });
}

export function useManuscript(
  id: string | null,
  options?: Omit<UseQueryOptions<Manuscript | null, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.manuscript(id ?? ""),
    queryFn: () => getManuscriptById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useContributors(
  options?: Omit<
    UseQueryOptions<{ items?: { id: string; name: string; email: string; createdAt?: string }[] }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: keys.contributors,
    queryFn: async () => {
      const res = await getContributors();
      return { items: (res?.items ?? []) as { id: string; name: string; email: string; createdAt?: string }[] };
    },
    retry: false,
    ...options,
  });
}

export function useStory(
  id: string | null,
  options?: Omit<UseQueryOptions<Story, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.story(id ?? ""),
    queryFn: () => getStoryById(id!) as Promise<Story>,
    enabled: !!id,
    ...options,
  });
}

export function useStoryByExternalId(
  source: string | null,
  externalId: string | null,
  options?: Omit<UseQueryOptions<Story, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.storyExternal(source ?? "", externalId ?? ""),
    queryFn: () =>
      getStoryByExternalId(source!, externalId!) as Promise<Story>,
    enabled: !!(source && externalId),
    ...options,
  });
}

export function useTourismPartners(
  params: { storyId?: string | null; cultureId?: string | null },
  options?: Omit<UseQueryOptions<TourismPartner[], Error>, "queryKey" | "queryFn">
) {
  const storyId = params.storyId?.trim() || undefined;
  const cultureId = params.cultureId?.trim() || undefined;
  const apiParams = storyId ? { storyId } : cultureId ? { cultureId } : null;

  return useQuery({
    queryKey: keys.tourismPartners({
      storyId: storyId ?? "",
      cultureId: cultureId ?? "",
    }),
    queryFn: async () => {
      try {
        return await getTourismPartners(apiParams!);
      } catch {
        return [];
      }
    },
    retry: false,
    staleTime: 60_000,
    ...options,
    /** Require a param; callers may pass `enabled: false` (e.g. defer until in view). */
    enabled: !!apiParams && options?.enabled !== false,
  });
}

export function useTours(
  params?: { region?: string; search?: string; page?: number; limit?: number },
  options?: Omit<UseQueryOptions<Tour[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.tours(params),
    queryFn: async () => {
      const res = await getTours(params);
      return (res.items ?? []).map(mapApiTourToTour);
    },
    retry: false,
    ...options,
  });
}

export function useTour(
  idOrSlug: string,
  options?: Omit<UseQueryOptions<Tour | null, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: keys.tour(idOrSlug),
    queryFn: async () => {
      const apiTour = await getTourByIdOrSlug(idOrSlug);
      return apiTour ? mapApiTourToTour(apiTour) : null;
    },
    enabled: Boolean(idOrSlug),
    retry: false,
    ...options,
  });
}

export { keys as apiQueryKeys };

export function useApiQueryClient() {
  return useQueryClient();
}

// ——— Auth mutations (backend POST /auth/login, POST /auth/register) ———
export function useLogin(
  options?: UseMutationOptions<
    import("./client").AuthResponse,
    Error,
    AuthLoginBody
  >
) {
  return useMutation({
    mutationFn: authLogin,
    ...options,
  });
}

export function useSignUp(
  options?: UseMutationOptions<
    import("./client").AuthResponse,
    Error,
    AuthSignUpBody
  >
) {
  return useMutation({
    mutationFn: authSignUp,
    ...options,
  });
}

// ——— Contributor dashboard overview ———
export function useContributorOverview(
  options?: Omit<
    UseQueryOptions<ContributorOverviewResponse, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.contributorOverview,
    queryFn: getContributorOverview,
    ...options,
  });
}

// ——— Current user profile (GET /users/me) ———
export function useMe(
  options?: Omit<UseQueryOptions<MeUser, Error>, "queryKey" | "queryFn"> & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.me,
    queryFn: getMe,
    ...options,
  });
}

// ——— Update profile (PATCH /users/me) ———
export function useUpdateMe(
  options?: UseMutationOptions<MeUser, Error, { name?: string }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData(keys.me, data);
    },
    ...options,
  });
}

// ——— Change password (PATCH /users/me/password) ———
export function useChangePassword(
  options?: UseMutationOptions<{ message?: string }, Error, ChangePasswordBody>
) {
  return useMutation({
    mutationFn: changePassword,
    ...options,
  });
}

export function useNotifications(
  limit = 30,
  options?: Omit<
    UseQueryOptions<{ items: UserNotification[]; unreadCount: number }, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: [...keys.notifications, limit] as const,
    queryFn: () => getNotifications(limit),
    refetchInterval: 60000,
    ...options,
  });
}

export function useMarkAllNotificationsRead(
  options?: UseMutationOptions<{ updated: number }, Error, void>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.notifications });
    },
    ...options,
  });
}

export function useMarkNotificationRead(
  options?: UseMutationOptions<{ updated: number }, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.notifications });
    },
    ...options,
  });
}

export function useAdminStories(
  params?: { page?: number; limit?: number; status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES" },
  options?: Omit<UseQueryOptions<{ items: AdminStoryModerationItem[]; total: number }, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: keys.adminStories(params),
    queryFn: () => adminGetStories(params),
    ...options,
  });
}

export function useModerateStory(
  options?: UseMutationOptions<
    { message: string },
    Error,
    {
      storyId: string;
      body: {
        status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
        visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
        consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
        verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
        reviewNotes?: string;
      };
    }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ storyId, body }) => adminModerateStory(storyId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "admin", "stories"] });
      queryClient.invalidateQueries({ queryKey: keys.stories() });
    },
    ...options,
  });
}

export function useAdminCultures(
  params?: { page?: number; limit?: number; status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES" },
  options?: Omit<UseQueryOptions<{ items: AdminCultureModerationItem[]; total: number }, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: keys.adminCultures(params),
    queryFn: () => adminGetCultures(params),
    ...options,
  });
}

export function useModerateCulture(
  options?: UseMutationOptions<
    { message: string },
    Error,
    {
      cultureId: string;
      body: {
        status?: "PENDING" | "APPROVED" | "REJECTED" | "NEEDS_CHANGES";
        visibility?: "PUBLIC" | "RESTRICTED" | "PRIVATE";
        consentStatus?: "UNKNOWN" | "REQUESTED" | "GRANTED" | "DENIED";
        verificationStatus?: "UNVERIFIED" | "COMMUNITY_VERIFIED" | "EXPERT_REVIEWED";
        reviewNotes?: string;
      };
    }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cultureId, body }) => adminModerateCulture(cultureId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "admin", "cultures"] });
      queryClient.invalidateQueries({ queryKey: keys.cultures() });
    },
    ...options,
  });
}

// ——— Create story (contributors/admins) ———
export function useCreateStory(
  options?: UseMutationOptions<
    Record<string, unknown>,
    Error,
    CreateStoryBody
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.stories() });
      queryClient.invalidateQueries({ queryKey: keys.contributorOverview });
    },
    ...options,
  });
}

// ——— Story reaction (auth) ———
export function useToggleStoryReaction(
  storyId: string | null,
  options?: UseMutationOptions<unknown, Error, ReactionType>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ReactionType) => toggleStoryReaction(storyId!, type),
    onSuccess: (_, __, ___) => {
      if (storyId) queryClient.invalidateQueries({ queryKey: keys.story(storyId) });
      queryClient.invalidateQueries({ queryKey: keys.stories() });
    },
    ...options,
  });
}

// ——— Forgot / reset password ———
export function useForgotPassword(
  options?: UseMutationOptions<{ message?: string }, Error, string>
) {
  return useMutation({
    mutationFn: authForgotPassword,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<{ message?: string }, Error, { token: string; newPassword: string }>
) {
  return useMutation({
    mutationFn: ({ token, newPassword }) => authResetPassword(token, newPassword),
    ...options,
  });
}

// ——— Partner organizations (Phase 4A) ———
export function useMyPartnerOrganizations(
  options?: Omit<
    UseQueryOptions<
      { items: { membershipRole: string; organization: import("./client").PartnerOrganization }[] },
      Error
    >,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.myPartnerOrgs,
    queryFn: getMyPartnerOrganizations,
    ...options,
  });
}

export function useCreatePartnerOrganization(
  options?: UseMutationOptions<
    import("./client").PartnerOrganization,
    Error,
    import("./client").CreatePartnerOrganizationBody
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.myPartnerOrgs });
    },
    ...options,
  });
}

export function useUpdatePartnerOrganization(
  options?: UseMutationOptions<
    import("./client").PartnerOrganization,
    Error,
    { orgId: string; body: import("./client").UpdatePartnerOrganizationBody }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, body }) => updatePartnerOrganization(orgId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.myPartnerOrgs });
    },
    ...options,
  });
}

export function usePartnerMembers(
  orgId: string | null,
  options?: Omit<
    UseQueryOptions<{ items: import("./client").PartnerMembership[]; total: number }, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.partnerMembers(orgId ?? ""),
    queryFn: () => getPartnerMembers(orgId!),
    enabled: !!orgId && (options?.enabled ?? true),
    ...options,
  });
}

export function useAddPartnerMember(
  options?: UseMutationOptions<
    import("./client").PartnerMembership,
    Error,
    { orgId: string; email: string }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, email }) =>
      addPartnerMember(orgId, { email, role: "MANAGER" }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: keys.partnerMembers(vars.orgId) });
      queryClient.invalidateQueries({ queryKey: keys.myPartnerOrgs });
    },
    ...options,
  });
}

export function useRemovePartnerMember(
  options?: UseMutationOptions<
    { message: string },
    Error,
    { orgId: string; membershipId: string }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, membershipId }) => removePartnerMember(orgId, membershipId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: keys.partnerMembers(vars.orgId) });
      queryClient.invalidateQueries({ queryKey: keys.myPartnerOrgs });
    },
    ...options,
  });
}

export function usePartnerTours(
  params?: {
    status?: import("./client").PartnerTourStatus;
    moderationStatus?: import("./client").PartnerTourModerationStatus;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<{ items: import("./client").PartnerTour[]; total: number }, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.partnerTours(params),
    queryFn: () => getPartnerTours(params),
    ...options,
  });
}

export function usePartnerTour(
  id: string | null,
  options?: Omit<
    UseQueryOptions<import("./client").PartnerTour, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.partnerTour(id ?? ""),
    queryFn: () => getPartnerTour(id!),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreatePartnerTour(
  options?: UseMutationOptions<
    import("./client").PartnerTour,
    Error,
    import("./client").PartnerTourBody
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPartnerTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "tours"] });
    },
    ...options,
  });
}

export function useUpdatePartnerTour(
  options?: UseMutationOptions<
    import("./client").PartnerTour,
    Error,
    { id: string; body: Partial<import("./client").PartnerTourBody> }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => updatePartnerTour(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "tours"] });
      queryClient.invalidateQueries({ queryKey: keys.partnerTour(data.id) });
    },
    ...options,
  });
}

export function useSubmitPartnerTour(
  options?: UseMutationOptions<import("./client").PartnerTour, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => submitPartnerTour(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "tours"] });
      queryClient.invalidateQueries({ queryKey: keys.partnerTour(data.id) });
    },
    ...options,
  });
}

export function useWithdrawPartnerTour(
  options?: UseMutationOptions<import("./client").PartnerTour, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawPartnerTour(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "tours"] });
      queryClient.invalidateQueries({ queryKey: keys.partnerTour(data.id) });
    },
    ...options,
  });
}

export function useClaimEligibility(
  tourIdOrSlug: string | null,
  options?: Omit<
    UseQueryOptions<import("./client").ClaimEligibility, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.claimEligibility(tourIdOrSlug ?? ""),
    queryFn: () => getClaimEligibility(tourIdOrSlug!),
    enabled: !!tourIdOrSlug && (options?.enabled ?? true),
    ...options,
  });
}

export function usePartnerClaims(
  params?: {
    status?: import("./client").ClaimStatus;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<{ items: import("./client").TourListingClaim[]; total: number }, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.partnerClaims(params),
    queryFn: () => getPartnerClaims(params),
    ...options,
  });
}

export function usePartnerClaim(
  id: string | null,
  options?: Omit<
    UseQueryOptions<import("./client").TourListingClaim, Error>,
    "queryKey" | "queryFn"
  > & { enabled?: boolean }
) {
  return useQuery({
    queryKey: keys.partnerClaim(id ?? ""),
    queryFn: () => getPartnerClaim(id!),
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateTourListingClaim(
  options?: UseMutationOptions<
    import("./client").TourListingClaim,
    Error,
    {
      tourIdOrSlug: string;
      organizationId?: string;
      evidenceNotes: string;
      evidenceUrls?: string[];
    }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTourListingClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "claims"] });
    },
    ...options,
  });
}

export function useResubmitTourListingClaim(
  options?: UseMutationOptions<
    import("./client").TourListingClaim,
    Error,
    { id: string; evidenceNotes: string; evidenceUrls?: string[] }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => resubmitTourListingClaim(id, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "claims"] });
      queryClient.invalidateQueries({ queryKey: keys.partnerClaim(data.id) });
    },
    ...options,
  });
}

export function useWithdrawTourListingClaim(
  options?: UseMutationOptions<import("./client").TourListingClaim, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawTourListingClaim(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "partner", "claims"] });
      queryClient.invalidateQueries({ queryKey: keys.partnerClaim(data.id) });
    },
    ...options,
  });
}
