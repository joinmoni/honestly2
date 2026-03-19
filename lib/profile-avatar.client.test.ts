import { clearProfileAvatarOverride, getStoredProfileAvatarOverride, saveProfileAvatarOverride } from "@/lib/profile-avatar.client";

describe("profile avatar local persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and reads a profile avatar override", () => {
    saveProfileAvatarOverride("data:image/png;base64,abc123");

    expect(getStoredProfileAvatarOverride()).toBe("data:image/png;base64,abc123");
  });

  it("clears the stored avatar override", () => {
    saveProfileAvatarOverride("data:image/png;base64,abc123");
    clearProfileAvatarOverride();

    expect(getStoredProfileAvatarOverride()).toBeUndefined();
  });
});
