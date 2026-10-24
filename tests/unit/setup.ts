import { vi } from "vitest";

// cacheLife, cacheTag and updateTag only work inside a Next.js server with Cache Components. Unit tests call the
// cached functions directly, so these become no-ops that tests can inspect.
vi.mock("next/cache", () => ({
    cacheLife: vi.fn(),
    cacheTag: vi.fn(),
    updateTag: vi.fn(),
    revalidateTag: vi.fn(),
}));
