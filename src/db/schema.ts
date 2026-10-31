import { index, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/** The current content: one validated JSON document per section (profile, products, events, panels). */
export const contentSections = pgTable("content_sections", {
    key: text("key").primaryKey(),
    data: jsonb("data").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Append-only history: every save records the section's previous document here. */
export const contentRevisions = pgTable(
    "content_revisions",
    {
        id: serial("id").primaryKey(),
        key: text("key").notNull(),
        data: jsonb("data").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    },
    (t) => [index("content_revisions_key_created_at_idx").on(t.key, t.createdAt)],
);
