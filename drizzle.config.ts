import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema:'./app/db/schema.ts',
    output: './app/db/migrations',
    dialect: 'sqlite',
    dbCredentials:{
        
    }
});