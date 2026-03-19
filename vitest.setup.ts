import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

export const routerPushMock = vi.fn();
export const routerRefreshMock = vi.fn();
export const routerReplaceMock = vi.fn();
export const routerPrefetchMock = vi.fn();

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const nextProps = { ...props };
    delete nextProps.fill;
    return React.createElement("img", nextProps);
  }
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPushMock,
    refresh: routerRefreshMock,
    replace: routerReplaceMock,
    prefetch: routerPrefetchMock
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  notFound: vi.fn()
}));
