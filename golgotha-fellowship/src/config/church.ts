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
      { station: '97.5 FM', when: 'Weekdays, 3:45–4:00 PM' },
    ],
  },

  /**
   * 97.5 FM (KIDH-LP, licensed to Meridian). Public listings still show it as "Higher Rock Radio",
   * owned by Calvary Chapel Meridian; the license is moving to Golgotha Fellowship.
   * CONFIRM before launch: the station's new name, its official website and its own stream link.
   * Until then "Listen live" opens the station's existing public stream page.
   */
  station: {
    frequency: '97.5 FM',
    callSign: 'KIDH-LP',
    name: null as string | null,
    /** The station's public page (used where a page can't play audio itself). */
    listenUrl: 'https://zeno.fm/radio/higher-rock-radio-97-5-fm-kidh-lp/',
    /** Direct audio stream (e.g. https://stream.zeno.fm/xxxx). When set, our own player streams it. */
    streamUrl: null as string | null,
    /** Zeno.fm's embeddable player for the station; used until streamUrl is known. */
    embedUrl: 'https://zeno.fm/player/higher-rock-radio-97-5-fm-kidh-lp' as string | null,
    status: 'confirm' as Status,
  },

  /**
   * Live services. "Watch live" shows only during these windows (Idaho time, set on the visitor's
   * device, no YouTube API needed). The /live address on YouTube always opens whatever is streaming.
   * CONFIRM: which services stream, and the Facebook page used for live video.
   */
  live: {
    youtubeUrl: 'https://www.youtube.com/@Golgothafellowship/live',
    facebookUrl: 'https://www.facebook.com/GolgothaFellowship/live_videos' as string | null,
    subscribeUrl: 'https://www.youtube.com/@Golgothafellowship?sub_confirmation=1',
    timeZone: 'America/Boise',
    /** day 0 = Sunday. start/end in 24h Idaho time, padded a little either side of the service. */
    windows: [
      { day: 0, start: '08:15', end: '12:15', label: 'Sundays', times: '8:30 & 10:30 AM' },
      { day: 3, start: '17:45', end: '19:30', label: 'Wednesdays', times: '6:00 PM' },
    ],
    status: 'confirm' as Status,
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

  /**
   * Homepage hero. When heroVideoUrl is set to a short, silent, looping clip of a Sunday
   * (an .mp4), the hero plays it instead of the photo, with the photo as the still fallback.
   * Keep it under ~10 MB and about 10-20 seconds. Until then it stays null and the photo shows.
   */
  heroVideoUrl: null as string | null,

  /** The church app (built on ChMeetings): giving, events, bulletin and Bible. */
  app: {
    name: 'Golgotha Fellowship Nampa, ID',
    ios: 'https://apps.apple.com/us/app/id6476302842',
    android: 'https://play.google.com/store/apps/details?id=com.jiosdev.chmeetings.golgotha',
  },

  giving: {
    /**
     * The church's giving runs through ChMeetings (the same system as the church app), which has a
     * "Give" tab. CONFIRM the exact Give page address from the app or golgotha.chmeetings.com.
     */
    url: 'https://golgotha.chmeetings.com' as string | null,
    providerName: 'ChMeetings' as string | null,
    status: 'confirm' as Status,
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
  { label: '97.5 FM Live', href: '/listen' },
  { label: 'Watch Live', href: '/live' },
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
      { label: 'Watch Live', href: '/live' },
      { label: '97.5 FM & Hold Fast', href: '/listen' },
      { label: 'Ministries', href: '/ministries' },
      { label: 'Kids', href: '/ministries/kids' },
      { label: 'Youth', href: '/ministries/youth' },
      { label: 'Get Involved', href: '/get-involved' },
    ],
  },
] as const;
