import { Pool } from "pg";

const pool = new Pool({
  host: "aws-1-ap-northeast-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.mgptoybmguyzgslbnbug",
  database: "postgres",
  password: process.env.DB_PASSWORD || "UtyCantik12",
  ssl: { rejectUnauthorized: false },
});

export default pool;
