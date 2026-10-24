// Temporary: the values live in tests/fixtures/content until the site reads the data layer (removed in 8.3).
import { fixtures } from "../../tests/fixtures/content";

const { site, socials, glance, letterboxdUser, ...rest } = fixtures.profile;
export { site, socials, glance, letterboxdUser };
export const profile = { ...rest, resume: rest.resume.url };
