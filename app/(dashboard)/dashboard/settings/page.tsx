"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Settings, Moon, Sun, Bell } from "lucide-react";

const SETTINGS_STORAGE_KEY = "archive_settings";

type StoredSettings = {
  emailNotifications?: boolean;
};

function getStoredSettings(): StoredSettings {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredSettings;
  } catch {
    return {};
  }
}

function setStoredSettings(settings: StoredSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export default function DashboardSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getStoredSettings();
    setEmailNotifications(s.emailNotifications ?? false);
  }, []);

  const handleEmailNotificationsChange = (checked: boolean) => {
    setEmailNotifications(checked);
    setStoredSettings({ ...getStoredSettings(), emailNotifications: checked });
  };

  if (!mounted) {
    return (
      <main className="py-8 sm:py-12 px-4 sm:px-6 safe-area-inset">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 sm:py-12 px-4 sm:px-6 safe-area-inset">
      <div className="max-w-xl mx-auto">
        <p className="flex items-center gap-2 mb-6 text-orange-700 dark:text-orange-400 font-mono text-[10px] uppercase tracking-[0.3em]">
          <Settings size={16} aria-hidden /> Settings
        </p>
        <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white mb-8">
          Settings
        </h1>

        {/* Theme */}
        <section className="mb-10" aria-labelledby="theme-heading">
          <h2 id="theme-heading" className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-4">
            {theme === "dark" ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
            Appearance
          </h2>
          <p className="text-stone-500 text-sm mb-4">
            Choose how the archive looks. You can also use the theme toggle in the main site navigation.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={theme === "light" ? "default" : "outline"}
              className="rounded-none font-mono text-[10px] uppercase min-h-[44px]"
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
            >
              Light
            </Button>
            <Button
              type="button"
              variant={theme === "dark" ? "default" : "outline"}
              className="rounded-none font-mono text-[10px] uppercase min-h-[44px]"
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              Dark
            </Button>
          </div>
        </section>

        {/* Notifications (localStorage) */}
        <section className="mb-10 pt-8 border-t border-stone-200 dark:border-stone-800" aria-labelledby="notifications-heading">
          <h2 id="notifications-heading" className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-4">
            <Bell size={16} aria-hidden /> Notifications
          </h2>
          <p className="text-stone-500 text-sm mb-4">
            Your preferences are saved on this device. We may add email alerts in the future.
          </p>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => handleEmailNotificationsChange(e.target.checked)}
              className="rounded border-stone-300 text-orange-700 focus:ring-orange-700"
              aria-describedby="notifications-hint"
            />
            <span className="font-mono text-sm text-stone-900 dark:text-white group-hover:text-stone-700">
              Email notifications (when available)
            </span>
          </label>
          <p id="notifications-hint" className="text-stone-500 text-xs mt-2">
            Saved on this device. If we add email alerts later, this setting will apply.
          </p>
        </section>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-700 min-h-[44px]"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
