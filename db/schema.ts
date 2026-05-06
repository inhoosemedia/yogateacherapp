import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Better Auth tables ────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  isSuperAdmin: boolean("is_super_admin").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// ─── Platform settings (singleton kv) ─────────────────────────────────
export const platformSetting = pgTable("platform_setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

// ─── Tenancy ───────────────────────────────────────────────────────────
export const studio = pgTable("studio", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  timezone: text("timezone").notNull().default("Asia/Kolkata"),
  currency: text("currency").notNull().default("INR"),
  ownerUserId: text("owner_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Billing (platform → studio)
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true, mode: "date" }).notNull(),
  // trialing | active | past_due | cancelled | suspended
  subscriptionStatus: text("subscription_status").notNull().default("trialing"),
  planTier: text("plan_tier"), // studio | multi_studio
  razorpayCustomerId: text("razorpay_customer_id"),
  razorpaySubscriptionId: text("razorpay_subscription_id"),
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end", { withTimezone: true, mode: "date" }),
  // Member-payments: studio brings their own Razorpay account so payment
  // settles directly to the studio (not the platform).
  studioRazorpayKeyId: text("studio_razorpay_key_id"),
  studioRazorpayKeySecret: text("studio_razorpay_key_secret"),
  studioRazorpayWebhookSecret: text("studio_razorpay_webhook_secret"),
  // Per-studio notification preferences (jsonb of booleans by event key)
  notificationSettings: jsonb("notification_settings"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const studioMember = pgTable(
  "studio_member",
  {
    id: text("id").primaryKey(),
    studioId: text("studio_id")
      .notNull()
      .references(() => studio.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("owner"), // owner | admin | staff | instructor
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("studio_member_studio_user_uniq").on(
      t.studioId,
      t.userId,
    ),
  }),
);

// Invitations to join a studio (admin/staff/instructor). Owner sends → email
// with a token → recipient signs up or signs in → token consumes into a
// studio_member row (and, for instructor invites, also links instructor.userId).
export const studioInvite = pgTable("studio_invite", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull(), // admin | staff | instructor
  // Optional link to an existing instructor row so accepting the invite
  // attaches the instructor record to the new user account.
  instructorId: text("instructor_id"),
  invitedByUserId: text("invited_by_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

// ─── CRM domain (all scoped by studioId) ───────────────────────────────
export const member = pgTable("member", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  notes: text("notes"),
  status: text("status").notNull().default("active"), // active | paused | inactive
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const instructor = pgTable("instructor", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  // When set, this instructor record is linked to a real user account that
  // can sign in to the instructor portal.
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  bio: text("bio"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const classType = pgTable("class_type", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  defaultCapacity: integer("default_capacity").notNull().default(15),
  color: text("color").notNull().default("#d97706"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Recurring class generators. Materialise into individual scheduled_class
// rows (so all existing schedule code keeps working) but remember the source
// rule so a series can be edited or stopped.
export const recurringRule = pgTable("recurring_rule", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  classTypeId: text("class_type_id")
    .notNull()
    .references(() => classType.id, { onDelete: "cascade" }),
  instructorId: text("instructor_id").references(() => instructor.id, {
    onDelete: "set null",
  }),
  // bitmask 0-127, bit 0 = Sunday, bit 6 = Saturday (multiple days allowed)
  daysOfWeek: integer("days_of_week").notNull(),
  // Local time-of-day, "HH:MM" string
  startTime: text("start_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  capacity: integer("capacity").notNull(),
  location: text("location"),
  notes: text("notes"),
  startsOn: timestamp("starts_on", { withTimezone: true, mode: "date" }).notNull(),
  endsOn: timestamp("ends_on", { withTimezone: true, mode: "date" }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const scheduledClass = pgTable("scheduled_class", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  classTypeId: text("class_type_id")
    .notNull()
    .references(() => classType.id, { onDelete: "restrict" }),
  instructorId: text("instructor_id").references(() => instructor.id, {
    onDelete: "set null",
  }),
  // Optional source rule; null for one-off classes.
  recurringRuleId: text("recurring_rule_id").references(() => recurringRule.id, {
    onDelete: "set null",
  }),
  startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }).notNull(),
  capacity: integer("capacity").notNull(),
  location: text("location"),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const package_ = pgTable("package", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  kind: text("kind").notNull(), // drop_in | class_pack | unlimited
  credits: integer("credits"), // null = unlimited
  validityDays: integer("validity_days").notNull().default(30),
  priceCents: integer("price_cents").notNull().default(0),
  currency: text("currency").notNull().default("INR"),
  active: boolean("active").notNull().default(true),
  // When true, member can self-purchase from public booking page.
  publiclyPurchasable: boolean("publicly_purchasable").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memberPackage = pgTable("member_package", {
  id: text("id").primaryKey(),
  studioId: text("studio_id")
    .notNull()
    .references(() => studio.id, { onDelete: "cascade" }),
  memberId: text("member_id")
    .notNull()
    .references(() => member.id, { onDelete: "cascade" }),
  packageId: text("package_id")
    .notNull()
    .references(() => package_.id, { onDelete: "restrict" }),
  creditsRemaining: integer("credits_remaining"),
  startsAt: timestamp("starts_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  pricePaidCents: integer("price_paid_cents").notNull().default(0),
  status: text("status").notNull().default("active"),
  // Razorpay payment reference (for member-paid packages)
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export const booking = pgTable(
  "booking",
  {
    id: text("id").primaryKey(),
    studioId: text("studio_id")
      .notNull()
      .references(() => studio.id, { onDelete: "cascade" }),
    scheduledClassId: text("scheduled_class_id")
      .notNull()
      .references(() => scheduledClass.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    memberPackageId: text("member_package_id").references(
      () => memberPackage.id,
      { onDelete: "set null" },
    ),
    status: text("status").notNull().default("booked"), // booked | cancelled | attended | no_show
    checkedInAt: timestamp("checked_in_at", { withTimezone: true, mode: "date" }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true, mode: "date" }),
    // Set when reminder email was successfully sent so we don't double-send.
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("booking_class_member_uniq").on(
      t.scheduledClassId,
      t.memberId,
    ),
  }),
);

// Members on the waitlist for a full class. When a seat opens, the
// earliest entry is automatically promoted to a real booking.
export const waitlistEntry = pgTable(
  "waitlist_entry",
  {
    id: text("id").primaryKey(),
    studioId: text("studio_id")
      .notNull()
      .references(() => studio.id, { onDelete: "cascade" }),
    scheduledClassId: text("scheduled_class_id")
      .notNull()
      .references(() => scheduledClass.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("waiting"), // waiting | promoted | removed
    promotedAt: timestamp("promoted_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("waitlist_class_member_uniq").on(
      t.scheduledClassId,
      t.memberId,
    ),
  }),
);

// Audit log of every transactional email we sent. Lets the studio see what
// went out and avoids double-sending the same reminder.
export const notificationLog = pgTable("notification_log", {
  id: text("id").primaryKey(),
  studioId: text("studio_id").references(() => studio.id, {
    onDelete: "cascade",
  }),
  // booking_confirmation | booking_cancelled | class_reminder | waitlist_promoted | invite | test
  type: text("type").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull(), // sent | failed
  error: text("error"),
  // Optional foreign keys to the entities referenced by this notification —
  // kept as plain text + nullable so cleanup of the original entity doesn't
  // delete the audit row.
  bookingId: text("booking_id"),
  scheduledClassId: text("scheduled_class_id"),
  memberId: text("member_id"),
  sentAt: timestamp("sent_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});
