import { expect, test } from "@playwright/test";
import { openEditor, signInAs } from "./session";

const PDF = Buffer.from("%PDF-1.4\n1 0 obj << /Type /Catalog >> endobj\ntrailer << /Root 1 0 R >>\n%%EOF\n");
// A 1x1 transparent PNG.
const PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64",
);

test.beforeEach(async ({ context, baseURL }) => signInAs(context, baseURL!));

test("uploading a PDF and saving changes where /resume.pdf points", async ({ page }) => {
    await openEditor(page, "/admin/profile");
    const resume = page.getByRole("group", { name: "Resume" });
    await resume
        .getByLabel(/Upload a PDF/)
        .setInputFiles({ name: "resume.pdf", mimeType: "application/pdf", buffer: PDF });
    await expect(resume.getByRole("status")).toHaveText("Uploaded. Save to publish it.");
    const url = await resume.getByLabel("Resume PDF", { exact: true }).inputValue();
    expect(url).toMatch(/^\/uploads\/resume\/[0-9a-f-]{36}\.pdf$/);

    // Uploading alone doesn't publish anything.
    expect((await page.request.get("/resume.pdf", { maxRedirects: 0 })).headers().location).not.toBe(url);

    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Saved" })).toBeVisible();
    for (const path of ["/resume.pdf", "/resume"]) {
        const res = await page.request.get(path, { maxRedirects: 0 });
        expect(res.status()).toBe(307);
        expect(res.headers().location).toBe(url);
    }
    const pdf = await page.request.get("/resume.pdf");
    expect(pdf.headers()["content-type"]).toBe("application/pdf");
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("a file that isn't a PDF is rejected as the resume", async ({ page }) => {
    await openEditor(page, "/admin/profile");
    const resume = page.getByRole("group", { name: "Resume" });
    const field = resume.getByLabel("Resume PDF", { exact: true });
    const before = await field.inputValue();
    await resume
        .getByLabel(/Upload a PDF/)
        .setInputFiles({ name: "resume.docx", mimeType: "application/msword", buffer: Buffer.from("not a pdf") });
    await expect(resume.getByRole("alert")).toHaveText("Not uploaded: The resume must be a PDF.");
    await expect(field).toHaveValue(before);
});

test("the upload endpoint checks the file itself, not just its claimed type", async ({ page, playwright, baseURL }) => {
    const res = await page.request.post("/admin/upload", {
        multipart: {
            kind: "resume",
            file: { name: "fake.pdf", mimeType: "application/pdf", buffer: Buffer.from("hello") },
        },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toMatch(/PDF/);

    // Without a session the upload never reaches storage, and the route says why in JSON the editor can show.
    const anonymous = await playwright.request.newContext({ baseURL });
    const denied = await anonymous.post("/admin/upload", {
        multipart: { kind: "resume", file: { name: "r.pdf", mimeType: "application/pdf", buffer: PDF } },
        maxRedirects: 0,
    });
    expect(denied.status()).toBe(401);
    expect((await denied.json()).error).toBeTruthy();
    await anonymous.dispose();
});

test("saving a stage photo without alt text is rejected and the alt field is flagged", async ({ page }) => {
    await openEditor(page, "/admin/events");
    await page.getByRole("button", { name: "Add photo" }).click();
    const photo = page.getByRole("group", { name: /^10\. / });
    await photo.getByLabel(/Upload a photo/).setInputFiles({ name: "stage.png", mimeType: "image/png", buffer: PNG });
    await expect(photo.getByRole("status")).toHaveText("Uploaded. Save to publish it.");
    await expect(photo.getByLabel("Photo", { exact: true })).toHaveValue(/^\/uploads\/photos\/[0-9a-f-]{36}\.png$/);
    await photo.getByLabel("Caption").fill("a new photo");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByRole("alert").filter({ hasText: "Nothing was saved" })).toContainText("Alt text");
    const alt = photo.getByLabel("Alt text");
    await expect(alt).toHaveAttribute("aria-invalid", "true");
    await expect(photo.locator(".field-error")).toHaveText("Required");

    await page.goto("/");
    await expect(page.locator(".mosaic .tile")).toHaveCount(9);
});

test("an upload's message stays with its photo when the list changes", async ({ page }) => {
    await openEditor(page, "/admin/events");
    const photos = page.getByRole("group", { name: /^Stage photos/ });
    const item = (n: number) => photos.getByRole("group", { name: new RegExp(`^${n}\\. `) });
    const third = item(3);
    await third.getByLabel(/Upload a photo/).setInputFiles({ name: "stage.png", mimeType: "image/png", buffer: PNG });
    await expect(third.getByRole("status")).toHaveText("Uploaded. Save to publish it.");
    const uploaded = await third.getByLabel("Photo", { exact: true }).inputValue();

    await item(2)
        .getByRole("button", { name: /^Remove: / })
        .click();
    // The uploaded photo is now second, and its message moved with it.
    const second = item(2);
    await expect(second.getByLabel("Photo", { exact: true })).toHaveValue(uploaded);
    await expect(second.getByRole("status")).toHaveText("Uploaded. Save to publish it.");
    await expect(item(3).getByRole("status")).toHaveText("");
});

test("a photo upload only takes images", async ({ page }) => {
    await openEditor(page, "/admin/panels");
    // HawkHacks shows a photo; other tests change Konfer's art.
    const art = page.getByRole("group", { name: /^3\. hawkhacks/ }).getByRole("group", { name: "Art" });
    await art
        .getByLabel(/Upload a photo/)
        .setInputFiles({ name: "notes.pdf", mimeType: "application/pdf", buffer: PDF });
    await expect(art.getByRole("alert")).toContainText("Photos must be JPEG, PNG, WebP, AVIF or GIF images.");
});
