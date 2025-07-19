// 設定 Drizzle ORM 的資料庫遷移（migration）工具要怎麼運作
// migration就是把我們在db.js中的js語言轉成sql

import { ENV } from "./src/config/env.js";

// 你的資料表 schema 定義寫在 src/db/schema.js 這個檔案裡
// 遷移檔案（migration files）會輸出到 src/db/migrations 這個資料夾
// 使用 PostgreSQL 作為資料庫
// 連線資料庫的設定，使用 ENV.DATABASE_URL 這個環境變數來當作資料庫的連線網址
export default {
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: ENV.DATABASE_URL },
};


// 接著執行 npx drizzle-kit generate 
// 就會根據你定義的 recipes 表 (from schema.js)，自動產生 SQL migration 檔
// 執行 npx drizzle-kit migrate 
// 就能知道要連接哪個資料庫、用哪個 migration 資料夾 把剛剛 generate 出來的 SQL migration 實際執行到資料庫裡（建立 table、修改欄位等等） 並在neon中看到table