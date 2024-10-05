// db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import {sql} from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  document_number: text('document_number').notNull(),
  name: text('name').notNull(),
  lastName: text('lastName').notNull(),
  surName: text('surName').notNull(),
  birthDate: integer('birthDate' , {mode:'timestamp'}).notNull(),
  gender: text('gender').notNull(),
  phone: text('phone').notNull(),
  register_date: integer("register_date",{mode:'timestamp_ms'}).default(sql`datetime('now')`).notNull(),
  country: text('country').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),  
});

export const liveness = sqliteTable('liveness', {
    id: text('id').primaryKey(),
    id_user: text('id_user').notNull().references(() => users.id),
    start_date: integer('start_date',{mode:'timestamp_ms'}).notNull(),
    end_date: integer('end_date',{mode:'timestamp_ms'}).notNull(),
    result: integer('result',{mode:'boolean'}).notNull(),
    ip_address: text('ip_address').notNull(),
    device_info: text('device_info').notNull(),
});

export const liveness_results = sqliteTable('liveness_results', {
    id: text('id').primaryKey(),
    id_liveness: text('id_liveness').notNull().references(() => liveness.id),
    action_type: text('action_type').notNull(),
    action_result: integer('action_result',{mode:'boolean'}).notNull(),
});
