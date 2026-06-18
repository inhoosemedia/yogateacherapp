// Blog content — kept as plain TS data, no MDX runtime, no extra deps.
// Each post is a list of section objects so we can render rich HTML without
// trusting raw HTML strings. Tyron edits here; pages re-render automatically.

export type BlogSection =
  | { type: "p"; body: string }
  | { type: "h2"; body: string }
  | { type: "h3"; body: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; body: string; cite?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cluster: "yoga-growth" | "pilates-growth" | "switching" | "operations";
  pillar: boolean;
  publishedAt: string;
  readTime: string;
  sections: BlogSection[];
  relatedPages: { label: string; href: string }[];
};

export const POSTS: BlogPost[] = [
  // ── Cluster: Yoga growth ────────────────────────────────────────────────
  {
    slug: "grow-your-yoga-studio",
    title: "How to grow your yoga studio in 2026",
    excerpt:
      "The practical, unromantic guide to growing a boutique yoga studio. Pricing, retention, marketing, software — the stuff that actually moves the numbers.",
    cluster: "yoga-growth",
    pillar: true,
    publishedAt: "2026-05-30",
    readTime: "15 min",
    sections: [
      {
        type: "p",
        body: "Most yoga studio growth advice is written by people who have never run a studio. It talks about 'authentic community' and 'aligning with your values' without explaining what to actually do on Monday morning. This guide is different. It's the operator's view — what moves the metrics that pay rent.",
      },
      { type: "h2", body: "The four metrics that decide whether your studio grows" },
      {
        type: "p",
        body: "A yoga studio is a business with four numbers that matter more than the rest. Get these four right and most other things take care of themselves. Get any one of them wrong and no amount of authentic community will save you.",
      },
      {
        type: "ul",
        items: [
          "Monthly active members (MAM) — the count of unique people who attended ≥1 class in the last 30 days",
          "Average revenue per member (ARM) — total monthly revenue / MAM",
          "Retention rate — % of last month's MAM who attended again this month",
          "Cost per acquired member (CPA) — total marketing spend / new members acquired",
        ],
      },
      {
        type: "p",
        body: "MAM × ARM = monthly revenue. Retention rate decides how fast MAM compounds (or erodes). CPA decides whether marketing is profitable. Track these four every Sunday for 30 minutes; you'll know your studio better than 90% of owners.",
      },
      { type: "h2", body: "Pricing: the lever most studios get wrong" },
      {
        type: "p",
        body: "Most independent yoga studios under-price. The instinct comes from a generous place — you want yoga to be accessible. But undercharging starves your studio of the revenue it needs to pay good teachers and rent a good space. The result is a slow downward spiral: low prices, low margins, can't afford good teachers, classes feel rushed, members notice, churn rises.",
      },
      {
        type: "p",
        body: "Boutique yoga studios in 2026 should price at or slightly above the median for their city — not below. Below-median pricing signals 'low quality' to discerning students and attracts the bargain-hunter segment that churns fastest.",
      },
      { type: "h3", body: "What 'good pricing' looks like" },
      {
        type: "ul",
        items: [
          "Drop-in: $25–30 USD equivalent (US/UK), $15–20 (India tier-1), $10–15 (India tier-2)",
          "10-class pack: 25–30% discount on drop-in price",
          "Unlimited monthly: ~6× drop-in price (anchors the 4-class/month break-even)",
          "Annual: 10–15% discount on monthly, paid upfront",
        ],
      },
      { type: "h2", body: "Retention: the cheapest growth there is" },
      {
        type: "p",
        body: "Acquiring a new member typically costs $50–150 (paid ads, referral incentives, time). Retaining one costs effectively nothing. Most studios spend 80% of their attention on acquisition and 20% on retention; flip that and the same studio grows twice as fast.",
      },
      { type: "h3", body: "The five retention levers" },
      {
        type: "ol",
        items: [
          "Personal greeting — every member, by name, every visit, for the first 5 visits. After 5 visits a member is 4x more likely to renew.",
          "Class consistency — same teacher, same room, same time. Predictability breeds habit.",
          "Package-expiration reminders — most studios forget; this is half the reason packs expire unused. YogaTeacher sends these automatically 14 days before expiry.",
          "Recurring memberships > class packs — auto-renew defaults to 'stay' instead of 'decide'. Move loyal members to monthly subscriptions.",
          "Re-engagement at 21 days — if a member's been absent 21 days, send a hand-written email. Not a marketing campaign; a real note from the studio owner.",
        ],
      },
      { type: "h2", body: "Marketing: spend it on the right place" },
      {
        type: "p",
        body: "For most boutique studios, paid ads (Facebook, Instagram, Google) are a bad bet. The math: a $50 acquisition cost on a $99/month membership only pays back if the member stays 6+ months. For a brand new studio with no reviews, no track record, no Instagram presence, ad-driven members typically stay 2–3 months. You lose money.",
      },
      {
        type: "p",
        body: "What works for new and small studios: word-of-mouth amplification. Specifically, referral incentives. Give a current member a free week if they bring a friend who signs up for a pack. The economics work because the existing member is already happy (cheap incentive), the new member came pre-recommended (lower churn), and the cost is recoverable inside one month.",
      },
      { type: "h2", body: "Software: stop reconciling spreadsheets" },
      {
        type: "p",
        body: "Studio owners who run on WhatsApp + spreadsheets + Venmo spend 2–4 hours every week on admin reconciliation. That's 100–200 hours a year — a working month — spent on plumbing instead of teaching, marketing, or growing.",
      },
      {
        type: "p",
        body: "Yoga studio management software replaces all of that with one source of truth. YogaTeacher does this for $29/month, all features included; Mindbody and WellnessLiving do it for $99–159+. For a brand new studio, the cheaper option is the right answer — invest the difference in retention work.",
      },
      { type: "h2", body: "The 90-day growth plan" },
      {
        type: "p",
        body: "If your studio is starting from zero or stagnating, here's a focused 90-day plan that moves the four metrics:",
      },
      { type: "h3", body: "Days 1–30: the foundation" },
      {
        type: "ul",
        items: [
          "Pick studio software (YogaTeacher's 30-day free trial gives you the month to evaluate)",
          "Import your member list as CSV",
          "Set up your weekly recurring schedule",
          "Define 4 packages: drop-in, 10-class pack, unlimited monthly, annual",
          "Connect PayPal or Stripe for payments",
          "Launch your public booking page",
        ],
      },
      { type: "h3", body: "Days 31–60: the retention push" },
      {
        type: "ul",
        items: [
          "Re-engage every absent-21-day member with a personal email",
          "Run a referral campaign: free week for any current member who refers a friend who buys a pack",
          "Move loyal members from class packs to monthly unlimited",
          "Personally greet every member, by name, for the first 5 visits",
        ],
      },
      { type: "h3", body: "Days 61–90: the growth lever" },
      {
        type: "ul",
        items: [
          "Add 1–2 new class times based on attendance data (your dashboard tells you what's full)",
          "Run a 'first class free' promotion via Instagram (organic, not paid)",
          "Ask your best 5 members for a written testimonial — use them on your booking page",
          "Review the four metrics weekly; double down on what's working",
        ],
      },
      { type: "h2", body: "What to ignore" },
      {
        type: "p",
        body: "There's a lot of 'must-have' yoga business advice that's mostly waste. To save you time, here's what you can safely ignore in your first year: a branded mobile app (PWA is fine), a complex tiered membership structure (3 packages is enough), influencer marketing (almost never positive ROI), retail merchandise (low-margin distraction), expanding to a second location (don't, until your first is consistently profitable).",
      },
      {
        type: "p",
        body: "Growing a yoga studio is mostly about consistent, unglamorous execution. Members, classes, packages, payments — done well — for 36 months. That's the whole strategy.",
      },
    ],
    relatedPages: [
      { label: "Yoga studio software", href: "/yoga-studio-software" },
      { label: "Memberships", href: "/membership-management-software" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    slug: "how-to-get-more-yoga-students",
    title: "How to get more yoga students (without paid ads)",
    excerpt:
      "Paid ads rarely pay back for boutique studios. Here's what actually works: referral incentives, organic Instagram, and the first-class-free funnel.",
    cluster: "yoga-growth",
    pillar: false,
    publishedAt: "2026-05-31",
    readTime: "8 min",
    sections: [
      {
        type: "p",
        body: "If you ask the marketing-industry side of the internet how to get more yoga students, the answer is always paid ads. Facebook, Instagram, Google. Throw $500/month at it and watch the leads come in. The math rarely works.",
      },
      { type: "h2", body: "Why paid ads usually don't pay back" },
      {
        type: "p",
        body: "The economics are tight. A typical boutique yoga studio's Cost Per Acquired Member (CPA) via Facebook Ads runs $50–150. Your average member's lifetime value (LTV) is roughly $400–800. Looks fine on paper — except brand new studios with no reviews lose 30–50% of ad-acquired members in the first month. Run the math: you spend $100 to acquire a member who buys a $35 drop-in once and never returns. You lose $65 on that member.",
      },
      {
        type: "p",
        body: "Ads work when you have a strong brand, a backlog of positive reviews, and a retention machine. For a new studio, none of those exist yet. So the right marketing channel is one that doesn't require pre-existing brand: referrals and organic.",
      },
      { type: "h2", body: "The referral incentive that actually works" },
      {
        type: "p",
        body: "Give a current member one free week of unlimited classes for every friend they refer who buys a 10-class pack or monthly unlimited. The numbers:",
      },
      {
        type: "ul",
        items: [
          "Cost of one free week to you: ~$25–40 (worth of unused class capacity)",
          "Value of one new pack-purchasing member: ~$200 over 3 months",
          "Net: $160–175 per referral",
        ],
      },
      {
        type: "p",
        body: "It works because the existing member (already happy) is incentivized to bring a friend (similar interests, similar income, similar geography), and the new member arrives pre-recommended by someone they trust — which churns far less than ad-acquired members.",
      },
      { type: "h2", body: "Organic Instagram (not paid)" },
      {
        type: "p",
        body: "Post 2–3 times a week. Class moments. Pose breakdowns. Teacher introductions. Studio interior. Real moments, not stock photos. The goal isn't viral content; it's a Discoverable, real Instagram profile that a curious neighbour can find and verify your studio exists.",
      },
      {
        type: "p",
        body: "Tag your location on every post. Use 3–5 local hashtags (your neighbourhood, your city + yoga, your studio name). Reels outperform photos in 2026 by 3–5×; even rough phone Reels work.",
      },
      { type: "h2", body: "The first-class-free funnel" },
      {
        type: "p",
        body: "Offer the first class free to any new student. Make it visible on your public booking page. The math: a free first class costs you the studio capacity (essentially nothing for an under-full class) and gets the prospect into the room. Once they're in the room, the conversion to 'returning student' is 5–10× higher than any other top-of-funnel mechanic.",
      },
      {
        type: "p",
        body: "In YogaTeacher you can create a 'First class free' package with 1 credit and a 7-day validity, marked publicly purchasable. The booking page shows it as the lead offer. The 7-day expiry creates urgency and gets new students into the studio fast while their motivation is high.",
      },
      { type: "h2", body: "Local community partnerships" },
      {
        type: "p",
        body: "Trade a class for cross-promotion with a neighbouring business that shares your customer profile: cafe, juice bar, athleisure store, physiotherapy clinic. They host a flyer or social post for your studio; you host theirs. Zero cost, hyper-local reach. Three good partnerships are worth $1,000 in paid ads.",
      },
      { type: "h2", body: "What to skip" },
      {
        type: "p",
        body: "Facebook ads (for new studios — once you have 100+ active members, retargeting ads work). Yoga Alliance directory paid listings (low traffic). Influencer collaborations (almost never positive ROI for small studios). Generic SEO content marketing (takes 12+ months to pay back; not a near-term lever).",
      },
      {
        type: "p",
        body: "Get the first 50 members through referrals + organic + first-class-free. Get the next 200 through retention + word-of-mouth from those 50. Paid ads only make sense after that.",
      },
    ],
    relatedPages: [
      { label: "Growing a yoga studio", href: "/blog/grow-your-yoga-studio" },
      { label: "Yoga booking software", href: "/yoga-booking-software" },
      { label: "Memberships", href: "/membership-management-software" },
    ],
  },
  {
    slug: "yoga-studio-marketing-ideas",
    title: "Yoga studio marketing ideas that work in 2026",
    excerpt:
      "Twelve marketing ideas tested across boutique yoga studios — ranked by ROI, with the budget and time investment each requires.",
    cluster: "yoga-growth",
    pillar: false,
    publishedAt: "2026-06-01",
    readTime: "10 min",
    sections: [
      {
        type: "p",
        body: "Twelve marketing ideas, ranked by return on investment. Skip the first three at your peril; the last three are mostly waste.",
      },
      { type: "h2", body: "1. Referral incentives (highest ROI)" },
      {
        type: "p",
        body: "Free week of unlimited for current members who refer a friend who buys a pack. ROI: 4–5× in the first month. Time: 0 hours/week to maintain once set up. Budget: ~$25–40 per successful referral.",
      },
      { type: "h2", body: "2. First-class-free funnel" },
      {
        type: "p",
        body: "Free first class for any new student, prominently featured on the booking page. ROI: 3–4× via top-of-funnel volume. Budget: studio capacity (effectively zero for non-full classes).",
      },
      { type: "h2", body: "3. Organic Instagram (2–3 posts/week)" },
      {
        type: "p",
        body: "Real studio moments, tagged with local hashtags. ROI: cumulative, 6+ months to see compound effects. Time: 30 min/week.",
      },
      { type: "h2", body: "4. Local cross-promotions" },
      {
        type: "p",
        body: "Trade classes/promo with neighbouring businesses (cafes, juice bars, athleisure). ROI: 2–3× per partnership. Time: 1 hour/partnership setup.",
      },
      { type: "h2", body: "5. Google Business Profile optimization" },
      {
        type: "p",
        body: "Free. Add your studio to Google Business. Photos, hours, booking link. Respond to every review. ROI: 2× over 6 months from local-pack traffic. Time: 2 hours setup + 10 min/week.",
      },
      { type: "h2", body: "6. Member testimonial collection" },
      {
        type: "p",
        body: "Ask your best 5 members for a written testimonial. Put them on your booking page. ROI: 1.5–2× on conversion rate of cold visitors to bookings.",
      },
      { type: "h2", body: "7. Workshops + retreats" },
      {
        type: "p",
        body: "Hosted twice a year. Higher per-event revenue, top-of-funnel reach for non-members. ROI: 2× via new-member acquisition. Time: 20 hours/event.",
      },
      { type: "h2", body: "8. Email newsletter (monthly)" },
      {
        type: "p",
        body: "Short, personal, from the studio owner. Class highlights, workshops, member shoutouts. ROI: 1.5× via member retention. Time: 1 hour/month.",
      },
      { type: "h2", body: "9. Loyalty / streak rewards" },
      {
        type: "p",
        body: "10 visits in a month = free class. 30-day streak = branded mug. ROI: 1.3× via retention nudge. Time: low; trackable from attendance reports.",
      },
      { type: "h2", body: "10. Open-house Saturday (quarterly)" },
      {
        type: "p",
        body: "Free 60-minute class open to the public, hosted on a Saturday morning. Most new attendees stay for the Q&A; many sign up. ROI: 2× via volume. Time: 4 hours/quarter.",
      },
      { type: "h2", body: "11. Paid Instagram retargeting (only after 100+ members)" },
      {
        type: "p",
        body: "Target people who visited your website but didn't book. ROI: 2× once you have brand recognition. Budget: $200–500/month.",
      },
      { type: "h2", body: "12. Cold Facebook ads (skip)" },
      {
        type: "p",
        body: "Cold paid ads to people who've never heard of your studio. ROI: usually negative for boutique studios. Skip until you have strong organic + retention foundations.",
      },
      { type: "h2", body: "How to prioritize" },
      {
        type: "p",
        body: "Start with 1, 2 and 3 in your first 90 days. Add 4 and 5 in months 3–6. Layer 6–10 over the following year. Only consider 11 once you have 100+ active members. Stay away from 12 until your retention machine is humming.",
      },
    ],
    relatedPages: [
      { label: "Growing a yoga studio", href: "/blog/grow-your-yoga-studio" },
      { label: "Yoga studio software", href: "/yoga-studio-software" },
    ],
  },

  // ── Cluster: Pilates growth ─────────────────────────────────────────────
  {
    slug: "grow-your-pilates-studio",
    title: "How to grow your pilates studio in 2026",
    excerpt:
      "Pilates economics are different from yoga: smaller capacity, higher prices, tighter packs. The growth playbook is different too.",
    cluster: "pilates-growth",
    pillar: true,
    publishedAt: "2026-06-02",
    readTime: "12 min",
    sections: [
      {
        type: "p",
        body: "Pilates studios have a different economic shape than yoga studios. Reformer capacity is 6–10 students vs 20 for mat yoga. Drop-in pricing is 50% higher. Class packs are the dominant purchase, not unlimited memberships. The growth playbook has to match.",
      },
      { type: "h2", body: "The pilates economics that matter" },
      {
        type: "p",
        body: "A reformer pilates studio with 8 beds running 25 classes/week at 70% capacity does ~$25,000/month at a typical 10-class-pack price. The bottleneck is bed-hours, not member count. Growth means filling existing bed-hours before adding new ones.",
      },
      { type: "h2", body: "Pricing for pilates" },
      {
        type: "p",
        body: "Pilates is a premium service. Drop-ins at $35–50, 10-class packs at $300–450, unlimited at $250–400/month are typical for US/UK metro. Below this band signals 'low quality' to discerning students who happily pay full price elsewhere.",
      },
      { type: "h2", body: "The four-stage funnel" },
      {
        type: "p",
        body: "Pilates studios that grow well typically have this funnel: free intro class → 5-class trial pack → 10-class pack → recurring unlimited. Each step has its own conversion rate; optimize them in order.",
      },
      {
        type: "ul",
        items: [
          "Free intro class to 5-class trial pack: 40–60% conversion target",
          "5-class trial to 10-class pack: 50–70% target",
          "10-class pack to recurring unlimited: 20–35% target",
          "Annual unlimited renewal: 70–80% target",
        ],
      },
      { type: "h2", body: "Reformer capacity is your inventory" },
      {
        type: "p",
        body: "Every empty bed-hour is unrecoverable revenue. If your 7am reformer class has 2 empty beds three days a week, that's 6 bed-hours × $35/class × 50 weeks = $10,500/year you're leaving on the table. Move classes around, change times, swap instructors, until every bed-hour fills.",
      },
      {
        type: "p",
        body: "YogaTeacher's reports show per-class capacity utilization. Sort by lowest fill rate; those are the classes to fix or kill.",
      },
      { type: "h2", body: "Instructor quality matters more than in yoga" },
      {
        type: "p",
        body: "Pilates students follow their instructor. A great senior instructor doubles per-class revenue (privates plus group classes plus referrals). When you find one, retain them: pay above market, give them schedule priority, send them to workshops, treat them as a partner not an employee.",
      },
      { type: "h2", body: "Privates as the high-margin product" },
      {
        type: "p",
        body: "Private 1-on-1 sessions at $80–150 are the highest per-hour revenue in your studio. Many studios under-promote them. Add a 'privates' section to your public booking page; let members self-book; senior instructors only.",
      },
      { type: "h2", body: "Retention via auto-renew" },
      {
        type: "p",
        body: "Pilates students are more habit-driven than yoga students — once they're 2-3 times a week, they tend to stay. Auto-renew monthly memberships are the natural fit. Move members from 10-class packs to unlimited monthly as soon as they hit 8+ visits/month.",
      },
      { type: "h2", body: "The 90-day pilates studio plan" },
      {
        type: "p",
        body: "If you're starting or stagnating, here's the focused plan:",
      },
      { type: "h3", body: "Days 1–30" },
      {
        type: "ul",
        items: [
          "Set up YogaTeacher (or migrate from your current system)",
          "Define class types: Reformer 50, Mat Flow 60, Private 60",
          "Set capacity per type (8 reformer, 20 mat, 1 private)",
          "Create packages: drop-in, 5-class trial, 10-class pack, unlimited monthly",
          "Connect Stripe (or your processor)",
        ],
      },
      { type: "h3", body: "Days 31–60" },
      {
        type: "ul",
        items: [
          "Launch the 5-class trial pack at 30% discount for new members",
          "Audit reformer capacity — kill or move the lowest-fill classes",
          "Add 2 private slots/week with your best senior instructor",
        ],
      },
      { type: "h3", body: "Days 61–90" },
      {
        type: "ul",
        items: [
          "Move loyal pack-buyers to unlimited monthly auto-renew",
          "Run a referral campaign: free 5-pack for current members who refer a friend who buys a 10-pack",
          "Review per-class fill rates weekly; iterate the schedule",
        ],
      },
    ],
    relatedPages: [
      { label: "Pilates studio software", href: "/pilates-studio-software" },
      { label: "Pilates booking", href: "/pilates-booking-software" },
      { label: "Memberships", href: "/membership-management-software" },
    ],
  },
  {
    slug: "how-to-open-a-pilates-studio",
    title: "How to open a pilates studio in 2026",
    excerpt:
      "Capital requirements, equipment shopping, lease negotiations, software setup, opening promo. The 6-month operational checklist for new pilates studios.",
    cluster: "pilates-growth",
    pillar: false,
    publishedAt: "2026-06-03",
    readTime: "12 min",
    sections: [
      {
        type: "p",
        body: "Opening a pilates studio in 2026 is not glamorous. It's mostly: capital, equipment, lease, software, marketing — in that order. Here's the operational view.",
      },
      { type: "h2", body: "Capital required" },
      {
        type: "p",
        body: "For an 8-bed reformer pilates studio in a mid-tier US/UK city, plan on $80,000–150,000 in startup capital. Breakdown: equipment ($30–50K), lease deposit + first 3 months ($15–30K), build-out ($10–30K), software + marketing ($5–10K), working capital ($20–30K).",
      },
      { type: "h2", body: "Equipment shopping" },
      {
        type: "p",
        body: "Start with 8 reformers, 2 cadillac/towers, 1 chair, mats. New reformers from Balanced Body or Stott range $3,500–5,500 each; refurbished can be $1,500–2,500. Don't skimp on the reformers — bed quality is directly visible to students and replacement mid-term is expensive.",
      },
      { type: "h2", body: "Lease negotiation" },
      {
        type: "p",
        body: "Pilates studios need 1,200–2,000 sq ft, high ceilings, hardwood floors (or padded vinyl). Negotiate for a build-out allowance, 3-month free rent, escalation cap below CPI. A bad lease term will haunt the next 5 years; spend the legal-fee money to review it carefully.",
      },
      { type: "h2", body: "Software setup" },
      {
        type: "p",
        body: "Pick studio software before you open the doors. Set up classes, packages, payments and the public booking page during build-out. YogaTeacher takes ~1 hour to set up; Mindbody takes 2–4 weeks. For a new pilates studio, simpler is better — you're learning your customers in real time, not running an enterprise.",
      },
      { type: "h2", body: "Opening promotion strategy" },
      {
        type: "p",
        body: "Free intro class for the first 200 attendees. Followed by a 10-class founding-member pack at 40% off, valid for life of the studio. Founding members become your earliest evangelists; the 200-person base creates word-of-mouth from day one.",
      },
      { type: "h2", body: "Instructor hiring" },
      {
        type: "p",
        body: "Don't open with junior instructors. Two senior pilates instructors (5+ years teaching) are worth more than five new ones. Pay them 50% above market for the first 6 months to lock them in.",
      },
      { type: "h2", body: "First 90 days post-opening" },
      {
        type: "ul",
        items: [
          "Free intro class every Saturday for 8 weeks",
          "Hand-write a thank-you note to every founding member",
          "Run weekly retention reviews — who hasn't been back in 14 days?",
          "Adjust the schedule monthly based on attendance data",
          "Don't add new classes or programs in the first 90 days — focus on filling existing ones",
        ],
      },
      { type: "h2", body: "What to do later, not now" },
      {
        type: "p",
        body: "Skip in year 1: retail merchandise, branded apparel, a second location, in-house events / workshops, complex tiered memberships, a fancy website. All distractions from the core job of filling reformer hours.",
      },
    ],
    relatedPages: [
      { label: "Pilates studio software", href: "/pilates-studio-software" },
      { label: "Growing a pilates studio", href: "/blog/grow-your-pilates-studio" },
    ],
  },

  // ── Cluster: Switching software ─────────────────────────────────────────
  {
    slug: "how-to-switch-yoga-studio-software",
    title: "How to switch yoga studio software without losing members",
    excerpt:
      "A pragmatic migration playbook for moving from Mindbody, Vagaro or WellnessLiving to a simpler platform. Data, comms, payments, the cut-over.",
    cluster: "switching",
    pillar: true,
    publishedAt: "2026-06-04",
    readTime: "10 min",
    sections: [
      {
        type: "p",
        body: "Switching studio software is the most-deferred maintenance task in most yoga studios. The current platform is annoying but functional; switching feels risky; you put it off for another quarter. Two years later you're paying $159/month for software that takes you 3 hours/week to manage, instead of $29/month for software that takes 30 minutes.",
      },
      {
        type: "p",
        body: "Here's the migration playbook. It works for Mindbody → YogaTeacher, Vagaro → YogaTeacher, WellnessLiving → YogaTeacher, and most other directions. The total project is 7 days end-to-end with a 24-hour cut-over.",
      },
      { type: "h2", body: "Days 1–2: data export and import" },
      {
        type: "p",
        body: "Export from your current platform: members (CSV), packages (CSV), active memberships (CSV), classes (CSV — for reference, not for re-import). Every major platform supports this; if your platform doesn't, that's your sign to leave.",
      },
      {
        type: "p",
        body: "Import to YogaTeacher via Settings > Members > Import. The member CSV needs: name, email, phone (optional), notes. Skip the package import if you have fewer than 200 active memberships — you can re-create them manually faster than fighting an import.",
      },
      { type: "h2", body: "Day 3: re-create the operational shape" },
      {
        type: "p",
        body: "Set up class types (Vinyasa, Reformer, Mat Flow, Restorative — whatever your studio uses). Create packages (drop-in, 10-class, unlimited, etc.). Build the weekly recurring schedule. Assign instructors. This is the longest part of the migration; budget 2–4 hours.",
      },
      { type: "h2", body: "Day 4: connect payments" },
      {
        type: "p",
        body: "Connect PayPal, Stripe or Razorpay in Settings > Payments. Test with a $1 purchase — buy a test package as a member, verify funds settle to your account, verify the receipt email arrives.",
      },
      { type: "h2", body: "Day 5: preview and member announcement" },
      {
        type: "p",
        body: "Preview your public booking page at yogateacherapp.com/book/your-studio-slug. Walk through the booking flow as a member would. When it looks right, draft a short member announcement.",
      },
      {
        type: "p",
        body: "The announcement template: 'We're switching to a faster booking system. Starting [date], book classes at [new URL]. Your existing class credits transfer automatically. Need help? Reply to this email.' That's it. Don't over-explain; members want a working link.",
      },
      { type: "h2", body: "Day 6: parallel run" },
      {
        type: "p",
        body: "Send the announcement Saturday morning. Leave both platforms running for 24 hours. Most members switch to the new one within their first visit; a few will book on the old one out of habit. Both bookings are honored.",
      },
      { type: "h2", body: "Day 7: cut-over" },
      {
        type: "p",
        body: "Sunday evening, archive the old platform. Cancel the subscription effective end of billing cycle. Move all forward bookings to the new platform manually. Done.",
      },
      { type: "h2", body: "Common migration mistakes" },
      {
        type: "ol",
        items: [
          "Over-importing class history — operational data, not customer-facing data; skip it",
          "Trying to migrate while running a marketing campaign — wait until the campaign ends",
          "Switching during a busy season — pick a quiet week (early January, late August)",
          "Not testing payments end-to-end before announcing — $1 test purchase is mandatory",
          "Forgetting recurring memberships — must be re-set up on new processor",
        ],
      },
      { type: "h2", body: "What to expect from members" },
      {
        type: "p",
        body: "90% of members notice no difference. 5% notice and prefer the new system (faster, cleaner). 5% are confused for 1-2 visits and ask the studio. Total support overhead: 5–10 quick emails over the first week. That's it.",
      },
    ],
    relatedPages: [
      { label: "vs Mindbody", href: "/vs-mindbody" },
      { label: "vs Vagaro", href: "/vs-vagaro" },
      { label: "vs WellnessLiving", href: "/vs-wellnessliving" },
      { label: "Migrate from Mindbody", href: "/blog/migrate-from-mindbody-to-yogateacher" },
    ],
  },
  {
    slug: "migrate-from-mindbody-to-yogateacher",
    title: "How to migrate from Mindbody to YogaTeacher",
    excerpt:
      "Step-by-step migration from Mindbody. Where to find the export, what to import, how to handle active memberships and recurring billing.",
    cluster: "switching",
    pillar: false,
    publishedAt: "2026-06-05",
    readTime: "8 min",
    sections: [
      {
        type: "p",
        body: "If you're a yoga or pilates studio on Mindbody Business and the monthly $159+ bill is no longer earning its keep, here's the migration path to YogaTeacher. Total time: 1 weekend for a small studio, 3–5 days for a larger one.",
      },
      { type: "h2", body: "Step 1: Export from Mindbody" },
      {
        type: "p",
        body: "In Mindbody Business, navigate to Reports > Members. Export the member list as CSV. Make sure to include: first name, last name, email, phone, member ID (for cross-reference), and any custom fields you want to preserve. Run a second export for active memberships (Reports > Memberships > Active).",
      },
      { type: "h2", body: "Step 2: Sign up for YogaTeacher" },
      {
        type: "p",
        body: "Free 30-day trial, no credit card. The trial gives you the full month to complete migration and verify everything works.",
      },
      { type: "h2", body: "Step 3: Import members" },
      {
        type: "p",
        body: "In YogaTeacher, go to Members > Import. Upload your Mindbody CSV. Match the columns (first name → name first part, etc). Import. Spot-check that 5–10 random members imported correctly.",
      },
      { type: "h2", body: "Step 4: Re-create class types and packages" },
      {
        type: "p",
        body: "Set up the class types your studio teaches. For each, set capacity and duration. Create your packages: drop-in, 10-class, unlimited monthly. Set prices in your local currency. This is manual but quick.",
      },
      { type: "h2", body: "Step 5: Build the recurring schedule" },
      {
        type: "p",
        body: "Map out your weekly classes. Schedule > New Recurring Class. Set day, time, instructor, class type. Repeat for every class in your week. For a typical 20-class-a-week studio, this takes 30–45 minutes.",
      },
      { type: "h2", body: "Step 6: Handle active memberships" },
      {
        type: "p",
        body: "Mindbody recurring memberships don't migrate to YogaTeacher automatically because the underlying payment processor changes. Two options:",
      },
      {
        type: "ol",
        items: [
          "Cancel auto-renew on Mindbody for the current cycle. Members re-subscribe via the new YogaTeacher booking page once they receive the announcement.",
          "Manually grant the active member their package balance in YogaTeacher (Members > [name] > Add Package > Custom) for the remaining days of their current Mindbody cycle.",
        ],
      },
      {
        type: "p",
        body: "Option 1 is simpler; Option 2 is friendlier to members. For 50+ active recurring members, Option 1 saves 5–10 hours.",
      },
      { type: "h2", body: "Step 7: Connect payments" },
      {
        type: "p",
        body: "Settings > Payments. Connect Stripe (recommended), PayPal or Razorpay. Test with a $1 purchase. Verify the receipt email arrives.",
      },
      { type: "h2", body: "Step 8: Member announcement" },
      {
        type: "p",
        body: "Draft a short announcement. Send Saturday morning. Run both platforms for 24 hours. Sunday evening, archive Mindbody and cancel the subscription effective end of cycle.",
      },
      { type: "h2", body: "Expected timeline" },
      {
        type: "p",
        body: "Solo teacher with 50 members: weekend. Boutique studio with 200 members: 3 working days. Multi-location with 1000+ members: 5 days with help from the YogaTeacher support team on data import.",
      },
    ],
    relatedPages: [
      { label: "vs Mindbody", href: "/vs-mindbody" },
      { label: "How to switch", href: "/blog/how-to-switch-yoga-studio-software" },
    ],
  },
  {
    slug: "yoga-software-migration-checklist",
    title: "Yoga studio software migration checklist",
    excerpt:
      "The printable checklist. Every step, every gotcha, every CSV column. Use it to switch from any platform to any other.",
    cluster: "switching",
    pillar: false,
    publishedAt: "2026-06-06",
    readTime: "5 min",
    sections: [
      {
        type: "p",
        body: "Use this as a printable checklist. Tick items as you go. Total time: 1 weekend for a small studio, 5–7 days for a larger one.",
      },
      { type: "h2", body: "Pre-migration (T-7 days)" },
      {
        type: "ul",
        items: [
          "Decide your migration date (pick a slow week, not a busy one)",
          "Sign up for the new platform's free trial",
          "Read the new platform's import documentation",
          "List your active recurring memberships (manual count is fine)",
          "Inventory your custom class types and package shapes",
        ],
      },
      { type: "h2", body: "Day 1: data export" },
      {
        type: "ul",
        items: [
          "Export members (name, email, phone, notes)",
          "Export active memberships and packages",
          "Export class history (for reference only, not for import)",
          "Export instructor list (name, email)",
          "Back up the exports to a folder you can find again",
        ],
      },
      { type: "h2", body: "Day 2: import members and instructors" },
      {
        type: "ul",
        items: [
          "Import member list to new platform",
          "Spot-check 5–10 random members",
          "Invite instructors via Settings > Team",
          "Verify instructors can log in to their portal",
        ],
      },
      { type: "h2", body: "Day 3: class types and packages" },
      {
        type: "ul",
        items: [
          "Create each class type with capacity and duration",
          "Create each package with credits, validity, price, currency",
          "Mark which packages are publicly purchasable",
          "Test that prices appear correctly on the booking page",
        ],
      },
      { type: "h2", body: "Day 4: schedule and payments" },
      {
        type: "ul",
        items: [
          "Build the recurring weekly schedule",
          "Assign instructors to classes",
          "Connect Stripe / PayPal / Razorpay",
          "Test a $1 purchase end-to-end",
          "Verify receipt email arrives",
        ],
      },
      { type: "h2", body: "Day 5: preview + announcement" },
      {
        type: "ul",
        items: [
          "Preview the public booking page as a member",
          "Walk through the booking flow",
          "Draft member announcement (~3 sentences)",
          "Schedule announcement for Saturday morning",
        ],
      },
      { type: "h2", body: "Day 6: parallel run" },
      {
        type: "ul",
        items: [
          "Send the announcement",
          "Leave both platforms running",
          "Respond to member questions within 4 hours",
          "Track which platform new bookings appear on",
        ],
      },
      { type: "h2", body: "Day 7: cut-over" },
      {
        type: "ul",
        items: [
          "Move remaining forward bookings to the new platform",
          "Archive the old platform",
          "Cancel old subscription effective end of billing cycle",
          "Take Sunday off",
        ],
      },
      { type: "h2", body: "Post-migration (Week 2)" },
      {
        type: "ul",
        items: [
          "Audit member balances against the original export",
          "Resolve any data discrepancies",
          "Send a 'thanks for migrating with us' email to engaged members",
          "Watch retention numbers in the first 30 days post-migration",
        ],
      },
    ],
    relatedPages: [
      { label: "How to switch", href: "/blog/how-to-switch-yoga-studio-software" },
      { label: "Migrate from Mindbody", href: "/blog/migrate-from-mindbody-to-yogateacher" },
    ],
  },
];

export function getPost(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
