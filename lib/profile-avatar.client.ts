"use client";

import { useEffect, useState } from "react";

const PROFILE_AVATAR_STORAGE_KEY = "honestly.profile-avatar-override";
const PROFILE_AVATAR_UPDATED_EVENT = "honestly:profile-avatar-updated";

export function getStoredProfileAvatarOverride(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const value = window.localStorage.getItem(PROFILE_AVATAR_STORAGE_KEY);
  return value && value.trim().length ? value : undefined;
}

export function saveProfileAvatarOverride(avatarUrl: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PROFILE_AVATAR_STORAGE_KEY, avatarUrl);
  window.dispatchEvent(new Event(PROFILE_AVATAR_UPDATED_EVENT));
}

export function clearProfileAvatarOverride(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PROFILE_AVATAR_STORAGE_KEY);
  window.dispatchEvent(new Event(PROFILE_AVATAR_UPDATED_EVENT));
}

export function usePreferredAvatar(defaultAvatarUrl?: string): string | undefined {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(defaultAvatarUrl);

  useEffect(() => {
    const syncAvatar = () => {
      setAvatarUrl(getStoredProfileAvatarOverride() ?? defaultAvatarUrl);
    };

    syncAvatar();

    window.addEventListener("storage", syncAvatar);
    window.addEventListener(PROFILE_AVATAR_UPDATED_EVENT, syncAvatar);

    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener(PROFILE_AVATAR_UPDATED_EVENT, syncAvatar);
    };
  }, [defaultAvatarUrl]);

  return avatarUrl;
}
