/**
 * SINGLE SOURCE OF TRUTH for church facts.
 *
 * Every page, the footer, the structured data and the service-times band read from
 * this file. Change a time, phone number or link here and it changes everywhere.
 *
 * Status meanings
 *   verified - taken from the current official website (golgothafellowship.org).
 *   confirm  - on the official website, but the church asked to re-confirm before launch.
 *              Shown publicly; flagged on the staged review build.
 *   todo     - NOT known. Never shown publicly. Flagged on the staged review build.
 *
 * Source: reference pack "RESEARCH_AND_CONTENT_INVENTORY.md", research date 2026-11-16.
 */

export type Status = 'verified' | 'confirm' | 'todo';

export interface Gathering {
  id: string;
  name: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  times: string[];
  /** 24h "HH:MM" values matching `times`, for structured data. */
  times24: string[];
  note?: string;
  href?: string;
  status: Status;
  /** Main worship services appear in the header band; the rest only in fuller schedules. */
  primary: boolean;
}

export const church = {
  name: 'Golgotha Fellowship',
  legalNote: 'A non-denominational fellowship affirming Calvary Chapel distinctives.',
  siteUrl: 'https://www.golgothafellowship.org',
  shortDescription:
    'Golgotha Fellowship is a casual, Bible-teaching church in downtown Nampa, Idaho. We study Scripture line by line and gather around the grace of Jesus Christ.',

  address: {
    street: '1404 1st Street South',
    city: 'Nampa',
    region: 'ID',
    regionName: 'Idaho',
    postalCode: '83651',
    country: 'US',
    areaNote: 'Downtown Nampa',
    status: 'verified' as Status,
  },

  phone: { display: '208-572-3317', tel: '+12085723317', status: 'verified' as Status },
  email: { general: 'info@golgothafellowship.org', youth: 'youth@golgothafellowship.org' },

  seniorPastor: { name: 'Dr. Martin Sondermann', known: 'Pastor Marty', role: 'Senior Pastor' },

  affiliation: {
    summary:
      'We are a non-denominational local fellowship that affirms the historic Calvary Chapel distinctives and identifies with the Calvary Chapel Association.',
    status: 'verified' as Status,
  },

  gatherings: [
    {
      id: 'sunday',
      name: 'Sunday Services',
      day: 'Sunday',
      times: ['8:30 AM', '10:30 AM'],
      times24: ['08:30', '10:30'],
      note: 'Nursery and children’s ministry through sixth grade.',
      status: 'verified',
      primary: true,
    },
    {
      id: 'wednesday',
      name: 'Wednesday Evening Service',
      day: 'Wednesday',
      times: ['6:00 PM'],
      times24: ['18:00'],
      note: 'Children’s ministry available.',
      status: 'verified',
      primary: true,
    },
    {
      id: 'youth',
      name: 'Youth Ministry',
      day: 'Friday',
      times: ['6:00 PM'],
      times24: ['18:00'],
      href: '/ministries/youth',
      status: 'confirm',
      primary: false,
    },
    {
      id: 'men-monday',
      name: 'Men’s Bible Study',
      day: 'Monday',
      times: ['6:00 PM'],
      times24: ['18:00'],
      href: '/ministries/men',
      status: 'verified',
      primary: false,
    },
    {
      id: 'men-saturday',
      name: 'Men’s Bible Study',
      day: 'Saturday',
      times: ['8:00 AM'],
      times24: ['08:00'],
      href: '/ministries/men',
      status: 'verified',
      primary: false,
    },
  ] satisfies Gathering[] as Gathering[],

  /** Hold Fast radio program, as listed on the official home page. Re-confirm stations/times. */
  radio: {
    name: 'Hold Fast',
    status: 'confirm' as Status,
    broadcasts: [
      { station: 'KSPD 790 AM / 94.5 FM', when: 'Weekdays, 12:15–12:30 PM' },
      { station: 'KIDH 97.5 FM', when: 'Weekdays, 3:45–4:00 PM' },
    ],
  },

  social: {
    youtube: 'https://www.youtube.com/@Golgothafellowship',
    facebook: 'https://www.facebook.com/GolgothaFellowship',
    instagram: 'https://www.instagram.com/golgotha_fellowship',
  },

  /** Hold Fast radio program as a podcast. The feed is read at every build. */
  podcast: {
    name: 'Hold Fast',
    feedUrl: 'https://feeds.buzzsprout.com/2180061.rss',
    showUrl: 'https://golgothafellowship.buzzsprout.com/2180061',
    appleUrl: 'https://podcasts.apple.com/us/podcast/hold-fast/id1685016484',
  },

  youtube: {
    channelUrl: 'https://www.youtube.com/@Golgothafellowship',
    /** "Golgotha Fellowship Nampa" channel (found via search, 2026-11-17). New uploads are read at every build. */
    channelId: 'UC7ZJXJ3B2GQQLjolHM0Zo-Q' as string | null,
  },

  giving: {
    /**
     * TODO_VERIFY: the church's existing online giving URL (the reference pack suggests
     * it may be Tithe.ly, but the exact link was not verified). While null, the Give page
     * shows only office contact details and never a guessed payment link.
     */
    url: null as string | null,
    providerName: null as string | null,
  },

  /** Old page whose text could not be read during the audit. Used only for review notes. */
  legacyUrls: {
    beliefs: 'https://www.golgothafellowship.org/what-we-believe',
  },

  /** Volunteer areas listed on the official "Get Involved" page. */
  serveAreas: [
    'Greeters',
    'Kids ministry',
    'Youth ministry',
    'Security / medical',
    'Worship',
    'Audio / video',
    'Events',
    'Discipleship',
    'Biblical counseling',
    'Outreach',
    'Jail / prison ministry',
    'Care',
    'Radio / YouTube',
    'Men’s ministry',
    'Women’s ministry',
    'Home groups',
    'General help',
  ],
} as const;

/* ---------- Derived helpers (do not edit when updating facts) ---------- */

const a = church.address;
export const addressOneLine = `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${church.name}, ${addressOneLine}`,
)}`;
/** Map pinned to the exact street address (not the business listing, which some directories still show at an old location). */
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(addressOneLine)}&z=16&output=embed`;
export const telHref = `tel:${church.phone.tel}`;
export const mailHref = `mailto:${church.email.general}`;

export const primaryGatherings = church.gatherings.filter((g) => g.primary);
export const allGatherings = church.gatherings;

export const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/** Main navigation. Flat on purpose: no hover-only or nested dropdown menus. */
export const mainNav = [
  { label: 'I’m New', href: '/new-here' },
  { label: 'About', href: '/about' },
  { label: 'Teachings', href: '/teachings' },
  { label: 'Ministries', href: '/ministries' },
  { label: 'Events', href: '/events' },
] as const;

export const utilityNav = [
  { label: 'Location', href: '/location' },
  { label: 'Prayer', href: '/prayer' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerNav = [
  {
    heading: 'Visit',
    links: [
      { label: 'I’m New', href: '/new-here' },
      { label: 'Location & Map', href: '/location' },
      { label: 'Events', href: '/events' },
      { label: 'Contact', href: '/contact' },
      { label: 'Prayer Request', href: '/prayer' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'What We Believe', href: '/beliefs' },
      { label: 'Pastor Marty', href: '/pastor-marty' },
      { label: 'Leadership', href: '/leadership' },
      { label: 'Give', href: '/give' },
    ],
  },
  {
    heading: 'Grow',
    links: [
      { label: 'Teachings', href: '/teachings' },
      { label: 'Ministries', href: '/ministries' },
      { label: 'Kids', href: '/ministries/kids' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: 'Get Involved', href: '/get-involved' },
    ],
  },
] as const;
