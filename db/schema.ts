import {
  boolean,
  integer,
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
    role: text("role").notNull().default("owner"), // owner | admin | staff
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("studio_member_studio_user_uniq").on(
      t.studioId,
      t.userId,
    ),
  }),
);

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
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (t) => ({
    uniq: uniqueIndex("booking_class_member_uniq").on(
      t.scheduledClassId,
      t.memberId,
    ),
  }),
);
