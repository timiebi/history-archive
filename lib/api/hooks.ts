"use client";

import {
  useQuery,
  useQueryClient,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  getCategories,
  getCountries,
  getCountryById,
  getStories,
  getStoryById,
  getStoryByExternalId,
  createStory,
  toggleStoryReaction,
  authLogin,
  authSignUp,
  authForgotPassword,
  authResetPassword,
  getContributors,
  getArtifacts,
  getCultures,
  getTimelines,
  getTimelineById,
  getContributorOverview,
  getMe,
  updateMe,
  changePassword,
  getLibrary,
  getManuscriptById,
  type AuthLoginBody,
  type AuthSignUpBody,
  type CreateStoryBody,
  type Artifact,
  type ReactionType,
  type ContributorOverviewResponse,
  type MeUser,
  type ChangePasswordBody,
} from "./client";
import type { Category, Country, Story, Timeline, TimelineDetail, Manuscript, Culture } from "./types";

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
  library: ["api", "library"] as const,
  manuscript: (id: string) => ["api", "library", id] as const,
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
