// Shared content for every round 3 variant. Sources: v4 content, the resume, Letterboxd RSS, and what you told me.
// Anything guessed is marked "assumed" so it's easy to find and fix.
window.CONTENT = {
  name: "nausher rao",
  email: "nausher@sherrao.tech",
  links: {
    github: "https://github.com/SherRao",
    linkedin: "https://linkedin.com/in/nausherrao",
    letterboxd: "https://letterboxd.com/SherRao",
  },
  place: "waterloo, on",
  timezone: "America/Toronto",

  intro: "i've been programming since i was 8. today i'm a senior software engineer at mappedin, where i work on the blue dot: the part of an indoor map that knows where you are. outside of that i start companies, run live events, and play in a band.",

  roles: [
    { id: "eng", word: "engineer", line: "i write software.", detail: "blue dot and indoor positioning at mappedin. before that: shopify, webisoft, magnet forensics." },
    { id: "founder", word: "founder", line: "i start companies.", detail: "founder and ceo of konfer, and quietly building something new. before that, product and project roles at near and spur." },
    { id: "stage", word: "stage manager", line: "i run the show.", detail: "lead stage and production manager at spurhacks, canada's largest in-person hackathon by project submissions." },
    { id: "band", word: "bandmate", line: "i play in a band.", detail: "band name, instrument and recordings go here.", needed: true },
  ],

  now: {
    org: "mappedin",
    role: "senior software engineer",
    focus: "blue dot + indoor positioning",
    since: "2025", // assumed
    url: "https://www.mappedin.com",
  },

  experience: [
    { org: "mappedin", role: "senior software engineer", when: "2025 to now", kind: "engineering", url: "https://www.mappedin.com",
      points: ["blue dot and indoor positioning: the part of an indoor map that knows where you are."] },
    { org: "konfer", role: "founder & ceo", when: "2024 to now", place: "waterloo", kind: "company", url: "https://konfer.ca",
      points: ["produced spurhacks 2025 with a 14-person core team and 43 volunteers.", "product owner for our hackathon platform (react, typescript, go): applications, ticketing, scheduling, networking.", "ran a $350k+ budget end to end."] },
    { org: "spur innovation center", role: "project manager", when: "2024 to 2025", place: "waterloo", kind: "product", url: "https://spur.community",
      points: ["managed $1M+ in startup investment: reviewed 50+ companies, picked 15.", "12 of 15 startups hit their q1 okrs.", "shipped an investor platform that cut onboarding from 3+ months to a couple of weeks."] },
    { org: "near toronto", role: "director of technical product & growth", when: "2024", place: "toronto", kind: "product", url: "https://near.org",
      points: ["took seahorse, a privacy-first mental health app, from idea to an investor-ready mvp.", "two live demos at major hackathons, and $750k in funding secured.", "grew local developer activity by 600 daily active users."] },
    { org: "webisoft", role: "software engineer", when: "2024", place: "montreal", kind: "engineering",
      points: ["replaced a quoting system built on 1k+ excel tables with a full-stack dashboard for $100M+ in rfqs."] },
    { org: "shopify", role: "software engineer, unified app deployments", when: "2022 to 2023", place: "toronto", kind: "engineering", url: "https://www.shopify.com",
      points: ["features and fixes in the open-source shopify cli, used daily by 850 apps.", "partner dashboard in react + typescript for 1.1M+ daily users.", "graphql endpoints for extension hosting, used by 2,000+ developers a day."] },
    { org: "magnet forensics", role: "software engineer, systems, tools & software", when: "2021", place: "waterloo", kind: "engineering",
      points: ["ci pipelines and internal build tooling for 100+ engineers."] },
  ],

  education: { school: "wilfrid laurier university", degree: "bsc computer science, applied mathematics option", when: "2019 to 2024" },

  events: [
    { id: "spurhacks", name: "spurhacks 2025", date: "jun 20 to 22, 2025", place: "blackberry campus, waterloo", url: "https://spurhacks.com",
      blurb: "built from nothing in three months. four floors, 120,000 sq ft, canada's largest in-person hackathon by project submissions.",
      stats: [["1,400+", "attendees"], ["291", "projects"], ["$100k+", "in prizes"], ["5M+", "impressions"]],
      credits: [["director", "nausher rao"], ["stage & production manager", "nausher rao"], ["product owner, event platform", "nausher rao"], ["budget, $350k+", "nausher rao"], ["core crew", "14 organizers, 43 volunteers"]],
      photos: ["spurhacks-2.jpg", "spurhacks-6.jpg", "spurhacks-4.jpg", "spurhacks-3.jpg", "spurhacks-5.jpg"] },
    { id: "hawkhacks", name: "hawkhacks 2024", date: "may 17 to 19, 2024", place: "wilfrid laurier university, waterloo", url: "https://hawkhacks.ca",
      blurb: "the second-largest in-person student hackathon at the time. it broke the previous event records at laurier by a mile.",
      stats: [["1,289", "registrants"], ["900", "rsvps"], ["35", "sponsors"], ["$180k+", "in prizes"]],
      credits: [["organizer", "nausher rao"]], // role assumed
      photos: ["hawkhacks-2.jpg", "hawkhacks-4.jpg", "hawkhacks-5.jpg", "hawkhacks-3.jpg"] },
    { id: "yacht", name: "collision yacht soirée", date: "jun 17, 2024", place: "lake ontario, toronto", url: "https://luma.com/8iwq9lxb",
      blurb: "the largest side event at collision 2024, on the largest yacht on lake ontario.",
      stats: [["1", "yacht"], ["#1", "side event at collision"]],
      credits: [["organizer", "nausher rao"]], // role assumed
      photos: ["near-yacht-3.jpg", "near-yacht-1.jpg", "near-yacht-4.jpg", "near-yacht-2.jpg"] },
    { id: "bbq", name: "spur community bbq festival", date: "oct 26, 2024", place: "waterloo", url: "https://luma.com/aouu9bsq",
      blurb: "300 people, a pitch competition, fresh food, dessert, and a live band.",
      stats: [["300", "people"], ["$28k", "budget"]],
      credits: [["organizer", "nausher rao"]], // role assumed
      photos: ["spur-bbq-2.jpg", "spur-bbq-4.jpg", "spur-bbq-3.jpg", "spur-bbq-6.jpg"] },
  ],

  av: [
    "lead stage and production manager for every spurhacks 2025 ceremony.",
    "planned broadcast av and wi-fi for a 120,000 sq ft, four-floor venue with colliers and outside contractors.",
  ],

  band: {
    needed: true,
    line: "band name, what i play, a couple of recordings, and upcoming shows.",
  },

  // Real, from letterboxd.com/SherRao/rss (most recent first).
  films: [
    { title: "resident evil", year: 2026, watched: "sep 18", rating: 3 },
    { title: "the odyssey", year: 2026, watched: "aug 3", rating: 4.5 },
    { title: "dunkirk", year: 2017, watched: "aug 1", rating: 4.5 },
    { title: "a house of dynamite", year: 2025, watched: "aug 1", rating: 4 },
  ],
};

// Things built: side projects and products from work, newest first.
window.PRODUCTS = [
  { name: "tab", tag: "new", what: "a shared expense tracker for trips and events. scan a receipt, tag who got what, and it works out who owes whom in the fewest payments.", role: "side project", year: "2026", stack: "next.js, drizzle, postgres, tesseract.js", url: "https://github.com/SherRao/Tab" },
  { name: "blue dot", what: "indoor positioning: the part of an indoor map that knows where you are, where gps gives up.", role: "senior software engineer, mappedin", year: "2025 to now", url: "https://www.mappedin.com" },
  { name: "spurhacks platform", what: "applications, ticketing, scheduling and networking for canada's largest in-person hackathon.", role: "product owner, konfer", year: "2025", stack: "react, typescript, go", url: "https://spurhacks.com" },
  { name: "spur investor platform", what: "an investor-ready platform that cut startup onboarding from 3+ months to a couple of weeks.", role: "project manager, spur", year: "2024 to 2025", stack: "react, typescript, go" },
  { name: "seahorse", what: "a privacy-first mental health app with on-device ai. the mvp helped raise $750k.", role: "technical product lead, near", year: "2024", stack: "next.js, python, on-device rag, webllm" },
  { name: "rfq dashboard", what: "one full-stack app replacing 1k+ excel tables behind $100M+ in quotes.", role: "software engineer, webisoft", year: "2024", stack: "react, express" },
  { name: "shopify cli + partner dashboard", what: "extension hosting for shopify partners. the cli runs in 850 apps a day; the dashboard serves 1.1M+ people a day.", role: "software engineer, shopify", year: "2022 to 2023", stack: "typescript, react, rails, graphql", url: "https://www.shopify.com" },
];

// The long-form story used by the round 4 blends.
window.STORY = {
  headline: ["one person, four jobs,", "mostly at the same time."],
  dek: "an essay in five parts, by nausher rao",
  standfirst: "Since I was eight, I've been programming. These days I'm a senior software engineer at Mappedin, working on the blue dot: the part of an indoor map that knows where you are. I've started a company (and I'm quietly starting another), run some of the biggest hackathons in Canada, run the stage in front of 1,400 people, and I play in a band. I still build things on the side, too. This is how it all fits together.",
  chapters: [
    { id: "engineer", n: "i", title: "the engineer", big: "8", bigCap: "the age i started programming",
      paras: [
        "My first customers were people buying my Minecraft server plugins. I was a kid, and that's where it started.",
        "I studied computer science and applied math at Wilfrid Laurier. Co-op terms took me to Magnet Forensics, keeping CI and build tooling running for more than a hundred engineers, and then to Shopify, where I worked on the Shopify CLI and the Partner Dashboard, used by 1.1 million people a day.",
        "Today I'm at Mappedin, working on indoor positioning. GPS gives up the moment you walk into a mall, an airport or a stadium. The blue dot is how you still know where you are.",
      ],
      pull: "The blue dot is the part of the map that knows where you are." },
    { id: "founder", n: "ii", title: "the founder", big: "$1M+", bigCap: "in startup investment managed at spur innovation center",
      paras: [
        "Right now I'm building a new company. It's in stealth, so that's all I can say for now.",
        "In 2024 I started Konfer. We're the team behind SpurHacks, and we built the platform that ran it: applications, ticketing, scheduling and networking, in React, TypeScript and Go. I was the product owner.",
        "Around the same time I was a project manager at SPUR Innovation Center, looking after more than a million dollars of startup investment. We reviewed 50+ companies, picked 15, and met with them every week or two.",
        "Before that, at NEAR in Toronto, I led technical product for Seahorse, a privacy-first mental health app. We took it from an idea to an MVP that helped raise $750k.",
      ],
      pull: "Twelve of fifteen startups hit their first-quarter goals.",
      numbers: [["now", "a new company, in stealth"], ["$1M+", "startup investment managed"], ["12 of 15", "startups hit their q1 okrs"], ["$750k", "raised after the seahorse mvp"], ["3+ months to 2 weeks", "investor onboarding, after our platform"]] },
    { id: "stage", n: "iii", title: "the stage", big: "1,400", bigCap: "people at spurhacks 2025, built from nothing in three months",
      paras: [
        "SpurHacks 2025 went from nothing to 1,400+ people in three months: four floors of the old BlackBerry campus, 291 projects, $100k+ in prizes and a $350k+ budget. I directed it, and at every ceremony I was the stage and production manager, running the cues, the AV and the clock.",
        "Before that came HawkHacks 2024, with 1,289 registrants and $180k+ in prizes; the biggest side event at Collision, on a yacht on Lake Ontario; and a 300-person BBQ festival with a pitch competition and a live band.",
      ],
      pull: "1,400 people. 291 projects. Three months." },
    { id: "band", n: "iv", title: "the band", big: "tba", bigCap: "band name, instrument, recordings and shows",
      paras: ["This is where the band goes: who we are, what I play, and where you can hear us."], needed: true },
    { id: "hi", n: "v", title: "say hi" },
  ],
};

window.stars = (n) => "★".repeat(Math.floor(n)) + (n % 1 ? "½" : "");
