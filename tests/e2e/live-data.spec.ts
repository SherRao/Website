import { expect, test } from "@playwright/test";

const track = {
    title: "Motion Sickness",
    artist: "Phoebe Bridgers",
    album: "Stranger in the Alps",
    albumArt: "",
    url: "https://open.spotify.com/track/xyz",
    isPlaying: true,
};

test("music card shows the playing track", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.route("**/api/spotify/now-playing", (r) => r.fulfill({ json: track }));
    await page.goto("/#off");
    const card = page.locator("#off .card").first();
    await expect(card.locator(".now-track b")).toHaveText("Motion Sickness");
    await expect(card.locator(".now-track")).toHaveAttribute("href", track.url);
    await expect(card).toContainText("playing now on spotify");
    expect(errors).toEqual([]);
});

test("music card shows its idle state when nothing is playing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.route("**/api/spotify/now-playing", (r) => r.fulfill({ json: null }));
    await page.goto("/#off");
    await expect(page.locator("#off .card").first()).toContainText("not listening right now");
    expect(errors).toEqual([]);
});

test("music card survives the endpoint failing", async ({ page }) => {
    await page.route("**/api/spotify/now-playing", (r) => r.fulfill({ status: 500, body: "boom" }));
    await page.goto("/#off");
    await expect(page.locator("#off .card").first()).toContainText("not listening right now");
});

test("films card lists four recent films", async ({ page }) => {
    await page.goto("/#off");
    await expect(page.locator("#off .films li")).toHaveCount(4);
});
