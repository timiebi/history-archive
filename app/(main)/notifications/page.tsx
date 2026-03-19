"use client";

import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/lib/api";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setHasToken(!!localStorage.getItem(AUTH_TOKEN_KEY));
    }
  }, []);
  const { data, isPending } = useNotifications(60, { enabled: hasToken });
  const markAllRead = useMarkAllNotificationsRead();
  const markOneRead = useMarkNotificationRead();

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const unreadCount = data?.unreadCount ?? 0;

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] px-6 py-28">
        <div className="max-w-3xl mx-auto">
          <p className="text-stone-500 font-mono text-xs uppercase tracking-widest">Loading...</p>
        </div>
      </main>
    );
  }

  if (!hasToken) {
    return (
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] px-6 py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-4 text-stone-600 dark:text-stone-400 font-mono text-xs uppercase tracking-widest">
            Sign in to view your notifications.
          </p>
          <Link
            href="/auth/login?redirect=%2Fnotifications"
            className="inline-block mt-6 px-5 py-3 bg-orange-700 text-white font-mono text-[10px] uppercase tracking-widest"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] px-6 py-28">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-3 text-stone-500 font-mono text-[10px] uppercase tracking-widest">
              Unread: {unreadCount}
            </p>
          </div>
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || unreadCount === 0}
            className="px-4 py-2 border border-stone-300 dark:border-stone-700 font-mono text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>

        <section className="mt-8 border border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
          {isPending ? (
            <p className="p-6 text-stone-500 font-mono text-xs uppercase tracking-widest">Loading notifications...</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-stone-500 font-mono text-xs uppercase tracking-widest">No notifications yet.</p>
          ) : (
            items.map((n) => (
              <article
                key={n.id}
                className={`p-5 ${n.read ? "bg-transparent" : "bg-orange-50/60 dark:bg-orange-950/20"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-stone-900 dark:text-stone-100">
                    {n.title}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 whitespace-nowrap">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-stone-700 dark:text-stone-300">{n.message}</p>
                <div className="mt-3 flex items-center gap-4">
                  {n.storyId && (
                    <Link
                      href={`/stories/${n.storyId}?notificationId=${encodeURIComponent(n.id)}`}
                      onClick={() => {
                        if (!n.read) markOneRead.mutate(n.id);
                      }}
                      className="text-[10px] font-mono uppercase tracking-widest text-orange-700 dark:text-orange-400"
                    >
                      Open story
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markOneRead.mutate(n.id)}
                      disabled={markOneRead.isPending}
                      className="text-[10px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 disabled:opacity-50"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
