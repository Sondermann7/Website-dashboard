/**
 * Pastor Marty: biography, books and speaking.
 *
 * Sources (web search, 2026-11-16) are noted per item. None of this was read from the
 * church's own website, which was unreachable from the build environment, so every
 * item needs Pastor Marty's sign-off. Replace `bio` with his own approved biography.
 */
export const pastor = {
  name: 'Dr. Martin Sondermann',
  known: 'Pastor Marty',
  role: 'Senior Pastor',
  /** Source: Treasure Valley Men's Conference speaker bio; Amazon author page; church leadership page. */
  bio: [
    'Dr. Martin Sondermann, known to most people as Pastor Marty, is the senior pastor of Golgotha Fellowship in Nampa, Idaho.',
    'He has served in Christian ministry for more than 25 years: as a youth pastor, as a missionary pastor, and for nearly 12 years as a prison chaplain. He is also a Christian author, a conference speaker, and a former sports writer.',
    'Pastor Marty teaches the Bible verse by verse, chapter by chapter, and book by book, on Sundays and Wednesdays at Golgotha Fellowship and every weekday on the Hold Fast radio program.',
  ],
  ministry: [
    { title: 'Youth pastor', note: '' },
    { title: 'Missionary pastor', note: '' },
    { title: 'Prison chaplain', note: 'Nearly 12 years' },
    { title: 'Senior pastor', note: 'Golgotha Fellowship, Nampa' },
    { title: 'Author and Bible teacher', note: 'Hold Fast radio and podcast' },
  ],
  /** Source: church leadership page (doctorate); Amazon author page (the rest). */
  education: [
    'Doctor of Ministry in Biblical Studies, Liberty University',
    'M.A. in Christian Apologetics',
    'M.R.E. in Religious Education',
    'B.A. in Communication, Boise State University',
  ],
  /** Source: Amazon and Audible listings, and the covers and back cover supplied by the owner. */
  books: [
    { title: 'Star-Spangled Babylon', subtitle: 'Is America’s Destiny Foretold in Scripture?', year: 2023, kind: 'Bible prophecy', cover: 'star-spangled-babylon', about: 'Examines whether the United States appears in Bible prophecy.', url: 'https://www.amazon.com/Star-Spangled-Babylon-Americas-Foretold-Scripture/dp/B0CC4H7HV7' },
    { title: 'Two Tim Three', subtitle: 'The Last Generation', year: 2021, kind: 'Bible study', cover: 'two-tim-three', about: 'A study of 2 Timothy 3: twenty-three marks of the final generation, compared with the world today.', url: 'https://www.amazon.com/Two-Tim-Three-Last-Generation/dp/B0915H33QH' },
    { title: 'The Quickly Approaching Rapture', subtitle: 'The Imminent Return of Jesus Christ', year: 2020, kind: 'Countdown Collection', cover: 'quickly-approaching-rapture', about: 'On the imminent return of Jesus Christ for His church.', url: 'https://www.audible.com/pd/The-Quickly-Approaching-Rapture-The-Imminent-Return-of-Jesus-Christ-Audiobook/B0954RYKWX' },
    { title: 'Mark(s) of the Beast', subtitle: 'It’s More Than Just a Number', year: 2019, kind: 'Countdown Collection', cover: 'marks-of-the-beast', about: 'Why the mark of the beast in Revelation is about more than the number 666.', url: 'https://www.amazon.com/Mark-Beast-More-Than-Number-ebook/dp/B07QVNCRCD' },
    { title: 'The Soulcatcher Chronicles', subtitle: 'Infestation, Book 1', year: null, kind: 'Novel', cover: 'soulcatcher-chronicles', about: 'Book one of three. Zack Hyatt, a veteran struggling to find a life outside the military, is drawn into a fight between the kingdom of darkness and the Kingdom of Light.', url: 'https://www.audible.com/author/Martin-Sondermann/B07QVNNHRZ' },
  ],

  authorPage: 'https://www.amazon.com/Martin-Sondermann/e/B07QVNNHRZ',
  podcast: { name: 'Hold Fast', url: 'https://podcasts.apple.com/us/podcast/hold-fast/id1685016484' },
  speaking: [
    { name: 'Treasure Valley Men’s Conference', note: 'Conference speaker', url: 'https://www.tvmen.org/' },
    { name: 'Revelation Roundtable', note: 'Founder', url: 'https://www.revelationroundtable.com/' },
  ],
} as const;
