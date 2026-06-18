// Customer stories. Initial set is **illustrative composite profiles** — not
// fabricated reviews. These are the "what a typical studio sees" type of
// piece, designed to be replaced by real case-study interviews as Tyron
// books them. Each story is marked illustrative=true so the page renders an
// honest disclosure banner — and Review schema is NOT emitted for
// illustrative entries to avoid violating Google's review-snippet policy.

export type CustomerStory = {
  slug: string;
  studioName: string;
  location: string;
  type: "solo" | "boutique" | "multi-location";
  illustrative: boolean;
  excerpt: string;
  beforeYogaTeacher: string;
  afterYogaTeacher: string;
  metrics: { label: string; value: string }[];
  ownerName: string;
  ownerRole: string;
  quote: string;
  body: string[];
};

export const STORIES: CustomerStory[] = [
  {
    slug: "london-solo-teacher",
    studioName: "Aurora Yoga",
    location: "London, UK",
    type: "solo",
    illustrative: true,
    excerpt:
      "How a solo yoga teacher in London replaced WhatsApp + Sheets + Venmo with YogaTeacher — and got her Sunday afternoons back.",
    beforeYogaTeacher:
      "WhatsApp group of 80 students for bookings. Google Sheet for memberships. Bank transfer for payments. Two hours every Sunday reconciling who paid what and who used a credit.",
    afterYogaTeacher:
      "Public booking page replaces WhatsApp. Memberships tracked automatically. Stripe payments settle to her account. Sunday afternoons free.",
    metrics: [
      { label: "Hours/week saved on admin", value: "~3 hrs" },
      { label: "Membership retention (90d)", value: "+18%" },
      { label: "Average revenue per member", value: "+£22/mo" },
    ],
    ownerName: "Composite profile",
    ownerRole: "Solo yoga teacher",
    quote:
      "I used to dread Sunday afternoons. Now I open the dashboard, see who's booked for the week, and that's it. The reconciliation is just done.",
    body: [
      "Aurora Yoga is a composite profile illustrating a common YogaTeacher use case: a solo yoga teacher in a metropolitan area teaching 5–7 classes a week, with a community of 60–100 active students built over 18 months of teaching from a rented studio space.",
      "Before YogaTeacher: bookings via a WhatsApp group of 80 students. Members message to reserve a class; the teacher acknowledges and notes attendance manually. Class packs tracked in a Google Sheet kept open in a phone tab. Payments by bank transfer or in-person cash. The whole back-office takes 2 hours every Sunday and another 30 minutes scattered across the week.",
      "The problem: as the community grew past 50 members the manual workflow began to fall apart. Members were occasionally double-billed or missed a payment. Two students booked the same Friday morning class without realizing it was full. A pack expired and the student didn't know until they were turned away at class.",
      "After YogaTeacher: the public booking page replaces the WhatsApp group. Members book directly. Class packs decrement automatically. Recurring monthly memberships auto-renew via Stripe. Receipts and reminders go out automatically via Resend. The Sunday-afternoon admin block becomes 5 minutes — open the dashboard, confirm the week's bookings, done.",
      "The bigger surprise: retention went up. Auto-renew on monthly memberships meant fewer 'I forgot to renew' lapses. Package-expiration reminder emails (sent 14 days before expiry) brought students back who would otherwise have drifted. Over 90 days, member retention measured against the previous quarter went up by ~18%.",
      "Average revenue per member also nudged up by about £22/month — partly because members who previously stretched a class pack over 60 days now used credits at a healthier pace, partly because monthly auto-renew memberships replaced 10-class packs for the most committed students.",
    ],
  },
  {
    slug: "cape-town-pilates-studio",
    studioName: "Stillpoint Pilates",
    location: "Cape Town, South Africa",
    type: "boutique",
    illustrative: true,
    excerpt:
      "How a boutique reformer pilates studio in Cape Town moved from Mindbody to YogaTeacher — and reclaimed R2,100/month plus 5 admin hours a week.",
    beforeYogaTeacher:
      "Mindbody at R2,800/month. 8-bed reformer studio, 25 classes/week, 150 active members. Reformer capacity awkward to manage; pack-tracking spreadsheet-supplemented.",
    afterYogaTeacher:
      "YogaTeacher at $79/month (~R1,500). Multi-class-type capacity native. Per-class capacity bars on the booking page. Reformer + mat + private all flow through the same booking page.",
    metrics: [
      { label: "Monthly software spend", value: "−60%" },
      { label: "Reformer utilization", value: "+11%" },
      { label: "Setup-to-live time", value: "2 days" },
    ],
    ownerName: "Composite profile",
    ownerRole: "Boutique pilates studio owner",
    quote:
      "Mindbody felt like running a small business with enterprise software. YogaTeacher feels like running a small business with software that respects that fact.",
    body: [
      "Stillpoint Pilates is a composite profile representing a common boutique-pilates use case: an 8-bed reformer studio in a mid-sized city, running 20–30 classes a week, 100–200 active members, with the owner-operator also teaching 8–10 of those classes a week.",
      "Before YogaTeacher: Mindbody Business at R2,800/month (Mindbody's standard tier converted to ZAR). Per-class capacity was set, but the booking flow showed members reformer classes the same way as mat — no clear visual difference between an 8-bed reformer that was 6/8 booked versus a 20-spot mat class that was 6/20 booked. Members occasionally booked the wrong class type.",
      "Tracking class packs across reformer-only vs mat-mixed packs required a sidecar spreadsheet because Mindbody's UI for pack restrictions was buried in member-level overrides. Three-times-monthly billing reconciliation took 90 minutes per session.",
      "After YogaTeacher: the public booking page shows reformer class capacity bars distinctly (bed icons, '6/8 beds') vs mat class capacity (spot icons, '12/20 spots'). Members self-select cleanly; mis-bookings dropped to zero.",
      "Reformer-only class packs are a first-class concept in YogaTeacher; no sidecar spreadsheet needed. Members can buy a 10-pack restricted to reformer classes; credits decrement only from reformer bookings. Pack-tracking time fell to zero.",
      "The financial change: Mindbody (R2,800/mo) replaced by YogaTeacher Multi-Studio (R1,500/mo). Savings of R1,300/mo, ~R15,600/year — invested in a senior instructor hire who runs the busiest privates slots and pays for himself.",
      "Reformer utilization (booked bed-hours / available bed-hours) moved from 64% to 75% over the 90 days post-migration. The simpler booking flow meant members made more booking attempts before giving up on a 'full' class that was actually available.",
    ],
  },
  {
    slug: "toronto-multi-location",
    studioName: "Northern Wellness",
    location: "Toronto, Canada",
    type: "multi-location",
    illustrative: true,
    excerpt:
      "How a 4-location yoga + pilates brand in Toronto consolidated four studio platforms into one YogaTeacher account.",
    beforeYogaTeacher:
      "Four locations on three different platforms (mix of Mindbody, Glofox, Vagaro — inherited from acquired studios). No aggregate reporting. Members couldn't book across locations.",
    afterYogaTeacher:
      "All four locations on a single YogaTeacher Multi-Studio account. Shared memberships across locations. Aggregate revenue dashboard. Per-location reporting and instructor management.",
    metrics: [
      { label: "Locations consolidated", value: "4" },
      { label: "Platforms eliminated", value: "3" },
      { label: "Members able to cross-book", value: "+850" },
    ],
    ownerName: "Composite profile",
    ownerRole: "Multi-location wellness operator",
    quote:
      "The hardest part of running four studios was that they didn't feel like one business. Now they do.",
    body: [
      "Northern Wellness is a composite profile representing a common multi-location use case: a wellness brand operating 3–5 boutique yoga and pilates studios in a single metropolitan area, typically acquired from independent founders who used different software at each location.",
      "Before YogaTeacher: each location ran on a different platform — two on Mindbody, one on Glofox, one on Vagaro, all with annual contracts at various renewal dates. Aggregate reporting required exporting CSVs from each platform and combining them in Excel. Members couldn't use a single membership across locations; if they wanted to attend a class at the Yorkville studio while travelling away from their home studio in Leslieville, they paid drop-in.",
      "The migration was phased: one location moved to YogaTeacher in month 1, the next two in month 2, the last in month 3 (timed to the various Mindbody / Glofox / Vagaro contract renewals). Each migration followed the standard 7-day playbook.",
      "After YogaTeacher: all four locations live in one Multi-Studio account ($79/month). Each location has its own booking page slug, its own instructors, its own schedule. Aggregate revenue, attendance and retention reporting in one dashboard. Members with the cross-location unlimited pass (R350/mo) can attend at any of the four locations.",
      "The cross-location membership was the unlock. ~850 of the brand's ~1,400 active members upgraded to the cross-location pass within 60 days. Average revenue per member went up R180/mo across that cohort. Total monthly revenue increase: ~R150,000, dwarfing the software cost savings.",
      "The bigger operational win: instructor management. Senior instructors who taught at multiple locations now have a single portal showing all their classes across all locations. Monthly payroll exports take 15 minutes total (was 60 minutes per location, four locations, four hours).",
    ],
  },
];

export function getStory(slug: string): CustomerStory | null {
  return STORIES.find((s) => s.slug === slug) ?? null;
}
