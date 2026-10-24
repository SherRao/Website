import type { Content } from "@/content/types";
import { events } from "./events";
import { panels } from "./panels";
import { products } from "./products";
import { profile } from "./profile";

/**
 * The site's content as of the move to the database. The seed script copies it into the database, and the site and
 * tests read it directly when CONTENT_SOURCE=fixtures (CI, Playwright, and the rollback path).
 */
export const fixtures: Content = { profile, products, events, panels };
