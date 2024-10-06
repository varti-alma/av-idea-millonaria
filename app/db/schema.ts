// db/schema.ts
import {
  pgTable,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    document_number: text("document_number").notNull(),
    name: text("name").notNull(),
    lastName: text("lastName").notNull(),
    surName: text("surName").notNull(),
    birthDate: timestamp("birthDate", { withTimezone: true }).notNull(),
    gender: text("gender").notNull(),
    phone: text("phone").notNull(),
    serial_number: text("serial_number").notNull(),
    register_date: timestamp("register_date").defaultNow().notNull(),
    country: text("country").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(
        users.document_number,
        users.email,
        users.serial_number
      ),
    };
  }
);

export const liveness = pgTable(
  "liveness",
  {
    id: text("id").primaryKey(),
    id_user: text("id_user")
      .notNull()
      .references(() => users.id),
    initialDate: timestamp("initialDate", { withTimezone: true }).notNull(),
    finishDate: timestamp("finishDate", { withTimezone: true }).notNull(),
    result: boolean("result").notNull(),
    ip_address: text("ip_address").notNull(),
    token_session: text("token_session").notNull(),
    device_info: text("device_info").notNull(),
  },
  (liveness) => {
    return {
      uniqueToken: uniqueIndex("unique_token").on(liveness.token_session),
    };
  }
);

export const liveness_results = pgTable("liveness_results", {
  id: text("id").primaryKey(),
  id_liveness: text("id_liveness")
    .notNull()
    .references(() => liveness.id),
  action_type: text("action_type").notNull(),
  action_result: boolean("action_result").notNull(),
});
