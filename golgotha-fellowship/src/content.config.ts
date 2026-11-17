import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Content collections. Church staff edit the files in src/content/ - never the page
 * components. Files whose name starts with "_" are templates and are ignored.
 * See docs/CONTENT_GUIDE.md.
 */

const status = z.enum(['verified', 'confirm', 'todo']).default('confirm');
const md = (dir: string) => glob({ base: `./src/content/${dir}`, pattern: '**/[^_]*.md' });

const ministries = defineCollection({
  loader: md('ministries'),
  schema: z.object({
    title: z.string(),
    /** Existing ministry name on the old site, e.g. "Feed My Lambs". */
    alsoKnownAs: z.string().optional(),
    summary: z.string(),
    /** Opening line on the ministry's own page; different wording from the card summary. */
    lede: z.string().optional(),
    order: z.number().default(50),
    icon: z.enum(['baby', 'users', 'book-open', 'heart', 'globe', 'hand-heart', 'flame']).default('users'),
    audience: z.string().optional(),
    /** IDs of gatherings in src/config/church.ts, so times live in one place. */
    gatheringIds: z.array(z.string()).default([]),
    /** Free-text meeting info when it is not a weekly gathering in the config. */
    meets: z.string().optional(),
    leaders: z.array(z.string()).default([]),
    contactEmail: z.email().optional(),
    scripture: z.string().optional(),
    nextStep: z.object({ label: z.string(), href: z.string() }).optional(),
    /** Photo filename (without extension) in src/assets/photos/. Real, released photos only. */
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    showOnHome: z.boolean().default(false),
    status,
    /** Notes for reviewers. Shown only on the staged review build. */
    reviewNotes: z.array(z.string()).default([]),
  }),
});

const leadership = defineCollection({
  loader: file('./src/content/leadership/leaders.yaml'),
  schema: z.object({
    name: z.string(),
    known: z.string().optional(),
    role: z.string(),
    group: z.enum(['pastors', 'elders', 'ministry-leaders']),
    order: z.number(),
    /** Only an approved biography. Leave empty rather than writing one. */
    bio: z.string().optional(),
    photo: z.string().optional(),
    /** Optional page with a fuller biography. */
    link: z.string().optional(),
    status,
    reviewNote: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    allDay: z.boolean().default(false),
    location: z.string().optional(),
    summary: z.string(),
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    ministry: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const teachings = defineCollection({
  loader: md('teachings'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    speaker: z.string().optional(),
    /** Book of the Bible, e.g. "Revelation". */
    book: z.string().optional(),
    /** Chapter or passage, e.g. "Revelation 3:7-13". */
    passage: z.string().optional(),
    series: z.string().optional(),
    videoUrl: z.url().optional(),
    audioUrl: z.url().optional(),
    notesUrl: z.url().optional(),
    transcriptUrl: z.url().optional(),
    summary: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const announcements = defineCollection({
  loader: md('announcements'),
  schema: z.object({
    message: z.string(),
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    starts: z.coerce.date(),
    ends: z.coerce.date(),
    published: z.boolean().default(true),
  }),
});

const visitor = defineCollection({
  loader: file('./src/content/visitor/faq.yaml'),
  schema: z.object({
    question: z.string(),
    order: z.number(),
    /** The verified answer. Required unless status is "todo". */
    answer: z.string().optional(),
    /** Truthful stand-in shown publicly while the answer is unverified. */
    fallback: z.string().optional(),
    link: z.object({ label: z.string(), href: z.string() }).optional(),
    status,
    reviewNote: z.string().optional(),
  }),
});

const beliefs = defineCollection({
  loader: md('beliefs'),
  schema: z.object({
    title: z.string(),
    /**
     * pending  - the official text has NOT been pasted in yet (page shows the topic summary).
     * migrated - official text pasted in verbatim, waiting for pastoral sign-off.
     * approved - pastor has approved the migrated text.
     */
    approvalStatus: z.enum(['pending', 'migrated', 'approved']),
    approvedBy: z.string().optional(),
    approvedOn: z.coerce.date().optional(),
    source: z.url(),
  }),
});

export const collections = { ministries, leadership, events, teachings, announcements, visitor, beliefs };
