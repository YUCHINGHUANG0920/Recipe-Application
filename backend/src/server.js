import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

// build a web server
const app = express(); 
const PORT = ENV.PORT || 5001;

// 在production時 才執行cron job
// 在local run的時候 會讀取local的.env 所以他會讀到development
// 但在render中 他會知道這是部署的環境 所以在render部署的api 就會讀到production 就跟local的.env中寫什麼無關
if (ENV.NODE_ENV === "production") job.start();

app.use(express.json()); // 為了使用req.body

// 當有人（例如你自己的前端 app、第三方監控工具、或 DevOps 團隊）對你的伺服器發出 GET /api/health 請求時，
// 伺服器會回應一個狀態碼 200，以及一個簡單的 JSON { sucess: ture } 為了確認你的伺服器正在運行
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// 點擊收藏後 發req給db 所以從req中提取各種資訊要存到db
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


// 取消收藏後 發req給db 所以從 req URL 中取得 userId 和 recipeId
// 呼叫資料庫的 delete 操作，在 favoritesTable 裡刪除那筆對應的資料
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error); // 在終端機打印出error
    res.status(500).json({ error: "Something went wrong" });
  }
});

// fetch 當前的favorites 前端回傳當前userId 從db中找他有哪些favorites
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});



app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});