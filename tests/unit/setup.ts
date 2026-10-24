import { vi } from "vitest";

// cacheLife, cacheTag and updateTag only work inside a Next.js server with Cache Components. Unit tests call the
// cached functions directly, so these become no-ops that tests can inspect.
vi.mock("next/cache", () => ({
    cacheLife: vi.fn(),
    cacheTag: vi.fn(),
    updateTag: vi.fn(),
    revalidateTag: vi.fn(),
}));

// connection() marks request-time work; outside a request there's nothing to wait for.
vi.mock("next/server", async (importOriginal) => ({
    ...(await importOriginal<typeof import("next/server")>()),
    connection: vi.fn(async () => {}),
}));
