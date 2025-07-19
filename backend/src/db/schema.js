// 從 drizzle-orm/pg-core 這個套件裡，匯入一些用來定義 PostgreSQL 資料表 schema 的工具
// 你可以把這一行想成是在用 JavaScript/TypeScript 來「寫資料表結構」

// drizzle-orm 用來跟db互動 (新增或刪除等等) 幫忙把程式碼轉成 SQL 並執行
// drizzle-kit 用來 根據定義的資料表 schema 自動生成 migration 檔案 控制資料表長什麼樣
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core"; 

// 定義了一張叫做 favorites 的資料表，欄位如下
export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: integer("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  cookTime: text("cook_time"),
  servings: text("servings"),
  createdAt: timestamp("created_at").defaultNow(),
});
